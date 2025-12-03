import { ExhibitionInformationInputSchema } from '../../application/dto/exhibition'
import { createExhibitionUseCase } from '../../application/usecases/exhibition/createExhibition'
import { deleteExhibitionUseCase } from '../../application/usecases/exhibition/deleteExhibition'
import { deleteExhibitionImageUseCase } from '../../application/usecases/exhibition/deleteExhibitionImage'
import { getExhibitionUseCase } from '../../application/usecases/exhibition/getExhibition'
import { getExhibitionImageUseCase } from '../../application/usecases/exhibition/getExhibitionImage'
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
  let contentType = 'image/png'
  if (image.length >= 4) {
    const sig0 = image[0]
    const sig1 = image[1]
    const sig2 = image[2]
    const sig3 = image[3]
    // JPEG: FF D8 FF
    if (sig0 === 0xff && sig1 === 0xd8 && sig2 === 0xff) {
      contentType = 'image/jpeg'
    }
    // PNG: 89 50 4E 47
    else if (sig0 === 0x89 && sig1 === 0x50 && sig2 === 0x4e && sig3 === 0x47) {
      contentType = 'image/png'
    }
    // GIF: 'GIF8'
    else if (sig0 === 0x47 && sig1 === 0x49 && sig2 === 0x46 && sig3 === 0x38) {
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

