import { v4 as uuidv4 } from 'uuid'

import type { Exhibitor } from '../../models/exhibitor/exhibitor.js'
import { ExhibitorSchema } from '../../models/exhibitor/exhibitor.js'

/**
 * 新規Exhibitorを作成
 *
 * @param name 出展者名（1-100文字）
 * @param passwordHash ハッシュ化されたパスワード
 * @returns 新規Exhibitorエンティティ
 * @throws zodバリデーションエラー時
 */
export function createExhibitor(name: string, passwordHash: string): Exhibitor {
  const now = new Date()

  return ExhibitorSchema.parse({
    id: uuidv4(),
    name,
    passwordHash,
    createdAt: now,
    updatedAt: now,
  })
}

/**
 * DBレコードからExhibitorを再構築
 *
 * @param data DB取得データ
 * @returns 再構築されたExhibitorエンティティ
 * @throws zodバリデーションエラー時
 */
export function reconstructExhibitor(data: {
  id: string
  name: string
  passwordHash: string
  createdAt: Date
  updatedAt: Date
}): Exhibitor {
  return ExhibitorSchema.parse(data)
}
