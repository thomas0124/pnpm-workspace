import { z } from 'zod'

/**
 * Exhibitor ID スキーマ
 */
export const ExhibitorIdSchema = z.uuid('Invalid exhibitor ID format')

/**
 * Exhibitor Name スキーマ
 * API仕様: 1-100文字
 */
export const ExhibitorNameSchema = z
  .string()
  .min(1, 'Name is required')
  .max(100, 'Name must be 100 characters or less')
  .trim()

/**
 * Password Hash スキーマ
 */
export const PasswordHashSchema = z.string().min(1, 'Password hash is required')

/**
 * Exhibitor エンティティスキーマ
 */
export const ExhibitorSchema = z.object({
  id: ExhibitorIdSchema,
  name: ExhibitorNameSchema,
  passwordHash: PasswordHashSchema,
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
})

/**
 * Exhibitor型
 */
export type Exhibitor = z.infer<typeof ExhibitorSchema>

/**
 * エンティティの同一性チェック
 */
export function isSameExhibitor(a: Exhibitor, b: Exhibitor): boolean {
  return a.id === b.id
}

/**
 * 名前を変更した新しいExhibitorを返す
 */
export function changeExhibitorName(exhibitor: Exhibitor, newName: string): Exhibitor {
  return ExhibitorSchema.parse({
    ...exhibitor,
    name: newName,
    updatedAt: new Date().toISOString(),
  })
}

/**
 * パスワードハッシュを変更した新しいExhibitorを返す
 */
export function changeExhibitorPassword(exhibitor: Exhibitor, newPasswordHash: string): Exhibitor {
  return ExhibitorSchema.parse({
    ...exhibitor,
    passwordHash: newPasswordHash,
    updatedAt: new Date(),
  })
}
