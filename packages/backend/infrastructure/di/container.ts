import type { ExhibitorRepository } from '../../domain/repositories/exhibitorRepository'
import * as drizzleExhibitorRepo from '../persistence/drizzle/ExhibitorRepository'

export const createContainer = (d1: D1Database) => {
  const exhibitorRepository: ExhibitorRepository = {
    save: (exhibitor) => drizzleExhibitorRepo.save(exhibitor, d1),
    findById: (id) => drizzleExhibitorRepo.findById(id, d1),
    findByName: (name) => drizzleExhibitorRepo.findByName(name, d1),
    existsByName: (name) => drizzleExhibitorRepo.existsByName(name, d1),
    delete: (id) => drizzleExhibitorRepo.deleteExhibitor(id, d1),
    findAll: () => drizzleExhibitorRepo.findAll(d1),
  }

  return {
    exhibitorRepository,
  }
}

export type Container = ReturnType<typeof createContainer>