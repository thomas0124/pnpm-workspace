import type { Exhibitor } from '../models/exhibitor.js'

/**
 * Exhibitorリポジトリの型定義
 *
 */
export type ExhibitorRepository = {
  /**
   * Exhibitorを保存（作成または更新）
   */
  save: (exhibitor: Exhibitor) => Promise<void>

  /**
   * IDでExhibitorを検索
   */
  findById: (id: string) => Promise<Exhibitor | null>

  /**
   * 名前でExhibitorを検索
   */
  findByName: (name: string) => Promise<Exhibitor | null>

  /**
   * 名前の存在チェック
   */
  existsByName: (name: string) => Promise<boolean>

  /**
   * Exhibitorを削除
   */
  delete: (id: string) => Promise<void>

  /**
   * すべてのExhibitorを取得（管理用）
   */
  findAll: () => Promise<Exhibitor[]>
}
