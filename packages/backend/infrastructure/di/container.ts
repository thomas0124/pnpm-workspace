import type { ExhibitorRepository } from '../../domain/repositories/exhibitorRepository'
import * as drizzleExhibitorRepo from '../persistence/drizzle/ExhibitorRepository'

export const createContainer = (d1: D1Database) => {
  const exhibitorRepository: ExhibitorRepository =
    drizzleExhibitorRepo.createExhibitorRepository(d1)

  return {
    exhibitorRepository,
  }
}

export type Container = ReturnType<typeof createContainer>
