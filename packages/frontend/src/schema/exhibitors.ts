import { z } from "zod";

export const loginSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "名前を入力してください" }) // Name is required
    .max(100, { message: "名前は100文字以内で入力してください" }), // Name must be 100 characters or less
  password: z
    .string()
    .min(1, { message: "パスワードを入力してください" }),
});