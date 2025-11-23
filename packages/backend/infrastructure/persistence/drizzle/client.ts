import type { DrizzleD1Database } from 'drizzle-orm/d1'
import { drizzle } from 'drizzle-orm/d1'

import * as schema from './schema/user'

/**
 * Drizzle D1クライアントを取得
 *
 * @param d1 - Cloudflare WorkersのD1 Database binding
 * @returns Drizzle D1データベースインスタンス
 */
export function getDb(d1: D1Database): DrizzleD1Database<typeof schema> {
  return drizzle(d1, { schema })
}

export { schema }
export type { User, NewUser } from './schema/user'
