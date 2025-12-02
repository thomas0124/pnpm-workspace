import { verifyPassword } from '../../infrastructure/external/passwordService'
import { ConflictError } from '../errors'
import type { Exhibitor } from '../models/exhibitor'
import { ExhibitorIdSchema, ExhibitorNameSchema } from '../models/exhibitor'
import type { ExhibitorRepository } from '../repositories/exhibitorRepository'

/**
 * 出展者名の重複チェック
 *
 * @param name チェックする出展者名
 * @param repository Exhibitorリポジトリ
 * @returns 重複している場合はtrue
 * @throws zodバリデーションエラー時
 */
export async function isDuplicateExhibitorName(
  name: string,
  repository: ExhibitorRepository
): Promise<boolean> {
  // zodでバリデーション
  ExhibitorNameSchema.parse(name)

  return await repository.existsByName(name)
}

/**
 * 出展者名の可用性チェック（登録可能かどうか）
 *
 * @param name チェックする出展者名
 * @param repository Exhibitorリポジトリ
 * @throws 名前が既に使用されている場合、またはバリデーションエラー時
 */
export async function checkExhibitorNameAvailability(
  name: string,
  repository: ExhibitorRepository
): Promise<void> {
  const isDuplicate = await isDuplicateExhibitorName(name, repository)

  if (isDuplicate) {
    // アプリケーション層からは ConflictError を想定して扱うため、
    // ここでドメインの競合エラーを投げる
    throw new ConflictError('この名前は既に使用されています')
  }
}

/**
 * 出展者の存在確認
 *
 * @param id Exhibitor ID
 * @param repository Exhibitorリポジトリ
 * @returns 存在する場合はtrue
 * @throws zodバリデーションエラー時
 *
 */
export async function exhibitorExists(
  id: string,
  repository: ExhibitorRepository
): Promise<boolean> {
  // UUIDバリデーション
  ExhibitorIdSchema.parse(id)

  const exhibitor = await repository.findById(id)
  return exhibitor !== null
}

/**
 * 出展者の認証チェック（パスワード検証用）
 *
 * @param exhibitor 出展者エンティティ
 * @param password 平文パスワード
 * @returns パスワードが一致する場合はtrue
 */
export async function verifyExhibitorPassword(
  exhibitor: Exhibitor,
  password: string
): Promise<boolean> {
  // インフラ層のハッシュ検証に委譲する
  return verifyPassword(password, exhibitor.passwordHash)
}
