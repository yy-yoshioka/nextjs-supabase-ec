"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "../(context)/AuthProvider";
import { createClient } from "@supabase/supabase-js";
import { Database } from "../(lib)/types/database";
import { Order, OrderItem, Product } from "../(lib)/types/database";

// 拡張された注文アイテムの型定義
interface OrderItemWithProduct extends OrderItem {
  product?: Product;
}

// 拡張された注文の型定義
interface OrderWithItems extends Order {
  order_items: OrderItemWithProduct[];
}

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrders() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Supabaseクライアントを作成
        const supabase = createClient<Database>(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        // ユーザーの注文を取得
        const { data: ordersData, error: ordersError } = await supabase
          .from("orders")
          .select(
            `
            *,
            order_items(*)
          `
          )
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (ordersError) throw ordersError;

        // 注文内の商品情報を取得
        const ordersWithProducts = await Promise.all(
          ordersData.map(async (order) => {
            const orderItemsWithProducts = await Promise.all(
              order.order_items.map(async (item: OrderItem) => {
                // 商品情報を取得
                const { data: productData } = await supabase
                  .from("products")
                  .select("*")
                  .eq("id", item.product_id)
                  .single();

                return {
                  ...item,
                  product: productData,
                };
              })
            );

            return {
              ...order,
              order_items: orderItemsWithProducts,
            };
          })
        );

        setOrders(ordersWithProducts);
      } catch (err) {
        console.error("注文履歴の取得に失敗しました:", err);
        setError("注文履歴の読み込み中にエラーが発生しました");
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [user]);

  // ステータスに応じたバッジのクラス
  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // 注文ステータスの日本語表示
  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "完了";
      case "processing":
        return "処理中";
      case "shipped":
        return "発送済み";
      case "cancelled":
        return "キャンセル";
      default:
        return status;
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="bg-white shadow-md rounded-lg p-8 text-center">
          <h1 className="text-3xl font-bold mb-6">注文履歴</h1>
          <p className="text-gray-600 mb-6">
            注文履歴を確認するにはログインしてください。
          </p>
          <Link
            href="/auth/login"
            className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors"
          >
            ログイン
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">注文履歴</h1>

      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 text-red-800 p-4 rounded-md mb-6">
          {error}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white shadow-md rounded-lg p-8 text-center">
          <p className="text-gray-600 mb-6">注文履歴がありません。</p>
          <Link
            href="/products"
            className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors"
          >
            ショッピングを始める
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white shadow-md rounded-lg overflow-hidden"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
                  <div>
                    <h2 className="text-lg font-semibold">
                      注文番号: {order.id.substring(0, 8)}...
                    </h2>
                    <p className="text-gray-500 text-sm">
                      {new Date(order.created_at).toLocaleString("ja-JP")}
                    </p>
                  </div>
                  <div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(
                        order.status
                      )}`}
                    >
                      {getStatusText(order.status)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-md font-medium mb-4">注文内容</h3>
                <div className="space-y-4">
                  {order.order_items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between border-b border-gray-100 pb-4"
                    >
                      <div className="flex items-center">
                        {item.product?.image_url && (
                          <div className="w-16 h-16 flex-shrink-0 mr-4 overflow-hidden rounded-md">
                            <img
                              src={item.product.image_url}
                              alt={item.product?.name || "商品画像"}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div>
                          <h4 className="font-medium">
                            {item.product?.name || "商品名なし"}
                          </h4>
                          <p className="text-gray-500 text-sm">
                            数量: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          ¥{item.price_at_purchase.toLocaleString()}
                        </p>
                        <p className="text-gray-500 text-sm">
                          小計: ¥
                          {(
                            item.price_at_purchase * item.quantity
                          ).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">合計</span>
                    <span className="text-lg font-bold text-indigo-600">
                      ¥{order.total_price.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
