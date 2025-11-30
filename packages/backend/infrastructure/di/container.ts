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
export const container = {
  /**
   * 出展者リポジトリ
   *
   * 注意: Drizzleの関数はD1Databaseを引数に取るため、
   * 実際の使用時にはBindingからD1を渡す必要があるよ
   */
  get exhibitorRepository() {
    return {
      save: drizzleExhibitorRepo.save,
      findById: drizzleExhibitorRepo.findById,
      findByName: drizzleExhibitorRepo.findByName,
      existsByName: drizzleExhibitorRepo.existsByName,
      delete: drizzleExhibitorRepo.deleteExhibitor,
      findAll: drizzleExhibitorRepo.findAll,
    }
  },
}

export type Container = typeof container