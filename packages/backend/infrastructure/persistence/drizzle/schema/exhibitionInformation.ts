import { blob, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

import { exhibitionArDesign } from './exhibitionArDesign'
import { exhibitor } from './exhibitor'

/**
 * 出展情報テーブル
 */
export const exhibitionInformation = sqliteTable('exhibition_information', {
  id: text('id').primaryKey(),
  exhibitorId: text('exhibitor_id')
    .references(() => exhibitor.id)
    .notNull(),
  exhibitionArDesignId: text('exhibition_ar_design_id').references(() => exhibitionArDesign.id),
  exhibitorName: text('exhibitor_name').notNull(),
  title: text('title').notNull(),
  category: text('category', {
    enum: ['飲食', '展示', '体験', 'ステージ'],
  }).notNull(),
  location: text('location').notNull(),
  price: integer('price'),
  requiredTime: integer('required_time'),
  comment: text('comment'),
  image: blob('image', { mode: 'buffer' }),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
})

export type ExhibitionInformation = typeof exhibitionInformation.$inferSelect
export type NewExhibitionInformation = typeof exhibitionInformation.$inferInsert
