import { z } from 'zod'

import type {
  ExhibitionRepository,
  FindPublishedParams,
} from '../../../../domain/repositories/exhibition'
import type { ExhibitionInformationRepository } from '../../../../domain/repositories/exhibitionInformation'
import type { PublicExhibitionDto, PublicExhibitionListResponseDto } from '../../../dto/exhibition'
import {
  PublicExhibitionListResponseSchema,
  PublicExhibitionSchema,
} from '../../../dto/exhibition'

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
  category: z.enum(['Food', 'Exhibition', 'Experience', 'Stage']).optional(),
})

export type ListPublicExhibitionsQuery = z.infer<typeof ListQuerySchema>

/**
 * 公開出展一覧取得ユースケース
 */
export async function listPublicExhibitionsUseCase(
  rawQuery: ListPublicExhibitionsQuery,
  exhibitionRepository: ExhibitionRepository,
  exhibitionInformationRepository: ExhibitionInformationRepository
): Promise<PublicExhibitionListResponseDto> {
  const parsed = ListQuerySchema.parse({
    search: rawQuery.search,
    category: rawQuery.category,
  })

  const params: FindPublishedParams = {
    search: parsed.search,
    category: parsed.category,
  }

  const result = await exhibitionRepository.findPublished(params)

  // 一覧分の ExhibitionInformation を一括取得
  const infoIds = result.map((ex) => ex.exhibitionInformationId).filter((id): id is string => !!id)
  const uniqueInfoIds = Array.from(new Set(infoIds))
  const infos = await exhibitionInformationRepository.findByIds(uniqueInfoIds)
  const infoMap = new Map(infos.map((info) => [info.id, info]))

  const data: PublicExhibitionDto[] = []
  for (const ex of result) {
    if (!ex.exhibitionInformationId) {
      // 公開条件的にはありえないがガードしておく
      continue
    }

    const info = infoMap.get(ex.exhibitionInformationId)
    if (!info) continue

    // ExhibitionInformationドメインエンティティが保持する画像BLOBをBase64エンコード
    const image = toBase64OrNull(info.image)

    const publicExhibition = PublicExhibitionSchema.parse({
      id: ex.id,
      title: info.title,
      category: info.category,
      exhibitorName: info.exhibitorName,
      location: info.location,
      price: info.price,
      requiredTime: info.requiredTime,
      comment: info.comment,
      image,
    })

    data.push(publicExhibition)
  }

  return PublicExhibitionListResponseSchema.parse({
    data,
  })
}
