import { sqliteTable, text } from 'drizzle-orm/sqlite-core'

/**
 * ARデザインテーブル
 */
export const exhibitionArDesign = sqliteTable('exhibition_ar_design', {
  id: text('id').primaryKey(),
  url: text('url'),
})

export type ExhibitionArDesign = typeof exhibitionArDesign.$inferSelect
export type NewExhibitionArDesign = typeof exhibitionArDesign.$inferInsert
