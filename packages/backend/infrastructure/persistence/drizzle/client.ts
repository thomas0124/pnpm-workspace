import type { D1Database } from '@cloudflare/workers-types'
import type { DrizzleD1Database } from 'drizzle-orm/d1'
import { drizzle } from 'drizzle-orm/d1'

import * as exhibitionSchema from './schema/exhibition'
import * as exhibitionInformationSchema from './schema/exhibitionInformation'
import * as exhibitorSchema from './schema/exhibitor'

/**
 * Drizzle D1クライアントを取得
 *
 * @param d1 - Cloudflare WorkersのD1 Database binding
 * @returns Drizzle D1データベースインスタンス
 */
export function getDb(
  d1: D1Database
): DrizzleD1Database<
  typeof exhibitorSchema & typeof exhibitionSchema & typeof exhibitionInformationSchema
> {
  return drizzle(d1, {
    schema: {
      ...exhibitorSchema,
      ...exhibitionSchema,
      ...exhibitionInformationSchema,
    },
  })
}

export { exhibitorSchema, exhibitionSchema, exhibitionInformationSchema }
export type { Exhibitor, NewExhibitor } from './schema/exhibitor'
export type { Exhibition, NewExhibition } from './schema/exhibition'
export type {
  ExhibitionInformation,
  NewExhibitionInformation,
} from './schema/exhibitionInformation'
