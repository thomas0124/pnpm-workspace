import { zValidator } from '@hono/zod-validator'

import { PublicExhibitionListQuerySchema } from '../../application/dto/exhibition'
import type { ListPublicExhibitionsQuery } from '../../application/usecases/exhibition/public/publicExhibition'
import { listPublicExhibitionsUseCase } from '../../application/usecases/exhibition/public/publicExhibition'
import type { Category } from '../../domain/models/exhibitionInformation'
import { getContainer, handlerFactory } from './index'

export const handleGetPublicExhibitions = handlerFactory.createHandlers(
  zValidator('query', PublicExhibitionListQuerySchema),
  async (c) => {
    try {
      const container = getContainer(c)

      const query: ListPublicExhibitionsQuery = {
        search: c.req.query('search') ?? undefined,
        category: (c.req.query('category') as Category) ?? undefined,
      }

      const result = await listPublicExhibitionsUseCase(
        query,
        container.exhibitionRepository,
        container.exhibitionInformationRepository,
        container.exhibitionArDesignRepository
      )

      return c.json(result, 200)
    } catch (error) {
      console.error('❌ Error in handleGetPublicExhibitions:', error)
      throw error
    }
  }
)
