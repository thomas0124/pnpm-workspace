import { listArDesignsUseCase } from '../../application/usecases/exhibitionArDesign/listArDesign'
import type { HandlerContext } from './index'
import { getContainer } from './index'

/**
 * ARデザイン一覧取得ハンドラー
 *
 * @param c - HandlerContext
 * @returns 200 OK with ARデザイン一覧
 */
export async function handleListArDesign(c: HandlerContext): Promise<Response> {
  const container = getContainer(c)
  const response = await listArDesignsUseCase(container.exhibitionArDesignRepository)
  return c.json(response, 200)
}
