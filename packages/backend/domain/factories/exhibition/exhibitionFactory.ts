import { v4 as uuidv4 } from 'uuid'

import type {Exhibition} from '../../models/exhibition/exhibition';
import { ExhibitionSchema } from '../../models/exhibition/exhibition'

// 新規Exhibitionを作成
export function createExhibition(
  exhibitorId: string,
  exhibitionInformationId: string | null = null
): Exhibition {
  const now = new Date().toISOString()

  return ExhibitionSchema.parse({
    id: uuidv4(),
    exhibitorId,
    exhibitionInformationId,
    isDraft: 1, // 下書き
    isPublished: 0, // 非公開
    publishedAt: null,
    createdAt: now,
    updatedAt: now,
  })
}

// DBから取得したデータを再構築
export function reconstructExhibition(data: {
  id: string
  exhibitorId: string
  exhibitionInformationId: string | null
  isDraft: number
  isPublished: number
  publishedAt: string | null
  createdAt: string
  updatedAt: string
}): Exhibition {
  return ExhibitionSchema.parse(data)
}

/**
 * 出展を公開状態に変更
 * 下書き(isDraft=1)または非公開(isPublished=0, isDraft=0) → 公開
 *
 * @param exhibition - 公開するExhibition
 * @returns 公開状態に更新されたExhibition
 * @throws Error - exhibitionInformationIdがnullの場合、または既に公開中の場合はエラー
 */
export function publish(exhibition: Exhibition): Exhibition {
  // 公開条件: exhibitionInformationIdがnullでないこと
  if (exhibition.exhibitionInformationId === null) {
    throw new Error(
      '公開するには基本情報(exhibitionInformationId)が登録されている必要があります'
    )
  }

  // 既に公開中の場合はエラー（直接的な状態遷移は不可）
  if (exhibition.isPublished === 1) {
    throw new Error('既に公開中の出展です')
  }

  const now = new Date().toISOString()

  return ExhibitionSchema.parse({
    ...exhibition,
    isDraft: 0, // 確定
    isPublished: 1, // 公開
    publishedAt: now,
    updatedAt: now,
  })
}

/**
 * 出展を非公開状態に変更
 * 公開(isPublished=1) → 非公開(isPublished=0)
 *
 * @param exhibition - 非公開にするExhibition
 * @returns 非公開状態に更新されたExhibition
 * @throws Error - 既に非公開の場合はエラー
 */
export function unpublish(exhibition: Exhibition): Exhibition {
  // 公開中でない場合はエラー
  if (exhibition.isPublished === 0) {
    throw new Error('既に非公開の出展です')
  }

  const now = new Date().toISOString()

  return ExhibitionSchema.parse({
    ...exhibition,
    isPublished: 0, // 非公開
    publishedAt: null,
    updatedAt: now,
    // isDraftは変更しない（falseのまま）
  })
}

/**
 * 出展を下書き状態に戻す
 * 非公開(isPublished=0, isDraft=0) → 下書き(isDraft=1)
 *
 * @param exhibition - 下書きに戻すExhibition
 * @returns 下書き状態に更新されたExhibition
 * @throws Error - 公開中の場合はエラー（先に非公開にする必要がある）
 */
export function draft(exhibition: Exhibition): Exhibition {
  // 公開中の場合はエラー（直接下書きに戻せない）
  if (exhibition.isPublished === 1) {
    throw new Error(
      '公開中の出展は下書きに戻せません。先に非公開にしてください'
    )
  }

  // 既に下書きの場合はそのまま返す
  if (exhibition.isDraft === 1) {
    return exhibition
  }

  const now = new Date().toISOString()

  return ExhibitionSchema.parse({
    ...exhibition,
    isDraft: 1, // 下書き
    isPublished: 0, // 非公開
    updatedAt: now,
  })
}

