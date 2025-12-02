import { Hono } from 'hono'

import { errorHandler } from '../middlewares/errorHandler.js'
import { exhibitorRoutes } from './exhibitor.js'

type Bindings = {
  DB: D1Database
}

export function createApp() {
  const app = new Hono<{ Bindings: Bindings }>()

  // エラーハンドリングミドルウェアを適用
  app.onError(errorHandler)

  // ヘルスチェック
  app.get('/health', (c) => c.json({ status: 'ok' }))

  // APIルーティング
  app.route('/api/exhibitors', exhibitorRoutes)

  return app
}
