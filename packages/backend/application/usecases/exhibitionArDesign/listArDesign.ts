import type { ExhibitionArDesignRepository } from '../../../domain/repositories/exhibitionArDesign'
import type { ArDesignListResponse } from '../../dto/exhibitionArDesign'

/**
 * ARデザイン一覧取得ユースケース
 * 
 * 利用可能なすべてのARデザインを取得します。
 * 出展者が出展情報作成・編集時に使用します。
 *
 * @param repository - ExhibitionArDesignリポジトリ
 * @returns ARデザイン一覧
 */
export async function listArDesignsUseCase(
  repository: ExhibitionArDesignRepository
): Promise<ArDesignListResponse> {
  const arDesigns = await repository.findAll()

  const data = arDesigns.map((design) => ({
    id: design.id,
    url: design.url,
  }))

  return { data }
}