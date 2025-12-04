import { Hono } from 'hono'
import { cors } from 'hono/cors'

import type { Bindings } from './presentation/handlers/index'
import { errorHandler } from './presentation/middlewares/errorHandler'
import { exhibitionRoutes } from './presentation/routes/exhibition/exhibition'
import { arDesignRoutes } from './presentation/routes/exhibitionArDesign'
import { exhibitorRoutes } from './presentation/routes/exhibitor'
import { publicExhibitionRoutes } from './presentation/routes/publicExhibition'

const app = new Hono<{ Bindings: Bindings }>()

// エラーハンドラーを適用
app.onError(errorHandler)

// CORSを適用
app.use('*', cors())

// ヘルスチェック
app.get('/health', (c) => {
  return c.json({ status: 'ok' })
})

// 出展者API
app.route('/api/exhibitors', exhibitorRoutes)

// ARデザインAPI
app.route('/api/ar-designs', arDesignRoutes)

// 出展管理API
app.route('/api/exhibitions', exhibitionRoutes)

// 公開出展API
app.route('/', publicExhibitionRoutes)

export default app
