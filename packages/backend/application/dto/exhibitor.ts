import { z } from 'zod'

// 出展者登録リクエスト
export const ExhibitorRegisterRequestSchema = z.object({
  name: z.string().min(1).max(100).trim(),
  password: z.string().min(8).max(100).trim(),
})

export type ExhibitorRegisterRequest = z.infer<typeof ExhibitorRegisterRequestSchema>

// 出展者ログインリクエスト
export const ExhibitorLoginRequestSchema = z.object({
  name: z.string().trim().min(1),
  password: z.string().min(1),
})

export type ExhibitorLoginRequest = z.infer<typeof ExhibitorLoginRequestSchema>

// 出展者レスポンスDTO
export const ExhibitorDtoSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type ExhibitorDto = z.infer<typeof ExhibitorDtoSchema>

// 認証レスポンス
export const AuthResponseSchema = z.object({
  token: z.string().min(1),
  exhibitor: ExhibitorDtoSchema,
})

export type AuthResponse = z.infer<typeof AuthResponseSchema>
