import { z } from "zod";

export const categoryValues = [
  "Food",
  "Exhibition",
  "Experience",
  "Stage",
] as const;

export const exhibitionFormSchema = z.object({
  id: z.string().optional(),
  exhibitorName: z
    .string()
    .min(1, "サークル名は必須です")
    .max(100, "100文字以内で入力してください"),
  title: z
    .string()
    .min(1, "出展タイトルは必須です")
    .max(200, "200文字以内で入力してください"),
  category: z.enum(categoryValues),
  location: z
    .string()
    .min(1, "場所は必須です")
    .max(100, "100文字以内で入力してください"),
  price: z
    .number()
    .int("整数で入力してください")
    .min(0, "0以上で入力してください")
    .nullable(),
  requiredTime: z
    .number()
    .int("整数で入力してください")
    .min(0, "0以上で入力してください")
    .nullable(),
  comment: z.string().max(100, "100文字以内で入力してください").nullable(),
  image: z.string().optional().nullable(),
  arDesign: z
    .object({
      id: z.string(),
      url: z.string().url().nullable(),
    })
    .nullable()
    .optional(),
});

export type ExhibitionFormSchema = z.infer<typeof exhibitionFormSchema>;
