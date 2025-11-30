import type { ExhibitionArDesign } from '../models/exhibitionArDesign'

/**
 * ExhibitionArDesignリポジトリの型定義
 *
 */
export type ExhibitionArDesignRepository = {
  /**
   * ExhibitionArDesignを保存（作成または更新）
   */
  save: (exhibitionArDesign: ExhibitionArDesign) => Promise<void>

  /**
   * IDでExhibitionArDesignを検索
   */
  findById: (id: string) => Promise<ExhibitionArDesign | null>

  /**
   * すべてのExhibitionArDesignを取得
   */
  findAll: () => Promise<ExhibitionArDesign[]>

  /**
   * ExhibitionArDesignを削除
   */
  delete: (id: string) => Promise<void>
}
