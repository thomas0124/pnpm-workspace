import { zValidator } from '@hono/zod-validator'

import {
  AuthResponseSchema,
  ExhibitorLoginRequestSchema,
  ExhibitorRegisterRequestSchema,
} from '../../application/dto/exhibitor.js'
import { registerExhibitorUseCase } from '../../application/usecases/exhibitor/createExhibitor.js'
import { loginExhibitorUseCase } from '../../application/usecases/exhibitor/loginExhibitor.js'
import { UnauthorizedError } from '../../domain/errors/index.js'
import { generateToken } from '../../infrastructure/external/jwtService.js'
import { getContainer, handlerFactory } from './index'

/**
 * 出展者登録ハンドラー
 */
export const handleRegister = handlerFactory.createHandlers(
  zValidator('json', ExhibitorRegisterRequestSchema),
  async (c) => {
    const container = getContainer(c)
    const request = c.req.valid('json')

    // ユースケース内でパスワードハッシュ化を行う
    const exhibitorDto = await registerExhibitorUseCase(
      request,
      container.exhibitorRepository,
      container.passwordService
    )

    // 環境変数からJWT_SECRETを取得
    const jwtSecret = c.env.JWT_SECRET
    if (!jwtSecret) {
      throw new UnauthorizedError('JWT_SECRETが設定されていません')
    }

    // JWTトークンを生成
    const token = await generateToken({ exhibitorId: exhibitorDto.id }, jwtSecret)

    const response = AuthResponseSchema.parse({
      token,
      exhibitor: exhibitorDto,
    })

    return c.json(response, 201)
  }
)

/**
 * 出展者ログインハンドラー
 */
export const handleLogin = handlerFactory.createHandlers(
  zValidator('json', ExhibitorLoginRequestSchema),
  async (c) => {
    const container = getContainer(c)
    const request = c.req.valid('json')

    // 環境変数からJWT_SECRETを取得
    const jwtSecret = c.env.JWT_SECRET
    if (!jwtSecret) {
      throw new UnauthorizedError('JWT_SECRETが設定されていません')
    }

    // ログインユースケースを実行
    const response = await loginExhibitorUseCase(
      request,
      container.exhibitorRepository,
      jwtSecret,
      container.passwordService
    )

    return c.json(response, 200)
  }
)

/**
 * 出展者ログアウトハンドラー
 */
export const handleLogout = handlerFactory.createHandlers(async (c) => {
  // ステートレスJWTの場合、サーバー側での処理は不要
  // クライアント側でトークンを削除することでログアウト
  return c.body(null, 204)
})
