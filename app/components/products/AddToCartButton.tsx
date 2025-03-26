"use client";

import { useState } from "react";
import { Product } from "../../(lib)/types/database";

interface AddToCartButtonProps {
  product: Product;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = async () => {
    try {
      setIsLoading(true);
      // ここにカートに追加するロジックを実装する
      console.log(`商品 "${product.name}" をカートに追加しました`);
      // 成功時の処理（例：通知表示）
    } catch (error) {
      console.error("カートに追加できませんでした", error);
      // エラー時の処理
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={isLoading}
      className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition duration-200 disabled:bg-indigo-400"
    >
      {isLoading ? "処理中..." : "カートに追加"}
    </button>
  );
}
