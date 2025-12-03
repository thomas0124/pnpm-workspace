import { Hono } from 'hono'

import {
  handleCreateExhibition,
  handleDeleteExhibition,
  handleDeleteExhibitionImage,
  handleDraftExhibition,
  handleGetExhibition,
  handleGetExhibitionImage,
  handlePublishExhibition,
  handleUnpublishExhibition,
  handleUpdateExhibitionInformation,
  handleUploadExhibitionImage,
} from '../handlers/exhibition'
import type { Bindings } from '../handlers/index'
import { authMiddleware } from '../middlewares/authMiddleware'

export const exhibitionRoutes = new Hono<{ Bindings: Bindings }>()

// すべてのルートに認証ミドルウェアを適用
exhibitionRoutes.use('*', authMiddleware)

// POST /exhibitions - 出展情報の新規作成
exhibitionRoutes.post('/', handleCreateExhibition)

// GET /exhibitions/:exhibition_id - 出展情報の取得
exhibitionRoutes.get('/:exhibition_id', handleGetExhibition)

// DELETE /exhibitions/:exhibition_id - 出展の削除
exhibitionRoutes.delete('/:exhibition_id', handleDeleteExhibition)

// PUT /exhibitions/:exhibition_id/draft - 出展を下書きに戻す
exhibitionRoutes.put('/:exhibition_id/draft', handleDraftExhibition)

// PUT /exhibitions/:exhibition_id/publish - 出展の公開
exhibitionRoutes.put('/:exhibition_id/publish', handlePublishExhibition)

// PUT /exhibitions/:exhibition_id/unpublish - 出展の非公開
exhibitionRoutes.put('/:exhibition_id/unpublish', handleUnpublishExhibition)

// POST /exhibitions/:exhibition_id/information/image - 出展画像のアップロード
exhibitionRoutes.post('/:exhibition_id/information/image', handleUploadExhibitionImage)

// PUT /exhibitions/:exhibition_id/information/image - 出展画像の更新
exhibitionRoutes.put('/:exhibition_id/information/image', handleUploadExhibitionImage)

// GET /exhibitions/:exhibition_id/information/image - 出展画像の取得
exhibitionRoutes.get('/:exhibition_id/information/image', handleGetExhibitionImage)

// DELETE /exhibitions/:exhibition_id/information/image - 出展画像の削除
exhibitionRoutes.delete('/:exhibition_id/information/image', handleDeleteExhibitionImage)

// PUT /exhibitions/:exhibition_id/information - 基本情報の更新
exhibitionRoutes.put('/:exhibition_id/information', handleUpdateExhibitionInformation)
