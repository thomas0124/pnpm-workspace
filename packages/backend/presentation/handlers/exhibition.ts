import { ExhibitionInformationInputSchema } from '../../application/dto/exhibition'
import { createExhibitionUseCase } from '../../application/usecases/exhibition/createExhibition'
import { deleteExhibitionUseCase } from '../../application/usecases/exhibition/deleteExhibition'
import { getExhibitionUseCase } from '../../application/usecases/exhibition/getExhibition'
import { updateExhibitionInformationUseCase } from '../../application/usecases/exhibition/updateExhibitionInformation'
import { getExhibitorId } from '../middlewares/authMiddleware'
import type {HandlerContext} from './index';
import { getContainer  } from './index'

/**
 * 出展作成ハンドラー
 */
export async function handleCreateExhibition(c: HandlerContext) {
  const container = getContainer(c)
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
export async function handleGetExhibition(c: HandlerContext) {
  const container = getContainer(c)
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
export async function handleDeleteExhibition(c: HandlerContext) {
  const container = getContainer(c)
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
export async function handleUpdateExhibitionInformation(c: HandlerContext) {
  const container = getContainer(c)
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

