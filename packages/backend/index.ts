import { Hono } from 'hono'
import { cors } from 'hono/cors'

import type { Bindings } from './presentation/handlers/index'
import { errorHandler } from './presentation/middlewares/errorHandler'
import { exhibitionRoutes } from './presentation/routes/exhibition/exhibition'
import { exhibitorRoutes } from './presentation/routes/exhibitor'
import { publicExhibitionRoutes } from './presentation/routes/publicExhibition'

const app = new Hono<{ Bindings: Bindings }>()

// エラーハンドラーを適用
app.onError(errorHandler)

// CORSを適用
app.use(
  '*',
  cors({
    origin: [
      'https://ar-pamph-frontend.sekibun3109.workers.dev',
      'http://localhost:3000', // 開発環境用
      'http://localhost:8787', // 開発環境用
    ],
  })
)

// ヘルスチェック
app.get('/health', (c) => {
  return c.json({ status: 'ok' })
})

// RPC 対象の API ルートをまとめたルーター
// 将来的に HTML ページなどを追加する場合は、そちらは `app` に直接ぶら下げ、
// RPC 用の型はこの `routes` のみを対象とする想定
// OpenAPI定義（docs/api.yml）のパスと一致させるため、プレフィックスは付けない
export const routes = app
  // 出展者API (/exhibitors/...)
  .route('/exhibitors', exhibitorRoutes)
  // 出展管理API (/exhibitions/...)
  .route('/exhibitions', exhibitionRoutes)
  // 公開出展API (/public/...)
  .route('/', publicExhibitionRoutes)

// Hono RPC 用の型
// クライアント側からは `hc<AppType>` のように利用できる
export type AppType = typeof routes

export default app
