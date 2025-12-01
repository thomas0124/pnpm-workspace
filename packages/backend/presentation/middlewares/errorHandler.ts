import type { Context, ErrorHandler } from 'hono'
import { ZodError } from 'zod'

export const errorHandler: ErrorHandler = (err, c) => {
  console.error('Error:', err)

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

    if (err instanceof Error) {
      // ビジネスロジックエラー
      if (err.message.includes('duplicate') || err.message.includes('重複')) {
        return c.json(
          {
            error: 'CONFLICT',
            message: err.message,
          },
          409
        )
      }

      if (err.message.includes('not found') || err.message.includes('見つかりません')) {
        return c.json(
          {
            error: 'NOT_FOUND',
            message: err.message,
          },
          404
        )
      }

      if (err.message.includes('unauthorized') || err.message.includes('認証')) {
        return c.json(
          {
            error: 'UNAUTHORIZED',
            message: err.message,
          },
          401
        )
      }

      return c.json(
        {
          error: 'INTERNAL_SERVER_ERROR',
          message: err.message,
        },
        500
      )
    }

    return c.json(
      {
        error: 'INTERNAL_SERVER_ERROR',
        message: 'Internal server error',
      },
      500
    )
  }
