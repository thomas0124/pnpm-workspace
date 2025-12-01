import { Hono } from 'hono'

import { publicExhibitionRoutes } from './presentation/routes/publicExhibition'

type Bindings = {
  DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()

// ヘルスチェック
app.get('/health', (c) => {
  return c.json({ status: 'ok' })
})

// 公開出展API
app.route('/', publicExhibitionRoutes)

export default app
