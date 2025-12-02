import { serve } from '@hono/node-server'

import app from './index'

const port = 8787

console.error(`🚀 Backend server running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port,
})
