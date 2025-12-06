import { sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { v4 as uuidv4 } from 'uuid'

/**
 * 出展者アカウントテーブル
 */
export const exhibitor = sqliteTable('exhibitor', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  name: text('name').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
})

export type Exhibitor = typeof exhibitor.$inferSelect
export type NewExhibitor = typeof exhibitor.$inferInsert
