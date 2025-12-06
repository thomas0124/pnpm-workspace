import type { Exhibition } from '../models/exhibition'

export type ExhibitionCategory = 'Food' | 'Exhibition' | 'Experience' | 'Stage'

/**
 * 公開出展検索のパラメータ
 */
export type FindPublishedParams = {
  search?: string // 追加: タイトル・出展者名・コメントの部分一致検索
  category?: ExhibitionCategory
}

/**
 * Exhibitionリポジトリの型定義
 */
export type ExhibitionRepository = {
  save: (exhibition: Exhibition) => Promise<void>
  findById: (id: string) => Promise<Exhibition | null>
  findByExhibitorId: (exhibitorId: string) => Promise<Exhibition[]>
  delete: (id: string) => Promise<void>
  findPublished: (params?: FindPublishedParams) => Promise<Exhibition[]>
}
