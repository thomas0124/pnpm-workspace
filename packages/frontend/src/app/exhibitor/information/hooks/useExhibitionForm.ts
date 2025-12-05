import { useState, useCallback } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";
import {
  exhibitionFormSchema,
  type ExhibitionFormSchema,
} from "@/app/exhibitor/information/types";
import { useExhibitionApi } from "./useExhibitionApi";

export function useExhibitionForm() {
  const [exhibitionId, setExhibitionId] = useState<string>("");
  const { createExhibition, updateExhibitionInformation, isLoading, error } =
    useExhibitionApi();

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

  /**
   * フォーム送信ハンドラー
   * 新規作成時はcreateExhibition、更新時はupdateExhibitionInformationを呼び出す
   */
  const onSubmit = useCallback(
    async (data: ExhibitionFormSchema) => {
      try {
        if (exhibitionId) {
          // 更新
          await updateExhibitionInformation(exhibitionId, data);
          // 更新時はexhibitionIdは変更されないため、再設定不要
        } else {
          // 新規作成
          const result = await createExhibition(data);
          // レスポンスからexhibitionIdを取得して設定
          if (result?.id) {
            setExhibitionId(result.id);
            setValue("id", result.id);
          }
        }
      } catch (err) {
        console.error("Form submission failed:", err);
        // エラーはuseExhibitionApiで管理されているため、ここではログのみ
        throw err; // エラーを再スローして、呼び出し元で処理できるようにする
      }
    },
    [exhibitionId, createExhibition, updateExhibitionInformation, setValue],
  );

  /**
   * 出展情報をフォームに設定（編集時など）
   */
  const setExhibitionData = useCallback(
    (data: {
      id: string;
      exhibitorName: string;
      title: string;
      category: ExhibitionFormSchema["category"];
      location: string;
      price: number | null;
      requiredTime: number | null;
      comment: string | null;
      image: string | null;
    }) => {
      setExhibitionId(data.id);
      setValue("id", data.id);
      setValue("exhibitorName", data.exhibitorName);
      setValue("title", data.title);
      setValue("category", data.category);
      setValue("location", data.location);
      setValue("price", data.price);
      setValue("requiredTime", data.requiredTime);
      setValue("comment", data.comment || "");
      setValue("image", data.image || "");
    },
    [setValue],
  );

  return {
    form,
    register,
    handleSubmit: handleSubmit(onSubmit),
    setValue,
    watch,
    errors,
    isSubmitting: isSubmitting || isLoading,
    exhibitionId,
    setExhibitionId,
    setExhibitionData,
    onSubmit,
    apiError: error,
  };
}
