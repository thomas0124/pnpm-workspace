import { useState } from "react";
import type { ExhibitionFormData } from "@/app/exhibitor/information/types";
import { DEFAULT_FORM_DATA } from "@/app/exhibitor/information/constants";

export function useExhibitionForm() {
  const [formData, setFormData] =
    useState<ExhibitionFormData>(DEFAULT_FORM_DATA);

  const updateField = <K extends keyof ExhibitionFormData>(
    field: K,
    value: ExhibitionFormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return {
    formData,
    updateField,
  };
}
