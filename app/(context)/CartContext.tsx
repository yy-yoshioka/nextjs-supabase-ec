"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "../(lib)/types/database";

// カート内のアイテムの型定義
export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

// カートコンテキストの型定義
interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  totalPrice: number;
}

// カートコンテキストの作成
const CartContext = createContext<CartContextType | undefined>(undefined);

// localStorageのキー
const CART_STORAGE_KEY = "ec-shop-cart";

// カートプロバイダーコンポーネント
export function CartProvider({ children }: { children: React.ReactNode }) {
  // カートアイテムの状態
  const [items, setItems] = useState<CartItem[]>([]);

  // 初期化時にlocalStorageから読み込み
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error("Failed to load cart from localStorage:", error);
    }
  }, []);

  // カートの変更をlocalStorageに保存
  useEffect(() => {
    // カートが空の場合に空の配列を無駄に保存しないようにする
    if (items.length === 0 && !localStorage.getItem(CART_STORAGE_KEY)) {
      return;
    }

    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error("Failed to save cart to localStorage:", error);
    }
  }, [items]);

  // アイテムをカートに追加
  const addItem = (product: Product, quantity = 1) => {
    setItems((currentItems) => {
      // すでにカートに存在するか確認
      const existingItemIndex = currentItems.findIndex(
        (item) => item.product.id === product.id
      );

      if (existingItemIndex >= 0) {
        // 既存のアイテムの数量を更新
        const updatedItems = [...currentItems];
        updatedItems[existingItemIndex].quantity += quantity;
        return updatedItems;
      } else {
        // 新しいアイテムを追加
        return [...currentItems, { id: product.id, product, quantity }];
      }
    });
  };

  // アイテムをカートから削除
  const removeItem = (productId: string) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.product.id !== productId)
    );
  };

  // アイテムの数量を更新
  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  // カートをクリア
  const clearCart = () => {
    setItems([]);
  };

  // カート内のアイテム総数を計算
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  // カート内の合計金額を計算
  const totalPrice = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  // コンテキスト値
  const value = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    itemCount,
    totalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// カートコンテキストを使用するためのカスタムフック
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
