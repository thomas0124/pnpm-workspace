import { z } from 'zod'

/**
 * ARデザインレスポンススキーマ
 */
export const ExhibitionArDesignDtoSchema = z.object({
  id: z.uuid(),
  url: z.url().nullable(),
})

export type ExhibitionArDesignDto = z.infer<typeof ExhibitionArDesignDtoSchema>

/**
 * ARデザイン一覧レスポンススキーマ
 */
export const ArDesignListResponseSchema = z.object({
  data: z.array(ExhibitionArDesignDtoSchema),
})

export type ArDesignListResponse = z.infer<typeof ArDesignListResponseSchema>
