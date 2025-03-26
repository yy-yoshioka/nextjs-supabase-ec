"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { isAdmin } from "../../(lib)/isAdmin";

interface Product {
  id: string;
  name: string;
  price: number;
  description: string | null;
  image_url: string | null;
  created_at: string;
}

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adminVerified, setAdminVerified] = useState(false);

  useEffect(() => {
    // 管理者権限を確認
    const checkAdmin = async () => {
      const admin = await isAdmin();
      if (!admin) {
        router.push("/");
        return;
      }
      setAdminVerified(true);
      fetchProducts();
    };

    checkAdmin();
  }, [router]);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
      if (!response.ok) {
        throw new Error("商品の取得に失敗しました");
      }
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("本当にこの商品を削除しますか？")) {
      return;
    }

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("商品の削除に失敗しました");
      }

      // 成功したら商品リストを更新
      setProducts(products.filter((product) => product.id !== id));
    } catch (err) {
      setError((err as Error).message);
    }
  };

  if (!adminVerified) {
    return <div className="container mx-auto p-4">権限を確認中...</div>;
  }

  if (loading) {
    return <div className="container mx-auto p-4">読み込み中...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 p-4 rounded text-red-700 mb-4">
          エラー: {error}
        </div>
        <button
          onClick={fetchProducts}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          再試行
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">商品管理</h1>
        <Link
          href="/admin/products/add"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          新規商品を追加
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="bg-yellow-100 p-4 rounded text-yellow-700">
          商品がありません。「新規商品を追加」から商品を登録してください。
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  商品
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  価格
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {product.image_url ? (
                        <div className="h-10 w-10 mr-3 relative">
                          <Image
                            src={product.image_url}
                            alt={product.name}
                            fill
                            sizes="40px"
                            style={{ objectFit: "cover" }}
                            className="rounded"
                          />
                        </div>
                      ) : (
                        <div className="h-10 w-10 mr-3 bg-gray-200 rounded"></div>
                      )}
                      <div>
                        <div className="font-medium text-gray-900">
                          {product.name}
                        </div>
                        <div className="text-gray-500 truncate max-w-xs">
                          {product.description || "説明なし"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                    ¥{product.price.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Link
                        href={`/admin/products/edit/${product.id}`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        編集
                      </Link>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        削除
                      </button>
                      <Link
                        href={`/products/${product.id}`}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        閲覧
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
