import { Hono } from 'hono'
import { createContainer } from '../../infrastructure/di/container.js'
import { handleLogin, handleLogout, handleRegister } from '../handlers/exhibitor.js'

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
exhibitorRoutes.post('/logout', async (c) => {
  // TODO: JWT検証ミドルウェアを追加する必要があります
  return handleLogout(c)
})