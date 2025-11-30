import { eq } from 'drizzle-orm'
import { getDb } from './client.js'
import { exhibitorSchema } from './client.js'
import { reconstructExhibitor } from '../../../domain/factories/exhibitor/exhibitorFactory.js'
import type { Exhibitor } from '../../../domain/models/exhibitor/exhibitor.js'

/**
 * ISO datetime文字列をUnixタイムスタンプ（秒）に変換
 */
function toUnixTimestamp(isoString: string): number {
  return Math.floor(new Date(isoString).getTime() / 1000)
}

/**
 * Unixタイムスタンプ（秒）をISO datetime文字列に変換
 */
function toISOString(timestamp: number): string {
  return new Date(timestamp * 1000).toISOString()
}

// DBモデルの型を定義
type DbExhibitor = typeof exhibitorSchema.exhibitor.$inferSelect

function mapToDomain(data: DbExhibitor): Exhibitor {
  return reconstructExhibitor({
    id: data.id,
    name: data.name,
    passwordHash: data.passwordHash,
    createdAt: toISOString(data.createdAt),
    updatedAt: toISOString(data.updatedAt),
  })
}

/**
 * 出展者を保存（作成または更新）
 */
export async function save(exhibitor: Exhibitor, d1: D1Database): Promise<void> {
  const db = getDb(d1)

  await db
    .insert(exhibitorSchema.exhibitor)
    .values({
      id: exhibitor.id,
      name: exhibitor.name,
      passwordHash: exhibitor.passwordHash,
      createdAt: toUnixTimestamp(exhibitor.createdAt),
      updatedAt: toUnixTimestamp(exhibitor.updatedAt),
    })
    .onConflictDoUpdate({
      target: exhibitorSchema.exhibitor.id,
      set: {
        name: exhibitor.name,
        passwordHash: exhibitor.passwordHash,
        updatedAt: toUnixTimestamp(exhibitor.updatedAt),
      },
    })
    .run()
  
}

/**
 * IDで出展者を検索
 */
export async function findById(id: string, d1: D1Database): Promise<Exhibitor | null> {
  const db = getDb(d1)

  const exhibitorData = await db
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
export async function findByName(name: string, d1: D1Database): Promise<Exhibitor | null> {
  const db = getDb(d1)

  const exhibitorData = await db
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
export async function existsByName(name: string, d1: D1Database): Promise<boolean> {
  const db = getDb(d1)

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
export async function deleteExhibitor(id: string, d1: D1Database): Promise<void> {
  const db = getDb(d1)

  await db.delete(exhibitorSchema.exhibitor).where(eq(exhibitorSchema.exhibitor.id, id))
}

/**
 * すべての出展者を取得
 */
export async function findAll(d1: D1Database): Promise<Exhibitor[]> {
  const db = getDb(d1)

  const exhibitorsData = await db.select().from(exhibitorSchema.exhibitor).all()

  return exhibitorsData.map((data) => mapToDomain(data))
  }