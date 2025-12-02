import type { Context } from 'hono'
import { registerExhibitorUseCase } from '../../application/usecases/exhibitor/createExhibitor.js'
import { loginExhibitorUseCase } from '../../application/usecases/exhibitor/loginExhibitor.js'
import {
  AuthResponseSchema,
  ExhibitorLoginRequestSchema,
  ExhibitorRegisterRequestSchema,
} from '../../application/dto/exhibitor.js'
import type { ExhibitorRepository } from '../../domain/repositories/exhibitorRepository.js'
import { generateToken } from '../../infrastructure/external/jwtService.js'

/**
 * 出展者登録ハンドラー
 */
export async function handleRegister(c: Context, exhibitorRepository: ExhibitorRepository) {
  const body = await c.req.json()
  const request = ExhibitorRegisterRequestSchema.parse(body)

  // ユースケース内でパスワードハッシュ化を行う
  const exhibitorDto = await registerExhibitorUseCase(request, exhibitorRepository)

  // 環境変数からJWT_SECRETを取得
  const jwtSecret = c.env.JWT_SECRET as string
  
  // JWTトークンを生成
  const token = await generateToken({ exhibitorId: exhibitorDto.id }, jwtSecret)

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

  // 環境変数からJWT_SECRETを取得
  const jwtSecret = c.env.JWT_SECRET as string

  // ログインユースケースを実行
  const response = await loginExhibitorUseCase(request, exhibitorRepository, jwtSecret)

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