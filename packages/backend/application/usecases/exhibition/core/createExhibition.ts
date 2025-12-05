import { ConflictError } from '../../../../domain/errors'
import { createExhibition } from '../../../../domain/factories/exhibition'
import { createExhibitionInformation } from '../../../../domain/factories/exhibitionInformation'
import type { ExhibitionRepository } from '../../../../domain/repositories/exhibition'
import type { ExhibitionInformationRepository } from '../../../../domain/repositories/exhibitionInformation'
import type { ExhibitionDto, ExhibitionInformationInputDto } from '../../../dto/exhibition'
import { toExhibitionDto, toExhibitionInformationDto } from '../../../dto/exhibition'
import { base64ToUint8Array } from '../../../utils/imageUtils'

/**
 * 出展作成ユースケース
 * ✅ 画像データも含めて作成
 *
 * @param input 出展情報入力
 * @param exhibitorId 出展者ID（認証済み）
 * @param exhibitionRepository Exhibitionリポジトリ
 * @param exhibitionInformationRepository ExhibitionInformationリポジトリ
 * @returns 作成されたExhibitionのDTO
 * @throws ConflictError - 既に出展情報が登録されている場合
 */
export async function createExhibitionUseCase(
  input: ExhibitionInformationInputDto,
  exhibitorId: string,
  exhibitionRepository: ExhibitionRepository,
  exhibitionInformationRepository: ExhibitionInformationRepository
): Promise<ExhibitionDto> {
  // ✅ 画像データをBase64からUint8Arrayに変換
  const imageData = input.image ? base64ToUint8Array(input.image) : null

  // 既存の出展情報が存在するかチェック
  const existingInformation = await exhibitionInformationRepository.findByExhibitorId(exhibitorId)
  if (existingInformation.length > 0) {
    throw new ConflictError('この出展者は既に出展情報を登録しています')
  }

  // ExhibitionInformationを作成
  const exhibitionInformation = createExhibitionInformation(
    exhibitorId,
    input.exhibitorName,
    input.title,
    input.category,
    input.location,
    input.price ?? null,
    input.requiredTime ?? null,
    input.comment ?? null,
    imageData
  )

  // Exhibitionを作成（下書き状態）
  const exhibition = createExhibition(exhibitorId, exhibitionInformation.id)

  // 保存（ExhibitionInformationを先に保存）
  await exhibitionInformationRepository.save(exhibitionInformation)
  await exhibitionRepository.save(exhibition)

  // DTOに変換
  const exhibitionInformationDto = toExhibitionInformationDto(exhibitionInformation)

  return toExhibitionDto(exhibition, exhibitionInformationDto)
}
