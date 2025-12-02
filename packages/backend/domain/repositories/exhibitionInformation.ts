import type { ExhibitionInformation } from '../models/exhibitionInformation'

/**
 * ExhibitionInformationリポジトリの型定義
 *
 */
export type ExhibitionInformationRepository = {
  /**
   * ExhibitionInformationを保存（作成または更新）
   */
  save: (exhibitionInformation: ExhibitionInformation) => Promise<void>

  /**
   * IDでExhibitionInformationを検索
   */
  findById: (id: string) => Promise<ExhibitionInformation | null>

  /**
   * 複数IDでExhibitionInformationを一括取得
   */
  findByIds: (ids: string[]) => Promise<ExhibitionInformation[]>

  /**
   * 出展者IDでExhibitionInformationを検索（複数件）
   */
  findByExhibitorId: (exhibitorId: string) => Promise<ExhibitionInformation[]>

  /**
   * ExhibitionInformationを削除
   */
  delete: (id: string) => Promise<void>
}
