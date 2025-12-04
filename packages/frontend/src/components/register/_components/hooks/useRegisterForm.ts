import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

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
    defaultValues: {
      name: "",
      password: "",
    },
  });

  const onSubmit = async (values: ExhibitorSchema) => {
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
      sessionStorage.setItem("exhibitorId", data.exhibitor.id);
      sessionStorage.setItem("userName", data.exhibitor.name);
      sessionStorage.setItem("isLoggedIn", "true");

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
