import { sqliteTable, text } from 'drizzle-orm/sqlite-core'

/**
 * 出展者アカウントテーブル
 */
export const exhibitor = sqliteTable('exhibitor', {
  id: text('id').primaryKey(),
  name: text('name').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
})

export type Exhibitor = typeof exhibitor.$inferSelect
export type NewExhibitor = typeof exhibitor.$inferInsert
