import type { Category } from "@/types/exhibitions";
import { CATEGORIES } from "@/app/exhibitor/information/constants";

interface CategorySelectorProps {
  selectedCategory: Category;
  onSelect: (category: Category) => void;
}

export function CategorySelector({
  selectedCategory,
  onSelect,
}: CategorySelectorProps) {
  return (
    <div>
      <label className="mb-3 block text-sm font-medium text-gray-700">
        カテゴリ
      </label>
      <div className="flex gap-2">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => onSelect(category)}
            className={`rounded-full px-6 py-2 text-sm font-medium transition-colors ${
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
  );
}
