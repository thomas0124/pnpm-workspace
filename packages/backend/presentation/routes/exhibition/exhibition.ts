import { Hono } from 'hono'

import type { Bindings } from '../../handlers/index'
import { authMiddleware } from '../../middlewares/authMiddleware'
import { exhibitionCoreRoutes } from './exhibitionCore'
import { exhibitionImageRoutes } from './exhibitionImage'
import { exhibitionInformationRoutes } from './exhibitionInformation'

// GitHub issue #3148 の解決策: メソッドチェーン形式で定義することで型推論が正しく動作する
export const exhibitionRoutes = new Hono<{ Bindings: Bindings }>()
  // すべてのルートに認証ミドルウェアを適用
  .use('*', authMiddleware)
  // 基本CRUDと状態変更のルート
  .route('/', exhibitionCoreRoutes)
  // 基本情報更新のルート
  .route('/:exhibitionId/information', exhibitionInformationRoutes)
  // 画像関連のルート
  .route('/:exhibitionId/information/image', exhibitionImageRoutes)
