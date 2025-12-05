import * as React from "react";
import {
  Button as BaseButton,
  type ButtonProps as BaseButtonProps,
} from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type ButtonSize = "small" | "medium" | "large";
export type ButtonColor = "red" | "pink" | "gray" | "teal";

export interface ButtonProps extends Omit<BaseButtonProps, "size"> {
  size?: ButtonSize;
  color?: ButtonColor;
}

const sizeClasses: Record<ButtonSize, string> = {
  small: "py-4",
  medium: "py-6",
  large: "py-8",
};

const colorClasses: Record<ButtonColor, { default: string; outline: string }> =
  {
    red: {
      default: "bg-red-400 hover:bg-red-500 text-white",
      outline:
        "border-2 border-red-400 bg-transparent text-red-400 hover:bg-red-50",
    },
    pink: {
      default: "bg-[#FF6B6B] hover:bg-[#FF5252] text-white",
      outline:
        "border-2 border-[#FF6B6B] bg-transparent text-[#FF6B6B] hover:bg-[#FF6B6B]/5",
    },
    gray: {
      default: "bg-gray-200 hover:bg-gray-300 text-gray-700",
      outline:
        "border-2 border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50",
    },
    teal: {
      default: "bg-teal-400 hover:bg-teal-500 text-white",
      outline:
        "border-2 border-teal-500 bg-transparent text-teal-500 hover:bg-teal-50",
    },
  };

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, size = "medium", color, variant, ...props }, ref) => {
    const sizeClass = sizeClasses[size];
    const colorClass = color
      ? variant === "outline"
        ? colorClasses[color].outline
        : colorClasses[color].default
      : "";
    return (
      <BaseButton
        ref={ref}
        className={cn(
          "rounded-lg font-medium",
          sizeClass,
          colorClass,
          className,
        )}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button };
