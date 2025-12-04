import type React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface InputWithLabelProps
  extends Omit<React.ComponentProps<"input">, "id"> {
  label: string;
  id: string;
  inputWrapper?: (input: React.ReactElement) => React.ReactElement;
}

export function InputWithLabel({
  label,
  id,
  type = "text",
  className,
  inputWrapper,
  ...props
}: InputWithLabelProps) {
  const input = (
    <Input
      id={id}
      type={type}
      className={cn(
        "w-full border-gray-200 bg-gray-50 focus-visible:ring-gray-300",
        className,
      )}
      {...props}
    />
  );

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      {inputWrapper ? inputWrapper(input) : input}
    </div>
  );
}
