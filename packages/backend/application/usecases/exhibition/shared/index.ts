import type { Exhibition } from '../../../../domain/models/exhibition'
import type { ExhibitionRepository } from '../../../../domain/repositories/exhibition'
import type { ExhibitionInformationRepository } from '../../../../domain/repositories/exhibitionInformation'
import type { ExhibitionDto } from '../../../dto/exhibition'
import { toExhibitionDto, toExhibitionInformationDto } from '../../../dto/exhibition'
import { findExhibitionWithOwnershipCheck } from '../core/findExhibitionWithOwnershipCheck'

export type CommonDeps = {
  exhibitionRepository: ExhibitionRepository
  exhibitionInformationRepository: ExhibitionInformationRepository
}

export async function loadExhibitionWithOwnership(
  exhibitionId: string,
  exhibitorId: string,
  exhibitionRepository: ExhibitionRepository
): Promise<Exhibition> {
  return findExhibitionWithOwnershipCheck(exhibitionId, exhibitorId, exhibitionRepository)
}

export async function saveAndBuildExhibitionDto(
  exhibition: Exhibition,
  deps: CommonDeps
): Promise<ExhibitionDto> {
  const { exhibitionRepository, exhibitionInformationRepository } = deps

  await exhibitionRepository.save(exhibition)

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
