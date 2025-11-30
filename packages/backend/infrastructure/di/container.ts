import type { ExhibitorRepository } from '../../domain/repositories/exhibitorRepository.js'
import * as drizzleExhibitorRepo from '../persistence/drizzle/drizzleExhibitorRepository.js'

/**
 * シンプルなDIコンテナ
 *
 * 複雑なDIライブラリは不要だよ！
 * ただのオブジェクトで依存性を管理できるんだ。
 *
 * Cloudflare WorkersではD1DatabaseはリクエストごとにBindingから取得するため、
 * ここではリポジトリ関数のみを提供するよ
 */
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