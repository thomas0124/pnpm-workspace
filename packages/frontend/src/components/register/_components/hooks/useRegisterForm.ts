import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { exhibitorSchema } from "@/schema/exhibitors";
import type { ExhibitorSchema } from "@/schema/exhibitors";
import client from "@/lib/apiClient";

export function useRegisterForm() {
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
      const response = await client.exhibitors.register.$post({
        json: values,
      });

      if (!response.ok) {
        setError("name", {
          type: "manual",
          message: "この名前は既に使用されています",
        });
        return;
      }

      const data = await response.json();

      sessionStorage.setItem("authToken", data.token);

      router.push("/exhibitor/information");
    } catch (error) {
      console.error("Register failed:", error);
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
