import { Hono } from 'hono'

import type { Bindings } from '../../handlers/index'
import { authMiddleware } from '../../middlewares/authMiddleware'
import { exhibitionCoreRoutes } from './exhibitionCore'
import { exhibitionImageRoutes } from './exhibitionImage'
import { exhibitionInformationRoutes } from './exhibitionInformation'

export const exhibitionRoutes = new Hono<{ Bindings: Bindings }>()

// すべてのルートに認証ミドルウェアを適用
exhibitionRoutes.use('*', authMiddleware)

// 基本CRUDと状態変更のルート
exhibitionRoutes.route('/', exhibitionCoreRoutes)

// 基本情報更新のルート
exhibitionRoutes.route('/:exhibitionId/information', exhibitionInformationRoutes)

// 画像関連のルート
exhibitionRoutes.route('/:exhibitionId/information/image', exhibitionImageRoutes)
