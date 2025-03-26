"use client";

import { useState } from "react";
import { Product } from "../../(lib)/types/database";
import { useCart } from "../../(context)/CartContext";

interface AddToCartButtonProps {
  product: Product;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const [addedToCart, setAddedToCart] = useState(false);

  const handleAddToCart = async () => {
    try {
      setIsLoading(true);
      // カートに商品を追加
      addItem(product, quantity);
      console.log(`商品 "${product.name}" をカートに追加しました`);
      // 成功メッセージを表示
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000); // 2秒後にメッセージを非表示
    } catch (error) {
      console.error("カートに追加できませんでした", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center mb-4">
        <label htmlFor="quantity" className="mr-2 text-gray-700">
          数量:
        </label>
        <div className="flex items-center border border-gray-300 rounded-md">
          <button
            type="button"
            onClick={() => quantity > 1 && setQuantity(quantity - 1)}
            className="px-3 py-1 text-gray-600 hover:bg-gray-100"
          >
            -
          </button>
          <span className="px-3 py-1 text-center w-10">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity(quantity + 1)}
            className="px-3 py-1 text-gray-600 hover:bg-gray-100"
          >
            +
          </button>
        </div>
      </div>

      <button
        onClick={handleAddToCart}
        disabled={isLoading}
        className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition duration-200 disabled:bg-indigo-400"
      >
        {isLoading ? "処理中..." : "カートに追加"}
      </button>

      {addedToCart && (
        <div className="mt-2 p-2 bg-green-100 text-green-800 rounded-md text-center">
          カートに追加しました！
        </div>
      )}
    </div>
  );
}
