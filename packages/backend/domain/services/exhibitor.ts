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
    throw new Error(`The name "${name}" is already taken`)
  }
}

/**
 * 出展者の存在確認
 *
 * @param id Exhibitor ID
 * @param repository Exhibitorリポジトリ
 * @returns 存在する場合はtrue
 * @throws zodバリデーションエラー時
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
 * @param passwordHash 検証するパスワードハッシュ
 * @returns パスワードが一致する場合はtrue
 */
export function verifyExhibitorPassword(exhibitor: Exhibitor, passwordHash: string): boolean {
  return exhibitor.passwordHash === passwordHash
}
