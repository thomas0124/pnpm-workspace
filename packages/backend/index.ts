import { Hono } from 'hono'

import type { Bindings } from './presentation/handlers/index'
import { errorHandler } from './presentation/middlewares/errorHandler'
import { arDesignRoutes } from './presentation/routes/exhibitionArDesign'
import { exhibitionRoutes } from './presentation/routes/exhibition'
import { exhibitorRoutes } from './presentation/routes/exhibitor'
import { publicExhibitionRoutes } from './presentation/routes/publicExhibition'

const app = new Hono<{ Bindings: Bindings }>()

// エラーハンドラーを適用
app.onError(errorHandler)

// ヘルスチェック
app.get('/health', (c) => {
  return c.json({ status: 'ok' })
})

// 出展者API
app.route('/api/exhibitors', exhibitorRoutes)

// ARデザインAPI（認証必須）
app.route('/api/ar-designs', arDesignRoutes)
// 出展管理API
app.route('/api/exhibitions', exhibitionRoutes)

// 公開出展API
app.route('/', publicExhibitionRoutes)

export default app
