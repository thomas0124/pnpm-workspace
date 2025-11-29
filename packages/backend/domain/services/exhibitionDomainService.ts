import type { Exhibition } from '../models/exhibition/exhibition'

/**
 * Exhibitionが公開可能かチェック
 *
 * @param exhibition - チェック対象のExhibition
 * @returns 公開可能な場合true
 */
export function canPublish(exhibition: Exhibition): boolean {
  return exhibition.exhibitionInformationId !== null
}

/**
 * Exhibitionが下書き状態に遷移可能かチェック
 *
 * @param exhibition - チェック対象のExhibition
 * @returns 下書きに遷移可能な場合true
 */
export function canTransitionToDraft(exhibition: Exhibition): boolean {
  // 公開中(is_published=true)の出展は下書きに戻せない
  if (exhibition.isPublished === 1) {
    return false
  }
  // 非公開(is_draft=false, is_published=false) → 下書きは可能
  return exhibition.isDraft === 0 && exhibition.isPublished === 0
}

/**
 * Exhibitionが公開状態に遷移可能かチェック
 *
 * @param exhibition - チェック対象のExhibition
 * @returns 公開に遷移可能な場合true
 */
export function canTransitionToPublished(exhibition: Exhibition): boolean {
  // 基本情報が登録済みである必要がある
  if (exhibition.exhibitionInformationId === null) {
    return false
  }
  // 下書きまたは非公開から公開への遷移は可能
  return exhibition.isDraft === 1 || (exhibition.isDraft === 0 && exhibition.isPublished === 0)
}

/**
 * Exhibitionが非公開状態に遷移可能かチェック
 *
 * @param exhibition - チェック対象のExhibition
 * @returns 非公開に遷移可能な場合true
 */
export function canTransitionToUnpublished(exhibition: Exhibition): boolean {
  // 公開中(is_published=true)から非公開への遷移のみ可能
  return exhibition.isPublished === 1
}

/**
 * Exhibitionが指定された出展者に所有されているかチェック
 *
 * @param exhibition - チェック対象のExhibition
 * @param exhibitorId - 出展者ID
 * @returns 所有されている場合true
 */
export function isOwnedBy(exhibition: Exhibition, exhibitorId: string): boolean {
  return exhibition.exhibitorId === exhibitorId
}
