import { NotFoundError, ValidationError } from '../../../domain/errors'
import { updateExhibitionInformation } from '../../../domain/factories/exhibitionInformation'
import type { ExhibitionRepository } from '../../../domain/repositories/exhibition'
import type { ExhibitionInformationRepository } from '../../../domain/repositories/exhibitionInformation'
import { findExhibitionWithOwnershipCheck } from './findExhibitionWithOwnershipCheck'

/**
 * 出展画像更新ユースケース
 *
 * 既に画像が登録されている出展のみ更新を許可する。
 *
 * @param exhibitionId 出展ID
 * @param exhibitorId 出展者ID（認証済み）
 * @param image 画像バイナリ（Uint8Array）
 * @param exhibitionRepository Exhibitionリポジトリ
 * @param exhibitionInformationRepository ExhibitionInformationリポジトリ
 *
 * @throws ValidationError - ExhibitionInformation が存在しない場合
 * @throws NotFoundError - ExhibitionInformation または既存画像が見つからない場合
 * @throws ForbiddenError - Exhibition が認証済み出展者の所有でない場合
 */
export async function updateExhibitionImageUseCase(
  exhibitionId: string,
  exhibitorId: string,
  image: Uint8Array,
  exhibitionRepository: ExhibitionRepository,
  exhibitionInformationRepository: ExhibitionInformationRepository
): Promise<void> {
  // Exhibition を取得し、所有権チェック
  const exhibition = await findExhibitionWithOwnershipCheck(
    exhibitionId,
    exhibitorId,
    exhibitionRepository
  )

  // ExhibitionInformation が存在するかチェック
  if (!exhibition.exhibitionInformationId) {
    throw new ValidationError('出展情報が登録されていません')
  }

  // ExhibitionInformation を取得
  const existingInformation = await exhibitionInformationRepository.findById(
    exhibition.exhibitionInformationId
  )
  if (!existingInformation) {
    throw new NotFoundError('出展情報が見つかりません')
  }

  // 既存画像が登録されているかチェック
  if (!existingInformation.image) {
    throw new NotFoundError('画像が見つかりません')
  }

  // 画像を更新
  const updatedInformation = updateExhibitionInformation(existingInformation, {
    image,
  })

  // 保存
  await exhibitionInformationRepository.save(updatedInformation)
}
