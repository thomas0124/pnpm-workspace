import { z } from 'zod'

// Zodスキーマで値オブジェクトを定義
export const ExhibitionIdSchema = z.uuid('Invalid exhibition ID format')

export const ExhibitorIdSchema = z.uuid('Invalid exhibitor ID format')

export const ExhibitionInformationIdSchema = z.uuid('Invalid exhibition information ID format').nullable()
// エンティティのスキーマ
export const ExhibitionSchema = z.object({
  id: ExhibitionIdSchema,
  exhibitorId: ExhibitorIdSchema,
  exhibitionInformationId: ExhibitionInformationIdSchema,
  isDraft: z.number().int().min(0).max(1), // true: 下書き, false: 確定（DBでは1/0で管理）
  isPublished: z.number().int().min(0).max(1), // true: 公開, false: 非公開（DBでは1/0で管理）
  publishedAt: z.string().datetime().nullable(),  // 修正: z.iso → z.string()
  createdAt: z.string().datetime(),               // 修正: z.iso → z.string()
  updatedAt: z.string().datetime(),               // 修正: z.iso → z.string()
})

// 型を生成
export type Exhibition = z.infer<typeof ExhibitionSchema>
