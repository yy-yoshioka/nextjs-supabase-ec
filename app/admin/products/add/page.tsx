"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AddProductPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
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
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "商品の登録に失敗しました");
      }

      const data = await response.json();
      setSuccess("商品が正常に登録されました！");

      // フォームをリセット
      (event.target as HTMLFormElement).reset();

      // 少し待ってから商品一覧ページに戻る
      setTimeout(() => {
        router.push("/products");
      }, 2000);
    } catch (err) {
      setError((err as Error).message || "商品の登録中にエラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSeedProducts() {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(
        "/api/seed/products?key=your-secret-api-key",
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "サンプル商品の登録に失敗しました");
      }

      const data = await response.json();
      setSuccess(`${data.count}件のサンプル商品が正常に登録されました！`);
    } catch (err) {
      setError(
        (err as Error).message || "サンプル商品の登録中にエラーが発生しました"
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">商品の追加</h1>
        <Link
          href="/products"
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

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
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
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="例: オーガニックコットンTシャツ"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="例: 4980"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="商品の詳細な説明を入力してください"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="例: https://example.com/image.jpg"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-70"
            >
              {isLoading ? "登録中..." : "商品を登録"}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">サンプル商品データ</h2>
        <p className="mb-4 text-gray-600">
          サンプルの商品データをデータベースに登録します。開発・テスト用にご利用ください。
        </p>
        <button
          onClick={handleSeedProducts}
          disabled={isLoading}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-70"
        >
          {isLoading ? "登録中..." : "サンプル商品を登録"}
        </button>
      </div>
    </div>
  );
}
