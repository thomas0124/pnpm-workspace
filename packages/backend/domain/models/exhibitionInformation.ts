import { z } from 'zod'

/**
 * ExhibitionInformation ID スキーマ
 */
export const ExhibitionInformationIdSchema = z.uuid('Invalid exhibition information ID format')

/**
 * Title スキーマ
 * API仕様: 最大200文字
 */
export const TitleSchema = z
  .string()
  .trim()
  .min(1, 'Title is required')
  .max(200, 'Title must be 200 characters or less')

/**
 * Category スキーマ
 * API仕様: 飲食, 展示, 体験, ステージ
 */
export const CategorySchema = z.enum(['Food', 'Exhibition', 'Experience', 'Stage'], {
  message: 'Category must be one of: Food, Exhibition, Experience, Stage',
})

/**
 * Category型
 */
export type Category = z.infer<typeof CategorySchema>

/**
 * Location スキーマ
 * API仕様: 最大100文字
 */
export const LocationSchema = z
  .string()
  .trim()
  .min(1, 'Location is required')
  .max(100, 'Location must be 100 characters or less')

/**
 * Price スキーマ
 * API仕様: 0以上の整数、nullable（無料の場合はnull）
 */
export const PriceSchema = z.number().int().min(0, 'Price must be 0 or greater').nullable()

/**
 * RequiredTime スキーマ
 * API仕様: 1以上の整数、nullable（所要時間が不明な場合はnull）
 */
export const RequiredTimeSchema = z
  .number()
  .int()
  .min(1, 'Required time must be 1 or greater')
  .nullable()

/**
 * Comment スキーマ
 * API仕様: 最大100文字、nullable
 */
export const CommentSchema = z
  .string()
  .trim()
  .max(100, 'Comment must be 100 characters or less')
  .nullable()

/**
 * ExhibitorName スキーマ
 * 出展者名（1-100文字）
 */
export const ExhibitorNameSchema = z
  .string()
  .trim()
  .min(1, 'Exhibitor name is required')
  .max(100, 'Exhibitor name must be 100 characters or less')

/**
 * ExhibitionInformation エンティティスキーマ
 */
export const ExhibitionInformationSchema = z.object({
  id: ExhibitionInformationIdSchema,
  exhibitorId: z.uuid('Invalid exhibitor ID format'),
  exhibitorName: ExhibitorNameSchema,
  title: TitleSchema,
  category: CategorySchema,
  location: LocationSchema,
  price: PriceSchema,
  requiredTime: RequiredTimeSchema,
  comment: CommentSchema,
  image: z.custom<Uint8Array | null>(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
})

/**
 * ExhibitionInformation型
 */
export type ExhibitionInformation = z.infer<typeof ExhibitionInformationSchema>

/**
 * エンティティの同一性チェック
 */
export function isSameExhibitionInformation(
  a: ExhibitionInformation,
  b: ExhibitionInformation
): boolean {
  return a.id === b.id
}
