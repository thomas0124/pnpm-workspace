import { sql } from 'drizzle-orm'
import { check, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { v4 as uuidv4 } from 'uuid'

import { exhibitionInformation } from './exhibitionInformation'
import { exhibitor } from './exhibitor'

/**
 * 出展全体管理テーブル
 */
export const exhibition = sqliteTable(
  'exhibition',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => uuidv4()),
    exhibitorId: text('exhibitor_id')
      .references(() => exhibitor.id)
      .notNull(),
    exhibitionInformationId: text('exhibition_information_id').references(
      () => exhibitionInformation.id
    ),
    isDraft: integer('is_draft').notNull().default(1),
    isPublished: integer('is_published').notNull().default(0),
    publishedAt: text('published_at'),
    createdAt: text('created_at').notNull(),
    updatedAt: text('updated_at').notNull(),
  },
  (table) => [
    check('is_draft', sql`${table.isDraft} IN (0, 1)`),
    check('is_published', sql`${table.isPublished} IN (0, 1)`),
  ]
)

export type Exhibition = typeof exhibition.$inferSelect
export type NewExhibition = typeof exhibition.$inferInsert
