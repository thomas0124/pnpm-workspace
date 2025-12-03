import { Hono } from 'hono'

import { createContainer } from '../../infrastructure/di/container'
import { handleListArDesign } from '../handlers/exhibitionArDesign'
import { authMiddleware } from '../middlewares/authMiddleware'

type Bindings = {
  DB: D1Database
}

export const arDesignRoutes = new Hono<{ Bindings: Bindings }>()

// ARデザイン一覧取得（認証必須）
arDesignRoutes.get('/', authMiddleware, async (c) => {
  const container = createContainer(c.env.DB)
  return handleListArDesign(c, container.exhibitionArDesignRepository)
})