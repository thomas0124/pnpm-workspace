"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/button";
import { Save, Share2, Trash2, EyeOff } from "lucide-react";
import { useExhibitionApi } from "../../hooks/useExhibitionApi";
import { ExhibitionFormSchema } from "@/app/exhibitor/information/types";

interface HeaderProps {
  exhibitionId: string;
  onSaveForm: () => Promise<void>;
  onExhibitionDeleted?: () => void;
  formData?: ExhibitionFormSchema;
  isPublished?: boolean;
  onStatusChange?: () => Promise<unknown>;
}

export function Header({
  exhibitionId,
  onSaveForm,
  onExhibitionDeleted,
  formData,
  isPublished = false,
  onStatusChange,
}: HeaderProps) {
  const router = useRouter();
  const {
    createExhibition,
    saveDraft,
    publish,
    unpublish,
    deleteExhibition,
    isLoading,
  } = useExhibitionApi();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleAction = useCallback(
    async (
      action: () => Promise<unknown>,
      successMessage: string,
      errorMessage: string,
      onSuccess?: () => Promise<unknown>,
    ) => {
      try {
        await onSaveForm();

        if (!exhibitionId) {
          alert("出展情報を先に保存してください");
          return;
        }

        await action();
        alert(successMessage);

        // 成功後のコールバックを実行
        if (onSuccess) {
          await onSuccess();
        }
      } catch (err) {
        console.error(`${errorMessage}:`, err);
        const message = err instanceof Error ? err.message : errorMessage;
        alert(message);
      }
    },
    [exhibitionId, onSaveForm],
  );

  const handleSaveDraft = useCallback(async () => {
    try {
      if (!formData) {
        throw new Error("フォームデータが取得できませんでした");
      }

      // フォームデータの検証
      if (
        !formData.exhibitorName ||
        !formData.title ||
        !formData.category ||
        !formData.location
      ) {
        alert(
          "必須項目（サークル名、タイトル、カテゴリ、場所）を入力してください",
        );
        return;
      }

      // 新規作成の場合は直接createExhibitionを呼び出す
      if (!exhibitionId) {
        await createExhibition(formData);
        alert("下書きとして保存しました");
        return;
      }

      // 既存の場合はsaveDraftを呼び出す
      await saveDraft(exhibitionId);
      alert("下書きとして保存しました");
    } catch (err) {
      console.error("下書き保存に失敗しました:", err);
      const message =
        err instanceof Error ? err.message : "下書き保存に失敗しました";
      alert(message);
    }
  }, [exhibitionId, createExhibition, formData, onSaveForm]);

  const handlePublish = useCallback(() => {
    return handleAction(
      () => publish(exhibitionId),
      "公開しました",
      "公開に失敗しました",
      onStatusChange,
    );
  }, [exhibitionId, publish, handleAction, onStatusChange]);

  const handleUnpublish = useCallback(() => {
    return handleAction(
      () => unpublish(exhibitionId),
      "非公開にしました",
      "非公開に失敗しました",
      onStatusChange,
    );
  }, [exhibitionId, unpublish, handleAction, onStatusChange]);

  const handleDelete = useCallback(async () => {
    if (!exhibitionId) {
      alert("削除する出展がありません");
      return;
    }

    const confirmed = window.confirm(
      "本当にこの出展を削除しますか？この操作は取り消せません。",
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteExhibition(exhibitionId);
      alert("削除しました");
      if (onExhibitionDeleted) {
        onExhibitionDeleted();
      } else {
        router.push("/exhibitor/information");
      }
    } catch (err) {
      console.error("削除に失敗しました:", err);
      const message = err instanceof Error ? err.message : "削除に失敗しました";
      alert(message);
    } finally {
      setIsDeleting(false);
    }
  }, [exhibitionId, deleteExhibition, onExhibitionDeleted, router]);

  const isProcessing = isLoading || isDeleting;

  return (
    <header className="border-b border-gray-200 bg-white px-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-medium text-gray-900">
          えあパンフ - 出展者管理
        </h1>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            color="gray"
            onClick={handleSaveDraft}
            disabled={isProcessing}
          >
            <Save className="h-4 w-4" />
            下書き保存
          </Button>
          <Button
            color="teal"
            onClick={isPublished ? handleUnpublish : handlePublish}
            disabled={isProcessing}
          >
            {isPublished ? (
              <>
                <EyeOff className="h-4 w-4" />
                非公開
              </>
            ) : (
              <>
                <Share2 className="h-4 w-4" />
                公開
              </>
            )}
          </Button>
          <Button
            variant="outline"
            color="red"
            onClick={handleDelete}
            disabled={isProcessing || !exhibitionId}
          >
            <Trash2 className="h-4 w-4" />
            出展取り消し
          </Button>
        </div>
      </div>
    </header>
  );
}
