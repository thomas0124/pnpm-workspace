import { sql } from 'drizzle-orm'
import { blob, check, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

import { exhibitor } from './exhibitor'

/**
 * 出展情報テーブル
 */
export const exhibitionInformation = sqliteTable(
  'exhibition_information',
  {
    id: text('id').primaryKey(),
    exhibitorId: text('exhibitor_id')
      .references(() => exhibitor.id)
      .notNull(),
    title: text('title').notNull(),
    category: text('category', {
      enum: ['飲食', '展示', '体験', 'ステージ'],
    }).notNull(),
    location: text('location').notNull(),
    price: integer('price'),
    requiredTime: integer('required_time'),
    comment: text('comment'),
    image: blob('image'),
    createdAt: text('created_at').notNull(),
    updatedAt: text('updated_at').notNull(),
  },
  (table) => [
    check(
      'category_in_allowed_values',
      sql`${table.category} IN ('飲食', '展示', '体験', 'ステージ')`
    ),
  ]
)

export type ExhibitionInformation = typeof exhibitionInformation.$inferSelect
export type NewExhibitionInformation = typeof exhibitionInformation.$inferInsert
