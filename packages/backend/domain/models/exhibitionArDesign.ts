import { z } from 'zod'

/**
 * ExhibitionArDesign ID スキーマ
 */
export const ExhibitionArDesignIdSchema = z.uuid('Invalid AR design ID format')

/**
 * URL スキーマ
 * API仕様: nullable URI
 */
export const UrlSchema = z
  .url('Invalid URL format')
  .nullable()

/**
 * ExhibitionArDesign エンティティスキーマ
 */
export const ExhibitionArDesignSchema = z.object({
  id: ExhibitionArDesignIdSchema,
  url: UrlSchema,
})

/**
 * ExhibitionArDesign型
 */
export type ExhibitionArDesign = z.infer<typeof ExhibitionArDesignSchema>

/**
 * エンティティの同一性チェック
 */
export function isSameExhibitionArDesign(
  a: ExhibitionArDesign,
  b: ExhibitionArDesign
): boolean {
  return a.id === b.id
}

