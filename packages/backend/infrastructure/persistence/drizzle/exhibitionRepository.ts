import type { D1Database } from '@cloudflare/workers-types'
import { and, eq, isNotNull, sql } from 'drizzle-orm'

import { reconstructExhibition } from '../../../domain/factories/exhibition'
import type { Exhibition as DomainExhibition } from '../../../domain/models/exhibition'
import type {
  ExhibitionRepository,
  FindPublishedParams,
} from '../../../domain/repositories/exhibition'
import { getDb } from './client'
import { exhibition } from './schema/exhibition'
import { exhibitionInformation } from './schema/exhibitionInformation'

type DbExhibition = typeof exhibition.$inferSelect

function mapToDomain(row: DbExhibition): DomainExhibition {
  return reconstructExhibition(row)
}

export function createExhibitionRepository(d1: D1Database): ExhibitionRepository {
  return new DrizzleExhibitionRepository(d1)
}

export class DrizzleExhibitionRepository implements ExhibitionRepository {
  private db: ReturnType<typeof getDb>

  constructor(d1: D1Database) {
    this.db = getDb(d1)
  }

  async save(ex: DomainExhibition): Promise<void> {
    await this.db
      .insert(exhibition)
      .values({
        id: ex.id,
        exhibitorId: ex.exhibitorId,
        exhibitionInformationId: ex.exhibitionInformationId,
        isDraft: ex.isDraft,
        isPublished: ex.isPublished,
        publishedAt: ex.publishedAt,
        createdAt: ex.createdAt,
        updatedAt: ex.updatedAt,
      })
      .onConflictDoUpdate({
        target: exhibition.id,
        set: {
          exhibitorId: ex.exhibitorId,
          exhibitionInformationId: ex.exhibitionInformationId,
          isDraft: ex.isDraft,
          isPublished: ex.isPublished,
          publishedAt: ex.publishedAt,
          updatedAt: ex.updatedAt,
        },
      })
      .run()
  }

  async findById(id: string): Promise<DomainExhibition | null> {
    const row = await this.db.select().from(exhibition).where(eq(exhibition.id, id)).get()
    if (!row) return null
    return mapToDomain(row)
  }

  async findByExhibitorId(exhibitorId: string): Promise<DomainExhibition[]> {
    const rows = await this.db
      .select()
      .from(exhibition)
      .where(eq(exhibition.exhibitorId, exhibitorId))
      .all()
    return rows.map(mapToDomain)
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(exhibition).where(eq(exhibition.id, id)).run()
  }

  /**
   * 公開中の出展一覧をページネーション付きで取得
   */
  async findPublished(params?: FindPublishedParams): Promise<DomainExhibition[]> {
    const baseWhere = and(
      eq(exhibition.isPublished, 1),
      isNotNull(exhibition.exhibitionInformationId)
    )

    const category = params?.category
    const search = params?.search

    // 検索条件とカテゴリフィルタの両方に対応
    const needsJoin = category || search

    if (needsJoin) {
      // ExhibitionInformationとJOIN
      const conditions = [baseWhere]

      if (category) {
        conditions.push(eq(exhibitionInformation.category, category))
      }

      if (search) {
        // タイトル、出展者名、コメントのいずれかに部分一致
        conditions.push(
          sql`(
            ${exhibitionInformation.title} LIKE ${'%' + search + '%'} OR
            ${exhibitionInformation.exhibitorName} LIKE ${'%' + search + '%'} OR
            ${exhibitionInformation.comment} LIKE ${'%' + search + '%'}
          )`
        )
      }

      const whereCondition = and(...conditions)

      const rows = await this.db
        .select({
          id: exhibition.id,
          exhibitorId: exhibition.exhibitorId,
          exhibitionInformationId: exhibition.exhibitionInformationId,
          isDraft: exhibition.isDraft,
          isPublished: exhibition.isPublished,
          publishedAt: exhibition.publishedAt,
          createdAt: exhibition.createdAt,
          updatedAt: exhibition.updatedAt,
        })
        .from(exhibition)
        .innerJoin(
          exhibitionInformation,
          eq(exhibition.exhibitionInformationId, exhibitionInformation.id)
        )
        .where(whereCondition)
        .all()

      return rows.map(mapToDomain)
    }

    // 検索もカテゴリフィルタもなし
    const rows = await this.db.select().from(exhibition).where(baseWhere).all()

    return rows.map(mapToDomain)
  }
}
