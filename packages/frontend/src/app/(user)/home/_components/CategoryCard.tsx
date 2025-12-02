import React from "react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type CategoryType = "飲食" | "展示" | "体験" | "ステージ"

interface CategoryCardProps {
  category: CategoryType
  description: string
  count: number
  onPress: () => void
}

const categoryConfig: Record<
  CategoryType,
  { icon: string; bgColor: string }
> = {
  飲食: { icon: "🍔", bgColor: "#FFD54F" },
  展示: { icon: "🎨", bgColor: "#4DD0E1" },
  体験: { icon: "🎮", bgColor: "#81C784" },
  ステージ: { icon: "🎤", bgColor: "#FF8A80" },
}

export function CategoryCard({
  category,
  description,
  count,
  onPress,
}: CategoryCardProps) {
  const { icon, bgColor } = categoryConfig[category]

  return (
    <Card
      className={cn(
        "flex items-center gap-4 w-full p-4 rounded-2xl shadow-md cursor-pointer transition active:scale-[0.97] hover:shadow-lg"
      )}
      onClick={onPress}
    >
      {/* 左のアイコン円 */}
      <div
        className="flex items-center justify-center text-3xl font-bold rounded-full shrink-0"
        style={{ backgroundColor: bgColor, width: 60, height: 60 }}
      >
        {icon}
      </div>

      {/* 中央テキスト */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <h3 className="text-[20px] font-semibold text-[#212121] truncate">
          {category}
        </h3>
        <p className="text-[14px] text-[#757575] leading-tight truncate">
          {description}
        </p>
        <span className="text-[14px] font-medium text-[#FF6B6B] mt-1">
          出展数: {count}
        </span>
      </div>

      {/* 右矢印 */}
      <span className="text-[24px] text-[#BDBDBD] shrink-0">›</span>
    </Card>
  )
}
        