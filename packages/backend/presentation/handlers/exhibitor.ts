import type { Context } from 'hono'

import {
  AuthResponseSchema,
  ExhibitorLoginRequestSchema,
  ExhibitorRegisterRequestSchema,
} from '../../application/dto/exhibitor'
import { registerExhibitorUseCase } from '../../application/usecases/exhibitor/createExhibitor'
import { loginExhibitorUseCase } from '../../application/usecases/exhibitor/loginExhibitor'
import type { ExhibitorRepository } from '../../domain/repositories/exhibitorRepository'
import { generateToken } from '../../infrastructure/external/jwtService'

/**
 * 出展者登録ハンドラー
 */
export async function handleRegister(c: Context, exhibitorRepository: ExhibitorRepository) {
  const body = await c.req.json()
  const request = ExhibitorRegisterRequestSchema.parse(body)

  // ユースケース内でパスワードハッシュ化を行う
  const exhibitorDto = await registerExhibitorUseCase(request, exhibitorRepository)

  // JWTトークンを生成
  const token = await generateToken({ exhibitorId: exhibitorDto.id })

  const response = AuthResponseSchema.parse({
    token,
    exhibitor: exhibitorDto,
  })

  return c.json(response, 201)
}

/**
 * 出展者ログインハンドラー
 */
export async function handleLogin(c: Context, exhibitorRepository: ExhibitorRepository) {
  const body = await c.req.json()
  const request = ExhibitorLoginRequestSchema.parse(body)

  // ログインユースケースを実行
  const response = await loginExhibitorUseCase(request, exhibitorRepository)

  return c.json(response, 200)
}

/**
 * 出展者ログアウトハンドラー
 */
export async function handleLogout(c: Context) {
  // ステートレスJWTの場合、サーバー側での処理は不要
  // クライアント側でトークンを削除することでログアウト
  return c.body(null, 204)
}