"use client";

import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { CategoryButton } from "./_components/categoryButton";
import { SearchBar } from "./_components/searchBar";
import { ExhibitionItem } from "./_components/exhibitionItem";

export default function EventsPage() {
  const categories = ["飲食", "展示", "体験", "ステージ"];
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const items = [
    {
      id: 1,
      name: "マルゲリータピザ",
      organization: "イタリア料理研究会",
      category: "飲食",
      price: 500,
      location: "1号館",
      duration: "約15分",
      description: "本格窯焼きピザをお楽しみください",
      icon: "/images/pizza-icon.jpg",
    },
    {
      id: 2,
      name: "特製ラーメン",
      organization: "ラーメン愛好会",
      category: "飲食",
      price: 400,
      location: "2号館",
      duration: "約20分",
      description: "こだわりスープの本格派ラーメン",
      icon: "/images/ramen-icon.jpg",
    },
    {
      id: 3,
      name: "フルーツスムージー",
      organization: "健康科学サークル",
      category: "飲食",
      price: 300,
      location: "1号館",
      duration: "約10分",
      description: "新鮮フルーツのヘルシードリンク",
      icon: "/images/smoothie-icon.jpg",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Search Bar */}
      <div className="flex flex-col">
        <SearchBar />

        {/* Category Buttons */}
        <div className="bg-white px-4 py-4">
          <div className="flex gap-3">
            {categories.map((category) => (
              <CategoryButton
                key={category}
                category={category}
                isSelected={selectedCategory === category}
                onClick={() => setSelectedCategory(category)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Items List */}
      <div className="space-y-4 p-4">
        {items.map((item) => (
          <ExhibitionItem key={item.id} item={item} />
        ))}
      </div>

      {/* Floating Camera Button */}
      <Link href="/arscanner">
        <Button
          size="icon"
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-teal-500 shadow-2xl hover:bg-teal-600"
          style={{
            boxShadow:
              "0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 0 20px rgba(0, 0, 0, 0.2)",
          }}
        >
          <Camera className="h-12 w-12 text-white" />
        </Button>
      </Link>
    </div>
  );
}
