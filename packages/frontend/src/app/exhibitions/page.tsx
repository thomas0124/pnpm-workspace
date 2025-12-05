"use client";

import { Search, Clock, MapPin, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState } from "react";
import { CategoryButton } from "./_components/categoryButton";

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
        <div className="bg-white p-4">
          <div className="relative rounded-lg border">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="出展を検索..."
              className="border-gray-200 bg-gray-50 pl-10 text-base focus-visible:ring-0 focus-visible:ring-gray-300 focus-visible:ring-offset-0"
            />
          </div>
        </div>

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
          <div
            key={item.id}
            className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
          >
            <div className="flex gap-4">
              {/* Icon */}
              <div className="flex-shrink-0">
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-yellow-400 text-4xl">
                  <img
                    src={item.icon || "/placeholder.svg"}
                    alt={item.name}
                    className="h-16 w-16 object-contain"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <h3 className="mb-1 text-lg text-gray-900">{item.name}</h3>
                <p className="mb-3 text-sm text-gray-600">
                  {item.organization}
                </p>

                {/* Tags */}
                <div className="mb-3 flex flex-wrap gap-2">
                  <span className="inline-flex items-center rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs text-red-500">
                    {item.category}
                  </span>
                  <span className="inline-flex items-center rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-medium text-orange-600">
                    ¥{item.price}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs text-cyan-600">
                    <MapPin className="h-3 w-3" />
                    {item.location}
                  </span>
                </div>

                {/* Duration */}
                <div className="mb-2 inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>{item.duration}</span>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-700">{item.description}</p>
              </div>
            </div>
          </div>
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
