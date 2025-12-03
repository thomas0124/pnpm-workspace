import { Hono } from 'hono'

import { handleLogin, handleLogout, handleRegister } from '../handlers/exhibitor'
import type { Bindings } from '../handlers/index'
import { authMiddleware } from '../middlewares/authMiddleware'

export const exhibitorRoutes = new Hono<{ Bindings: Bindings }>()

// 出展者登録
exhibitorRoutes.post('/register', handleRegister)

// 出展者ログイン
exhibitorRoutes.post('/login', handleLogin)

// 出展者ログアウト
exhibitorRoutes.post('/logout', authMiddleware, handleLogout)
