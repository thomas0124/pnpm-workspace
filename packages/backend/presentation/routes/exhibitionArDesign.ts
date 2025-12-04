import { Hono } from 'hono'

import { handleListArDesign } from '../handlers/exhibitionArDesign'
import type { Bindings } from '../handlers/index'
import { authMiddleware } from '../middlewares/authMiddleware'

// GitHub issue #3148 の解決策: メソッドチェーン形式で定義することで型推論が正しく動作する
export const arDesignRoutes = new Hono<{ Bindings: Bindings }>()
  // ARデザイン一覧取得（認証必須）
  .get('/', authMiddleware, ...handleListArDesign)
