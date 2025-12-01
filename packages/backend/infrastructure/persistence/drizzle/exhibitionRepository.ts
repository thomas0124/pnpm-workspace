import { and, count, eq, isNotNull, sql } from 'drizzle-orm'

import { reconstructExhibition } from '../../../domain/factories/exhibition'
import type { Exhibition as DomainExhibition } from '../../../domain/models/exhibition'
import type {
  CategoryCount,
  ExhibitionRepository,
  FindPublishedParams,
  PaginatedResult,
} from '../../../domain/repositories/exhibition'
import { getDb } from './client'
import { exhibition } from './schema/exhibition'
import { exhibitionInformation } from './schema/exhibitionInformation'

type DbExhibition = typeof exhibition.$inferSelect

function mapToDomain(row: DbExhibition): DomainExhibition {
  return reconstructExhibition(row)
}

function normalizePaginationParams(params?: FindPublishedParams) {
  const page = params?.page && params.page > 0 ? params.page : 1
  const perPage = params?.perPage && params.perPage > 0 ? params.perPage : 20
  return { page, perPage }
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
  async findPublished(params?: FindPublishedParams): Promise<PaginatedResult<DomainExhibition>> {
    const { page, perPage } = normalizePaginationParams(params)
    const offset = (page - 1) * perPage

    const baseWhere = and(
      eq(exhibition.isPublished, 1),
      isNotNull(exhibition.exhibitionInformationId)
    )

    // カテゴリフィルタがある場合はExhibitionInformationとJOINして絞り込む
    const category = params?.category

    if (category) {
      const totalRow = await this.db
        .select({
          value: count(exhibition.id).as('value'),
        })
        .from(exhibition)
        .innerJoin(
          exhibitionInformation,
          eq(exhibition.exhibitionInformationId, exhibitionInformation.id)
        )
        .where(and(baseWhere, eq(exhibitionInformation.category, category)))
        .get()

      const total = totalRow?.value ?? 0

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
        .where(and(baseWhere, eq(exhibitionInformation.category, category)))
        .limit(perPage)
        .offset(offset)
        .all()

      return {
        data: rows.map(mapToDomain),
        meta: {
          total,
          page,
          perPage,
          totalPages: total === 0 ? 0 : Math.ceil(total / perPage),
        },
      }
    }

    // カテゴリフィルタなし
    const totalRow = await this.db
      .select({
        value: count(exhibition.id).as('value'),
      })
      .from(exhibition)
      .where(baseWhere)
      .get()

    const total = totalRow?.value ?? 0

    const rows = await this.db
      .select()
      .from(exhibition)
      .where(baseWhere)
      .limit(perPage)
      .offset(offset)
      .all()

    return {
      data: rows.map(mapToDomain),
      meta: {
        total,
        page,
        perPage,
        totalPages: total === 0 ? 0 : Math.ceil(total / perPage),
      },
    }
  }

  /**
   * 公開中かつ基本情報が存在する出展をIDで取得
   */
  async findPublishedById(id: string): Promise<DomainExhibition | null> {
    const row = await this.db
      .select()
      .from(exhibition)
      .where(
        and(
          eq(exhibition.id, id),
          eq(exhibition.isPublished, 1),
          isNotNull(exhibition.exhibitionInformationId)
        )
      )
      .get()

    if (!row) return null
    return mapToDomain(row)
  }

  /**
   * 公開中出展のカテゴリ別件数
   */
  async findCategoryCounts(): Promise<CategoryCount[]> {
    const rows = await this.db
      .select({
        category: exhibitionInformation.category,
        count: sql<number>`COUNT(*)`.as('count'),
      })
      .from(exhibition)
      .innerJoin(
        exhibitionInformation,
        eq(exhibition.exhibitionInformationId, exhibitionInformation.id)
      )
      .where(and(eq(exhibition.isPublished, 1), isNotNull(exhibition.exhibitionInformationId)))
      .groupBy(exhibitionInformation.category)
      .all()

    return rows.map((row) => ({
      category: row.category,
      count: row.count,
    }))
  }

  /**
   * 公開中出展に紐づく画像BLOBを取得
   */
  async findPublishedImageById(id: string): Promise<Uint8Array | null> {
    const row = await this.db
      .select({
        image: exhibitionInformation.image,
      })
      .from(exhibition)
      .innerJoin(
        exhibitionInformation,
        eq(exhibition.exhibitionInformationId, exhibitionInformation.id)
      )
      .where(
        and(
          eq(exhibition.id, id),
          eq(exhibition.isPublished, 1),
          isNotNull(exhibition.exhibitionInformationId)
        )
      )
      .get()

    if (!row || row.image == null) return null

    // Cloudflare D1のBLOB型はArrayBuffer/Uint8Array想定
    if (row.image instanceof Uint8Array) {
      return row.image
    }

    // フォールバック: ArrayBuffer などを Uint8Array に変換
    return new Uint8Array(row.image as ArrayBuffer)
  }
}
