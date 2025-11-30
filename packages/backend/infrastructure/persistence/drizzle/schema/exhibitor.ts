import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

/**
 * 出展者アカウントテーブル
 */
export const exhibitor = sqliteTable('exhibitor', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  passwordHash: text('password_hash').notNull(),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
})

export type Exhibitor = typeof exhibitor.$inferSelect
export type NewExhibitor = typeof exhibitor.$inferInsert
