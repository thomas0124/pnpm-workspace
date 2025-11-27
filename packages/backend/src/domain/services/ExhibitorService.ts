import { ExhibitorRepository } from '../repositories/ExhibitorRepository'
import { Exhibitor } from '../models/Exhibitor/Exhibitor'

// ユーザー名の重複チェックを行うサービス関数
export async function isDuplicateUsername(
  user: Exhibitor,
  repository: ExhibitorRepository
): Promise<boolean> {
  const existingUser = await repository.findByUsername(user.name)
  return existingUser !== null && existingUser.id !== user.id
}