import { zValidator } from '@hono/zod-validator'

import { ExhibitionInformationInputSchema } from '../../application/dto/exhibition'
import { createExhibitionUseCase } from '../../application/usecases/exhibition/core/createExhibition'
import { deleteExhibitionUseCase } from '../../application/usecases/exhibition/core/deleteExhibition'
import { getExhibitionUseCase } from '../../application/usecases/exhibition/core/getExhibition'
import { deleteExhibitionImageUseCase } from '../../application/usecases/exhibition/image/deleteExhibitionImage'
import { getExhibitionImageUseCase } from '../../application/usecases/exhibition/image/getExhibitionImage'
import { uploadExhibitionImageUseCase } from '../../application/usecases/exhibition/image/uploadExhibitionImage'
import { updateExhibitionInformationUseCase } from '../../application/usecases/exhibition/information/updateExhibitionInformation'
import { draftExhibitionUseCase } from '../../application/usecases/exhibition/status/draftExhibition'
import { publishExhibitionUseCase } from '../../application/usecases/exhibition/status/publishExhibition'
import { unpublishExhibitionUseCase } from '../../application/usecases/exhibition/status/unpublishExhibition'
import { ValidationError } from '../../domain/errors'
import { ExhibitionIdSchema } from '../../domain/models/exhibition'
import { getExhibitorId } from '../middlewares/authMiddleware'
import { getContainer, handlerFactory } from './index'

const MAX_SIZE_BYTES = 5 * 1024 * 1024 // 5MB

/**
 * 出展作成ハンドラー
 */
export const handleCreateExhibition = handlerFactory.createHandlers(
  zValidator('json', ExhibitionInformationInputSchema),
  async (c) => {
    const container = getContainer(c)
    const exhibitorId = getExhibitorId(c)
    const input = c.req.valid('json')

    const result = await createExhibitionUseCase(
      input,
      exhibitorId,
      container.exhibitionRepository,
      container.exhibitionInformationRepository,
      container.exhibitionArDesignRepository
    )

    return c.json(result, 201)
  }
)

/**
 * 出展取得ハンドラー
 */
