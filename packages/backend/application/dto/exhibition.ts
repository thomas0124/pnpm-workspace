import { z } from 'zod'

import type { Exhibition } from '../../domain/models/exhibition'
import type { ExhibitionInformation } from '../../domain/models/exhibitionInformation'
import type { ExhibitionCategory } from '../../domain/repositories/exhibition'
import type { ExhibitionArDesignRepository } from '../../domain/repositories/exhibitionArDesign'

export const ExhibitionIdParamSchema = z.object({
  exhibition_id: z.string().uuid(),
})

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

/**
 * 出展情報入力（作成・更新用）
 * api.yml の ExhibitionInformationInput に対応
 */
export const ExhibitionInformationInputSchema = z.object({
  exhibitor_name: z.string().min(1).max(100).trim(),
  title: z.string().min(1).max(200).trim(),
  category: z.enum(['飲食', '展示', '体験', 'ステージ']),
  location: z.string().min(1).max(100).trim(),
  price: z.number().int().min(0).nullable().optional(),
  required_time: z.number().int().min(1).nullable().optional(),
  comment: z.string().max(100).trim().nullable().optional(),
  exhibition_ar_design_id: z.uuid().nullable().optional(),
})

export type ExhibitionInformationInputDto = z.infer<typeof ExhibitionInformationInputSchema>

/**
 * ARデザイン（管理API用）
 */
export const ExhibitionArDesignDtoSchema = z.object({
  id: z.uuid(),
  url: z.url().nullable(),
})

export type ExhibitionArDesignDto = z.infer<typeof ExhibitionArDesignDtoSchema>

/**
 * 出展情報（管理API用）
 * api.yml の ExhibitionInformation に対応
 */
export const ExhibitionInformationDtoSchema = z.object({
  id: z.uuid(),
  exhibitor_id: z.uuid(),
  exhibitor_name: z.string(),
  title: z.string(),
  category: z.enum(['飲食', '展示', '体験', 'ステージ']),
  location: z.string(),
  price: z.number().int().nullable(),
  required_time: z.number().int().nullable(),
  comment: z.string().nullable(),
  ar_design: ExhibitionArDesignDtoSchema.nullable(),
  created_at: z.string(),
  updated_at: z.string(),
})

export type ExhibitionInformationDto = z.infer<typeof ExhibitionInformationDtoSchema>

/**
 * 出展（管理API用）
 * api.yml の Exhibition に対応
 */
export const ExhibitionDtoSchema = z.object({
  id: z.uuid(),
  exhibitor_id: z.uuid(),
  exhibition_information_id: z.uuid().nullable(),
  exhibition_information: ExhibitionInformationDtoSchema.nullable(),
  is_draft: z.boolean(),
  is_published: z.boolean(),
  published_at: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
})

export type ExhibitionDto = z.infer<typeof ExhibitionDtoSchema>

/**
 * ExhibitionArDesignエンティティからDTOに変換
 */
export async function toExhibitionArDesignDto(
  arDesignId: string | null,
  arDesignRepository: ExhibitionArDesignRepository
): Promise<ExhibitionArDesignDto | null> {
  if (!arDesignId) {
    return null
  }

  const arDesign = await arDesignRepository.findById(arDesignId)
  if (!arDesign) {
    return null
  }

  return ExhibitionArDesignDtoSchema.parse({
    id: arDesign.id,
    url: arDesign.url,
  })
}

/**
 * ExhibitionInformationエンティティからDTOに変換
 * ARデザイン情報も含めて取得・変換する
 */
export async function toExhibitionInformationDto(
  exhibitionInformation: ExhibitionInformation,
  arDesignRepository: ExhibitionArDesignRepository
): Promise<ExhibitionInformationDto> {
  const arDesignDto = await toExhibitionArDesignDto(
    exhibitionInformation.exhibitionArDesignId,
    arDesignRepository
  )

  return ExhibitionInformationDtoSchema.parse({
    id: exhibitionInformation.id,
    exhibitor_id: exhibitionInformation.exhibitorId,
    exhibitor_name: exhibitionInformation.exhibitorName,
    title: exhibitionInformation.title,
    category: exhibitionInformation.category,
    location: exhibitionInformation.location,
    price: exhibitionInformation.price,
    required_time: exhibitionInformation.requiredTime,
    comment: exhibitionInformation.comment,
    ar_design: arDesignDto,
    created_at: exhibitionInformation.createdAt,
    updated_at: exhibitionInformation.updatedAt,
  })
}

/**
 * ExhibitionエンティティからDTOに変換
 * ExhibitionInformationDtoが提供される場合はそれを使用、nullの場合はnullを設定
 */
export function toExhibitionDto(
  exhibition: Exhibition,
  exhibitionInformationDto: ExhibitionInformationDto | null
): ExhibitionDto {
  return ExhibitionDtoSchema.parse({
    id: exhibition.id,
    exhibitor_id: exhibition.exhibitorId,
    exhibition_information_id: exhibition.exhibitionInformationId,
    exhibition_information: exhibitionInformationDto,
    is_draft: exhibition.isDraft === 1,
    is_published: exhibition.isPublished === 1,
    published_at: exhibition.publishedAt,
    created_at: exhibition.createdAt,
    updated_at: exhibition.updatedAt,
  })
}
