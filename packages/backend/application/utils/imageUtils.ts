/**
 * 画像データ変換用ユーティリティ関数
 */

/**
 * Base64文字列をUint8Arrayに変換
 */
export function base64ToUint8Array(base64: string): Uint8Array {
  return Uint8Array.from(Buffer.from(base64, 'base64'))
}

/**
 * Uint8ArrayをBase64文字列に変換
 * nullの場合はnullを返す
 */
export function uint8ArrayToBase64(data: Uint8Array | null): string | null {
  if (data === null) {
    return null
  }
  return Buffer.from(data).toString('base64')
}
