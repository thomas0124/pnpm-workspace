import type { D1Database } from '@cloudflare/workers-types'
import type { Context } from 'hono'
import { createFactory } from 'hono/factory'

import type { Container } from '../../infrastructure/di/container'
import { createContainer } from '../../infrastructure/di/container'

/**
 * Cloudflare WorkersのBindings型定義
 */
export type Bindings = {
  DB: D1Database
  JWT_SECRET: string
  ENVIRONMENT?: string
}

export const handlerFactory = createFactory<{ Bindings: Bindings }>()

/**
 * ContextからDIコンテナを取得するヘルパー関数
 *
 * @param c Context<{ Bindings: Bindings }>
 * @returns DIコンテナ
 */
export function getContainer(c: Context<{ Bindings: Bindings }>): Container {
  return createContainer(c.env.DB)
}
