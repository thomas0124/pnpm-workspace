/**
 * パスワードハッシュ化・検証サービスのインターフェース
 *
 * ドメイン層は実装の詳細（bcrypt等）に依存せず、
 * このインターフェースを通じてパスワード操作を行う
 */
export interface PasswordService {
  /**
   * 平文パスワードをハッシュ化
   * @param plain 平文パスワード
   * @returns ハッシュ化されたパスワード
   */
  hash(plain: string): Promise<string>

  /**
   * 平文パスワードとハッシュを検証
   * @param plain 平文パスワード
   * @param hash ハッシュ化されたパスワード
   * @returns 一致する場合はtrue
   */
  verify(plain: string, hash: string): Promise<boolean>
}
