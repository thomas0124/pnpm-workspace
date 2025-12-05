import { NotFoundError, ValidationError } from '../../../../domain/errors'
import { updateExhibitionInformation } from '../../../../domain/factories/exhibitionInformation'
import type { ExhibitionRepository } from '../../../../domain/repositories/exhibition'
import type { ExhibitionArDesignRepository } from '../../../../domain/repositories/exhibitionArDesign'
import type { ExhibitionInformationRepository } from '../../../../domain/repositories/exhibitionInformation'
import type {
  ExhibitionInformationDto,
  ExhibitionInformationInputDto,
} from '../../../dto/exhibition'
import { toExhibitionInformationDto } from '../../../dto/exhibition'
import { validateArDesignId } from '../../shared/validateArDesignId'
import { findExhibitionWithOwnershipCheck } from '../core/findExhibitionWithOwnershipCheck'


/**
 * 出展基本情報更新ユースケース
 *
 * @param exhibitionId 出展ID
 * @param input 出展情報入力
 * @param exhibitorId 出展者ID（認証済み）
 * @param exhibitionRepository Exhibitionリポジトリ
 * @param exhibitionInformationRepository ExhibitionInformationリポジトリ
 * @param exhibitionArDesignRepository ExhibitionArDesignリポジトリ（ARデザインID検証用）
 * @returns 更新されたExhibitionInformationのDTO
 * @throws NotFoundError - ExhibitionまたはExhibitionInformationが見つからない場合
 * @throws ForbiddenError - Exhibitionが認証済み出展者の所有でない場合
 * @throws ValidationError - ExhibitionInformationが存在しない場合
 *
 * 注意: Exhibitionの所有権チェックで十分（ExhibitionInformationはExhibitionに紐づいているため）
 */
export async function updateExhibitionInformationUseCase(
  exhibitionId: string,
  input: ExhibitionInformationInputDto,
  exhibitorId: string,
  exhibitionRepository: ExhibitionRepository,
  exhibitionInformationRepository: ExhibitionInformationRepository,
  exhibitionArDesignRepository: ExhibitionArDesignRepository
): Promise<ExhibitionInformationDto> {
  // Exhibitionを取得し、所有権チェック
  const exhibition = await findExhibitionWithOwnershipCheck(
    exhibitionId,
    exhibitorId,
    exhibitionRepository
  )

  // ExhibitionInformationが存在するかチェック
  if (!exhibition.exhibitionInformationId) {
    throw new ValidationError('出展情報が登録されていません')
  }

  // ExhibitionInformationを取得
  const existingInformation = await exhibitionInformationRepository.findById(
    exhibition.exhibitionInformationId
  )
  if (!existingInformation) {
    throw new NotFoundError('出展情報が見つかりません')
  }

  // ARデザインIDの存在確認
  await validateArDesignId(input.exhibitionArDesignId, exhibitionArDesignRepository)

 // ✅ 画像データをBase64からUint8Arrayに変換
  const imageData = input.image !== undefined
    ? input.image
      ? Uint8Array.from(Buffer.from(input.image, 'base64'))
      : null
    : existingInformation.image // 画像が指定されていない場合は既存の画像を保持

  // ExhibitionInformationを更新
  const updatedInformation = updateExhibitionInformation(existingInformation, {
    exhibitorName: input.exhibitorName,
    title: input.title,
    category: input.category,
    location: input.location,
    price: input.price ?? null,
    requiredTime: input.requiredTime ?? null,
    comment: input.comment ?? null,
    exhibitionArDesignId: input.exhibitionArDesignId ?? null,
    image: imageData,
  })

  // 保存
  await exhibitionInformationRepository.save(updatedInformation)

  // DTOに変換
  return toExhibitionInformationDto(updatedInformation, exhibitionArDesignRepository)
}
