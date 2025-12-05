"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface SearchBarProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  className?: string;
}

export function SearchBar({
  value,
  defaultValue,
  onChange,
  onSearch,
  className,
}: SearchBarProps) {
  const [internalValue, setInternalValue] = useState(defaultValue || "");
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (!isControlled) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch?.(currentValue);
    }
  };

  return (
    <div className={`bg-white p-4 ${className || ""}`}>
      <div className="relative rounded-lg border">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <Input
          value={currentValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="出展を検索..."
          className="border-gray-200 bg-gray-50 pl-10 text-base focus-visible:ring-0 focus-visible:ring-gray-300 focus-visible:ring-offset-0"
        />
      </div>
    </div>
  );
}
