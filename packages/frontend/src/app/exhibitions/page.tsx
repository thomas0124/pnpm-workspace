"use client"

import { Search, Clock, MapPin, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export default function EventsPage() {
  const categories = ["飲食", "展示", "体験", "ステージ"]

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
  ]

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Search Bar */}
      <div className="bg-white p-4 border-b-4 border-blue-500">
        <div className="relative border-2 border-blue-500 rounded-lg">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            placeholder="出展を検索..."
            className="pl-10 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
          />
        </div>
      </div>

      {/* Category Buttons */}
      <div className="bg-white px-4 py-4 border-b">
        <div className="flex gap-3 overflow-x-auto">
          {categories.map((category, index) => (
            <Button
              key={category}
              variant={index === 0 ? "default" : "outline"}
              className={`rounded-full px-6 whitespace-nowrap ${
                index === 0
                  ? "bg-red-400 hover:bg-red-500 text-white"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Items List */}
      <div className="p-4 space-y-4">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex gap-4">
              {/* Icon */}
              <div className="flex-shrink-0">
                <div className="w-24 h-24 bg-yellow-400 rounded-2xl flex items-center justify-center text-4xl">
                  <img src={item.icon || "/placeholder.svg"} alt={item.name} className="w-16 h-16 object-contain" />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-gray-900 mb-1">{item.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{item.organization}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-red-50 text-red-500 border border-red-200">
                    {item.category}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-orange-50 text-orange-600 border border-orange-200 font-medium">
                    ¥{item.price}
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-cyan-50 text-cyan-600 border border-cyan-200">
                    <MapPin className="h-3 w-3" />
                    {item.location}
                  </span>
                </div>

                {/* Duration */}
                <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
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
          size="lg"
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-teal-500 hover:bg-teal-600 shadow-lg"
        >
          <Camera className="h-6 w-6" />
        </Button>
      </Link>
    </div>
  )
}
