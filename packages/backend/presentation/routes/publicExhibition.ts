import { Hono } from 'hono'

import type { Bindings } from '../handlers/index'
import {
  handleGetPublicExhibitionCategories,
  handleGetPublicExhibitions,
} from '../handlers/publicExhibition'

// GitHub issue #3148 の解決策: メソッドチェーン形式で定義することで型推論が正しく動作する
export const publicExhibitionRoutes = new Hono<{ Bindings: Bindings }>()
  // 公開出展一覧
  .get('/public/exhibitions', ...handleGetPublicExhibitions)
  // 公開出展カテゴリ別件数
  .get('/public/exhibitions/categories', ...handleGetPublicExhibitionCategories)
