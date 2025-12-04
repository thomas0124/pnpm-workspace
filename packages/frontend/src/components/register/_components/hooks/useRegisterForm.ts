import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { exhibitorSchema } from "@/schema/exhibitors";
import type { ExhibitorSchema } from "@/schema/exhibitors";

export function useRegisterForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

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
    setApiError(null);
    setIsSubmitting(true);

    try {
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

      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      if (!baseUrl) {
        throw new Error("バックエンドURLが設定されていません");
      }

      const response = await fetch(`${baseUrl}/api/exhibitors/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.name,
          password: values.password,
        }),
      });

      if (!response.ok) {
        if (response.status === 409) {
          setError("name", {
            type: "manual",
            message: "この名前は既に使用されています",
          });
          return;
        }

        throw new Error("登録に失敗しました");
      }

      const data: {
        token: string;
        exhibitor: {
          id: string;
          name: string;
        };
      } = await response.json();

      sessionStorage.setItem("authToken", data.token);
      sessionStorage.setItem("exhibitorId", data.exhibitor.id);
      sessionStorage.setItem("userName", data.exhibitor.name);
      sessionStorage.setItem("isLoggedIn", "true");

      router.push("/exhibitor/basic-info");
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        setApiError(error.message);
      } else {
        setApiError("予期せぬエラーが発生しました");
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
    apiError,
    onSubmit,
  };
}