export const handleGetExhibition = handlerFactory.createHandlers(
  zValidator('param', ExhibitionIdSchema),
  async (c) => {
    const container = getContainer(c)
    const exhibitorId = getExhibitorId(c)
    const exhibitionId = c.req.valid('param')

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
 * 出展削除ハンドラー
 */
export const handleDeleteExhibition = handlerFactory.createHandlers(
  zValidator('param', ExhibitionIdSchema),
  async (c) => {
    const container = getContainer(c)
    const exhibitorId = getExhibitorId(c)
    const exhibitionId = c.req.valid('param')

    await deleteExhibitionUseCase(
      exhibitionId,
      exhibitorId,
      container.exhibitionRepository,
      container.exhibitionInformationRepository
    )

    return c.body(null, 204)
  }
)

/**
 * 出展を下書き状態に戻すハンドラー
 * PUT /exhibitions/{exhibitionId}/draft
 */
export const handleDraftExhibition = handlerFactory.createHandlers(
  zValidator('param', ExhibitionIdSchema),
  async (c) => {
    const container = getContainer(c)
    const exhibitorId = getExhibitorId(c)
    const exhibitionId = c.req.valid('param')

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
 * 出展公開ハンドラー
 * PUT /exhibitions/{exhibitionId}/publish
 */
export const handlePublishExhibition = handlerFactory.createHandlers(
  zValidator('param', ExhibitionIdSchema),
  async (c) => {
    const container = getContainer(c)
    const exhibitorId = getExhibitorId(c)
    const exhibitionId = c.req.valid('param')

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
 * 出展非公開ハンドラー
 * PUT /exhibitions/{exhibitionId}/unpublish
 */
export const handleUnpublishExhibition = handlerFactory.createHandlers(
  zValidator('param', ExhibitionIdSchema),
  async (c) => {
    const container = getContainer(c)
    const exhibitorId = getExhibitorId(c)
    const exhibitionId = c.req.valid('param')

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
 * 出展基本情報更新ハンドラー
 */
export const handleUpdateExhibitionInformation = handlerFactory.createHandlers(
  zValidator('param', ExhibitionIdSchema),
  zValidator('json', ExhibitionInformationInputSchema),
  async (c) => {
    const container = getContainer(c)
    const exhibitorId = getExhibitorId(c)
    const exhibitionId = c.req.valid('param')
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
 * 出展画像アップロードハンドラー
 * POST /exhibitions/{exhibitionId}/information/image
 */
export const handleUploadExhibitionImage = handlerFactory.createHandlers(
  zValidator('param', ExhibitionIdSchema),
  async (c) => {
    const container = getContainer(c)
    const exhibitorId = getExhibitorId(c)
    const exhibitionId = c.req.valid('param')

    const body = await c.req.parseBody()
    const file = body['image']

    if (!(file instanceof File)) {
      throw new ValidationError('画像ファイルが指定されていません')
    }

    if (file.size > MAX_SIZE_BYTES) {
      throw new ValidationError('画像ファイルのサイズが大きすぎます（最大5MB）')
    }

    const contentType = file.type
    if (!['image/png', 'image/jpeg', 'image/gif'].includes(contentType)) {
      throw new ValidationError('サポートされていない画像形式です（PNG, JPEG, GIFのみ）')
    }

    const buffer = await file.arrayBuffer()
    const image = new Uint8Array(buffer)

    await uploadExhibitionImageUseCase(
      exhibitionId,
      exhibitorId,
      image,
      container.exhibitionRepository,
      container.exhibitionInformationRepository
    )

    return c.json(
      {
        message: '画像が正常にアップロードされました',
      },
      200
    )
  }
)

/**
 * 出展画像取得ハンドラー
 * GET /exhibitions/{exhibitionId}/information/image
 */
export const handleGetExhibitionImage = handlerFactory.createHandlers(
  zValidator('param', ExhibitionIdSchema),
  async (c) => {
    // 画像バイナリを返却する専用エンドポイント。
    // Hono RPC ではこのルートは `Response` として扱い、JSON ベースの型付きレスポンスの対象外とする。
    const container = getContainer(c)
    const exhibitorId = getExhibitorId(c)
    const exhibitionId = c.req.valid('param')

    const { image } = await getExhibitionImageUseCase(
      exhibitionId,
      exhibitorId,
      container.exhibitionRepository,
      container.exhibitionInformationRepository
    )

    // シグネチャから簡易的にContent-Typeを判定
    let contentType = 'application/octet-stream'
    if (image.length >= 4) {
      const sig = image.subarray(0, 4)
      // PNG: 89 50 4E 47
      if (sig[0] === 0x89 && sig[1] === 0x50 && sig[2] === 0x4e && sig[3] === 0x47) {
        contentType = 'image/png'
      }
      // JPEG: FF D8 FF
      else if (sig[0] === 0xff && sig[1] === 0xd8 && sig[2] === 0xff) {
        contentType = 'image/jpeg'
      }
      // GIF: 'GIF8'
      else if (sig[0] === 0x47 && sig[1] === 0x49 && sig[2] === 0x46 && sig[3] === 0x38) {
        contentType = 'image/gif'
      }
    }

    const arrayBuffer = image.buffer.slice(
      image.byteOffset,
      image.byteOffset + image.byteLength
    ) as ArrayBuffer
    const blob = new Blob([arrayBuffer], { type: contentType })

    return new Response(blob, {
      status: 200,
      headers: {
        'Content-Type': contentType,
      },
    })
  }
)

/**
 * 出展画像削除ハンドラー
 * DELETE /exhibitions/{exhibitionId}/information/image
 */
export const handleDeleteExhibitionImage = handlerFactory.createHandlers(
  zValidator('param', ExhibitionIdSchema),
  async (c) => {
    const container = getContainer(c)
    const exhibitorId = getExhibitorId(c)
    const exhibitionId = c.req.valid('param')

    await deleteExhibitionImageUseCase(
      exhibitionId,
      exhibitorId,
      container.exhibitionRepository,
      container.exhibitionInformationRepository
    )

    return c.body(null, 204)
  }
)
