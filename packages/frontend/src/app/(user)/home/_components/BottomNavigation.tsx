"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import React from "react";

type BottomNavigationProps = {
  currentTab: "home" | "list";
  onTabChange: (tab: "home" | "list") => void;
};

export default function BottomNavigation({
  currentTab,
  onTabChange,
}: BottomNavigationProps) {
  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 h-[70px] flex justify-around items-center">
      {/* ホームタブ */}
      <Button
        variant="ghost"
        className="flex flex-col gap-1 items-center px-4"
        onClick={() => onTabChange("home")}
      >
        <Image
          src={
            currentTab === "home"
              ? "/assets/icons/home_active.png"
              : "/assets/icons/home_inactive.png"
          }
          alt="ホーム"
          width={28}
          height={28}
        />
        <span
          className={`text-sm ${
            currentTab === "home" ? "text-[#FF6B6B]" : "text-gray-400"
          }`}
        >
          ホーム
        </span>
      </Button>

      {/* 一覧タブ */}
      <Button
        variant="ghost"
        className="flex flex-col gap-1 items-center px-4"
        onClick={() => onTabChange("list")}
      >
        <Image
          src={
            currentTab === "list"
              ? "/assets/icons/list_active.png"
              : "/assets/icons/list_inactive.png"
          }
          alt="一覧"
          width={28}
          height={28}
        />
        <span
          className={`text-sm ${
            currentTab === "list" ? "text-[#FF6B6B]" : "text-gray-400"
          }`}
        >
          一覧
        </span>
      </Button>
    </nav>
  );
}
