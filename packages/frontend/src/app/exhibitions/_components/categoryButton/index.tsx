"use client";

import { Button } from "@/components/ui/button";

interface CategoryButtonProps {
  category: string;
  isSelected: boolean;
  onClick: () => void;
}

export function CategoryButton({
  category,
  isSelected,
  onClick,
}: CategoryButtonProps) {
  return (
    <Button
      variant={isSelected ? "default" : "outline"}
      className={`flex-1 whitespace-nowrap rounded-full px-4 ${
        isSelected
          ? "bg-red-400 text-white hover:bg-red-500"
          : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
      }`}
      onClick={onClick}
    >
      {category}
    </Button>
  );
}
