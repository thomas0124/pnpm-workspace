import { Hono } from 'hono'

import {
  handleCreateExhibition,
  handleDeleteExhibition,
  handleDraftExhibition,
  handleGetExhibition,
  handleGetMyExhibition,
  handlePublishExhibition,
  handleUnpublishExhibition,
} from '../../handlers/exhibition'
import type { Bindings } from '../../handlers/index'

export const exhibitionCoreRoutes = new Hono<{ Bindings: Bindings }>()

  // POST / - 出展情報の新規作成
  .post('/', ...handleCreateExhibition)

  // GET /me - 認証済み出展者の出展情報の取得
  .get('/me', ...handleGetMyExhibition)

  // GET /:exhibitionId - 出展情報の取得
  .get('/:exhibitionId', ...handleGetExhibition)

  // DELETE /:exhibitionId - 出展の削除
  .delete('/:exhibitionId', ...handleDeleteExhibition)

  // PUT /:exhibitionId/draft - 出展を下書きに戻す
  .put('/:exhibitionId/draft', ...handleDraftExhibition)

  // PUT /:exhibitionId/publish - 出展の公開
  .put('/:exhibitionId/publish', ...handlePublishExhibition)

  // PUT /:exhibitionId/unpublish - 出展の非公開
  .put('/:exhibitionId/unpublish', ...handleUnpublishExhibition)
