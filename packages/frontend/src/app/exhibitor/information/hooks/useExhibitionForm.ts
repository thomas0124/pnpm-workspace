import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";
import {
  exhibitionFormSchema,
  type ExhibitionFormSchema,
} from "@/app/exhibitor/information/types";

export function useExhibitionForm() {
  const form = useForm<ExhibitionFormSchema>({
    resolver: zodResolver(
      exhibitionFormSchema,
    ) as Resolver<ExhibitionFormSchema>,
    mode: "onChange",
    defaultValues: {
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
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = form;

  return {
    form,
    register,
    handleSubmit,
    setValue,
    watch,
    errors,
    isSubmitting,
  };
}
