import { publish as publishExhibitionDomain } from '../../../../domain/factories/exhibition'
import type { ExhibitionRepository } from '../../../../domain/repositories/exhibition'
import type { ExhibitionInformationRepository } from '../../../../domain/repositories/exhibitionInformation'
import type { ExhibitionDto } from '../../../dto/exhibition'
import { loadExhibitionWithOwnership, saveAndBuildExhibitionDto } from '../shared'

/**
 * 出展公開ユースケース
 */
export async function publishExhibitionUseCase(
  exhibitionId: string,
  exhibitorId: string,
  exhibitionRepository: ExhibitionRepository,
  exhibitionInformationRepository: ExhibitionInformationRepository
): Promise<ExhibitionDto> {
  const exhibition = await loadExhibitionWithOwnership(
    exhibitionId,
    exhibitorId,
    exhibitionRepository
  )

  const published = publishExhibitionDomain(exhibition)

  return saveAndBuildExhibitionDto(published, {
    exhibitionRepository,
    exhibitionInformationRepository,
  })
}
