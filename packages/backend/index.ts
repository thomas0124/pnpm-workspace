import type { D1Database } from '@cloudflare/workers-types'
import { Hono } from 'hono'

import { errorHandler } from './presentation/middlewares/errorHandler'
import { exhibitorRoutes } from './presentation/routes/exhibitor'
import { publicExhibitionRoutes } from './presentation/routes/publicExhibition'

type Bindings = {
  DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()

// エラーハンドラーを適用
app.onError(errorHandler)

// ヘルスチェック
app.get('/health', (c) => {
  return c.json({ status: 'ok' })
})

// 出展者API
app.route('/api/exhibitors', exhibitorRoutes)

// 公開出展API
app.route('/', publicExhibitionRoutes)

export default app
