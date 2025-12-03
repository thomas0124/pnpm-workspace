import { unpublish as unpublishExhibitionDomain } from '../../../domain/factories/exhibition'
import type { ExhibitionRepository } from '../../../domain/repositories/exhibition'
import type { ExhibitionArDesignRepository } from '../../../domain/repositories/exhibitionArDesign'
import type { ExhibitionInformationRepository } from '../../../domain/repositories/exhibitionInformation'
import type { ExhibitionDto } from '../../dto/exhibition'
import { loadExhibitionWithOwnership, saveAndBuildExhibitionDto } from './shared'

/**
 * 出展非公開ユースケース
 */
export async function unpublishExhibitionUseCase(
  exhibitionId: string,
  exhibitorId: string,
  exhibitionRepository: ExhibitionRepository,
  exhibitionInformationRepository: ExhibitionInformationRepository,
  exhibitionArDesignRepository: ExhibitionArDesignRepository
): Promise<ExhibitionDto> {
  const exhibition = await loadExhibitionWithOwnership(
    exhibitionId,
    exhibitorId,
    exhibitionRepository
  )

  const unpublished = unpublishExhibitionDomain(exhibition)

  return saveAndBuildExhibitionDto(unpublished, {
    exhibitionRepository,
    exhibitionInformationRepository,
    exhibitionArDesignRepository,
  })
}
