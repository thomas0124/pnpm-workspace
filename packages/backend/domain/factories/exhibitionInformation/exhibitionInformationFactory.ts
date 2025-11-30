import { v4 as uuidv4 } from 'uuid'

import type {
  Category,
  ExhibitionInformation,
} from '../../models/exhibitionInformation/exhibitionInformation'
import { ExhibitionInformationSchema } from '../../models/exhibitionInformation/exhibitionInformation'

/**
 * 新規ExhibitionInformationを作成
 *
 * @param exhibitorId 出展者ID
 * @param exhibitor 出展者名（1-100文字）
 * @param title タイトル（1-200文字）
 * @param category カテゴリ（飲食, 展示, 体験, ステージ）
 * @param location 場所（1-100文字）
 * @param price 金額（円単位、nullの場合は無料）
 * @param requiredTime 所要時間（分単位、nullの場合は不明）
 * @param comment ひとことコメント（最大100文字、nullの場合はなし）
 * @param exhibitionArDesignId ARデザインID（nullの場合はARなし）
 * @returns 新規ExhibitionInformationエンティティ
 * @throws zodバリデーションエラー時
 */
export function createExhibitionInformation(
  exhibitorId: string,
  exhibitor: string,
  title: string,
  category: Category,
  location: string,
  price: number | null = null,
  requiredTime: number | null = null,
  comment: string | null = null,
  exhibitionArDesignId: string | null = null
): ExhibitionInformation {
  const now = new Date().toISOString()

  return ExhibitionInformationSchema.parse({
    id: uuidv4(),
    exhibitorId,
    exhibitionArDesignId,
    exhibitor,
    title,
    category,
    location,
    price,
    requiredTime,
    comment,
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
