import { zValidator } from '@hono/zod-validator'

import { PublicExhibitionListQuerySchema } from '../../application/dto/exhibition'
import {
  getPublicExhibitionCategoryCountsUseCase,
  listPublicExhibitionsUseCase,
} from '../../application/usecases/exhibition/public/publicExhibition'
import { CATEGORY_MAPPING} from '../../domain/repositories/exhibition'
import { getContainer, handlerFactory } from './index'


export type ExhibitionCategoryEn = keyof typeof CATEGORY_MAPPING

export const handleGetPublicExhibitions = handlerFactory.createHandlers(
  zValidator('query', PublicExhibitionListQuerySchema),
  async (c) => {
  try {
    const container = getContainer(c)

    // 英語のカテゴリを日本語に変換
    const categoryEn = c.req.query('category') as ExhibitionCategoryEn | undefined
    const categoryJp = categoryEn ? CATEGORY_MAPPING[categoryEn] : undefined

    const query = {
      search: c.req.query('search') ?? undefined,
      category: categoryJp, // 日本語のカテゴリを使用
      page: c.req.query('page') ?? undefined,
      per_page: c.req.query('per_page') ?? undefined,
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
})

export const handleGetPublicExhibitionCategories = handlerFactory.createHandlers(async (c) => {
  const container = getContainer(c)

  const result = await getPublicExhibitionCategoryCountsUseCase(container.exhibitionRepository)

  return c.json(result, 200)
})
