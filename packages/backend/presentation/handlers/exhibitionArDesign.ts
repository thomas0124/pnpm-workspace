import { listArDesignsUseCase } from '../../application/usecases/exhibitionArDesign/listArDesign'
import { getContainer, handlerFactory } from './index'

/**
 * ARデザイン一覧取得ハンドラー
 *
 * @param c - HandlerContext
 * @returns 200 OK with ARデザイン一覧
 */
export const handleListArDesign = handlerFactory.createHandlers(async (c) => {
  const container = getContainer(c)
  const response = await listArDesignsUseCase(container.exhibitionArDesignRepository)
  return c.json(response, 200)
})
