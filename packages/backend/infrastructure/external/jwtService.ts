import { sign, verify } from 'hono/jwt'

// TODO: 本番環境では環境変数から取得してください (wrangler secret put JWT_SECRET)
const JWT_SECRET = 'your-secret-key-change-this-in-production'

export interface JwtPayload {
  exhibitorId: string
  iat?: number
  exp?: number
}

/**
 * JWTトークンを生成
 */
export async function generateToken(payload: { exhibitorId: string }): Promise<string> {
  const token = await sign(
    {
      ...payload,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 7日間有効
    },
    JWT_SECRET
  )
  return token
}

/**
 * JWTトークンを検証
 */
export async function verifyToken(token: string): Promise<JwtPayload> {
  try {
    const payload = await verify(token, JWT_SECRET)
    return payload as unknown as JwtPayload
  } catch (_error) {
    throw new Error('トークンが無効です')
  }
}