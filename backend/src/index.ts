import { Hono, Context } from 'hono'

export const message = 'Hello from backend (Hono)'

const app = new Hono()

app.get('/message', (c: Context) => {
	return c.json({ message })
})

export default app