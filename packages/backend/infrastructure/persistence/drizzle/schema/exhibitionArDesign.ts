import { sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { v4 as uuidv4 } from 'uuid'

/**
 * ARデザインテーブル
 */
export const exhibitionArDesign = sqliteTable('exhibition_ar_design', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  url: text('url'),
})

export type ExhibitionArDesign = typeof exhibitionArDesign.$inferSelect
export type NewExhibitionArDesign = typeof exhibitionArDesign.$inferInsert
