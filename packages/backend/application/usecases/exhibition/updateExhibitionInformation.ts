import { updateExhibitionInformation } from '../../../domain/factories/exhibitionInformation'
import type { ExhibitionRepository } from '../../../domain/repositories/exhibition'
import type { ExhibitionInformationRepository } from '../../../domain/repositories/exhibitionInformation'
import type { ExhibitionArDesignRepository } from '../../../domain/repositories/exhibitionArDesign'
import { NotFoundError, ValidationError } from '../../../domain/errors'
import type { ExhibitionInformationInputDto, ExhibitionInformationDto } from '../../dto/exhibition'
import { toExhibitionInformationDto } from '../../dto/exhibition'
import { findExhibitionWithOwnershipCheck } from './findExhibitionWithOwnershipCheck'
import { validateArDesignId } from '../shared/validateArDesignId'

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
  await validateArDesignId(input.exhibition_ar_design_id, exhibitionArDesignRepository)

  // ExhibitionInformationを更新
  const updatedInformation = updateExhibitionInformation(existingInformation, {
    exhibitorName: input.exhibitor_name,
    title: input.title,
    category: input.category,
    location: input.location,
    price: input.price ?? null,
    requiredTime: input.required_time ?? null,
    comment: input.comment ?? null,
    exhibitionArDesignId: input.exhibition_ar_design_id ?? null,
    // 画像は更新しない（別途エンドポイントで管理）
  })

  // 保存
  await exhibitionInformationRepository.save(updatedInformation)

  // DTOに変換
  return toExhibitionInformationDto(updatedInformation, exhibitionArDesignRepository)
}

