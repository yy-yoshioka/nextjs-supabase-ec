"use client";

import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import Link from "next/link";

// ボタンのバリエーションを定義
const buttonVariants = cva(
  // 共通のスタイル
  "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      // バリアント（種類）
      variant: {
        primary:
          "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500",
        secondary:
          "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500",
        outline:
          "bg-transparent border border-indigo-600 text-indigo-600 hover:bg-indigo-50 focus:ring-indigo-500",
        ghost:
          "bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-gray-500",
        link: "bg-transparent underline-offset-4 hover:underline text-indigo-600 hover:text-indigo-800 p-0 focus:ring-0",
        danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
        success:
          "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
      },
      // サイズ
      size: {
        xs: "text-xs px-2.5 py-1.5",
        sm: "text-sm px-3 py-2",
        md: "text-sm px-4 py-2",
        lg: "text-base px-6 py-3",
        xl: "text-lg px-8 py-4",
      },
      // 幅いっぱいに広げるか
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

// Props の型定義
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  href?: string;
  target?: string;
}

// ボタンコンポーネント
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      variant,
      size,
      fullWidth,
      isLoading = false,
      leftIcon,
      rightIcon,
      href,
      target,
      ...props
    },
    ref
  ) => {
    // ボタンのクラス
    const buttonClasses = buttonVariants({
      variant,
      size,
      fullWidth,
      className,
    });

    // href が指定されている場合は Link コンポーネントを使用
    if (href) {
      return (
        <Link
          href={href}
          target={target}
          className={buttonClasses}
          aria-disabled={isLoading}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
          {children}
          {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
        </Link>
      );
    }

    // 通常のボタン
    return (
      <button
        className={buttonClasses}
        ref={ref}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
