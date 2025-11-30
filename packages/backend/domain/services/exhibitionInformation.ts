import type { ExhibitionInformation } from '../models/exhibitionInformation'
import { ExhibitionInformationIdSchema } from '../models/exhibitionInformation'
import type { ExhibitionInformationRepository } from '../repositories/exhibitionInformation'

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
