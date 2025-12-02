import { createExhibitor } from '../../../domain/factories/exhibitor'
import type { ExhibitorRepository } from '../../../domain/repositories/exhibitorRepository'
import { checkExhibitorNameAvailability } from '../../../domain/services/exhibitor'
import { hashPassword } from '../../../infrastructure/external/passwordService'
import type { ExhibitorDto, ExhibitorRegisterRequest } from '../../dto/exhibitor'
import { ExhibitorDtoSchema } from '../../dto/exhibitor'

/**
 * 出展者登録ユースケース
 *
 * @param request - 出展者登録リクエスト
 * @param repository - Exhibitorリポジトリ
 * @returns 作成された出展者情報
 * @throws ConflictError 出展者名が既に存在する場合
 */
export async function registerExhibitorUseCase(
  request: ExhibitorRegisterRequest,
  repository: ExhibitorRepository
): Promise<ExhibitorDto> {
  const hashedPassword = await hashPassword(request.password)
  // 1. 出展者を作成
  const exhibitor = createExhibitor(request.name, hashedPassword)

  // 2. 重複チェック（ドメインサービスに委譲）
  await checkExhibitorNameAvailability(exhibitor.name, repository)

  // 3. 保存
  await repository.save(exhibitor)

  // 4. DTOとして返す
  return ExhibitorDtoSchema.parse({
    id: exhibitor.id,
    name: exhibitor.name,
    createdAt: exhibitor.createdAt,
    updatedAt: exhibitor.updatedAt,
  })
}
