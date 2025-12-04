import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { exhibitorSchema } from "@/schema/exhibitors";
import type { ExhibitorSchema } from "@/schema/exhibitors";
import client from "@/lib/apiClient";
import { zodResolver } from "@hookform/resolvers/zod";

export function useLoginForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ExhibitorSchema>({
    resolver: zodResolver(exhibitorSchema),
    defaultValues: {
      name: "",
      password: "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (values: ExhibitorSchema) => {
    setIsSubmitting(true);

    try {
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

      const data = await response.json();

      sessionStorage.setItem("authToken", data.token);

      router.push("/exhibitor/basic-info");
    } catch (error) {
      console.error("Login failed:", error);
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
