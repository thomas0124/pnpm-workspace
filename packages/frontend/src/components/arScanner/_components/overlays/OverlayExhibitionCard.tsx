"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { usePublicExhibitions } from "@/app/exhibitions/_components/exhibitionContent/hooks/usePublicExhibitions";
import { ExhibitionPreview } from "@/components/exhibitionPreview";
import { Spinner } from "@/components/ui/spinner";
import type { ExhibitionFormSchema } from "@/app/exhibitor/information/types";

type DisplayItem = ExhibitionFormSchema & {
  displayCategory: string;
};

interface OverlayExhibitionCardProps {
  markerId: number;
  onClose: () => void;
}

export function OverlayExhibitionCard({
  markerId,
  onClose,
}: OverlayExhibitionCardProps) {
  const { data, isLoading } = usePublicExhibitions();
  const [displayItem, setDisplayItem] = useState<DisplayItem | null>(null);

  useEffect(() => {
    if (!data) return;

    // 簡易的に (markerId - 1) 番目のデータを取得
    const index = markerId - 1;
    const item = data[index];

    if (item) {
      const categoryDisplayMap: Record<string, string> = {
        Food: "飲食",
        Exhibition: "展示",
        Experience: "体験",
        Stage: "ステージ",
      };

      const formattedItem: DisplayItem = {
        ...item,
        category: item.category as any,
        displayCategory: categoryDisplayMap[item.category] || item.category,
      };

      setDisplayItem(formattedItem);
    } else {
      setDisplayItem(null);
    }
  }, [data, markerId]);

  if (isLoading) {
    return (
      <div className="absolute bottom-36 left-0 right-0 z-40 flex justify-center">
        <div className="rounded-full bg-slate-900/50 p-2 backdrop-blur">
          <Spinner className="h-6 w-6 text-white" />
        </div>
      </div>
    );
  }

  // データがない場合の表示
  if (!displayItem) {
    return (
      <div className="absolute bottom-36 left-4 right-4 z-40 duration-500 animate-in fade-in slide-in-from-bottom-4">
        <div className="relative rounded-xl bg-white/90 p-4 text-center shadow-lg backdrop-blur">
          <button
            onClick={onClose}
            className="absolute right-2 top-2 rounded-full p-1 text-slate-500 hover:bg-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
          <p className="font-bold text-slate-800">No Data</p>
          <p className="text-sm text-slate-600">
            ID: {markerId} の展示情報が見つかりません
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute bottom-36 left-4 right-4 z-40 duration-500 animate-in fade-in slide-in-from-bottom-8 md:left-1/2 md:right-auto md:w-96 md:-translate-x-1/2">
      <div className="relative">
        {/* 閉じるボタン */}
        <button
          onClick={onClose}
          className="absolute -right-2 -top-2 z-50 rounded-full bg-slate-900 p-2 text-white shadow-lg transition-colors hover:bg-slate-700"
          aria-label="閉じる"
        >
          <X className="h-4 w-4" />
        </button>

        {/* カード本体 */}
        <ExhibitionPreview item={displayItem} />
      </div>
    </div>
  );
}
