import type { ExhibitionInformation } from '../models/exhibitionInformation/exhibitionInformation'
import { ExhibitionInformationIdSchema } from '../models/exhibitionInformation/exhibitionInformation'
import type { ExhibitionInformationRepository } from '../repositories/exhibitionInformationRepository'

/**
 * ExhibitionInformationが指定された出展者に所有されているかチェック
 *
 * @param exhibitionInformation - チェック対象のExhibitionInformation
 * @param exhibitorId - 出展者ID
 * @returns 所有されている場合true
 */
export function isOwnedBy(
  exhibitionInformation: ExhibitionInformation,
  exhibitorId: string
): boolean {
  return exhibitionInformation.exhibitorId === exhibitorId
}

/**
 * ExhibitionInformationの存在確認
 *
 * @param id ExhibitionInformation ID
 * @param repository ExhibitionInformationリポジトリ
 * @returns 存在する場合はtrue
 * @throws zodバリデーションエラー時
 */
export async function exhibitionInformationExists(
  id: string,
  repository: ExhibitionInformationRepository
): Promise<boolean> {
  // UUIDバリデーション
  ExhibitionInformationIdSchema.parse(id)

  const exhibitionInformation = await repository.findById(id)
  return exhibitionInformation !== null
}

/**
 * ExhibitionInformationが指定された出展者に属しているかチェック
 *
 * @param exhibitionInformation - チェック対象のExhibitionInformation
 * @param exhibitorId - 出展者ID
 * @returns 属している場合true
 */
export function belongsToExhibitor(
  exhibitionInformation: ExhibitionInformation,
  exhibitorId: string
): boolean {
  return exhibitionInformation.exhibitorId === exhibitorId
}
