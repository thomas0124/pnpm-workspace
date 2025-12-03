import { ValidationError } from '../../../domain/errors'
import { draft as draftExhibitionDomain } from '../../../domain/factories/exhibition'
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

  // ドメインレベルの遷移チェック（公開中→下書きは禁止）
  if (exhibition.isPublished === 1) {
    throw new ValidationError(
      '公開中の出展は下書きに戻せません。先に非公開にしてください'
    )
  }

  const drafted = draftExhibitionDomain(exhibition)

  return saveAndBuildExhibitionDto(drafted, {
    exhibitionRepository,
    exhibitionInformationRepository,
    exhibitionArDesignRepository,
  })
}


