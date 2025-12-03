import type { Context } from 'hono'

import { listArDesignsUseCase } from '../../application/usecases/exhibitionArDesign/listArDesign'
import type { ExhibitionArDesignRepository } from '../../domain/repositories/exhibitionArDesign'

/**
 * ARデザイン一覧取得ハンドラー
 * 
 * @param c - Honoコンテキスト
 * @param repository - ExhibitionArDesignリポジトリ
 * @returns 200 OK with ARデザイン一覧
 */
export async function handleListArDesign(
  c: Context,
  repository: ExhibitionArDesignRepository
): Promise<Response> {
  const response = await listArDesignsUseCase(repository)
  return c.json(response, 200)
}