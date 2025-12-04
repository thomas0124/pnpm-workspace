import { Hono } from 'hono'

import type { Bindings } from '../handlers/index'
import {
  handleGetPublicExhibition,
  handleGetPublicExhibitionCategories,
  handleGetPublicExhibitions,
} from '../handlers/publicExhibition'

export const publicExhibitionRoutes = new Hono<{ Bindings: Bindings }>()

// 公開出展一覧
publicExhibitionRoutes.get('/public/exhibitions', ...handleGetPublicExhibitions)

// 公開出展カテゴリ別件数
publicExhibitionRoutes.get('/public/exhibitions/categories', ...handleGetPublicExhibitionCategories)

// 公開出展詳細
publicExhibitionRoutes.get('/public/exhibitions/:exhibitionId', ...handleGetPublicExhibition)
