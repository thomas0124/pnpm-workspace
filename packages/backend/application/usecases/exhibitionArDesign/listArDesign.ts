import type { ExhibitionArDesignRepository } from '../../../domain/repositories/exhibitionArDesign'
import type { ArDesignListResponse } from '../../dto/exhibitionArDesign'

/**
 * ARデザイン一覧取得ユースケース
 *
 * @param repository - ExhibitionArDesignリポジトリ
 * @returns ARデザイン一覧
 */
export async function listArDesignsUseCase(
  repository: ExhibitionArDesignRepository
): Promise<ArDesignListResponse> {
  // 1. 全ARデザインを取得
  const arDesigns = await repository.findAll()

  // 2. DTOに変換
  const data = arDesigns.map((design) => ({
    id: design.id,
    url: design.url,
  }))

  return { data }
}