import { z } from 'zod'

import type {
  CategoryCount,
  ExhibitionRepository,
  FindPublishedParams,
} from '../../../domain/repositories/exhibition'
import type { ExhibitionArDesignRepository } from '../../../domain/repositories/exhibitionArDesign'
import type { ExhibitionInformationRepository } from '../../../domain/repositories/exhibitionInformation'
import type {
  CategoryCountListResponseDto,
  PublicExhibitionDto,
  PublicExhibitionListResponseDto,
} from '../../dto/exhibition'
import {
  CategoryCountListResponseSchema,
  CategoryCountSchema,
  PublicExhibitionArDesignSchema,
  PublicExhibitionListResponseSchema,
  PublicExhibitionSchema,
} from '../../dto/exhibition'

/**
 * 画像BLOB(Uint8Array)をBase64文字列に変換
 * DBに画像が存在しない場合はnullを返す
 */
function toBase64OrNull(blob: Uint8Array | null): string | null {
  if (!blob) return null

  let binary = ''
  for (let i = 0; i < blob.length; i++) {
    binary += String.fromCharCode(blob[i])
  }

  // Cloudflare Workers 環境では btoa が利用可能
  return btoa(binary)
}

const ListQuerySchema = z.object({
  category: z.enum(['飲食', '展示', '体験', 'ステージ']).optional(),
  page: z.number().int().min(1).optional(),
  perPage: z.number().int().min(1).max(100).optional(),
})

export type ListPublicExhibitionsQuery = z.infer<typeof ListQuerySchema>

/**
 * 公開出展一覧取得ユースケース
 */
export async function listPublicExhibitionsUseCase(
  rawQuery: { category?: string; page?: string; per_page?: string },
  exhibitionRepository: ExhibitionRepository,
  exhibitionInformationRepository: ExhibitionInformationRepository,
  exhibitionArDesignRepository: ExhibitionArDesignRepository
): Promise<PublicExhibitionListResponseDto> {
  const parsed = ListQuerySchema.parse({
    category: rawQuery.category,
    page: rawQuery.page ? Number(rawQuery.page) : undefined,
    perPage: rawQuery.per_page ? Number(rawQuery.per_page) : undefined,
  })

  const params: FindPublishedParams = {
    category: parsed.category,
    page: parsed.page,
    perPage: parsed.perPage,
  }

  const result = await exhibitionRepository.findPublished(params)

  const data: PublicExhibitionDto[] = []
  for (const ex of result.data) {
    if (!ex.exhibitionInformationId) {
      // 公開条件的にはありえないがガードしておく
      continue
    }
    const info = await exhibitionInformationRepository.findById(ex.exhibitionInformationId)
    if (!info) continue

    let arDesign: PublicExhibitionDto['ar_design'] = null
    if (info.exhibitionArDesignId) {
      const design = await exhibitionArDesignRepository.findById(info.exhibitionArDesignId)
      if (design) {
        arDesign = PublicExhibitionArDesignSchema.parse({
          id: design.id,
          url: design.url,
        })
      }
    }

    // ExhibitionInformationドメインエンティティが保持する画像BLOBをBase64エンコード
    const image = toBase64OrNull(info.image)

    const publicExhibition = PublicExhibitionSchema.parse({
      id: ex.id,
      title: info.title,
      category: info.category,
      exhibitor_name: info.exhibitorName,
      location: info.location,
      price: info.price,
      required_time: info.requiredTime,
      comment: info.comment,
      ar_design: arDesign,
      image,
    })

    data.push(publicExhibition)
  }

  return PublicExhibitionListResponseSchema.parse({
    data,
    meta: {
      total: result.meta.total,
      page: result.meta.page,
      per_page: result.meta.perPage,
      total_pages: result.meta.totalPages,
    },
  })
}

/**
 * 公開出展詳細取得ユースケース
 */
export async function getPublicExhibitionUseCase(
  exhibitionId: string,
  exhibitionRepository: ExhibitionRepository,
  exhibitionInformationRepository: ExhibitionInformationRepository,
  exhibitionArDesignRepository: ExhibitionArDesignRepository
): Promise<PublicExhibitionDto | null> {
  const ex = await exhibitionRepository.findPublishedById(exhibitionId)
  if (!ex || !ex.exhibitionInformationId) return null

  const info = await exhibitionInformationRepository.findById(ex.exhibitionInformationId)
  if (!info) return null

  let arDesign: PublicExhibitionDto['ar_design'] = null
  if (info.exhibitionArDesignId) {
    const design = await exhibitionArDesignRepository.findById(info.exhibitionArDesignId)
    if (design) {
      arDesign = PublicExhibitionArDesignSchema.parse({
        id: design.id,
        url: design.url,
      })
    }
  }

  // 詳細取得時もExhibitionInformationが保持する画像BLOBをBase64として含める
  const image = toBase64OrNull(info.image)

  return PublicExhibitionSchema.parse({
    id: ex.id,
    title: info.title,
    category: info.category,
    exhibitor_name: info.exhibitorName,
    location: info.location,
    price: info.price,
    required_time: info.requiredTime,
    comment: info.comment,
    ar_design: arDesign,
    image,
  })
}

/**
 * カテゴリ別件数取得ユースケース
 */
export async function getPublicExhibitionCategoryCountsUseCase(
  exhibitionRepository: ExhibitionRepository
): Promise<CategoryCountListResponseDto> {
  const rows: CategoryCount[] = await exhibitionRepository.findCategoryCounts()

  const data = rows.map((row) =>
    CategoryCountSchema.parse({
      category: row.category,
      count: row.count,
    })
  )

  return CategoryCountListResponseSchema.parse({
    data,
  })
}
