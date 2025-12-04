import { Hono } from 'hono'

import { handleLogin, handleLogout, handleRegister } from '../handlers/exhibitor'
import type { Bindings } from '../handlers/index'
import { authMiddleware } from '../middlewares/authMiddleware'

// GitHub issue #3148 の解決策: メソッドチェーン形式で定義することで型推論が正しく動作する
export const exhibitorRoutes = new Hono<{ Bindings: Bindings }>()
  // 出展者登録
  .post('/register', ...handleRegister)
  // 出展者ログイン
  .post('/login', ...handleLogin)
  // 出展者ログアウト
  .post('/logout', authMiddleware, ...handleLogout)
