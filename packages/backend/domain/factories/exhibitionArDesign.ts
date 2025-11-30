import { v4 as uuidv4 } from 'uuid'

import type { ExhibitionArDesign } from '../models/exhibitionArDesign'
import { ExhibitionArDesignSchema } from '../models/exhibitionArDesign'

/**
 * 新規ExhibitionArDesignを作成
 *
 * @param url ARのURL（nullの場合はURLなし）
 * @returns 新規ExhibitionArDesignエンティティ
 * @throws zodバリデーションエラー時
 */
export function createExhibitionArDesign(url: string | null = null): ExhibitionArDesign {
  return ExhibitionArDesignSchema.parse({ id: uuidv4(), url })
}

/**
 * DBレコードからExhibitionArDesignを再構築
 *
 * @param data DB取得データ
 * @returns 再構築されたExhibitionArDesignエンティティ
 * @throws zodバリデーションエラー時
 */
export function reconstructExhibitionArDesign(data: ExhibitionArDesign): ExhibitionArDesign {
  return ExhibitionArDesignSchema.parse(data)
}
