"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/button";
import { Save, Share2, Trash2 } from "lucide-react";
import { useExhibitionApi } from "../../hooks/useExhibitionApi";

interface HeaderProps {
  exhibitionId: string;
  onSaveForm: () => Promise<void>;
  onExhibitionDeleted?: () => void;
}

export function Header({
  exhibitionId,
  onSaveForm,
  onExhibitionDeleted,
}: HeaderProps) {
  const router = useRouter();
  const { saveDraft, publish, deleteExhibition, isLoading } =
    useExhibitionApi();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleAction = useCallback(
    async (
      action: () => Promise<unknown>,
      successMessage: string,
      errorMessage: string,
    ) => {
      try {
        // まずフォームデータを保存
        await onSaveForm();

        if (!exhibitionId) {
          alert("出展情報を先に保存してください");
          return;
        }

        // その後、アクションを実行
        await action();
        alert(successMessage);
      } catch (err) {
        console.error(`${errorMessage}:`, err);
        const message = err instanceof Error ? err.message : errorMessage;
        alert(message);
      }
    },
    [exhibitionId, onSaveForm],
  );

  const handleSaveDraft = useCallback(() => {
    return handleAction(
      () => saveDraft(exhibitionId),
      "下書きとして保存しました",
      "下書き保存に失敗しました",
    );
  }, [exhibitionId, saveDraft, handleAction]);

  const handlePublish = useCallback(() => {
    return handleAction(
      () => publish(exhibitionId),
      "公開しました",
      "公開に失敗しました",
    );
  }, [exhibitionId, publish, handleAction]);

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
          <Button color="teal" onClick={handlePublish} disabled={isProcessing}>
            <Share2 className="h-4 w-4" />
            公開
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
