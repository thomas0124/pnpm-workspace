import { eq } from 'drizzle-orm'

import { reconstructExhibitor } from '../../../domain/factories/exhibitor'
import type { Exhibitor } from '../../../domain/models/exhibitor'
import type { ExhibitorRepository } from '../../../domain/repositories/exhibitorRepository'
import { exhibitorSchema, getDb } from './client'

// DBモデルの型を定義
type DbExhibitor = typeof exhibitorSchema.exhibitor.$inferSelect

function mapToDomain(data: DbExhibitor): Exhibitor {
  return reconstructExhibitor(data)
}


export function createExhibitorRepository(d1: D1Database): ExhibitorRepository {
  return new DrizzleExhibitorRepository(d1);
}

export class DrizzleExhibitorRepository implements ExhibitorRepository {
  private db: ReturnType<typeof getDb>;

  constructor(d1: D1Database) {
    this.db = getDb(d1);
  }
  async save(exhibitor: Exhibitor): Promise<void> {
    await this.db.insert(exhibitorSchema.exhibitor).values({
      id: exhibitor.id,
      name: exhibitor.name,
      passwordHash: exhibitor.passwordHash,
      createdAt: exhibitor.createdAt,
      updatedAt: exhibitor.updatedAt,
    })
    .onConflictDoUpdate({
      target: exhibitorSchema.exhibitor.id,
      set: {
        name: exhibitor.name,
        passwordHash: exhibitor.passwordHash,
        updatedAt: exhibitor.updatedAt,
      },
    })
    .run()
}

/**
 * IDで出展者を検索
 */
async findById(id: string): Promise<Exhibitor | null> {
    const exhibitorData = await this.db
      .select()
      .from(exhibitorSchema.exhibitor)
      .where(eq(exhibitorSchema.exhibitor.id, id))
      .get()

    if (!exhibitorData) return null

    return mapToDomain(exhibitorData)
  }

/**
 * 名前で出展者を検索
 */
  async findByName(name: string): Promise<Exhibitor | null> {
  const exhibitorData = await this.db
    .select()
    .from(exhibitorSchema.exhibitor)
    .where(eq(exhibitorSchema.exhibitor.name, name))
    .get()

  if (!exhibitorData) return null

  return mapToDomain(exhibitorData)
}

/**
 * 名前の存在確認
 */
  async existsByName(name: string): Promise<boolean> {
  const db = this.db;

  const result = await db
    .select({ id: exhibitorSchema.exhibitor.id })
    .from(exhibitorSchema.exhibitor)
    .where(eq(exhibitorSchema.exhibitor.name, name))
    .get()

  return result !== undefined
}

/**
 * 出展者を削除
 */
  async delete(id: string): Promise<void> {
  const db = this.db;

  await db.delete(exhibitorSchema.exhibitor).where(eq(exhibitorSchema.exhibitor.id, id)).run()
}

/**
 * すべての出展者を取得
 */
  async findAll(): Promise<Exhibitor[]> {
  const db = this.db;

  const exhibitorsData = await db.select().from(exhibitorSchema.exhibitor).all()

  return exhibitorsData.map((data) => mapToDomain(data))
}}
