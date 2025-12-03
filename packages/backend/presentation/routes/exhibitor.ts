import { Hono } from 'hono'

import { getContainer } from '../handlers/index'
import type { Bindings } from '../handlers/index'
import { handleLogin, handleLogout, handleRegister } from '../handlers/exhibitor'
import { authMiddleware } from '../middlewares/authMiddleware'

export const exhibitorRoutes = new Hono<{ Bindings: Bindings }>()

// 出展者登録
exhibitorRoutes.post('/register', async (c) => {
  const container = getContainer(c)
  return handleRegister(c, container.exhibitorRepository, container.passwordService)
})

// 出展者ログイン
exhibitorRoutes.post('/login', async (c) => {
  const container = getContainer(c)
  return handleLogin(c, container.exhibitorRepository, container.passwordService)
})

// 出展者ログアウト
exhibitorRoutes.post('/logout', authMiddleware, async (c) => {
  return handleLogout(c)
})
