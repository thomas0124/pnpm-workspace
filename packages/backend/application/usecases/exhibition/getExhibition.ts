import type { ExhibitionRepository } from '../../../domain/repositories/exhibition'
import type { ExhibitionArDesignRepository } from '../../../domain/repositories/exhibitionArDesign'
import type { ExhibitionInformationRepository } from '../../../domain/repositories/exhibitionInformation'
import type { ExhibitionDto } from '../../dto/exhibition'
import { toExhibitionDto, toExhibitionInformationDto } from '../../dto/exhibition'
import { findExhibitionWithOwnershipCheck } from './findExhibitionWithOwnershipCheck'

/**
 * 出展情報取得ユースケース
 *
 * @param exhibitionId 出展ID
 * @param exhibitorId 出展者ID（認証済み）
 * @param exhibitionRepository Exhibitionリポジトリ
 * @param exhibitionInformationRepository ExhibitionInformationリポジトリ
 * @param exhibitionArDesignRepository ExhibitionArDesignリポジトリ
 * @returns 取得されたExhibitionのDTO
 * @throws NotFoundError - Exhibitionが見つからない場合
 * @throws ForbiddenError - Exhibitionが認証済み出展者の所有でない場合
 */
export async function getExhibitionUseCase(
  exhibitionId: string,
  exhibitorId: string,
  exhibitionRepository: ExhibitionRepository,
  exhibitionInformationRepository: ExhibitionInformationRepository,
  exhibitionArDesignRepository: ExhibitionArDesignRepository
): Promise<ExhibitionDto> {
  // Exhibitionを取得し、所有権チェック
  const exhibition = await findExhibitionWithOwnershipCheck(
    exhibitionId,
    exhibitorId,
    exhibitionRepository
  )

  // ExhibitionInformationを取得（存在する場合）
  let exhibitionInformationDto = null
  if (exhibition.exhibitionInformationId) {
    const exhibitionInformation = await exhibitionInformationRepository.findById(
      exhibition.exhibitionInformationId
    )
    if (exhibitionInformation) {
      exhibitionInformationDto = await toExhibitionInformationDto(
        exhibitionInformation,
        exhibitionArDesignRepository
      )
    }
  }

  return toExhibitionDto(exhibition, exhibitionInformationDto)
}
