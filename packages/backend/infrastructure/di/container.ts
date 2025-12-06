import type { D1Database } from '@cloudflare/workers-types'

import type { ExhibitionRepository } from '../../domain/repositories/exhibition'
import type { ExhibitionInformationRepository } from '../../domain/repositories/exhibitionInformation'
import type { ExhibitorRepository } from '../../domain/repositories/exhibitorRepository'
import type { PasswordService } from '../../domain/services/password'
import { createBcryptPasswordService } from '../external/passwordService'
import { createExhibitionInformationRepository } from '../persistence/drizzle/exhibitionInformationRepository'
import { createExhibitionRepository } from '../persistence/drizzle/exhibitionRepository'
import { createExhibitorRepository } from '../persistence/drizzle/exhibitorRepository'

export function createContainer(d1: D1Database) {
  const exhibitorRepository: ExhibitorRepository = createExhibitorRepository(d1)
  const exhibitionRepository: ExhibitionRepository = createExhibitionRepository(d1)
  const exhibitionInformationRepository: ExhibitionInformationRepository =
    createExhibitionInformationRepository(d1)
  const passwordService: PasswordService = createBcryptPasswordService()

  return {
    exhibitorRepository,
    exhibitionRepository,
    exhibitionInformationRepository,
    passwordService,
  }
}

export type Container = ReturnType<typeof createContainer>
