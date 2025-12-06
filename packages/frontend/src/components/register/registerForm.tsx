"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/button";
import { InputWithLabel } from "@/components/inputWithLabel";
import Link from "next/link";
import { useRegisterForm } from "./_components/hooks/useRegisterForm";

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, errors, isSubmitting, onSubmit } =
    useRegisterForm();

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold text-gray-900">えあパンフ</h1>
        <p className="text-sm text-gray-600">出展者新規登録</p>
      </div>

      <div className="space-y-6 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Name Field */}
          <InputWithLabel
            label="名前"
            id="name"
            type="text"
            placeholder="名前を入力してください"
            inputWrapper={(input) => <div className="relative">{input}</div>}
            {...register("name")}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
          )}

          {/* Password Field */}
          <InputWithLabel
            label="パスワード"
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="パスワードを入力してください"
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
            {...register("password")}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-500">
              {errors.password.message}
            </p>
          )}

          <Button
            type="submit"
            color="pink"
            className="w-full shadow-sm"
            disabled={isSubmitting}
          >
            {isSubmitting ? "登録中..." : "新規登録"}
          </Button>
        </form>

        <div className="space-y-3 pt-2">
          <p className="text-center text-sm text-gray-600">
            すでにアカウントをお持ちの方
          </p>
          <Link href="/login" className="block">
            <Button variant="outline" color="pink" className="w-full">
              ログイン
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
