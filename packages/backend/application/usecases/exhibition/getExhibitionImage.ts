import { NotFoundError } from '../../../domain/errors'
import type { ExhibitionRepository } from '../../../domain/repositories/exhibition'
import type { ExhibitionInformationRepository } from '../../../domain/repositories/exhibitionInformation'
import { findExhibitionWithOwnershipCheck } from './findExhibitionWithOwnershipCheck'

export type ExhibitionImageResult = {
  image: Uint8Array
}

/**
 * 出展画像取得ユースケース
 *
 * @param exhibitionId 出展ID
 * @param exhibitorId 出展者ID（認証済み）
 * @param exhibitionRepository Exhibitionリポジトリ
 * @param exhibitionInformationRepository ExhibitionInformationリポジトリ
 *
 * @returns 画像バイナリ
 * @throws NotFoundError - ExhibitionInformation または画像が見つからない場合
 * @throws ForbiddenError - Exhibitionが認証済み出展者の所有でない場合
 */
export async function getExhibitionImageUseCase(
  exhibitionId: string,
  exhibitorId: string,
  exhibitionRepository: ExhibitionRepository,
  exhibitionInformationRepository: ExhibitionInformationRepository
): Promise<ExhibitionImageResult> {
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
  if (!information || !information.image) {
    throw new NotFoundError('画像が見つかりません')
  }

  return {
    image: information.image,
  }
}
