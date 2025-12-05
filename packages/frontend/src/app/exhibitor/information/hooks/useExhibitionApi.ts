import { useState, useCallback } from "react";
import client from "@/lib/apiClient";
import { AUTH_TOKEN_KEY } from "../constants";
import type { ExhibitionFormSchema } from "../types";
import type { ExhibitionDto } from "@/types/exhibitions";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

/**
 * Base64文字列からBlobに変換
 */
function base64ToBlob(base64: string, mimeType: string = "image/png"): Blob {
  // data:image/png;base64, のプレフィックスを除去
  const base64Data = base64.includes(",") ? base64.split(",")[1] : base64;
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
}

/**
 * 認証ヘッダーを取得
 */
function getAuthHeader(): { authorization: string } {
  // ブラウザ環境のチェックを追加
  if (typeof window === "undefined") {
    throw new Error(
      "認証トークンが取得できませんでした（サーバーサイドでは実行できません）",
    );
  }

  const token = sessionStorage.getItem(AUTH_TOKEN_KEY);
  if (!token) {
    // デバッグ用：sessionStorageの内容を確認
    console.error("AUTH_TOKEN_KEY:", AUTH_TOKEN_KEY);
    console.error("sessionStorage keys:", Object.keys(sessionStorage));
    throw new Error("認証トークンが取得できませんでした");
  }
  return {
    authorization: `Bearer ${token}`,
  };
}

/**
 * エラーレスポンスからメッセージを抽出
 */
function extractErrorMessage(errorData: unknown): string {
  if (
    errorData &&
    typeof errorData === "object" &&
    "message" in errorData &&
    typeof errorData.message === "string"
  ) {
    return errorData.message;
  }
  return "";
}

/**
 * フォームデータからFormDataを構築（新規作成用）
 */
function buildFormData(data: ExhibitionFormSchema): FormData {
  const formData = new FormData();

  // 必須フィールド
  formData.append("exhibitorName", data.exhibitorName);
  formData.append("title", data.title);
  formData.append("category", data.category);
  formData.append("location", data.location);

  // オプショナルフィールド
  if (data.price !== null && data.price !== undefined) {
    formData.append("price", data.price.toString());
  }
  if (data.requiredTime !== null && data.requiredTime !== undefined) {
    formData.append("requiredTime", data.requiredTime.toString());
  }
  if (
    data.comment !== null &&
    data.comment !== undefined &&
    data.comment !== ""
  ) {
    formData.append("comment", data.comment);
  }

  // 画像データ
  if (data.image && data.image.trim() !== "") {
    const mimeType =
      data.image.match(/data:([^;]+);base64,/)?.[1] || "image/png";
    const blob = base64ToBlob(data.image, mimeType);
    formData.append("image", blob, "image.png");
  }

  return formData;
}

/**
 * フォームデータからFormDataを構築（更新用・部分更新対応）
 */
function buildFormDataForUpdate(data: Partial<ExhibitionFormSchema>): FormData {
  const formData = new FormData();

  // 部分更新のため、値が存在する場合のみ追加
  if (data.exhibitorName !== undefined) {
    formData.append("exhibitorName", data.exhibitorName);
  }
  if (data.title !== undefined) {
    formData.append("title", data.title);
  }
  if (data.category !== undefined) {
    formData.append("category", data.category);
  }
  if (data.location !== undefined) {
    formData.append("location", data.location);
  }
  if (data.price !== undefined && data.price !== null) {
    formData.append("price", data.price.toString());
  }
  if (data.requiredTime !== undefined && data.requiredTime !== null) {
    formData.append("requiredTime", data.requiredTime.toString());
  }
  if (data.comment !== undefined) {
    formData.append("comment", data.comment || "");
  }

  // 画像の処理
  if (data.image !== undefined) {
    if (data.image && data.image.trim() !== "") {
      const mimeType =
        data.image.match(/data:([^;]+);base64,/)?.[1] || "image/png";
      const blob = base64ToBlob(data.image, mimeType);
      formData.append("image", blob, "image.png");
    } else {
      // 画像を削除する場合は空のBlobを送信
      formData.append("image", new Blob(), "");
    }
  }

  return formData;
}

/**
 * 出展情報管理API呼び出し用フック
 */
