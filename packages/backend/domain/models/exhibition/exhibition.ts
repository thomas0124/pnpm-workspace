import { z } from 'zod'

// Zodスキーマで値オブジェクトを定義
export const ExhibitionIdSchema = z.uuid()

export const ExhibitorIdSchema = z.uuid()

export const ExhibitionInformationIdSchema = z.uuid().nullable()

// エンティティのスキーマ
export const ExhibitionSchema = z.object({
  id: ExhibitionIdSchema,
  exhibitorId: ExhibitorIdSchema,
  exhibitionInformationId: ExhibitionInformationIdSchema,
  isDraft: z.number().int().min(0).max(1), // true: 下書き, false: 確定（DBでは1/0で管理）
  isPublished: z.number().int().min(0).max(1), // true: 公開, false: 非公開（DBでは1/0で管理）
  publishedAt: z.iso.datetime().nullable(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
})

// 型を生成
export type Exhibition = z.infer<typeof ExhibitionSchema>
