"use client";

interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large";
  color?: string;
  className?: string;
  text?: string;
}

export default function LoadingSpinner({
  size = "medium",
  color = "indigo-600",
  className = "",
  text,
}: LoadingSpinnerProps) {
  const sizeMap = {
    small: "h-4 w-4",
    medium: "h-8 w-8",
    large: "h-12 w-12",
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div
        className={`animate-spin rounded-full border-b-2 ${sizeMap[size]} border-${color}`}
        role="status"
        aria-label="読み込み中"
      ></div>
      {text && <p className="mt-2 text-gray-700 text-sm">{text}</p>}
    </div>
  );
}
