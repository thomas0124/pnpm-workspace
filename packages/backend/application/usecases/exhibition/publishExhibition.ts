import { ValidationError } from '../../../domain/errors'
import { publish as publishExhibitionDomain } from '../../../domain/factories/exhibition'
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
 * 出展公開ユースケース
 */
export async function publishExhibitionUseCase(
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

  if (exhibition.exhibitionInformationId === null) {
    throw new ValidationError('必須情報が不足しています(exhibition_information_idがNULL)')
  }

  const published = publishExhibitionDomain(exhibition)

  return saveAndBuildExhibitionDto(published, {
    exhibitionRepository,
    exhibitionInformationRepository,
    exhibitionArDesignRepository,
  })
}
