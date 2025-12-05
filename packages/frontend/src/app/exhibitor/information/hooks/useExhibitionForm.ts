import { useState } from "react";
import type { ExhibitionFormData } from "@/types/exhibitions";

export function useExhibitionForm() {
  const [formData, setFormData] = useState<ExhibitionFormData>({
    id: "",
    title: "",
    exhibitorName: "",
    category: "Food",
    price: null,
    location: "",
    requiredTime: null,
    comment: "",
    image: "",
    arDesign: null,
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
