import { draft as draftExhibitionDomain } from '../../../../domain/factories/exhibition'
import type { ExhibitionRepository } from '../../../../domain/repositories/exhibition'
import type { ExhibitionArDesignRepository } from '../../../../domain/repositories/exhibitionArDesign'
import type { ExhibitionInformationRepository } from '../../../../domain/repositories/exhibitionInformation'
import type { ExhibitionDto } from '../../../dto/exhibition'
import { loadExhibitionWithOwnership, saveAndBuildExhibitionDto } from '../shared'

/**
 * 出展を下書き状態に戻すユースケース
 */
export async function draftExhibitionUseCase(
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

  const drafted = draftExhibitionDomain(exhibition)

  return saveAndBuildExhibitionDto(drafted, {
    exhibitionRepository,
    exhibitionInformationRepository,
    exhibitionArDesignRepository,
  })
}
