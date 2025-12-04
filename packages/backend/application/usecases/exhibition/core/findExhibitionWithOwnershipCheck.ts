import { ForbiddenError, NotFoundError } from '../../../../domain/errors'
import type { Exhibition } from '../../../../domain/models/exhibition'
import type { ExhibitionRepository } from '../../../../domain/repositories/exhibition'
import { isOwnedBy } from '../../../../domain/services/exhibition'

/**
 * Exhibitionを取得し、所有権チェックを行う
 *
 * @param exhibitionId 出展ID
 * @param exhibitorId 出展者ID（認証済み）
 * @param exhibitionRepository Exhibitionリポジトリ
 * @returns 取得されたExhibition
 * @throws NotFoundError - Exhibitionが見つからない場合
 * @throws ForbiddenError - Exhibitionが認証済み出展者の所有でない場合
 */
export async function findExhibitionWithOwnershipCheck(
  exhibitionId: string,
  exhibitorId: string,
  exhibitionRepository: ExhibitionRepository
): Promise<Exhibition> {
  const exhibition = await exhibitionRepository.findById(exhibitionId)
  if (!exhibition) {
    throw new NotFoundError('出展が見つかりません')
  }

  if (!isOwnedBy(exhibition, exhibitorId)) {
    throw new ForbiddenError('この出展にアクセスする権限がありません')
  }

  return exhibition
}
