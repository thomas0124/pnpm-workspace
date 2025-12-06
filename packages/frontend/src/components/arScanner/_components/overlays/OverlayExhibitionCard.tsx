"use client";

import { useEffect, useState } from "react";
import { usePublicExhibitions } from "@/app/exhibitions/_components/exhibitionContent/hooks/usePublicExhibitions";
import { ExhibitionPreview } from "@/components/exhibitionPreview";
import { Spinner } from "@/components/ui/spinner";
import type { ExhibitionFormSchema } from "@/app/exhibitor/information/types";

// UI表示用の型定義
type DisplayItem = ExhibitionFormSchema & {
  displayCategory: string;
};

interface OverlayExhibitionCardProps {
  markerId: number;
}

export function OverlayExhibitionCard({ markerId }: OverlayExhibitionCardProps) {
  // 展示データをAPIから取得
  const { data, isLoading } = usePublicExhibitions();
  const [displayItem, setDisplayItem] = useState<DisplayItem | null>(null);

  useEffect(() => {
    if (!data) return;

    // TODO: 本来は展示データに `markerId` を持たせて紐付けるべきですが、
    // ここでは簡易的に (markerId - 1) 番目の展示データを表示するロジックにしています。
    const index = markerId - 1;
    const item = data[index];

    if (item) {
      // カテゴリの日本語変換マップ
      const categoryDisplayMap: Record<string, string> = {
        Food: "飲食",
        Exhibition: "展示",
        Experience: "体験",
        Stage: "ステージ",
      };

      // ExhibitionPreviewに渡すデータ形式へ変換
      const formattedItem: DisplayItem = {
        id: item.id,
        exhibitorName: item.exhibitorName,
        title: item.title,
        category: item.category as any,
        location: item.location,
        price: item.price,
        requiredTime: item.requiredTime,
        comment: item.comment,
        image: item.image,
        displayCategory: categoryDisplayMap[item.category] || item.category,
      };

      setDisplayItem(formattedItem);
    } else {
      setDisplayItem(null);
    }
  }, [data, markerId]);

  if (isLoading) {
    return (
      <div className="absolute bottom-36 left-0 right-0 flex justify-center z-40">
        <div className="rounded-full bg-slate-900/50 p-2 backdrop-blur">
          <Spinner className="h-6 w-6 text-white" />
        </div>
      </div>
    );
  }

  if (!displayItem) {
    return (
      <div className="absolute bottom-36 left-4 right-4 z-40 animate-in slide-in-from-bottom-4 fade-in duration-500">
        <div className="rounded-xl bg-white/90 p-4 text-center shadow-lg backdrop-blur">
          <p className="font-bold text-slate-800">No Data</p>
          <p className="text-sm text-slate-600">
            ID: {markerId} の展示情報が見つかりません
          </p>
        </div>
      </div>
    );
  }

  return (
    // 画面下部（再スキャンボタンの上）にカードを表示
    <div className="absolute bottom-36 left-4 right-4 z-40 animate-in slide-in-from-bottom-8 fade-in duration-500 md:left-1/2 md:w-96 md:-translate-x-1/2 md:right-auto">
      <ExhibitionPreview item={displayItem} />
    </div>
  );
}