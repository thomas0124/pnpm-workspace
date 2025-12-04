import type { ExhibitionRepository } from '../../../../domain/repositories/exhibition'
import type { ExhibitionInformationRepository } from '../../../../domain/repositories/exhibitionInformation'
import { findExhibitionWithOwnershipCheck } from './findExhibitionWithOwnershipCheck'

/**
 * 出展削除ユースケース
 *
 * @param exhibitionId 出展ID
 * @param exhibitorId 出展者ID（認証済み）
 * @param exhibitionRepository Exhibitionリポジトリ
 * @param exhibitionInformationRepository ExhibitionInformationリポジトリ
 * @throws NotFoundError - Exhibitionが見つからない場合
 * @throws ForbiddenError - Exhibitionが認証済み出展者の所有でない場合
 */
export async function deleteExhibitionUseCase(
  exhibitionId: string,
  exhibitorId: string,
  exhibitionRepository: ExhibitionRepository,
  exhibitionInformationRepository: ExhibitionInformationRepository
): Promise<void> {
  // Exhibitionを取得し、所有権チェック
  const exhibition = await findExhibitionWithOwnershipCheck(
    exhibitionId,
    exhibitorId,
    exhibitionRepository
  )

  // ExhibitionInformationのIDを保存（削除前に）
  const exhibitionInformationId = exhibition.exhibitionInformationId

  // Exhibitionを先に削除（外部キー制約を回避するため）
  await exhibitionRepository.delete(exhibitionId)

  // ExhibitionInformationを削除（存在する場合）
  if (exhibitionInformationId) {
    await exhibitionInformationRepository.delete(exhibitionInformationId)
  }
}
