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

  const binary = Array.from(blob, (byte) => String.fromCharCode(byte)).join('')

  // Cloudflare Workers 環境では btoa が利用可能
  return btoa(binary)
}

const ListQuerySchema = z.object({
  search: z.string().optional(),
  category: z.enum(['飲食', '展示', '体験', 'ステージ']).optional(),
  page: z.number().int().min(1).optional(),
  perPage: z.number().int().min(1).max(100).optional(),
})

export type ListPublicExhibitionsQuery = z.infer<typeof ListQuerySchema>

/**
 * 公開出展一覧取得ユースケース
 */
export async function listPublicExhibitionsUseCase(
  rawQuery: { search?: string; category?: string; page?: string; per_page?: string },
  exhibitionRepository: ExhibitionRepository,
  exhibitionInformationRepository: ExhibitionInformationRepository,
  exhibitionArDesignRepository: ExhibitionArDesignRepository
): Promise<PublicExhibitionListResponseDto> {
  const parsed = ListQuerySchema.parse({
    search: rawQuery.search,
    category: rawQuery.category,
    page: rawQuery.page ? Number(rawQuery.page) : undefined,
    perPage: rawQuery.per_page ? Number(rawQuery.per_page) : undefined,
  })

  const params: FindPublishedParams = {
    search: parsed.search,
    category: parsed.category,
    page: parsed.page,
    perPage: parsed.perPage,
  }

  const result = await exhibitionRepository.findPublished(params)

  // 一覧分の ExhibitionInformation を一括取得
  const infoIds = result.data
    .map((ex) => ex.exhibitionInformationId)
    .filter((id): id is string => !!id)
  const uniqueInfoIds = Array.from(new Set(infoIds))
  const infos = await exhibitionInformationRepository.findByIds(uniqueInfoIds)
  const infoMap = new Map(infos.map((info) => [info.id, info]))

  // 一覧分の ExhibitionArDesign を一括取得
  const arDesignIds = infos
    .map((info) => info.exhibitionArDesignId)
    .filter((id): id is string => !!id)
  const uniqueArDesignIds = Array.from(new Set(arDesignIds))
  const arDesigns = uniqueArDesignIds.length
    ? await exhibitionArDesignRepository.findByIds(uniqueArDesignIds)
    : []
  const arDesignMap = new Map(arDesigns.map((design) => [design.id, design]))

  const data: PublicExhibitionDto[] = []
  for (const ex of result.data) {
    if (!ex.exhibitionInformationId) {
      // 公開条件的にはありえないがガードしておく
      continue
    }

    const info = infoMap.get(ex.exhibitionInformationId)
    if (!info) continue

    let arDesign: PublicExhibitionDto['ar_design'] = null
    if (info.exhibitionArDesignId) {
      const design = arDesignMap.get(info.exhibitionArDesignId)
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
