import type { ErrorHandler } from 'hono'
import { ZodError } from 'zod'

import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from '../../domain/errors/index.js'

export const errorHandler: ErrorHandler = (err, c) => {
  console.error('Error:', err)

  // Zodバリデーションエラー
  if (err instanceof ZodError) {
    return c.json(
      {
        error: 'VALIDATION_ERROR',
        message: 'リクエストパラメータが不正です',
        details: err.issues,
      },
      400
    )
  }

  // カスタムエラークラスによる型安全なエラーハンドリング
  if (err instanceof UnauthorizedError) {
    return c.json(
      {
        error: 'UNAUTHORIZED',
        message: err.message,
      },
      401
    )
  }

  if (err instanceof ForbiddenError) {
    return c.json(
      {
        error: 'FORBIDDEN',
        message: err.message,
      },
      403
    )
  }

  if (err instanceof NotFoundError) {
    return c.json(
      {
        error: 'NOT_FOUND',
        message: err.message,
      },
      404
    )
  }

  if (err instanceof ConflictError) {
    return c.json(
      {
        error: 'CONFLICT',
        message: err.message,
      },
      409
    )
  }

  if (err instanceof ValidationError) {
    return c.json(
      {
        error: 'VALIDATION_ERROR',
        message: err.message,
      },
      400
    )
  }

  // 予期しないエラー
  if (err instanceof Error) {
    return c.json(
      {
        error: 'INTERNAL_SERVER_ERROR',
        message: err.message,
      },
      500
    )
  }

  // その他のエラー
  return c.json(
    {
      error: 'INTERNAL_SERVER_ERROR',
      message: 'Internal server error',
    },
    500
  )
}
