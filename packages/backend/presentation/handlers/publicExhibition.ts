import {
  getPublicExhibitionCategoryCountsUseCase,
  getPublicExhibitionUseCase,
  listPublicExhibitionsUseCase,
} from '../../application/usecases/exhibition/publicExhibition'
import type { HandlerContext } from './index'
import { getContainer } from './index'

export async function handleGetPublicExhibitions(c: HandlerContext) {
  const container = getContainer(c)

  const query = {
    search: c.req.query('search') ?? undefined,
    category: c.req.query('category') ?? undefined,
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
}

export async function handleGetPublicExhibition(c: HandlerContext) {
  const container = getContainer(c)
  const exhibitionId = c.req.param('exhibition_id')

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

export async function handleGetPublicExhibitionCategories(c: HandlerContext) {
  const container = getContainer(c)

  const result = await getPublicExhibitionCategoryCountsUseCase(container.exhibitionRepository)

  return c.json(result, 200)
}
