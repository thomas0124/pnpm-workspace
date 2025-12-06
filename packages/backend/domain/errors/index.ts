/**
 * ドメイン層のカスタムエラークラス
 */

/**
 * リソースが見つからない場合のエラー
 */
export class NotFoundError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'NotFoundError'
    Object.setPrototypeOf(this, NotFoundError.prototype)
  }
}

/**
 * リソースの競合エラー（重複など）
 */
export class ConflictError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ConflictError'
    Object.setPrototypeOf(this, ConflictError.prototype)
  }
}

/**
 * 認証エラー
 */
export class UnauthorizedError extends Error {
  constructor(message: string = '認証に失敗しました') {
    super(message)
    this.name = 'UnauthorizedError'
    Object.setPrototypeOf(this, UnauthorizedError.prototype)
  }
}

/**
 * 認可エラー（権限不足）
 */
export class ForbiddenError extends Error {
  constructor(message: string = 'この操作を実行する権限がありません') {
    super(message)
    this.name = 'ForbiddenError'
    Object.setPrototypeOf(this, ForbiddenError.prototype)
  }
}

/**
 * バリデーションエラー（Zod以外のビジネスロジックのバリデーション）
 */
export class ValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ValidationError'
    Object.setPrototypeOf(this, ValidationError.prototype)
  }
}
