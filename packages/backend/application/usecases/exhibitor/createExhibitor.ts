import { createExhibitor } from '../../../domain/factories/exhibitor/exhibitorFactory.js'
import { isDuplicateExhibitorName } from '../../../domain/services/exhibitorDomainService.js'
import type { ExhibitorRepository } from '../../../domain/repositories/exhibitorRepository.js'
import type { ExhibitorRegisterRequest, ExhibitorDto } from '../../dto/exhibitorDto.js'

/**
 * 出展者登録ユースケース
 *
 * @param request - 出展者登録リクエスト
 * @param repository - Exhibitorリポジトリ
 * @param passwordHash - ハッシュ化されたパスワード（外部サービスで事前にハッシュ化）
 * @returns 作成された出展者情報
 * @throws 出展者名が既に存在する場合
 */
export async function registerExhibitorUseCase(
  request: ExhibitorRegisterRequest,
  repository: ExhibitorRepository,
  passwordHash: string
): Promise<ExhibitorDto> {
  // 1. 出展者を作成
  const exhibitor = createExhibitor(request.name, passwordHash)

  // 2. 重複チェック
  const isDuplicate = await isDuplicateExhibitorName(exhibitor.name, repository)
  if (isDuplicate) {
    throw new Error('Exhibitor with this name already exists')
  }

  // 3. 保存
  await repository.save(exhibitor)

  // 4. DTOとして返す
  return {
    id: exhibitor.id,
    name: exhibitor.name,
    createdAt: exhibitor.createdAt,
    updatedAt: exhibitor.updatedAt,
  }
}