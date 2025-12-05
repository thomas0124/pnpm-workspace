"use client";

import { LogOut, FileText } from "lucide-react";

import { useLogout } from "../../hooks/useLogout";

export function Sidebar() {
  const { logout, isLoading } = useLogout();

  return (
    <aside className="min-h-[calc(100vh-73px)] w-64 border-r border-gray-200 bg-white">
      <div className="p-4">
        <div className="mb-4">
          <h2 className="mb-2 text-xs font-medium text-gray-500">メニュー</h2>
          <button className="flex w-full items-center gap-2 rounded-r border-l-4 border-orange-400 bg-orange-50 px-4 py-3 text-orange-600">
            <FileText className="h-4 w-4" />
            <span className="text-sm font-medium">基本情報</span>
          </button>
        </div>
      </div>
      <div className="absolute bottom-4 left-4">
        <button
          onClick={logout}
          disabled={isLoading}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-60"
        >
          <LogOut className="h-4 w-4" />
          ログアウト
        </button>
      </div>
    </aside>
  );
}
