"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function FoodPage() {
  const router = useRouter();
  const filters = ["すべて", "場所", "¥ 価格", "並替"];
  const [selected, setSelected] = useState("すべて");

  const items = [
    {
      name: "マルゲリータピザ",
      group: "イタリア料理研究会",
      price: "¥500",
      building: "1号館",
      desc: "本格窯焼きピザをお楽しみください",
      icon: "/food/pizza.png",
    },
    {
      name: "特製ラーメン",
      group: "ラーメン愛好会",
      price: "¥400",
      building: "2号館",
      desc: "こだわりスープの本格派ラーメン",
      icon: "/food/ramen.png",
    },
    {
      name: "フルーツスムージー",
      group: "健康科学サークル",
      price: "¥300",
      building: "1号館",
      desc: "新鮮フルーツのヘルシードリンク",
      icon: "/food/smoothie.png",
    },
    {
      name: "手作りケーキ",
      group: "製菓研究会",
      price: "¥350",
      building: "3号館",
      desc: "自家製スイーツをご賞味ください",
      icon: "/food/cake.png",
    },
  ];

  return (
    <main className="flex flex-col items-center w-full min-h-screen bg-white relative">
      {/* Header */}
      <div className="w-full max-w-md px-6 pt-8 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <button onClick={() => router.back()}>
            <Image src="/icons/back.png" alt="back" width={22} height={22} />
          </button>
          <h1 className="text-xl font-semibold">飲食</h1>
        </div>
        <span className="text-sm text-red-500">28件</span>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 w-full max-w-md px-6 mt-4 overflow-x-auto no-scrollbar">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setSelected(f)}
            className={`px-4 py-1 text-sm rounded-full border ${
              selected === f
                ? "bg-red-400 text-white border-red-400"
                : "bg-white text-gray-600 border-gray-300"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Food Cards */}
      <div className="w-full max-w-md px-5 mt-5 pb-28 space-y-3">
        {items.map((item, i) => (
          <div
            key={i}
            className="flex items-start bg-white rounded-2xl px-4 py-4 shadow-sm border border-gray-100"
          >
            <div
              className="flex justify-center items-center rounded-xl w-16 h-16 mr-4"
              style={{ backgroundColor: "#FFED9B" }}
            >
              <Image src={item.icon} alt={item.name} width={36} height={36} />
            </div>

            <div className="flex flex-col flex-1">
              <h2 className="text-lg font-semibold">{item.name}</h2>
              <p className="text-sm text-gray-500">{item.group}</p>

              {/* price + place */}
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-white bg-red-400 px-2 py-0.5 rounded-full font-medium">
                  {item.price}
                </span>
                <span className="text-xs text-teal-700 bg-teal-100 px-2 py-0.5 rounded-full font-medium">
                  {item.building}
                </span>
              </div>

              <p className="text-sm text-gray-600 mt-1">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 w-full max-w-md bg-white border-t shadow-md flex justify-between px-12 py-2 text-xs">
        <button className="flex flex-col items-center text-gray-500">
          <Image src="/icons/home.png" alt="home" width={22} height={22} />
          ホーム
        </button>
        <button className="flex flex-col items-center text-red-500 font-bold">
          <Image src="/icons/list.png" alt="list" width={22} height={22} />
          一覧
        </button>
      </div>

      {/* Floating Camera Button */}
      <button className="fixed bottom-16 flex justify-center items-center shadow-lg bg-teal-400 w-16 h-16 rounded-full">
        <Image src="/icons/camera.png" alt="camera" width={30} height={30} />
      </button>
    </main>
  );
}
