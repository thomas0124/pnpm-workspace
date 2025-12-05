import { useState } from "react";
import type { ExhibitionFormData } from "@/app/exhibitor/information/types";

export function useExhibitionForm() {
  const [formData, setFormData] = useState<ExhibitionFormData>({
    id: "",
    title: "",
    exhibitorName: "",
    category: "飲食",
    price: undefined,
    location: "",
    requiredTime: undefined,
    comment: "",
    image: "",
    arDesign: undefined,
  });

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
