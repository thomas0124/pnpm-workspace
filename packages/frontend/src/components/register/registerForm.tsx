"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/button";
import { InputWithLabel } from "@/components/inputWithLabel";
import Link from "next/link";

export function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("パスワードが一致しません");
      return;
    }

    sessionStorage.setItem("isLoggedIn", "true");
    sessionStorage.setItem("userName", name);
    router.push("/events");
  };

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold text-gray-900">
          えあパンフ
        </h1>
        <p className="text-sm text-gray-600">出展者新規登録</p>
      </div>

      <div className="space-y-6 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <form onSubmit={handleRegister} className="space-y-5">
          {/* Name Field */}
          <InputWithLabel
            label="名前"
            id="name"
            type="text"
            placeholder="名前を入力してください"
            value={name}
            onChange={(e) => setName(e.target.value)}
            inputWrapper={(input) => (
              <div className="relative">
                {input}
              </div>
            )}
            required
          />

          {/* Password Field */}
          <InputWithLabel
            label="パスワード"
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="パスワードを入力してください"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            inputWrapper={(input) => (
              <div className="relative">
                {input}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            )}
          />

          <InputWithLabel
            label="パスワード（確認）"
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="もう一度パスワードを入力してください"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            inputWrapper={(input) => (
              <div className="relative">
                {input}
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            )}
          />

          <Button
            type="submit"
            color="pink"
            className="w-full shadow-sm"
          >
            新規登録
          </Button>
        </form>

        <div className="space-y-3 pt-2">
          <p className="text-center text-sm text-gray-600">
            すでにアカウントをお持ちの方
          </p>
          <Link href="/login" className="block">
            <Button
              variant="outline"
              color="pink"
              className="w-full"
            >
              ログイン
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
