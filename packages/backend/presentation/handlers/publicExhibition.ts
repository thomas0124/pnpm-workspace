import { zValidator } from '@hono/zod-validator'

import { PublicExhibitionListQuerySchema } from '../../application/dto/exhibition'
import {
  getPublicExhibitionCategoryCountsUseCase,
  getPublicExhibitionUseCase,
  listPublicExhibitionsUseCase,
} from '../../application/usecases/exhibition/public/publicExhibition'
import { ExhibitionIdSchema } from '../../domain/models/exhibition'
import { getContainer, handlerFactory } from './index'

export const handleGetPublicExhibitions = handlerFactory.createHandlers(
  zValidator('query', PublicExhibitionListQuerySchema),
  async (c) => {
    const container = getContainer(c)

    const query = c.req.valid('query')

    const result = await listPublicExhibitionsUseCase(
      query,
      container.exhibitionRepository,
      container.exhibitionInformationRepository,
      container.exhibitionArDesignRepository
    )

    return c.json(result, 200)
  }
)

export const handleGetPublicExhibition = handlerFactory.createHandlers(
  zValidator('param', ExhibitionIdSchema),
  async (c) => {
    const container = getContainer(c)
    const exhibitionId = c.req.valid('param')

    const result = await getPublicExhibitionUseCase(
      exhibitionId,
      container.exhibitionRepository,
      container.exhibitionInformationRepository,
      container.exhibitionArDesignRepository
    )

    if (!result) {
      return c.json(
        {
          error: 'NOT_FOUND',
          message: '出展が見つかりません、または非公開です',
        },
        404
      )
    }

    return c.json(result, 200)
  }
)

export const handleGetPublicExhibitionCategories = handlerFactory.createHandlers(async (c) => {
  const container = getContainer(c)

  const result = await getPublicExhibitionCategoryCountsUseCase(container.exhibitionRepository)

  return c.json(result, 200)
})
