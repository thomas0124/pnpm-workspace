import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/button";
import { InputWithLabel } from "@/components/inputWithLabel";
import Link from "next/link";
import { useLoginForm } from "./_components/hooks/useLoginForm";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, errors, isSubmitting, apiError, onSubmit } =
    useLoginForm();

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold text-gray-900">えあパンフ</h1>
        <p className="text-sm text-gray-600">出展者ログイン</p>
      </div>
      <div className="space-y-6 rounded-2xl bg-white p-8 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <InputWithLabel
            label="名前"
            id="name"
            type="text"
            placeholder="名前を入力してください"
            inputWrapper={(input) => <div className="relative">{input}</div>}
            {...register("name")}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500">
              {errors.name.message}
            </p>
          )}

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

          {apiError && (
            <p className="mt-2 text-sm text-red-500">{apiError}</p>
          )}

          <Button
            type="submit"
            color="red"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "ログイン中..." : "ログイン"}
          </Button>
        </form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">または</span>
          </div>
        </div>
        <Link href="/register">
          <Button
            type="button"
            variant="outline"
            color="pink"
            className="w-full"
          >
            新規登録
          </Button>
        </Link>
      </div>
      <div className="text-center text-xs leading-relaxed text-gray-500">
        ユーザー画面からアクセスする場合は、
        <br />
        画面左下のボタンをクリックしてください
      </div>
    </div>
  );
}
