import { zValidator } from '@hono/zod-validator'

import {
  ExhibitionIdParamSchema,
  ExhibitionInformationInputSchema,
} from '../../application/dto/exhibition'
import { createExhibitionUseCase } from '../../application/usecases/exhibition/core/createExhibition'
import { deleteExhibitionUseCase } from '../../application/usecases/exhibition/core/deleteExhibition'
import { getExhibitionUseCase } from '../../application/usecases/exhibition/core/getExhibition'
import { updateExhibitionInformationUseCase } from '../../application/usecases/exhibition/information/updateExhibitionInformation'
import { draftExhibitionUseCase } from '../../application/usecases/exhibition/status/draftExhibition'
import { publishExhibitionUseCase } from '../../application/usecases/exhibition/status/publishExhibition'
import { unpublishExhibitionUseCase } from '../../application/usecases/exhibition/status/unpublishExhibition'
import { getExhibitorId } from '../middlewares/authMiddleware'
import { getContainer, handlerFactory } from './index'

/**
 * ✅ 出展作成ハンドラー（multipart/form-data 対応・画像含む）
 * POST /exhibitions
 */
export const handleCreateExhibition = handlerFactory.createHandlers(async (c) => {
  const container = getContainer(c)
  const exhibitorId = getExhibitorId(c)

  const body = await c.req.parseBody()

  const toStringOrUndefined = (value: unknown) => {
    if (value === undefined || value === null) return undefined
    if (typeof value === 'string') return value
    return undefined
  }

  const toNullableString = (value: unknown) => {
    const str = toStringOrUndefined(value)
    return str === undefined || str === '' ? null : str
  }

  const toOptionalInt = (value: unknown) => {
    const str = toStringOrUndefined(value)
    if (str === undefined || str === '') return undefined
    const num = Number(str)
    return Number.isFinite(num) ? num : undefined
  }

  let imageBase64: string | undefined
  const image = body.image
  if (image instanceof File) {
    const arrayBuffer = await image.arrayBuffer()
    imageBase64 = Buffer.from(arrayBuffer).toString('base64')
  } else if (image && typeof image === 'object' && 'byteLength' in (image as ArrayBufferView)) {
    // parseBody が Uint8Array などの TypedArray を返す場合に対応
    const view = image as ArrayBufferView
    imageBase64 = Buffer.from(view.buffer).toString('base64')
  } else if (typeof image === 'string' && image.trim() !== '') {
    // 既にBase64が送られているケースも許容
    imageBase64 = image
  }

  const parsedInput = ExhibitionInformationInputSchema.parse({
    exhibitorName: toStringOrUndefined(body.exhibitorName),
    title: toStringOrUndefined(body.title),
    category: toStringOrUndefined(body.category),
    location: toStringOrUndefined(body.location),
    price: toOptionalInt(body.price),
    requiredTime: toOptionalInt(body.requiredTime),
    comment: toNullableString(body.comment) ?? undefined,
    exhibitionArDesignId: toNullableString(body.exhibitionArDesignId) ?? undefined,
    image: imageBase64,
  })

  const result = await createExhibitionUseCase(
    parsedInput,
    exhibitorId,
    container.exhibitionRepository,
    container.exhibitionInformationRepository,
    container.exhibitionArDesignRepository
  )

  return c.json(result, 201)
})

/**
 * ✅ 出展取得ハンドラー（画像含む）
 * GET /exhibitions/{exhibitionId}
 */
export const handleGetExhibition = handlerFactory.createHandlers(
  zValidator('param', ExhibitionIdParamSchema),
  async (c) => {
    const container = getContainer(c)
    const exhibitorId = getExhibitorId(c)
    const { exhibitionId } = c.req.valid('param')

    const result = await getExhibitionUseCase(
      exhibitionId,
      exhibitorId,
      container.exhibitionRepository,
      container.exhibitionInformationRepository,
      container.exhibitionArDesignRepository
    )

    return c.json(result, 200)
  }
)

/**
 * ✅ 出展情報更新ハンドラー（画像含む）
 * PUT /exhibitions/{exhibitionId}/information
 */
export const handleUpdateExhibitionInformation = handlerFactory.createHandlers(
  zValidator('param', ExhibitionIdParamSchema),
  zValidator('json', ExhibitionInformationInputSchema),
  async (c) => {
    const container = getContainer(c)
    const exhibitorId = getExhibitorId(c)
    const { exhibitionId } = c.req.valid('param')
    const input = c.req.valid('json')

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
)

/**
 * ✅ 出展を下書き状態に戻すハンドラー（画像含むレスポンス）
 * PUT /exhibitions/{exhibitionId}/draft
 */
export const handleDraftExhibition = handlerFactory.createHandlers(
  zValidator('param', ExhibitionIdParamSchema),
  async (c) => {
    const container = getContainer(c)
    const exhibitorId = getExhibitorId(c)
    const { exhibitionId } = c.req.valid('param')

    const result = await draftExhibitionUseCase(
      exhibitionId,
      exhibitorId,
      container.exhibitionRepository,
      container.exhibitionInformationRepository,
      container.exhibitionArDesignRepository
    )

    return c.json(result, 200)
  }
)

/**
 * ✅ 出展公開ハンドラー（画像含むレスポンス）
 * PUT /exhibitions/{exhibitionId}/publish
 */
export const handlePublishExhibition = handlerFactory.createHandlers(
  zValidator('param', ExhibitionIdParamSchema),
  async (c) => {
    const container = getContainer(c)
    const exhibitorId = getExhibitorId(c)
    const { exhibitionId } = c.req.valid('param')

    const result = await publishExhibitionUseCase(
      exhibitionId,
      exhibitorId,
      container.exhibitionRepository,
      container.exhibitionInformationRepository,
      container.exhibitionArDesignRepository
    )

    return c.json(result, 200)
  }
)

/**
 * ✅ 出展非公開ハンドラー（画像含むレスポンス）
 * PUT /exhibitions/{exhibitionId}/unpublish
 */
export const handleUnpublishExhibition = handlerFactory.createHandlers(
  zValidator('param', ExhibitionIdParamSchema),
  async (c) => {
    const container = getContainer(c)
    const exhibitorId = getExhibitorId(c)
    const { exhibitionId } = c.req.valid('param')

    const result = await unpublishExhibitionUseCase(
      exhibitionId,
      exhibitorId,
      container.exhibitionRepository,
      container.exhibitionInformationRepository,
      container.exhibitionArDesignRepository
    )

    return c.json(result, 200)
  }
)

/**
 * ✅ 出展削除ハンドラー（画像も含めて削除）
 * DELETE /exhibitions/{exhibitionId}
 */
export const handleDeleteExhibition = handlerFactory.createHandlers(
  zValidator('param', ExhibitionIdParamSchema),
  async (c) => {
    const container = getContainer(c)
    const exhibitorId = getExhibitorId(c)
    const { exhibitionId } = c.req.valid('param')

    await deleteExhibitionUseCase(
      exhibitionId,
      exhibitorId,
      container.exhibitionRepository,
      container.exhibitionInformationRepository
    )

    return c.body(null, 204)
  }
)
