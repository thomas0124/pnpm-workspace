import { zValidator } from '@hono/zod-validator'

import {
  AuthorizationHeaderSchema,
  ExhibitionIdParamSchema,
  ExhibitionInformationInputSchema,
  ExhibitionInformationUpdateSchema,
} from '../../application/dto/exhibition'
import { createExhibitionUseCase } from '../../application/usecases/exhibition/core/createExhibition'
import { deleteExhibitionUseCase } from '../../application/usecases/exhibition/core/deleteExhibition'
import { getExhibitionUseCase } from '../../application/usecases/exhibition/core/getExhibition'
import { updateExhibitionInformationUseCase } from '../../application/usecases/exhibition/information/updateExhibitionInformation'
import { draftExhibitionUseCase } from '../../application/usecases/exhibition/status/draftExhibition'
import { publishExhibitionUseCase } from '../../application/usecases/exhibition/status/publishExhibition'
import { unpublishExhibitionUseCase } from '../../application/usecases/exhibition/status/unpublishExhibition'
import { getExhibitorId } from '../middlewares/authMiddleware'
import {
  parseImageToBase64,
  toNullableString,
  toOptionalInt,
  toStringOrUndefined,
} from '../utils/formDataParser'
import { getContainer, handlerFactory } from './index'

/**
 * ✅ 出展作成ハンドラー（multipart/form-data 対応・画像含む）
 * POST /exhibitions
 */
export const handleCreateExhibition = handlerFactory.createHandlers(async (c) => {
  const container = getContainer(c)
  const exhibitorId = getExhibitorId(c)

  const formData = await c.req.formData()

  const imageBase64 = await parseImageToBase64(formData.get('image'))

  const parsedInput = ExhibitionInformationInputSchema.parse({
    exhibitorName: toStringOrUndefined(formData.get('exhibitorName')),
    title: toStringOrUndefined(formData.get('title')),
    category: toStringOrUndefined(formData.get('category')),
    location: toStringOrUndefined(formData.get('location')),
    price: toOptionalInt(formData.get('price')),
    requiredTime: toOptionalInt(formData.get('requiredTime')),
    comment: toNullableString(formData.get('comment')) ?? undefined,
    image: imageBase64,
  })

  const result = await createExhibitionUseCase(
    parsedInput,
    exhibitorId,
    container.exhibitionRepository,
    container.exhibitionInformationRepository
  )

  return c.json(result, 201)
})

/**
 * ✅ 出展取得ハンドラー（画像含む）
 * GET /exhibitions/{exhibitionId}
 */
export const handleGetExhibition = handlerFactory.createHandlers(
  zValidator('param', ExhibitionIdParamSchema),
  zValidator('header', AuthorizationHeaderSchema),
  async (c) => {
    const container = getContainer(c)
    const exhibitorId = getExhibitorId(c)
    const { exhibitionId } = c.req.valid('param')

    const result = await getExhibitionUseCase(
      exhibitionId,
      exhibitorId,
      container.exhibitionRepository,
      container.exhibitionInformationRepository
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
  zValidator('form', ExhibitionInformationUpdateSchema),
  zValidator('header', AuthorizationHeaderSchema),
  async (c) => {
    const container = getContainer(c)
    const exhibitorId = getExhibitorId(c)
    const { exhibitionId } = c.req.valid('param')

    const body = await c.req.parseBody()

    const imageBase64 = await parseImageToBase64(body.image)

    const input = ExhibitionInformationUpdateSchema.parse({
      exhibitorName: toStringOrUndefined(body.exhibitorName),
      title: toStringOrUndefined(body.title),
      category: toStringOrUndefined(body.category),
      location: toStringOrUndefined(body.location),
      price: toOptionalInt(body.price),
      requiredTime: toOptionalInt(body.requiredTime),
      comment: toNullableString(body.comment),
      image: imageBase64,
    })

    const result = await updateExhibitionInformationUseCase(
      exhibitionId,
      input,
      exhibitorId,
      container.exhibitionRepository,
      container.exhibitionInformationRepository
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
  zValidator('header', AuthorizationHeaderSchema),
  async (c) => {
    const container = getContainer(c)
    const exhibitorId = getExhibitorId(c)
    const { exhibitionId } = c.req.valid('param')

    const result = await draftExhibitionUseCase(
      exhibitionId,
      exhibitorId,
      container.exhibitionRepository,
      container.exhibitionInformationRepository
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
  zValidator('header', AuthorizationHeaderSchema),
  async (c) => {
    const container = getContainer(c)
    const exhibitorId = getExhibitorId(c)
    const { exhibitionId } = c.req.valid('param')

    const result = await publishExhibitionUseCase(
      exhibitionId,
      exhibitorId,
      container.exhibitionRepository,
      container.exhibitionInformationRepository
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
  zValidator('header', AuthorizationHeaderSchema),
  async (c) => {
    const container = getContainer(c)
    const exhibitorId = getExhibitorId(c)
    const { exhibitionId } = c.req.valid('param')

    const result = await unpublishExhibitionUseCase(
      exhibitionId,
      exhibitorId,
      container.exhibitionRepository,
      container.exhibitionInformationRepository
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
  zValidator('header', AuthorizationHeaderSchema),
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
