import type { Exhibition } from '../models/exhibition'

export type ExhibitionCategory = '飲食' | '展示' | '体験' | 'ステージ'

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
 * 公開出展のカテゴリ別件数
 */
export type CategoryCount = {
  category: ExhibitionCategory
  count: number
}

/**
 * 公開出展検索のパラメータ
 */
export type FindPublishedParams = {
  search?: string // 追加: タイトル・出展者名・コメントの部分一致検索
  category?: ExhibitionCategory
  page?: number
  perPage?: number
}