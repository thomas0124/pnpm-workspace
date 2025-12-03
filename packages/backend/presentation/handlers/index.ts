import type { D1Database } from '@cloudflare/workers-types'
import type { Context } from 'hono'

import { createContainer } from '../../infrastructure/di/container'
import type { Container } from '../../infrastructure/di/container'

/**
 * Cloudflare WorkersのBindings型定義
 */
export type Bindings = {
  DB: D1Database
}

/**
 * ハンドラーで使用する共通のContext型
 */
export type HandlerContext = Context<{ Bindings: Bindings }>

/**
 * ContextからDIコンテナを取得するヘルパー関数
 *
 * @param c HandlerContext
 * @returns DIコンテナ
 */
export function getContainer(c: HandlerContext): Container {
  return createContainer(c.env.DB)
}

