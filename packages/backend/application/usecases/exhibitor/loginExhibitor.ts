import type { ExhibitorRepository } from '../../../domain/repositories/exhibitorRepository.js'
import type { AuthResponse, ExhibitorLoginRequest } from '../../dto/exhibitor.js'
import { verifyPassword } from '../../../infrastructure/external/passwordService.js'
import { generateToken } from '../../../infrastructure/external/jwtService.js'
import { UnauthorizedError } from '../../../domain/errors/index.js'

/**
 * 出展者ログインユースケース
 *
 * @param request - ログインリクエスト
 * @param repository - Exhibitorリポジトリ
 * @returns 認証レスポンス（トークン + 出展者情報）
 * @throws UnauthorizedError 認証に失敗した場合
 */
export async function loginExhibitorUseCase(
  request: ExhibitorLoginRequest,
  repository: ExhibitorRepository
): Promise<AuthResponse> {
  // 1. 名前で出展者を検索
  const exhibitor = await repository.findByName(request.name)

  if (!exhibitor) {
    throw new UnauthorizedError('認証に失敗しました')
  }

  // 2. パスワードを検証
  const isValid = await verifyPassword(request.password, exhibitor.passwordHash)

  if (!isValid) {
    throw new UnauthorizedError('認証に失敗しました')
  }

  // 3. JWTトークンを生成
  const token = await generateToken({ exhibitorId: exhibitor.id })

  // 4. AuthResponseを返す
  return {
    token,
    exhibitor: {
      id: exhibitor.id,
      name: exhibitor.name,
      createdAt: exhibitor.createdAt,
      updatedAt: exhibitor.updatedAt,
    },
  }
}