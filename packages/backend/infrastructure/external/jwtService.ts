import { sign, verify } from 'hono/jwt'
import { z } from 'zod'

const JwtPayloadSchema = z.object({
  exhibitorId: z.string(),
  iat: z.number().optional(),
  exp: z.number().optional(),
})

export interface JwtPayload {
  exhibitorId: string
  iat?: number
  exp?: number
}

/**
 * JWTトークンを生成
 * @param payload - トークンのペイロード
 * @param secret - JWT署名用の秘密鍵
 */
export async function generateToken(
  payload: { exhibitorId: string },
  secret: string
): Promise<string> {
  if (!secret) {
    throw new Error('JWT_SECRET is not configured')
  }

  const token = await sign(
    {
      ...payload,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 7日間有効
    },
    secret
  )
  return token
}

/**
 * JWTトークンを検証
 * @param token - 検証するトークン
 * @param secret - JWT署名用の秘密鍵
 */
export async function verifyToken(token: string, secret: string): Promise<JwtPayload> {
  if (!secret) {
    throw new Error('JWT_SECRET is not configured')
  }

  try {
    const payload = await verify(token, secret)
    const validatedPayload = JwtPayloadSchema.parse(payload)
    return validatedPayload
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error('トークンのペイロードが無効です')
    }
    throw new Error('トークンが無効です')
  }
}
