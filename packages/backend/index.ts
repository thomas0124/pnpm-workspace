import { Hono } from 'hono'

import { errorHandler } from './presentation/middlewares/errorHandler'
import { exhibitorRoutes } from './presentation/routes/exhibitor'
import { exhibitionRoutes } from './presentation/routes/exhibition'
import { publicExhibitionRoutes } from './presentation/routes/publicExhibition'
import type { Bindings } from './presentation/handlers/index'

const app = new Hono<{ Bindings: Bindings }>()

// エラーハンドラーを適用
app.onError(errorHandler)

// ヘルスチェック
app.get('/health', (c) => {
  return c.json({ status: 'ok' })
})

// 出展者API
app.route('/api/exhibitors', exhibitorRoutes)

// 出展管理API
app.route('/api/exhibitions', exhibitionRoutes)

// 公開出展API
app.route('/', publicExhibitionRoutes)

export default app
