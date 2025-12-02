import { Hono } from 'hono'

import { createContainer } from '../../infrastructure/di/container'
import { handleLogin, handleLogout, handleRegister } from '../handlers/exhibitor'
import { authMiddleware } from '../middlewares/authMiddleware'
type Bindings = {
  DB: D1Database
}

export const exhibitorRoutes = new Hono<{ Bindings: Bindings }>()

// 出展者登録
exhibitorRoutes.post('/register', async (c) => {
  const container = createContainer(c.env.DB)
  return handleRegister(c, container.exhibitorRepository)
})

// 出展者ログイン
exhibitorRoutes.post('/login', async (c) => {
  const container = createContainer(c.env.DB)
  return handleLogin(c, container.exhibitorRepository)
})

// 出展者ログアウト
exhibitorRoutes.post('/logout', authMiddleware, async (c) => {
  return handleLogout(c)
})
