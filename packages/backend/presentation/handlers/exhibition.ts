import { ExhibitionInformationInputSchema } from '../../application/dto/exhibition'
import { createExhibitionUseCase } from '../../application/usecases/exhibition/createExhibition'
import { deleteExhibitionUseCase } from '../../application/usecases/exhibition/deleteExhibition'
import { deleteExhibitionImageUseCase } from '../../application/usecases/exhibition/deleteExhibitionImage'
import { draftExhibitionUseCase } from '../../application/usecases/exhibition/draftExhibition'
import { getExhibitionUseCase } from '../../application/usecases/exhibition/getExhibition'
import { getExhibitionImageUseCase } from '../../application/usecases/exhibition/getExhibitionImage'
import { publishExhibitionUseCase } from '../../application/usecases/exhibition/publishExhibition'
import { unpublishExhibitionUseCase } from '../../application/usecases/exhibition/unpublishExhibition'
import { updateExhibitionInformationUseCase } from '../../application/usecases/exhibition/updateExhibitionInformation'
import { uploadExhibitionImageUseCase } from '../../application/usecases/exhibition/uploadExhibitionImage'
import { ValidationError } from '../../domain/errors'
import { getExhibitorId } from '../middlewares/authMiddleware'
import type { HandlerContext } from './index'
import { getContainer } from './index'

const MAX_SIZE_BYTES = 5 * 1024 * 1024 // 5MB

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

// 出展状態変更系ハンドラーで共通の依存取得
function getExhibitionDeps(c: HandlerContext) {
  const container = getContainer(c)
  const exhibitorId = getExhibitorId(c)
  const exhibitionId = c.req.param('exhibition_id')

  return {
    container,
    exhibitorId,
    exhibitionId,
  }
}

/**
 * 出展を下書き状態に戻すハンドラー
 * PUT /exhibitions/{exhibition_id}/draft
 */
export async function handleDraftExhibition(c: HandlerContext) {
  const { container, exhibitorId, exhibitionId } = getExhibitionDeps(c)

  const result = await draftExhibitionUseCase(
    exhibitionId,
    exhibitorId,
    container.exhibitionRepository,
    container.exhibitionInformationRepository,
    container.exhibitionArDesignRepository
  )

  return c.json(result, 200)
}

/**
 * 出展公開ハンドラー
 * PUT /exhibitions/{exhibition_id}/publish
 */
export async function handlePublishExhibition(c: HandlerContext) {
  const { container, exhibitorId, exhibitionId } = getExhibitionDeps(c)

  const result = await publishExhibitionUseCase(
    exhibitionId,
    exhibitorId,
    container.exhibitionRepository,
    container.exhibitionInformationRepository,
    container.exhibitionArDesignRepository
  )

  return c.json(result, 200)
}

/**
 * 出展非公開ハンドラー
 * PUT /exhibitions/{exhibition_id}/unpublish
 */
export async function handleUnpublishExhibition(c: HandlerContext) {
  const { container, exhibitorId, exhibitionId } = getExhibitionDeps(c)

  const result = await unpublishExhibitionUseCase(
    exhibitionId,
    exhibitorId,
    container.exhibitionRepository,
    container.exhibitionInformationRepository,
    container.exhibitionArDesignRepository
  )

  return c.json(result, 200)
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

/**
 * 出展画像アップロードハンドラー
 * POST /exhibitions/{exhibition_id}/information/image
 */
export async function handleUploadExhibitionImage(c: HandlerContext) {
  const container = getContainer(c)
  const exhibitorId = getExhibitorId(c)
  const exhibitionId = c.req.param('exhibition_id')

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

/**
 * 出展画像取得ハンドラー
 * GET /exhibitions/{exhibition_id}/information/image
 */
export async function handleGetExhibitionImage(c: HandlerContext) {
  const container = getContainer(c)
  const exhibitorId = getExhibitorId(c)
  const exhibitionId = c.req.param('exhibition_id')

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

/**
 * 出展画像削除ハンドラー
 * DELETE /exhibitions/{exhibition_id}/information/image
 */
export async function handleDeleteExhibitionImage(c: HandlerContext) {
  const container = getContainer(c)
  const exhibitorId = getExhibitorId(c)
  const exhibitionId = c.req.param('exhibition_id')

  await deleteExhibitionImageUseCase(
    exhibitionId,
    exhibitorId,
    container.exhibitionRepository,
    container.exhibitionInformationRepository
  )

  return c.body(null, 204)
}
