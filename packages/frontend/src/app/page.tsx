"use client";

import { message } from "@uttk/backend";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [search, setSearch] = useState("");

  const categories = [
    {
      title: "飲食",
      subtitle: "フードやドリンクの出展",
      count: "28件の出展",
      color: "#FFE19B",
      icon: "/icons/food.png",
    },
    {
      title: "展示",
      subtitle: "アート・研究発表など",
      count: "15件の出展",
      color: "#A6E6E1",
      icon: "/icons/exhibit.png",
    },
    {
      title: "体験",
      subtitle: "ゲーム・ワークショップなど",
      count: "22件の出展",
      color: "#BDE3FF",
      icon: "/icons/game.png",
    },
    {
      title: "ステージ",
      subtitle: "ライブ・パフォーマンスなど",
      count: "12件の出展",
      color: "#FFB7B7",
      icon: "/icons/stage.png",
    },
  ];

  return (
    <main className="flex flex-col items-center min-h-screen w-full bg-white p-6 pb-24">
      {/* 元の message をヘッダーに活用 */}
      <h1 className="text-2xl font-bold text-blue-500 mb-1">{message}</h1>
      <p className="text-sm text-gray-500 mb-4">カテゴリから出展を探す</p>

      {/* 検索 */}
      <input
        type="text"
        placeholder="出展を検索…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-md bg-gray-100 rounded-xl py-3 px-4 mb-4"
      />

      {/* カテゴリ一覧 */}
      <div className="w-full max-w-md space-y-3">
        {categories.map((cat, index) => (
          <button
            key={index}
            className="w-full flex items-center bg-white shadow-sm rounded-2xl px-4 py-3 hover:bg-gray-50 transition"
          >
            <div
              className="flex justify-center items-center rounded-xl w-14 h-14 mr-4"
              style={{ backgroundColor: cat.color }}
            >
              <Image src={cat.icon} alt={cat.title} width={32} height={32} />
            </div>

            <div className="flex flex-col flex-1 text-left">
              <span className="text-lg font-semibold">{cat.title}</span>
              <span className="text-sm text-gray-500">{cat.subtitle}</span>
              <span className="text-sm text-rose-500">{cat.count}</span>
            </div>

            <span className="text-2xl text-gray-300">›</span>
          </button>
        ))}
      </div>

      {/* 下部ナビゲーション */}
      <div className="fixed bottom-0 w-full max-w-md bg-white border-t flex justify-around py-3 text-sm">
        <span className="text-rose-500 font-bold">ホーム</span>
        <span className="text-gray-500">一覧</span>
        <span className="text-gray-500">AR</span>
      </div>
    </main>
  );
}
