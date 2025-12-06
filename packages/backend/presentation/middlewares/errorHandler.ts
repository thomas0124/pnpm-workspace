import type { ErrorHandler } from 'hono'
import { ZodError } from 'zod'

import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from '../../domain/errors/index'

export const errorHandler: ErrorHandler = (err, c) => {
  console.error('Error:', err)

  // Zodバリデーションエラー
  if (err instanceof ZodError) {
    // flatten() が非推奨の場合があるため、issuesから手動でfieldErrorsを構築
    const fieldErrors: Record<string, string[]> = {}

    err.issues.forEach((issue) => {
      // パスが存在する場合、その最初の要素をフィールド名として扱う
      if (issue.path.length > 0) {
        const key = String(issue.path[0])
        if (!fieldErrors[key]) {
          fieldErrors[key] = []
        }
        fieldErrors[key].push(issue.message)
      }
    })

    return c.json(
      {
        error: 'VALIDATION_ERROR',
        message: '入力内容に不備があります',
        fieldErrors: fieldErrors, // { title: ["必須入力です"], price: ["数値ではありません"] } のような形式
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
        message: err.message || 'Unknown error occurred',
      },
      500
    )
  }

  // その他のエラー
  return c.json(
    {
      error: 'INTERNAL_SERVER_ERROR',
      message: typeof err === 'string' ? err : 'Internal server error',
    },
    500
  )
}
