import type { Context, Next } from 'hono'

import { UnauthorizedError } from '../../domain/errors/index.js'
import { verifyToken } from '../../infrastructure/external/jwtService.js'

/**
 * JWT認証ミドルウェア
 *
 * Authorizationヘッダーからトークンを取得し、検証します。
 * 検証成功時、トークンのペイロードをコンテキストに追加します。
 */
export async function authMiddleware(c: Context, next: Next) {
  const authHeader = c.req.header('Authorization')

  if (!authHeader) {
    throw new UnauthorizedError('認証トークンが必要です')
  }

  // "Bearer {token}" 形式を想定
  const token = authHeader.replace('Bearer ', '')

  if (!token) {
    throw new UnauthorizedError('認証トークンが不正です')
  }

  try {
    // トークンを検証
    const payload = await verifyToken(token)

    // コンテキストに認証情報を追加
    c.set('exhibitorId', payload.exhibitorId)

    await next()
  } catch (_error) {
    throw new UnauthorizedError('認証トークンが無効または期限切れです')
  }
}

/**
 * コンテキストから出展者IDを取得するヘルパー関数
 */
export function getExhibitorId(c: Context): string {
  const exhibitorId = c.get('exhibitorId')

  if (!exhibitorId) {
    throw new UnauthorizedError('認証情報が見つかりません')
  }

  return exhibitorId as string
}
