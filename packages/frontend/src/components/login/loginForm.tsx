"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export function LoginForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    sessionStorage.setItem("isLoggedIn", "true")
    sessionStorage.setItem("userName", name)
    router.push("/exhibitor/basic-info")
  }

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">デジタルパンフレット</h1>
        <p className="text-sm text-gray-600">出展者ログイン</p>
      </div>
      <div className="bg-white rounded-2xl shadow-sm p-8 space-y-6">
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              名前
            </label>
            <Input
              id="name"
              type="text"
              placeholder="名前を入力してください"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-50 border-gray-200 focus-visible:ring-gray-300"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              パスワード
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="パスワードを入力してください"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-50 border-gray-200 focus-visible:ring-gray-300 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>
          <Button type="submit" className="w-full bg-red-400 hover:bg-red-500 text-white font-medium py-6 rounded-lg">
            ログイン
          </Button>
        </form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">または</span>
          </div>
        </div>
        <Link href="/register">
          <Button
            type="button"
            variant="outline"
            className="w-full border-2 border-red-400 text-red-400 hover:bg-red-50 font-medium py-6 rounded-lg bg-transparent"
          >
            新規登録
          </Button>
        </Link>
      </div>
      <div className="text-center text-xs text-gray-500 leading-relaxed">
        ユーザー画面からアクセスする場合は、
        <br />
        画面左下のボタンをクリックしてください
      </div>
    </div>
  )
}
