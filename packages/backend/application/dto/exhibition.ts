import { z } from 'zod'

import type { Exhibition } from '../../domain/models/exhibition'
import type { ExhibitionInformation } from '../../domain/models/exhibitionInformation'
import type { ExhibitionCategory } from '../../domain/repositories/exhibition'
import type { ExhibitionArDesignRepository } from '../../domain/repositories/exhibitionArDesign'

export const ExhibitionIdParamSchema = z.object({
  exhibitionId: z.uuid(),
})

// 公開出展一覧クエリ用スキーマ（文字列クエリのまま受け取り、ユースケース側で数値変換を行う）
export const PublicExhibitionListQuerySchema = z.object({
  search: z.string().optional(),
  category: z.enum(['Food', 'Exhibition', 'Experience', 'Stage']).optional(),
})

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
  exhibitorName: z.string(),
  location: z.string(),
  price: z.number().int().nullable(),
  requiredTime: z.number().int().nullable(),
  comment: z.string().nullable(),
  arDesign: PublicExhibitionArDesignSchema,
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
})

export type PublicExhibitionListResponseDto = z.infer<typeof PublicExhibitionListResponseSchema>

/**
 * 出展情報入力（作成・更新用）
 * api.yml の ExhibitionInformationInput に対応
 */
export const ExhibitionInformationInputSchema = z.object({
  exhibitorName: z.string().min(1).max(100).trim(),
  title: z.string().min(1).max(200).trim(),
  category: z.enum(['Food', 'Exhibition', 'Experience', 'Stage']),
  location: z.string().min(1).max(100).trim(),
  price: z.number().int().min(0).nullable().optional(),
  requiredTime: z.number().int().min(1).nullable().optional(),
  comment: z.string().max(100).trim().nullable().optional(),
  exhibitionArDesignId: z.uuid().nullable().optional(),
  image: z.string().nullable().optional(), // Base64エンコードされた画像データ
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
  exhibitorId: z.uuid(),
  exhibitorName: z.string(),
  title: z.string(),
  category: z.enum(['Food', 'Exhibition', 'Experience', 'Stage']),
  location: z.string(),
  price: z.number().int().nullable(),
  requiredTime: z.number().int().nullable(),
  comment: z.string().nullable(),
  arDesign: ExhibitionArDesignDtoSchema.nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  image: z.string().nullable(),
})

export type ExhibitionInformationDto = z.infer<typeof ExhibitionInformationDtoSchema>

/**
 * 出展（管理API用）
 * api.yml の Exhibition に対応
 */
export const ExhibitionDtoSchema = z.object({
  id: z.uuid(),
  exhibitorId: z.uuid(),
  exhibitionInformationId: z.uuid().nullable(),
  exhibitionInformation: ExhibitionInformationDtoSchema.nullable(),
  isDraft: z.boolean(),
  isPublished: z.boolean(),
  publishedAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
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
    // ✅ 画像データをBase64エンコード
  const imageBase64 = exhibitionInformation.image
    ? Buffer.from(exhibitionInformation.image).toString('base64')
    : null

  return ExhibitionInformationDtoSchema.parse({
    id: exhibitionInformation.id,
    exhibitorId: exhibitionInformation.exhibitorId,
    exhibitorName: exhibitionInformation.exhibitorName,
    title: exhibitionInformation.title,
    category: exhibitionInformation.category,
    location: exhibitionInformation.location,
    price: exhibitionInformation.price,
    requiredTime: exhibitionInformation.requiredTime,
    comment: exhibitionInformation.comment,
    arDesign: arDesignDto,
    image: exhibitionInformation.image,
    createdAt: exhibitionInformation.createdAt,
    updatedAt: exhibitionInformation.updatedAt,
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
    exhibitorId: exhibition.exhibitorId,
    exhibitionInformationId: exhibition.exhibitionInformationId,
    exhibitionInformation: exhibitionInformationDto,
    isDraft: exhibition.isDraft === 1,
    isPublished: exhibition.isPublished === 1,
    publishedAt: exhibition.publishedAt,
    createdAt: exhibition.createdAt,
    updatedAt: exhibition.updatedAt,
  })
}
