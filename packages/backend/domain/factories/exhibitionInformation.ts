import { v4 as uuidv4 } from 'uuid'

import type { Category, ExhibitionInformation } from '../models/exhibitionInformation'
import { ExhibitionInformationSchema } from '../models/exhibitionInformation'

/**
 * 新規ExhibitionInformationを作成
 *
 * @param exhibitorId 出展者ID
 * @param exhibitorName 出展者名（1-100文字）
 * @param title タイトル（1-200文字）
 * @param category カテゴリ（飲食, 展示, 体験, ステージ）
 * @param location 場所（1-100文字）
 * @param price 金額（円単位、nullの場合は無料）
 * @param requiredTime 所要時間（分単位、nullの場合は不明）
 * @param comment ひとことコメント（最大100文字、nullの場合はなし）
 * @param exhibitionArDesignId ARデザインID（nullの場合はARなし）
 * @param image 画像BLOB（nullの場合はなし）
 * @returns 新規ExhibitionInformationエンティティ
 * @throws zodバリデーションエラー時
 */
export function createExhibitionInformation(
  exhibitorId: string,
  exhibitorName: string,
  title: string,
  category: Category,
  location: string,
  price: number | null = null,
  requiredTime: number | null = null,
  comment: string | null = null,
  exhibitionArDesignId: string | null = null,
  image: Uint8Array | null = null
): ExhibitionInformation {
  const now = new Date().toISOString()

  return ExhibitionInformationSchema.parse({
    id: uuidv4(),
    exhibitorId,
    exhibitionArDesignId,
    exhibitorName,
    title,
    category,
    location,
    price,
    requiredTime,
    comment,
    image,
    createdAt: now,
    updatedAt: now,
  })
}

/**
 * DBレコードからExhibitionInformationを再構築
 *
 * @param data DB取得データ
 * @returns 再構築されたExhibitionInformationエンティティ
 * @throws zodバリデーションエラー時
 */
export function reconstructExhibitionInformation(
  data: ExhibitionInformation
): ExhibitionInformation {
  return ExhibitionInformationSchema.parse(data)
}

/**
 * 既存のExhibitionInformationを更新
 * イミュータブルに新しいオブジェクトを返す
 *
 * @param existing 既存のExhibitionInformationエンティティ
 * @param updates 更新するフィールド（部分的に更新可能）
 * @returns 更新されたExhibitionInformationエンティティ
 * @throws zodバリデーションエラー時
 */
export function updateExhibitionInformation(
  existing: ExhibitionInformation,
  updates: {
    exhibitorName?: string
    title?: string
    category?: Category
    location?: string
    price?: number | null
    requiredTime?: number | null
    comment?: string | null
    exhibitionArDesignId?: string | null
    image?: Uint8Array | null
  }
): ExhibitionInformation {
  const now = new Date().toISOString()

  return ExhibitionInformationSchema.parse({
    id: existing.id,
    exhibitorId: existing.exhibitorId,
    exhibitionArDesignId: updates.exhibitionArDesignId ?? existing.exhibitionArDesignId,
    exhibitorName: updates.exhibitorName ?? existing.exhibitorName,
    title: updates.title ?? existing.title,
    category: updates.category ?? existing.category,
    location: updates.location ?? existing.location,
    price: updates.price !== undefined ? updates.price : existing.price,
    requiredTime: updates.requiredTime !== undefined ? updates.requiredTime : existing.requiredTime,
    comment: updates.comment !== undefined ? updates.comment : existing.comment,
    image: updates.image !== undefined ? updates.image : existing.image,
    createdAt: existing.createdAt,
    updatedAt: now,
  })
}
