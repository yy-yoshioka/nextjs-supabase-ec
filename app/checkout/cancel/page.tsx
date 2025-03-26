"use client";

import React from "react";
import Link from "next/link";

export default function CheckoutCancelPage() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md mx-auto">
        <div className="mb-6 text-yellow-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold mb-4">
          ご注文がキャンセルされました
        </h1>
        <p className="text-gray-600 mb-6">
          注文処理中に何か問題がありましたか？サポートが必要な場合はお気軽にお問い合わせください。
        </p>

        <div className="flex flex-col space-y-4">
          <Link
            href="/cart"
            className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors"
          >
            カートに戻る
          </Link>
          <Link
            href="/products"
            className="text-indigo-600 hover:text-indigo-800"
          >
            ショッピングを続ける
          </Link>
        </div>
      </div>
    </div>
  );
}
