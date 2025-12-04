import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { exhibitorSchema } from "@/schema/exhibitors";
import type { ExhibitorSchema } from "@/schema/exhibitors";
import client from "@/lib/apiClient";

export function useLoginForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ExhibitorSchema>({
    defaultValues: {
      name: "",
      password: "",
    },
  });

  const onSubmit = async (values: ExhibitorSchema) => {
    setIsSubmitting(true);

    try {
      // Zod でのバリデーション
      const parsed = exhibitorSchema.safeParse(values);
      if (!parsed.success) {
        parsed.error.issues.forEach((issue) => {
          const fieldName = issue.path[0];
          if (!fieldName) return;

          setError(fieldName as keyof ExhibitorSchema, {
            type: "manual",
            message: issue.message,
          });
        });
        return;
      }

      // API リクエスト
      const response = await client.exhibitors.login.$post({
        json: values,
      });

      // HTTP ステータスでの判定
      if (!response.ok) {
        setError("password", {
          type: "manual",
          message: "名前またはパスワードが正しくありません",
        });
        return;
      }

      // JSON パース
      const data = await response.json();

      // セッション保存
      sessionStorage.setItem("authToken", data.token);

      // 画面遷移
      router.push("/exhibitor/basic-info");
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        console.error(error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    onSubmit,
  };
}
