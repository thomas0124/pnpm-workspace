import type { ExhibitionRepository } from '../../domain/repositories/exhibition'
import type { ExhibitionArDesignRepository } from '../../domain/repositories/exhibitionArDesign'
import type { ExhibitionInformationRepository } from '../../domain/repositories/exhibitionInformation'
import type { ExhibitorRepository } from '../../domain/repositories/exhibitorRepository'
import * as drizzleExhibitionArDesignRepo from '../persistence/drizzle/exhibitionArDesignRepository'
import * as drizzleExhibitionInformationRepo from '../persistence/drizzle/exhibitionInformationRepository'
import * as drizzleExhibitionRepo from '../persistence/drizzle/exhibitionRepository'
import * as drizzleExhibitorRepo from '../persistence/drizzle/ExhibitorRepository'

export function createContainer(d1: D1Database) {
  const exhibitorRepository: ExhibitorRepository =
    drizzleExhibitorRepo.createExhibitorRepository(d1)
  const exhibitionRepository: ExhibitionRepository =
    drizzleExhibitionRepo.createExhibitionRepository(d1)
  const exhibitionInformationRepository: ExhibitionInformationRepository =
    drizzleExhibitionInformationRepo.createExhibitionInformationRepository(d1)
  const exhibitionArDesignRepository: ExhibitionArDesignRepository =
    drizzleExhibitionArDesignRepo.createExhibitionArDesignRepository(d1)

  return {
    exhibitorRepository,
    exhibitionRepository,
    exhibitionInformationRepository,
    exhibitionArDesignRepository,
  }
}

export type Container = ReturnType<typeof createContainer>
