import { ConflictError } from '../../../../domain/errors'
import { createExhibition } from '../../../../domain/factories/exhibition'
import { createExhibitionInformation } from '../../../../domain/factories/exhibitionInformation'
import type { ExhibitionRepository } from '../../../../domain/repositories/exhibition'
import type { ExhibitionArDesignRepository } from '../../../../domain/repositories/exhibitionArDesign'
import type { ExhibitionInformationRepository } from '../../../../domain/repositories/exhibitionInformation'
import type { ExhibitionDto, ExhibitionInformationInputDto } from '../../../dto/exhibition'
import { toExhibitionDto, toExhibitionInformationDto } from '../../../dto/exhibition'
import { validateArDesignId } from '../../shared/validateArDesignId'
/**

/**
 * 出展作成ユースケース
 * ✅ 画像データも含めて作成
 *
 * @param input 出展情報入力
 * @param exhibitorId 出展者ID（認証済み）
 * @param exhibitionRepository Exhibitionリポジトリ
 * @param exhibitionInformationRepository ExhibitionInformationリポジトリ
 * @param exhibitionArDesignRepository ExhibitionArDesignリポジトリ（ARデザインID検証用）
 * @returns 作成されたExhibitionのDTO
 * @throws NotFoundError - ARデザインIDが指定されているが存在しない場合
 * @throws ConflictError - 既に出展情報が登録されている場合
 */
export async function createExhibitionUseCase(
  input: ExhibitionInformationInputDto,
  exhibitorId: string,
  exhibitionRepository: ExhibitionRepository,
  exhibitionInformationRepository: ExhibitionInformationRepository,
  exhibitionArDesignRepository: ExhibitionArDesignRepository
): Promise<ExhibitionDto> {
  // ✅ 画像データをBase64からUint8Arrayに変換
  const imageData = input.image
    ? Uint8Array.from(Buffer.from(input.image, 'base64'))
    : null


  // 既存の出展情報が存在するかチェック
  const existingInformation = await exhibitionInformationRepository.findByExhibitorId(exhibitorId)
  if (existingInformation.length > 0) {
    throw new ConflictError('この出展者は既に出展情報を登録しています')
  }

  // ARデザインIDの存在確認
  await validateArDesignId(input.exhibitionArDesignId, exhibitionArDesignRepository)

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
    input.exhibitionArDesignId ?? null,
    image: imageData,
  )

  // Exhibitionを作成（下書き状態）
  const exhibition = createExhibition(exhibitorId, exhibitionInformation.id)

  // 保存（ExhibitionInformationを先に保存）
  await exhibitionInformationRepository.save(exhibitionInformation)
  await exhibitionRepository.save(exhibition)

  // DTOに変換
  const exhibitionInformationDto = await toExhibitionInformationDto(
    exhibitionInformation,
    exhibitionArDesignRepository
  )

  return toExhibitionDto(exhibition, exhibitionInformationDto)
}
