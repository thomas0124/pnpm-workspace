import type { ExhibitionRepository } from '../../../../domain/repositories/exhibition'
import type { ExhibitionInformationRepository } from '../../../../domain/repositories/exhibitionInformation'
import type { ExhibitionDto } from '../../../dto/exhibition'
import { toExhibitionDto, toExhibitionInformationDto } from '../../../dto/exhibition'

/**
 * 認証済み出展者の出展情報取得ユースケース
 *
 * @param exhibitorId 出展者ID（認証済み）
 * @param exhibitionRepository Exhibitionリポジトリ
 * @param exhibitionInformationRepository ExhibitionInformationリポジトリ
 * @returns 取得されたExhibitionのDTO、存在しない場合はnull
 */
export async function getMyExhibitionUseCase(
  exhibitorId: string,
  exhibitionRepository: ExhibitionRepository,
  exhibitionInformationRepository: ExhibitionInformationRepository
): Promise<ExhibitionDto | null> {
  // 出展者の出展情報を取得
  const exhibitions = await exhibitionRepository.findByExhibitorId(exhibitorId)

  // 出展情報が存在しない場合はnullを返す
  if (exhibitions.length === 0) {
    return null
  }

  // 1人の出展者は1つの出展情報しか登録できないため、最初の要素を取得
  const exhibition = exhibitions[0]

  // ExhibitionInformationを取得（存在する場合）
  let exhibitionInformationDto = null
  if (exhibition.exhibitionInformationId) {
    const exhibitionInformation = await exhibitionInformationRepository.findById(
      exhibition.exhibitionInformationId
    )
    if (exhibitionInformation) {
      exhibitionInformationDto = toExhibitionInformationDto(exhibitionInformation)
    }
  }

  return toExhibitionDto(exhibition, exhibitionInformationDto)
}
