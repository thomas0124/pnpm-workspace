import { z } from "zod";

export const exhibitorSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "名前を入力してください" }) // Name is required
    .max(100, { message: "名前は100文字以内で入力してください" }), // Name must be 100 characters or less
  password: z
    .string()
    .min(8, { message: "パスワードは8文字以上で入力してください" }),
});

export type ExhibitorSchema = z.infer<typeof exhibitorSchema>;
