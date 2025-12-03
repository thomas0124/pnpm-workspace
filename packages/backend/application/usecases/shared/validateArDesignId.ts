import { NotFoundError } from '../../../domain/errors'
import type { ExhibitionArDesignRepository } from '../../../domain/repositories/exhibitionArDesign'

/**
 * ARデザインIDの存在確認
 *
 * @param arDesignId ARデザインID（nullの場合は検証をスキップ）
 * @param arDesignRepository ARデザインリポジトリ
 * @throws NotFoundError - ARデザインIDが指定されているが存在しない場合
 */
export async function validateArDesignId(
  arDesignId: string | null | undefined,
  arDesignRepository: ExhibitionArDesignRepository
): Promise<void> {
  if (!arDesignId) {
    return
  }

  const arDesign = await arDesignRepository.findById(arDesignId)
  if (!arDesign) {
    throw new NotFoundError('指定されたARデザインが見つかりません')
  }
}

