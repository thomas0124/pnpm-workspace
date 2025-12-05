import { useState, useCallback, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";
import useSWR from "swr";
import {
  exhibitionFormSchema,
  type ExhibitionFormSchema,
} from "@/app/exhibitor/information/types";
import { useExhibitionApi } from "./useExhibitionApi";
import { AUTH_TOKEN_KEY } from "../constants";

type ExhibitionDto = {
  id: string;
  exhibitorId: string;
  exhibitionInformationId: string | null;
  exhibitionInformation: {
    id: string;
    exhibitorId: string;
    exhibitorName: string;
    title: string;
    category: ExhibitionFormSchema["category"];
    location: string;
    price: number | null;
    requiredTime: number | null;
    comment: string | null;
    image: string | null;
  } | null;
  isDraft: boolean;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

type ExhibitionFormData = {
  id: string;
  exhibitorName: string;
  title: string;
  category: ExhibitionFormSchema["category"];
  location: string;
  price: number | null;
  requiredTime: number | null;
  comment: string | null;
  image: string | null;
};

/**
 * 認証トークンを取得
 */
function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(AUTH_TOKEN_KEY);
}

/**
 * useSWR用のfetcher関数
 */
async function fetcherMyExhibition(
  getMyExhibition: () => Promise<ExhibitionDto | null>,
): Promise<ExhibitionDto | null> {
  return getMyExhibition();
}

/**
 * ExhibitionDtoからフォームデータに変換
 */
function toFormData(dto: ExhibitionDto): ExhibitionFormData | null {
  if (!dto.exhibitionInformation) return null;

  const info = dto.exhibitionInformation;
  return {
    id: dto.id,
    exhibitorName: info.exhibitorName,
    title: info.title,
    category: info.category,
    location: info.location,
    price: info.price,
    requiredTime: info.requiredTime,
    comment: info.comment,
    image: info.image,
  };
}

export function useExhibitionForm() {
  const [exhibitionId, setExhibitionId] = useState<string>("");
  const {
    createExhibition,
    updateExhibitionInformation,
    getMyExhibition,
    isLoading,
    error,
  } = useExhibitionApi();

  // 認証トークンの存在確認
  const authToken = getAuthToken();

  // useSWRで出展情報を取得
  const {
    data: exhibitionData,
    isLoading: isLoadingExhibition,
    error: exhibitionError,
  } = useSWR<ExhibitionDto | null, Error>(
    authToken ? ["my-exhibition", authToken] : null,
    () => fetcherMyExhibition(getMyExhibition),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

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
   * 出展情報をフォームに設定
   */
  const setExhibitionData = useCallback(
    (data: ExhibitionFormData) => {
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

  /**
   * フォーム送信ハンドラー
   * 新規作成時はcreateExhibition、更新時はupdateExhibitionInformationを呼び出す
   */
  const onSubmit = useCallback(
    async (data: ExhibitionFormSchema) => {
      try {
        if (exhibitionId) {
          await updateExhibitionInformation(exhibitionId, data);
        } else {
          const result = await createExhibition(data);
          if (result?.id) {
            setExhibitionId(result.id);
            setValue("id", result.id);
          }
        }
      } catch (err) {
        console.error("Form submission failed:", err);
        throw err;
      }
    },
    [exhibitionId, createExhibition, updateExhibitionInformation, setValue],
  );

  // 取得した出展情報をフォームに設定
  useEffect(() => {
    if (!exhibitionData || exhibitionId) return;

    const formData = toFormData(exhibitionData);
    if (formData) {
      setExhibitionData(formData);
    }
  }, [exhibitionData, exhibitionId, setExhibitionData]);

  // エラーメッセージを文字列に変換
  const apiError =
    error ||
    (exhibitionError instanceof Error
      ? exhibitionError.message
      : exhibitionError
        ? String(exhibitionError)
        : null);

  return {
    form,
    register,
    handleSubmit: handleSubmit(onSubmit),
    setValue,
    watch,
    errors,
    isSubmitting: isSubmitting || isLoading,
    isLoadingExhibition,
    exhibitionId,
    setExhibitionId,
    setExhibitionData,
    onSubmit,
    apiError,
  };
}
