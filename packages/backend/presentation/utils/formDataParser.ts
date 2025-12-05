/**
 * FormDataパース用ユーティリティ関数
 */

/**
 * 値を文字列に変換、変換できない場合はundefinedを返す
 */
export function toStringOrUndefined(value: unknown): string | undefined {
  if (value === undefined || value === null) return undefined
  if (typeof value === 'string') return value
  return undefined
}

/**
 * 値をnull許容文字列に変換
 * undefinedまたは空文字列の場合はnullを返す
 */
export function toNullableString(value: unknown): string | null {
  const str = toStringOrUndefined(value)
  return str === undefined || str === '' ? null : str
}

/**
 * 値をオプショナルな整数に変換
 * 変換できない場合はundefinedを返す
 */
export function toOptionalInt(value: unknown): number | undefined {
  const str = toStringOrUndefined(value)
  if (str === undefined || str === '') return undefined
  const num = Number(str)
  return Number.isFinite(num) ? num : undefined
}

/**
 * 画像データをBase64文字列に変換
 * File、ArrayBufferView、または既にBase64文字列のいずれかを受け取る
 */
export async function parseImageToBase64(image: unknown): Promise<string | undefined> {
  if (image instanceof File) {
    const arrayBuffer = await image.arrayBuffer()
    return Buffer.from(arrayBuffer).toString('base64')
  }

  if (image && typeof image === 'object' && 'byteLength' in (image as ArrayBufferView)) {
    // parseBody が Uint8Array などの TypedArray を返す場合に対応
    const view = image as ArrayBufferView
    return Buffer.from(view.buffer, view.byteOffset, view.byteLength).toString('base64')
  }

  if (typeof image === 'string' && image.trim() !== '') {
    // 既にBase64が送られているケースも許容
    return image
  }

  return undefined
}
