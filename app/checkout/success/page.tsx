"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCart } from "../../(context)/CartContext";
import { useAuth } from "../../(context)/AuthProvider";
import { getSessionOrderId } from "../../(lib)/orderClient";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { clearCart } = useCart();
  const { user } = useAuth();
  const [orderId, setOrderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // カートクリア用の関数
  const handleClearCart = useCallback(() => {
    clearCart();
  }, []);

  // カートをクリア
  useEffect(() => {
    handleClearCart();
  }, [handleClearCart]);

  // セッション情報の取得
  useEffect(() => {
    async function fetchOrderDetails() {
      if (!sessionId) {
        setLoading(false);
        return;
      }

      try {
        const { orderId: sessionOrderId, error: sessionError } =
          await getSessionOrderId(sessionId);

        if (sessionError) {
          setError(sessionError);
          return;
        }

        setOrderId(sessionOrderId);
      } catch (err) {
        console.error("注文詳細の取得に失敗しました:", err);
        setError("注文詳細の取得に失敗しました");
      } finally {
        setLoading(false);
      }
    }

    fetchOrderDetails();
  }, [sessionId]);

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md mx-auto">
        <div className="mb-6 text-green-500">
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
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold mb-4">
          ご注文ありがとうございます！
        </h1>
        <p className="text-gray-600 mb-6">
          ご注文が正常に処理されました。注文の詳細はメールでお送りいたします。
        </p>

        <div className="text-sm text-gray-500 mb-6">
          注文番号: {sessionId?.substring(0, 8)}...
        </div>

        <div className="flex flex-col space-y-4">
          {orderId ? (
            <Link
              href={`/orders/${orderId}`}
              className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors"
            >
              注文詳細を確認する
            </Link>
          ) : (
            <Link
              href="/orders"
              className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors"
            >
              注文履歴を確認する
            </Link>
          )}
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
