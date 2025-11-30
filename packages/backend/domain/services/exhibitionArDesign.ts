import { ExhibitionArDesignIdSchema } from '../models/exhibitionArDesign'
import type { ExhibitionArDesignRepository } from '../repositories/exhibitionArDesign'

/**
 * ExhibitionArDesignの存在確認
 *
 * @param id ExhibitionArDesign ID
 * @param repository ExhibitionArDesignリポジトリ
 * @returns 存在する場合はtrue
 * @throws zodバリデーションエラー時
 */
export async function exhibitionArDesignExists(
  id: string,
  repository: ExhibitionArDesignRepository
): Promise<boolean> {
  // UUIDバリデーション
  ExhibitionArDesignIdSchema.parse(id)

  const exhibitionArDesign = await repository.findById(id)
  return exhibitionArDesign !== null
}

