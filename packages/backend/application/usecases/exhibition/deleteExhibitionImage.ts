import { NotFoundError } from '../../../domain/errors'
import { updateExhibitionInformation } from '../../../domain/factories/exhibitionInformation'
import type { ExhibitionRepository } from '../../../domain/repositories/exhibition'
import type { ExhibitionInformationRepository } from '../../../domain/repositories/exhibitionInformation'
import { findExhibitionWithOwnershipCheck } from './findExhibitionWithOwnershipCheck'

/**
 * 出展画像削除ユースケース
 *
 * @param exhibitionId 出展ID
 * @param exhibitorId 出展者ID（認証済み）
 * @param exhibitionRepository Exhibitionリポジトリ
 * @param exhibitionInformationRepository ExhibitionInformationリポジトリ
 *
 * @throws NotFoundError - ExhibitionInformationが見つからない場合
 * @throws ForbiddenError - Exhibitionが認証済み出展者の所有でない場合
 */
export async function deleteExhibitionImageUseCase(
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

  if (!exhibition.exhibitionInformationId) {
    throw new NotFoundError('出展情報が見つかりません')
  }

  const information = await exhibitionInformationRepository.findById(
    exhibition.exhibitionInformationId
  )
  if (!information) {
    throw new NotFoundError('出展情報が見つかりません')
  }
  if (!information.image) {
    throw new NotFoundError('画像が見つかりません')
  }

  const updatedInformation = updateExhibitionInformation(information, {
    image: null,
  })

  await exhibitionInformationRepository.save(updatedInformation)
}
