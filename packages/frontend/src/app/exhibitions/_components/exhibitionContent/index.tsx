"use client";

import { useQueryStates, parseAsString } from "nuqs";
import { CategoryButton } from "@/app/exhibitions/_components/categoryButton";
import { SearchBar } from "@/app/exhibitions/_components/searchBar";
import { ExhibitionItem } from "@/app/exhibitions/_components/exhibitionItem";
import { usePublicExhibitions } from "./hooks/usePublicExhibitions";

type Category = "Food" | "Exhibition" | "Experience" | "Stage";

export function ExhibitionsContent() {
  // カテゴリのマッピング（表示名 → URLパラメータ）
  const categoryMap = {
    飲食: "Food",
    展示: "Exhibition",
    体験: "Experience",
    ステージ: "Stage",
  } as const;

  // カテゴリの逆マッピング（APIパラメータ → 日本語表示名）
  const categoryDisplayMap: Record<Category, string> = {
    Food: "飲食",
    Exhibition: "展示",
    Experience: "体験",
    Stage: "ステージ",
  };

  const categories = ["飲食", "展示", "体験", "ステージ"] as const;
  const [{ category, search }, setQuery] = useQueryStates({
    category: parseAsString.withDefault(""),
    search: parseAsString.withDefault(""),
  });

  // APIからデータを取得
  const { data, isLoading, error } = usePublicExhibitions({
    search: search || undefined,
    category: category || undefined,
  });

  // APIから取得したデータを表示用に変換
  const displayItems = data.map((item) => ({
    ...item,
    category: categoryDisplayMap[item.category as Category] || item.category,
  }));

  return (
    <>
      {/* Search Bar */}
      <div className="flex flex-col">
        <SearchBar
          value={search}
          onChange={(value) => setQuery({ search: value })}
          onSearch={(value) => setQuery({ search: value })}
        />

        {/* Category Buttons */}
        <div className="bg-white px-4 py-4">
          <div className="flex gap-3">
            {categories.map((cat) => {
              const categoryParam = categoryMap[cat];
              return (
                <CategoryButton
                  key={cat}
                  category={cat}
                  isSelected={category === categoryParam}
                  onClick={() =>
                    setQuery({
                      category: category === categoryParam ? "" : categoryParam,
                    })
                  }
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Items List */}
      <div className="space-y-4 p-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-gray-500">読み込み中...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-red-500">
              エラーが発生しました: {error.message}
            </p>
          </div>
        ) : displayItems.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-gray-500">出展が見つかりませんでした</p>
          </div>
        ) : (
          displayItems.map((item) => (
            <ExhibitionItem key={item.id} item={item} />
          ))
        )}
      </div>
    </>
  );
}
