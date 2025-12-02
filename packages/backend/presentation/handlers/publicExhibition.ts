import type { D1Database } from '@cloudflare/workers-types'
import type { Context } from 'hono'
import { ZodError } from 'zod'

import {
  getPublicExhibitionCategoryCountsUseCase,
  getPublicExhibitionUseCase,
  listPublicExhibitionsUseCase,
} from '../../application/usecases/exhibition/publicExhibition'
import { createContainer } from '../../infrastructure/di/container'

type Bindings = {
  DB: D1Database
}

type PublicContext = Context<{ Bindings: Bindings }>

export async function handleGetPublicExhibitions(c: PublicContext) {
  const env = c.env
  const container = createContainer(env.DB)

  try {
    const query = {
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
  } catch (error) {
    if (error instanceof ZodError) {
      return c.json(
        {
          error: 'BAD_REQUEST',
          message: 'リクエストパラメータが不正です',
        },
        400
      )
    }

    console.error(error)
    return c.json(
      {
        error: 'INTERNAL_SERVER_ERROR',
        message: '内部サーバーエラーが発生しました',
      },
      500
    )
  }
}

export async function handleGetPublicExhibition(c: PublicContext) {
  const env = c.env
  const container = createContainer(env.DB)

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

export async function handleGetPublicExhibitionCategories(c: PublicContext) {
  const env = c.env
  const container = createContainer(env.DB)

  const result = await getPublicExhibitionCategoryCountsUseCase(container.exhibitionRepository)

  return c.json(result, 200)
}
