"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "../(context)/CartContext";

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, totalPrice } =
    useCart();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-8">ショッピングカート</h1>
        <div className="bg-white shadow-md rounded-lg p-8 text-center">
          <p className="text-gray-600 mb-6">カートに商品がありません。</p>
          <Link
            href="/products"
            className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors"
          >
            商品一覧へ戻る
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">ショッピングカート</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* カート商品リスト */}
        <div className="md:w-3/4">
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex justify-between">
              <h2 className="text-xl font-semibold">カート内の商品</h2>
              <button
                onClick={clearCart}
                className="text-red-600 hover:text-red-800"
              >
                カートを空にする
              </button>
            </div>

            <div className="divide-y divide-gray-200">
              {items.map((item) => (
                <div key={item.id} className="p-4 flex flex-col sm:flex-row">
                  {/* 商品画像 */}
                  <div className="sm:w-24 h-24 relative mb-4 sm:mb-0 sm:mr-4">
                    {item.product.image_url ? (
                      <Image
                        src={item.product.image_url}
                        alt={item.product.name}
                        fill
                        className="object-cover rounded-md"
                        sizes="(max-width: 768px) 96px, 96px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-md">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-10 w-10 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* 商品情報 */}
                  <div className="flex-grow">
                    <Link
                      href={`/products/${item.product.id}`}
                      className="text-lg font-medium text-indigo-600 hover:text-indigo-800"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-gray-600 line-clamp-2 text-sm my-1">
                      {item.product.description || "商品の説明はありません。"}
                    </p>
                    <p className="text-lg font-bold text-gray-800 mt-1">
                      ¥{item.product.price.toLocaleString()}
                    </p>
                  </div>

                  {/* 数量と削除 */}
                  <div className="mt-4 sm:mt-0 sm:ml-4 flex flex-col items-end">
                    <div className="flex items-center border border-gray-300 rounded-md mb-2">
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity - 1)
                        }
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                      >
                        -
                      </button>
                      <span className="px-4 py-1 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity + 1)
                        }
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      削除
                    </button>
                    <p className="text-gray-700 mt-2 font-medium">
                      小計: ¥
                      {(item.product.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 注文サマリー */}
        <div className="md:w-1/4">
          <div className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">注文サマリー</h2>
            <div className="border-t border-b border-gray-200 py-4 mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">小計</span>
                <span className="font-medium">
                  ¥{totalPrice.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">送料</span>
                <span className="font-medium">¥0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">税</span>
                <span className="font-medium">¥0</span>
              </div>
            </div>
            <div className="flex justify-between mb-6">
              <span className="text-xl font-bold">合計</span>
              <span className="text-xl font-bold text-indigo-600">
                ¥{totalPrice.toLocaleString()}
              </span>
            </div>
            <Link
              href="/checkout"
              className="block w-full bg-indigo-600 text-white text-center font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              購入手続きへ進む
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
