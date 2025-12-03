import { Hono } from 'hono'

import {
  handleCreateExhibition,
  handleDeleteExhibition,
  handleGetExhibition,
  handleUpdateExhibitionInformation,
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

// PUT /exhibitions/:exhibition_id/information - 基本情報の更新
exhibitionRoutes.put('/:exhibition_id/information', handleUpdateExhibitionInformation)

