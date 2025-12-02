import type { D1Database } from '@cloudflare/workers-types'
import type { Context } from 'hono'
import { Hono } from 'hono'

import { publicExhibitionRoutes } from './presentation/routes/publicExhibition'

type Bindings = {
  DB: D1Database
}

export const message = 'Hello from backend (Hono)'

const app = new Hono<{ Bindings: Bindings }>()

// ヘルスチェック
app.get('/health', (c) => {
  return c.json({ status: 'ok' })
})

// 公開出展API
app.route('/', publicExhibitionRoutes)

app.get('/message', (c: Context) => {
  return c.json({ message })
})

export default app
