"use client";

import { useQueryStates, parseAsString } from "nuqs";
import { CategoryButton } from "@/app/exhibitions/_components/categoryButton";
import { SearchBar } from "@/app/exhibitions/_components/searchBar";
import { ExhibitionItem } from "@/app/exhibitions/_components/exhibitionItem";

export function ExhibitionsContent() {
  // カテゴリのマッピング（表示名 → URLパラメータ）
  const categoryMap = {
    飲食: "Food",
    展示: "Exhibition",
    体験: "Experience",
    ステージ: "Stage",
  } as const;

  const categories = ["飲食", "展示", "体験", "ステージ"] as const;
  const [{ category, search }, setQuery] = useQueryStates({
    category: parseAsString.withDefault(""),
    search: parseAsString.withDefault(""),
  });

  const items = [
    {
      id: 1,
      title: "マルゲリータピザ",
      exhibitorName: "イタリア料理研究会",
      category: "飲食",
      price: 500,
      location: "1号館",
      requiredTime: 15,
      comment: "本格窯焼きピザをお楽しみください",
      arDesign: {
        id: "1",
        url: "https://example.com/ar-design.glb",
      },
      image: "/images/pizza-icon.jpg",
    },
    {
      id: 2,
      title: "特製ラーメン",
      exhibitorName: "ラーメン愛好会",
      category: "飲食",
      price: 400,
      location: "2号館",
      requiredTime: 20,
      comment: "こだわりスープの本格派ラーメン",
      arDesign: {
        id: "2",
        url: "https://example.com/ar-design.glb",
      },
      image: "/images/ramen-icon.jpg",
    },
    {
      id: 3,
      title: "フルーツスムージー",
      exhibitorName: "健康科学サークル",
      category: "飲食",
      price: 300,
      location: "1号館",
      requiredTime: 10,
      comment: "新鮮フルーツのヘルシードリンク",
      arDesign: {
        id: "3",
        url: "https://example.com/ar-design.glb",
      },
      image: "/images/smoothie-icon.jpg",
    },
  ];

  // フィルタリングロジック
  const filteredItems = items.filter((item) => {
    // カテゴリフィルタ（item.categoryは日本語、categoryは英語のパラメータ）
    const itemCategoryParam =
      categoryMap[item.category as keyof typeof categoryMap];
    const matchesCategory = !category || itemCategoryParam === category;

    // 検索フィルタ（名前、組織、説明に部分一致）
    const searchLower = search.toLowerCase();
    const matchesSearch =
      !search || item.title.toLowerCase().includes(searchLower);

    return matchesCategory && matchesSearch;
  });

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
        {filteredItems.map((item) => (
          <ExhibitionItem key={item.id} item={item} />
        ))}
      </div>
    </>
  );
}
