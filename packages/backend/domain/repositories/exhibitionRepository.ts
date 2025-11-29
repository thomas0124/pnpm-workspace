import type { Exhibition } from '../models/exhibition/exhibition'

type ExhibitionCategory = '飲食' | '展示' | '体験' | 'ステージ'

/**
 * ページネーション情報の型定義
 */
export type PaginationMeta = {
  total: number
  page: number
  perPage: number
  totalPages: number
}

/**
 * ページネーション結果の型定義
 */
export type PaginatedResult<T> = {
  data: T[]
  meta: PaginationMeta
}

/**
 * 公開出展検索のパラメータ
 */
export type FindPublishedParams = {
  category?: ExhibitionCategory
  page?: number
  perPage?: number
}

/**
 * Exhibitionリポジトリの型定義
 *
 */
export type ExhibitionRepository = {
  save: (exhibition: Exhibition) => Promise<void>
  findById: (id: string) => Promise<Exhibition | null>
  findByExhibitorId: (exhibitorId: string) => Promise<Exhibition[]>
  delete: (id: string) => Promise<void>
  findPublished: (
    params?: FindPublishedParams
  ) => Promise<PaginatedResult<Exhibition>>
  findPublishedById: (id: string) => Promise<Exhibition | null>
}

