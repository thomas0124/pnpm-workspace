import { Hono } from 'hono'

import { handleListArDesign } from '../handlers/exhibitionArDesign'
import type { Bindings } from '../handlers/index'
import { authMiddleware } from '../middlewares/authMiddleware'

export const arDesignRoutes = new Hono<{ Bindings: Bindings }>()

// ARデザイン一覧取得（認証必須）
arDesignRoutes.get('/', authMiddleware, handleListArDesign)
