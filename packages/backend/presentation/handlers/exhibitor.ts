import type { Context } from 'hono'
import { registerExhibitorUseCase } from '../../application/usecases/exhibitor/createExhibitor.js'
import {
  AuthResponseSchema,
  ExhibitorLoginRequestSchema,
  ExhibitorRegisterRequestSchema,
} from '../../application/dto/exhibitor.js'
import type { ExhibitorRepository } from '../../domain/repositories/exhibitorRepository.js'

/**
 * 出展者登録ハンドラー
 */
export async function handleRegister(c: Context, exhibitorRepository: ExhibitorRepository) {
  const body = await c.req.json()
  const request = ExhibitorRegisterRequestSchema.parse(body)

  // TODO: パスワードハッシング機能を実装する必要があります
  // 例: const hashedPassword = await hashPassword(request.password)
  // 現在は平文で保存（セキュリティ上問題があるため、本番環境では使用不可）
  const hashedPassword = request.password // 仮実装

  const exhibitorDto = await registerExhibitorUseCase(
    request,
    exhibitorRepository,
    hashedPassword
  )

  // TODO: JWT生成機能を実装する必要があります
  // 例: const token = await generateToken({ exhibitorId: exhibitorDto.id })
  const token = 'temporary-token-replace-with-jwt' // 仮実装

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

  // TODO: ログインユースケースを実装する必要があります
  // 例: const result = await loginExhibitorUseCase(request, exhibitorRepository)
  
  // 仮実装: 名前でユーザーを検索してパスワードを確認
  const exhibitor = await exhibitorRepository.findByName(request.name)
  
  if (!exhibitor) {
    throw new Error('認証に失敗しました')
  }

  // TODO: パスワード検証を実装する必要があります
  // 例: const isValid = await verifyPassword(request.password, exhibitor.passwordHash)
  if (exhibitor.passwordHash !== request.password) { // 仮実装
    throw new Error('認証に失敗しました')
  }

  // TODO: JWT生成機能を実装する必要があります
  const token = 'temporary-token-replace-with-jwt' // 仮実装

  const response = AuthResponseSchema.parse({
    token,
    exhibitor: {
      id: exhibitor.id,
      name: exhibitor.name,
      createdAt: exhibitor.createdAt,
      updatedAt: exhibitor.updatedAt,
    },
  })

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