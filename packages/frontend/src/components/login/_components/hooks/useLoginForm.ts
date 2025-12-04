import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { loginSchema } from "@/schema/exhibitors";

type LoginFormValues = z.infer<typeof loginSchema>;

export function useLoginForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormValues>({
    defaultValues: {
      name: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setApiError(null);
    setIsSubmitting(true);

    try {
      const parsed = loginSchema.safeParse(values);
      if (!parsed.success) {
        parsed.error.issues.forEach((issue) => {
          const fieldName = issue.path[0];
          if (!fieldName) return;
          setError(fieldName as keyof LoginFormValues, {
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

      const response = await fetch(`${baseUrl}/api/exhibitors/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError("password", {
            type: "manual",
            message: "名前またはパスワードが正しくありません",
          });
          return;
        }

        throw new Error("ログインに失敗しました");
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


