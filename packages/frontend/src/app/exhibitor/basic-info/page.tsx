"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Save, Share2, Trash2, Upload, LogOut, FileText, MapPin, Clock, DollarSign } from "lucide-react"

export default function BasicInfoPage() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState("飲食")
  const [selectedArDesign, setSelectedArDesign] = useState("なし")
  const [title, setTitle] = useState("マルゲリータピザ")
  const [circleName, setCircleName] = useState("イタリア料理研究会")
  const [location, setLocation] = useState("1号館 201")
  const [price, setPrice] = useState("500")
  const [duration, setDuration] = useState("約15分")
  const [description, setDescription] = useState("")

  const categories = ["飲食", "展示", "体験", "ステージ"]
  const arDesigns = ["なし", "1番", "2番", "3番"]

  const handleLogout = () => {
    sessionStorage.removeItem("isLoggedIn")
    sessionStorage.removeItem("userName")
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-medium text-gray-900">デジタルパンフレット - 出展者管理</h1>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2 border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent">
              <Save className="h-4 w-4" />
              下書き保存
            </Button>
            <Button className="gap-2 bg-teal-400 hover:bg-teal-500 text-white">
              <Share2 className="h-4 w-4" />
              公開
            </Button>
            <Button variant="outline" className="gap-2 border-red-400 text-red-400 hover:bg-red-50 bg-transparent">
              <Trash2 className="h-4 w-4" />
              出展取り消し
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-73px)]">
          <div className="p-4">
            <div className="mb-4">
              <h2 className="text-xs font-medium text-gray-500 mb-2">メニュー</h2>
              <button className="w-full flex items-center gap-2 px-4 py-3 bg-orange-50 border-l-4 border-orange-400 text-orange-600 rounded-r">
                <FileText className="h-4 w-4" />
                <span className="text-sm font-medium">基本情報</span>
              </button>
            </div>
          </div>
          <div className="absolute bottom-4 left-4">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
            >
              <LogOut className="h-4 w-4" />
              ログアウト
            </button>
          </div>
        </aside>

        <main className="flex-1 p-8">
          <div className="max-w-[1400px] mx-auto">
            <div className="grid grid-cols-3 gap-8">
              <div className="col-span-2">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-1">基本情報の入力</h2>
                    <p className="text-sm text-gray-600">出展の基本情報を入力してください</p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">カテゴリ</label>
                      <div className="flex gap-2">
                        {categories.map((category) => (
                          <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                              selectedCategory === category
                                ? "bg-red-400 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                          >
                            {category}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                          出展タイトル
                        </label>
                        <Input
                          id="title"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          className="bg-gray-50 border-gray-200"
                        />
                      </div>
                      <div>
                        <label htmlFor="circle" className="block text-sm font-medium text-gray-700 mb-2">
                          サークル名
                        </label>
                        <Input
                          id="circle"
                          value={circleName}
                          onChange={(e) => setCircleName(e.target.value)}
                          className="bg-gray-50 border-gray-200"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">写真</label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-gray-400 transition-colors cursor-pointer">
                        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                        <p className="text-sm text-gray-600 mb-1">クリックして写真をアップロード</p>
                        <p className="text-xs text-gray-400">PNG, JPG, GIF (最大 5MB)</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                          <MapPin className="h-4 w-4 inline mr-1" />
                          場所
                        </label>
                        <Input
                          id="location"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          className="bg-gray-50 border-gray-200"
                        />
                      </div>
                      <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                          <DollarSign className="h-4 w-4 inline mr-1" />
                          金額
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">¥</span>
                          <Input
                            id="price"
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="bg-gray-50 border-gray-200 pl-8"
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                        <Clock className="h-4 w-4 inline mr-1" />
                        所要時間
                      </label>
                      <Input
                        id="duration"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        className="bg-gray-50 border-gray-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">ARデザイン</label>
                      <div className="flex gap-2">
                        {arDesigns.map((design) => (
                          <button
                            key={design}
                            onClick={() => setSelectedArDesign(design)}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                              selectedArDesign === design
                                ? "bg-red-400 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                          >
                            {design}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                        紹介コメント
                      </label>
                      <p className="text-xs text-gray-500 mb-2">最大100文字まで入力できます</p>
                      <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        maxLength={100}
                        rows={6}
                        className="bg-gray-50 border-gray-200 resize-none"
                      />
                      <div className="text-right text-xs text-gray-500 mt-1">{description.length} / 100</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-1">
                <div className="sticky top-8">
                  <h3 className="text-sm font-medium text-gray-700 mb-4">プレビュー</h3>
                  <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
                    <div className="w-24 h-24 bg-yellow-400 rounded-2xl flex items-center justify-center mb-4">
                      <span className="text-4xl">🍕</span>
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 mb-1">{title}</h4>
                    <p className="text-sm text-gray-600 mb-4">{circleName}</p>
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      <span className="px-3 py-1 bg-red-100 text-red-500 text-xs font-medium rounded-full">
                        {selectedCategory}
                      </span>
                      <span className="px-3 py-1 bg-orange-100 text-orange-600 text-xs font-medium rounded-full">
                        ¥{price}
                      </span>
                      <span className="px-3 py-1 bg-teal-50 text-teal-600 text-xs font-medium rounded-full">
                        <MapPin className="h-3 w-3 inline mr-1" />
                        {location.split(" ")[0]}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
                      <Clock className="h-4 w-4" />
                      <span>{duration}</span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {description || "本格窯焼きピザをお楽しみください"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
