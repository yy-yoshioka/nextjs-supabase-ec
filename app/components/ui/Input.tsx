"use client";

import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Eye, EyeOff, AlertCircle } from "lucide-react";

// 入力フィールドのバリエーションを定義
const inputVariants = cva(
  // 共通のスタイル
  "w-full rounded-md border font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0",
  {
    variants: {
      // バリアント（種類）
      variant: {
        default:
          "border-gray-300 bg-white text-gray-900 focus:border-indigo-500 focus:ring-indigo-500",
        error:
          "border-red-500 bg-white text-gray-900 focus:border-red-500 focus:ring-red-500 pr-10",
        disabled:
          "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed",
      },
      // サイズ
      size: {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2 text-base",
        lg: "px-5 py-2.5 text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

// Props の型定義
export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
  label?: string;
  helperText?: string;
  error?: string;
  fullWidth?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  showPasswordToggle?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className = "",
      variant,
      size,
      label,
      helperText,
      error,
      fullWidth = false,
      startIcon,
      endIcon,
      showPasswordToggle = false,
      type = "text",
      disabled = false,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const actualType = showPasswordToggle
      ? showPassword
        ? "text"
        : "password"
      : type;

    // disabled の場合は variant を上書き
    const actualVariant = disabled ? "disabled" : error ? "error" : variant;

    // 入力フィールドのクラス
    const inputClasses = inputVariants({ variant: actualVariant, size });

    const handleTogglePassword = () => {
      setShowPassword((prev) => !prev);
    };

    return (
      <div className={`${fullWidth ? "w-full" : ""} space-y-1`}>
        {/* ラベル */}
        {label && (
          <label
            htmlFor={props.id}
            className={`block text-sm font-medium ${
              error ? "text-red-600" : "text-gray-700"
            } ${disabled ? "opacity-60" : ""}`}
          >
            {label}
          </label>
        )}

        {/* 入力フィールドのコンテナ */}
        <div className="relative">
          {/* 左側のアイコン */}
          {startIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500">{startIcon}</span>
            </div>
          )}

          {/* 入力フィールド */}
          <input
            ref={ref}
            type={actualType}
            disabled={disabled}
            className={`${inputClasses} ${className} ${
              startIcon ? "pl-10" : ""
            } ${showPasswordToggle || endIcon || error ? "pr-10" : ""}`}
            {...props}
          />

          {/* 右側のコンテンツ（エラーアイコン、パスワード表示切り替え、カスタムアイコン） */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {error && <AlertCircle className="h-5 w-5 text-red-500" />}

            {showPasswordToggle && !error && (
              <button
                type="button"
                className="text-gray-500 hover:text-gray-700 focus:outline-none disabled:opacity-50"
                onClick={handleTogglePassword}
                disabled={disabled}
                aria-label={
                  showPassword ? "パスワードを隠す" : "パスワードを表示"
                }
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            )}

            {endIcon && !error && !showPasswordToggle && (
              <span className="text-gray-500">{endIcon}</span>
            )}
          </div>
        </div>

        {/* ヘルパーテキストまたはエラーメッセージ */}
        {(helperText || error) && (
          <p className={`text-sm ${error ? "text-red-600" : "text-gray-500"}`}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input, inputVariants };
