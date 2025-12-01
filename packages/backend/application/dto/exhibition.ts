import { z } from 'zod'

import type { ExhibitionCategory } from '../../domain/repositories/exhibition'

/**
 * ページネーションメタ情報（公開API用）
 */
export const PaginationMetaSchema = z.object({
  total: z.number().int().nonnegative(),
  page: z.number().int().min(1),
  per_page: z.number().int().min(1),
  total_pages: z.number().int().nonnegative(),
})

export type PaginationMetaDto = z.infer<typeof PaginationMetaSchema>

/**
 * 公開用ARデザイン
 */
export const PublicExhibitionArDesignSchema = z
  .object({
    id: z.uuid(),
    url: z.url().nullable(),
  })
  .nullable()

export type PublicExhibitionArDesignDto = z.infer<typeof PublicExhibitionArDesignSchema>

/**
 * 公開用出展情報
 * api.yml の PublicExhibition に対応
 */
export const PublicExhibitionSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  category: z.custom<ExhibitionCategory>(),
  exhibitor_name: z.string(),
  location: z.string(),
  price: z.number().int().nullable(),
  required_time: z.number().int().nullable(),
  comment: z.string().nullable(),
  ar_design: PublicExhibitionArDesignSchema,
  image: z.string().nullable(),
})

export type PublicExhibitionDto = z.infer<typeof PublicExhibitionSchema>

/**
 * カテゴリ別件数
 * api.yml の CategoryCount に対応
 */
export const CategoryCountSchema = z.object({
  category: z.custom<ExhibitionCategory>(),
  count: z.number().int().nonnegative(),
})

export type CategoryCountDto = z.infer<typeof CategoryCountSchema>

/**
 * 公開出展一覧レスポンス
 */
export const PublicExhibitionListResponseSchema = z.object({
  data: z.array(PublicExhibitionSchema),
  meta: PaginationMetaSchema,
})

export type PublicExhibitionListResponseDto = z.infer<typeof PublicExhibitionListResponseSchema>

/**
 * カテゴリ別件数レスポンス
 */
export const CategoryCountListResponseSchema = z.object({
  data: z.array(CategoryCountSchema),
})

export type CategoryCountListResponseDto = z.infer<typeof CategoryCountListResponseSchema>
