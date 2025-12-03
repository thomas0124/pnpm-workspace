import { Hono } from 'hono'

import {
  handleCreateExhibition,
  handleDeleteExhibition,
  handleDraftExhibition,
  handleGetExhibition,
  handlePublishExhibition,
  handleUnpublishExhibition,
} from '../../handlers/exhibition'
import type { Bindings } from '../../handlers/index'

export const exhibitionCoreRoutes = new Hono<{ Bindings: Bindings }>()

// POST / - 出展情報の新規作成
exhibitionCoreRoutes.post('/', handleCreateExhibition)

// GET /:exhibition_id - 出展情報の取得
exhibitionCoreRoutes.get('/:exhibition_id', handleGetExhibition)

// DELETE /:exhibition_id - 出展の削除
exhibitionCoreRoutes.delete('/:exhibition_id', handleDeleteExhibition)

// PUT /:exhibition_id/draft - 出展を下書きに戻す
exhibitionCoreRoutes.put('/:exhibition_id/draft', handleDraftExhibition)

// PUT /:exhibition_id/publish - 出展の公開
exhibitionCoreRoutes.put('/:exhibition_id/publish', handlePublishExhibition)

// PUT /:exhibition_id/unpublish - 出展の非公開
exhibitionCoreRoutes.put('/:exhibition_id/unpublish', handleUnpublishExhibition)
