import bcrypt from 'bcryptjs'

import type { PasswordService } from '../../domain/services/password'

/**
 * bcryptを使用したPasswordServiceの実装を作成
 *
 * @returns PasswordServiceの実装インスタンス
 */
export function createBcryptPasswordService(): PasswordService {
  return {
    async hash(plain: string): Promise<string> {
      return bcrypt.hash(plain, 10)
    },
    async verify(plain: string, hash: string): Promise<boolean> {
      return bcrypt.compare(plain, hash)
    },
  }
}
