import type { D1Database } from '@cloudflare/workers-types'
import type { Context } from 'hono'

import { ExhibitionInformationInputSchema } from '../../application/dto/exhibition'
import { createExhibitionUseCase } from '../../application/usecases/exhibition/createExhibition'
import { getExhibitionUseCase } from '../../application/usecases/exhibition/getExhibition'
import { deleteExhibitionUseCase } from '../../application/usecases/exhibition/deleteExhibition'
import { updateExhibitionInformationUseCase } from '../../application/usecases/exhibition/updateExhibitionInformation'
import { createContainer } from '../../infrastructure/di/container'
import { getExhibitorId } from '../middlewares/authMiddleware'

type Bindings = {
  DB: D1Database
}

type ExhibitionContext = Context<{ Bindings: Bindings }>

/**
 * 出展作成ハンドラー
 */
export async function handleCreateExhibition(c: ExhibitionContext) {
  const container = createContainer(c.env.DB)
  const exhibitorId = getExhibitorId(c)

  const body = await c.req.json()
  const input = ExhibitionInformationInputSchema.parse(body)

  const result = await createExhibitionUseCase(
    input,
    exhibitorId,
    container.exhibitionRepository,
    container.exhibitionInformationRepository,
    container.exhibitionArDesignRepository
  )

  return c.json(result, 201)
}

/**
 * 出展取得ハンドラー
 */
export async function handleGetExhibition(c: ExhibitionContext) {
  const container = createContainer(c.env.DB)
  const exhibitorId = getExhibitorId(c)
  const exhibitionId = c.req.param('exhibition_id')

  const result = await getExhibitionUseCase(
    exhibitionId,
    exhibitorId,
    container.exhibitionRepository,
    container.exhibitionInformationRepository,
    container.exhibitionArDesignRepository
  )

  return c.json(result, 200)
}

/**
 * 出展削除ハンドラー
 */
export async function handleDeleteExhibition(c: ExhibitionContext) {
  const container = createContainer(c.env.DB)
  const exhibitorId = getExhibitorId(c)
  const exhibitionId = c.req.param('exhibition_id')

  await deleteExhibitionUseCase(
    exhibitionId,
    exhibitorId,
    container.exhibitionRepository,
    container.exhibitionInformationRepository
  )

  return c.body(null, 204)
}

/**
 * 出展基本情報更新ハンドラー
 */
export async function handleUpdateExhibitionInformation(c: ExhibitionContext) {
  const container = createContainer(c.env.DB)
  const exhibitorId = getExhibitorId(c)
  const exhibitionId = c.req.param('exhibition_id')

  const body = await c.req.json()
  const input = ExhibitionInformationInputSchema.parse(body)

  const result = await updateExhibitionInformationUseCase(
    exhibitionId,
    input,
    exhibitorId,
    container.exhibitionRepository,
    container.exhibitionInformationRepository,
    container.exhibitionArDesignRepository
  )

  return c.json(result, 200)
}

