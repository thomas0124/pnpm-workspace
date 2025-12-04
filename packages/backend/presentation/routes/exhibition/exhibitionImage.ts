import { Hono } from 'hono'

import {
  handleDeleteExhibitionImage,
  handleGetExhibitionImage,
  handleUploadExhibitionImage,
} from '../../handlers/exhibition'
import type { Bindings } from '../../handlers/index'

export const exhibitionImageRoutes = new Hono<{ Bindings: Bindings }>()

// POST /:exhibitionId/information/image - 出展画像のアップロード
exhibitionImageRoutes.post('/', ...handleUploadExhibitionImage)

// PUT /:exhibitionId/information/image - 出展画像の更新
exhibitionImageRoutes.put('/', ...handleUploadExhibitionImage)

// GET /:exhibitionId/information/image - 出展画像の取得
exhibitionImageRoutes.get('/', ...handleGetExhibitionImage)

// DELETE /:exhibitionId/information/image - 出展画像の削除
exhibitionImageRoutes.delete('/', ...handleDeleteExhibitionImage)
