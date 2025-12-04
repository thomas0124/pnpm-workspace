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
exhibitionCoreRoutes.post('/', ...handleCreateExhibition)

// GET /:exhibitionId - 出展情報の取得
exhibitionCoreRoutes.get('/:exhibitionId', ...handleGetExhibition)

// DELETE /:exhibitionId - 出展の削除
exhibitionCoreRoutes.delete('/:exhibitionId', ...handleDeleteExhibition)

// PUT /:exhibitionId/draft - 出展を下書きに戻す
exhibitionCoreRoutes.put('/:exhibitionId/draft', ...handleDraftExhibition)

// PUT /:exhibitionId/publish - 出展の公開
exhibitionCoreRoutes.put('/:exhibitionId/publish', ...handlePublishExhibition)

// PUT /:exhibitionId/unpublish - 出展の非公開
exhibitionCoreRoutes.put('/:exhibitionId/unpublish', ...handleUnpublishExhibition)