export function useExhibitionApi() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * 出展情報の新規作成
   */
  const createExhibition = useCallback(async (data: ExhibitionFormSchema) => {
    setIsLoading(true);
    setError(null);

    try {
      const token = sessionStorage.getItem(AUTH_TOKEN_KEY);
      if (!token) {
        throw new Error("認証トークンが取得できませんでした");
      }

      const formData = buildFormData(data);

      const response = await fetch(`${API_BASE_URL}/exhibitions`, {
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          extractErrorMessage(errorData) || "出展情報の作成に失敗しました",
        );
      }

      const result = await response.json();
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "出展情報の作成に失敗しました";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * 出展情報の取得
   */
  const getExhibition = useCallback(async (exhibitionId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const header = getAuthHeader();

      const response = await client.exhibitions[":exhibitionId"].$get({
        param: { exhibitionId },
        header,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          extractErrorMessage(errorData) || "出展情報の取得に失敗しました",
        );
      }

      const result = await response.json();
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "出展情報の取得に失敗しました";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * 認証済み出展者の出展情報の取得
   */
  const getMyExhibition =
    useCallback(async (): Promise<ExhibitionDto | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const header = getAuthHeader();

        const response = await client.exhibitions.me.$get({
          header,
        });

        if (!response.ok) {
          // 404の場合は出展情報が存在しないため、nullを返す
          if (response.status === 404) {
            return null;
          }
          const errorData = await (response as Response)
            .json()
            .catch(() => ({}));
          throw new Error(
            extractErrorMessage(errorData) || "出展情報の取得に失敗しました",
          );
        }

        const result = (await response.json()) as ExhibitionDto;
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "出展情報の取得に失敗しました";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    }, []);

  /**
   * 出展情報の更新
   */
  const updateExhibitionInformation = useCallback(
    async (exhibitionId: string, data: Partial<ExhibitionFormSchema>) => {
      setIsLoading(true);
      setError(null);

      try {
        const formData = buildFormDataForUpdate(data);

        // FormDataの内容を確認
        const formDataEntries: Record<string, string> = {};
        Array.from(formData.keys()).forEach((key) => {
          const value = formData.get(key);
          if (value instanceof File) {
            formDataEntries[key] = `File(${value.name}, ${value.size} bytes)`;
          } else {
            formDataEntries[key] = String(value);
          }
        });

        // Honoクライアントの型定義の問題を回避するため、fetchを直接使用
        const token = sessionStorage.getItem(AUTH_TOKEN_KEY);
        const url = `${API_BASE_URL}/exhibitions/${exhibitionId}/information`;

        const response = await fetch(url, {
          method: "PUT",
          headers: {
            authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            extractErrorMessage(errorData) || "出展情報の更新に失敗しました",
          );
        }

        const result = await response.json();
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "出展情報の更新に失敗しました";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  /**
   * 下書き保存
   */
  const saveDraft = useCallback(async (exhibitionId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const header = getAuthHeader();

      const response = await client.exhibitions[":exhibitionId"].draft.$put({
        param: { exhibitionId },
        header,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          extractErrorMessage(errorData) || "下書き保存に失敗しました",
        );
      }

      const result = await response.json();
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "下書き保存に失敗しました";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * 公開
   */
  const publish = useCallback(async (exhibitionId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const header = getAuthHeader();

      const response = await client.exhibitions[":exhibitionId"].publish.$put({
        param: { exhibitionId },
        header,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(extractErrorMessage(errorData) || "公開に失敗しました");
      }

      const result = await response.json();
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "公開に失敗しました";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * 非公開
   */
  const unpublish = useCallback(async (exhibitionId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const header = getAuthHeader();

      const response = await client.exhibitions[":exhibitionId"].unpublish.$put(
        {
          param: { exhibitionId },
          header,
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          extractErrorMessage(errorData) || "非公開に失敗しました",
        );
      }

      const result = await response.json();
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "非公開に失敗しました";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * 削除
   */
  const deleteExhibition = useCallback(async (exhibitionId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const header = getAuthHeader();

      const response = await client.exhibitions[":exhibitionId"].$delete({
        param: { exhibitionId },
        header,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(extractErrorMessage(errorData) || "削除に失敗しました");
      }

      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "削除に失敗しました";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    createExhibition,
    getExhibition,
    getMyExhibition,
    updateExhibitionInformation,
    saveDraft,
    publish,
    unpublish,
    deleteExhibition,
    isLoading,
    error,
  };
}
