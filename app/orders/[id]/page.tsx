"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "../../(context)/AuthProvider";
import { getOrderById, OrderWithItems } from "../../(lib)/orderClient";

export default function OrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [order, setOrder] = useState<OrderWithItems | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrderDetails() {
      if (!user) {
        setLoading(false);
        router.push("/auth/login");
        return;
      }

      try {
        if (!id || typeof id !== "string") {
          throw new Error("注文IDが無効です");
        }

        const { order: orderData, error: orderError } = await getOrderById(
          id,
          user.id
        );

        if (orderError) {
          setError(orderError);
          return;
        }

        setOrder(orderData);
      } catch (err) {
        console.error("注文詳細の取得に失敗しました:", err);
        setError("注文詳細の読み込み中にエラーが発生しました");
      } finally {
        setLoading(false);
      }
    }

    fetchOrderDetails();
  }, [id, user?.id, router]);

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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="bg-white shadow-md rounded-lg p-8">
          <h1 className="text-3xl font-bold mb-6">注文詳細</h1>
          <div className="bg-red-100 text-red-800 p-4 rounded-md mb-6">
            {error || "注文が見つかりません"}
          </div>
          <Link
            href="/orders"
            className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors"
          >
            注文履歴に戻る
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <Link
          href="/orders"
          className="inline-flex items-center text-indigo-600 hover:text-indigo-800"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          注文履歴に戻る
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold mb-4">注文詳細</h1>
          <div className="flex flex-wrap justify-between items-start gap-4">
            <div>
              <p className="text-gray-700">
                <span className="font-semibold">注文番号:</span> {order.id}
              </p>
              <p className="text-gray-700 mt-1">
                <span className="font-semibold">注文日:</span>{" "}
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

        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold mb-4">注文内容</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    商品
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    単価
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    数量
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    小計
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {order.order_items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {item.product?.image_url && (
                          <div className="flex-shrink-0 h-10 w-10 mr-4">
                            <img
                              className="h-10 w-10 rounded-md object-cover"
                              src={item.product.image_url}
                              alt={item.product.name}
                            />
                          </div>
                        )}
                        <div>
                          <Link
                            href={`/products/${item.product_id}`}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            {item.product?.name || "商品名なし"}
                          </Link>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ¥{item.price_at_purchase.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      ¥
                      {(
                        item.price_at_purchase * item.quantity
                      ).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-700">小計</span>
            <span className="font-medium">
              ¥{order.total_price.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-700">配送料</span>
            <span className="font-medium">¥0</span>
          </div>
          <div className="flex justify-between items-center border-t border-gray-200 pt-4 mt-4">
            <span className="text-lg font-bold">合計</span>
            <span className="text-lg font-bold text-indigo-600">
              ¥{order.total_price.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
