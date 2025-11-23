import { z } from 'zod'

// Zodスキーマで値オブジェクトを定義
export const id = z.string()
export const name = z.string().trim().min(1, 'Name cannot be empty').max(50, 'Name must be 50 characters or less')
export const password_hash = z.string().max(200)
export const created_at = z.iso.datetime()
export const updated_at = z.iso.datetime()

// エンティティのスキーマ
export const ExhibitorSchema = z.object({
  id: id,
  name: name,
  password_hash: password_hash,
  created_at: created_at,
  updated_at: updated_at,
})

// 型を生成
export type Exhibitor = z.infer<typeof ExhibitorSchema>