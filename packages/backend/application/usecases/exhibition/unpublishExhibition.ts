import { ValidationError } from '../../../domain/errors'
import { unpublish as unpublishExhibitionDomain } from '../../../domain/factories/exhibition'
import type { Exhibition } from '../../../domain/models/exhibition'
import type { ExhibitionRepository } from '../../../domain/repositories/exhibition'
import type { ExhibitionArDesignRepository } from '../../../domain/repositories/exhibitionArDesign'
import type { ExhibitionInformationRepository } from '../../../domain/repositories/exhibitionInformation'
import type { ExhibitionDto } from '../../dto/exhibition'
import { toExhibitionDto, toExhibitionInformationDto } from '../../dto/exhibition'
import { findExhibitionWithOwnershipCheck } from './findExhibitionWithOwnershipCheck'

type CommonDeps = {
  exhibitionRepository: ExhibitionRepository
  exhibitionInformationRepository: ExhibitionInformationRepository
  exhibitionArDesignRepository: ExhibitionArDesignRepository
}

async function loadExhibitionWithOwnership(
  exhibitionId: string,
  exhibitorId: string,
  exhibitionRepository: ExhibitionRepository
): Promise<Exhibition> {
  return findExhibitionWithOwnershipCheck(exhibitionId, exhibitorId, exhibitionRepository)
}

async function saveAndBuildExhibitionDto(
  exhibition: Exhibition,
  deps: CommonDeps
): Promise<ExhibitionDto> {
  const { exhibitionRepository, exhibitionInformationRepository, exhibitionArDesignRepository } =
    deps

  await exhibitionRepository.save(exhibition)

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

  if (exhibition.isPublished === 0) {
    throw new ValidationError('公開中ではない出展は非公開にできません')
  }

  const unpublished = unpublishExhibitionDomain(exhibition)

  return saveAndBuildExhibitionDto(unpublished, {
    exhibitionRepository,
    exhibitionInformationRepository,
    exhibitionArDesignRepository,
  })
}
