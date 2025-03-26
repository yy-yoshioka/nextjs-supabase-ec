"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { isAdmin } from "../../../../(lib)/isAdmin";

interface Product {
  id: string;
  name: string;
  price: number;
  description: string | null;
  image_url: string | null;
}

export default function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const productId = params.id;

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
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
      fetchProduct();
    };

    checkAdmin();
  }, [productId, router]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${productId}`);
      if (!response.ok) {
        throw new Error("商品の取得に失敗しました");
      }
      const data = await response.json();
      setProduct(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData(event.currentTarget);
    const productData = {
      name: formData.get("name") as string,
      price: parseFloat(formData.get("price") as string),
      description: formData.get("description") as string,
      image_url: formData.get("image_url") as string,
    };

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "商品の更新に失敗しました");
      }

      const data = await response.json();
      setSuccess("商品が正常に更新されました！");

      // 成功メッセージを表示した後に商品一覧ページに戻る
      setTimeout(() => {
        router.push("/admin/products");
      }, 2000);
    } catch (err) {
      setError((err as Error).message || "商品の更新中にエラーが発生しました");
    } finally {
      setIsSaving(false);
    }
  };

  if (!adminVerified) {
    return <div className="container mx-auto p-4">権限を確認中...</div>;
  }

  if (isLoading) {
    return <div className="container mx-auto p-4">読み込み中...</div>;
  }

  if (error && !product) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 p-4 rounded text-red-700 mb-4">
          エラー: {error}
        </div>
        <Link
          href="/admin/products"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          商品一覧に戻る
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">商品の編集</h1>
        <Link
          href="/admin/products"
          className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md transition-colors"
        >
          商品一覧に戻る
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6">
          {success}
        </div>
      )}

      {product && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                商品名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                defaultValue={product.name}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                価格 (円) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="price"
                name="price"
                min="1"
                step="1"
                required
                defaultValue={product.price}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                商品説明
              </label>
              <textarea
                id="description"
                name="description"
                rows={5}
                defaultValue={product.description || ""}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              ></textarea>
            </div>

            <div>
              <label
                htmlFor="image_url"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                商品画像URL
              </label>
              <input
                type="url"
                id="image_url"
                name="image_url"
                defaultValue={product.image_url || ""}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {product.image_url && (
              <div>
                <p className="block text-sm font-medium text-gray-700 mb-2">
                  現在の画像
                </p>
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="h-40 w-auto object-contain border rounded p-2"
                />
              </div>
            )}

            <div className="flex justify-end space-x-4">
              <Link
                href="/admin/products"
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              >
                キャンセル
              </Link>
              <button
                type="submit"
                disabled={isSaving}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-70"
              >
                {isSaving ? "保存中..." : "変更を保存"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
