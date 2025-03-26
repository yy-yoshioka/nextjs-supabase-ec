"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { isAdmin } from "../(lib)/isAdmin";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
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
      setLoading(false);
    };

    checkAdmin();
  }, [router]);

  if (loading) {
    return <div className="container mx-auto p-4">権限を確認中...</div>;
  }

  if (!adminVerified) {
    return (
      <div className="container mx-auto p-4">
        このページにアクセスする権限がありません。
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">管理者ダッシュボード</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/admin/products">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-indigo-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m-8-4l8 4m8 4l-8 4m8-4l-8 4m-8-4l8 4"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">商品管理</h2>
            <p className="text-gray-600">
              商品の追加、編集、削除を行います。商品情報や在庫の管理ができます。
            </p>
          </div>
        </Link>

        <Link href="/admin/orders">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">注文管理</h2>
            <p className="text-gray-600">
              注文の一覧と詳細を確認できます。注文ステータスの更新も可能です。
            </p>
          </div>
        </Link>

        <Link href="/admin/users">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">ユーザー管理</h2>
            <p className="text-gray-600">
              ユーザーアカウントの一覧と詳細情報を管理します。権限の設定も行えます。
            </p>
          </div>
        </Link>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">管理者メニュー</h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <ul className="space-y-2">
            <li>
              <Link
                href="/admin/products/add"
                className="text-indigo-600 hover:text-indigo-800"
              >
                新規商品の追加
              </Link>
            </li>
            <li>
              <Link
                href="/admin/settings"
                className="text-indigo-600 hover:text-indigo-800"
              >
                サイト設定
              </Link>
            </li>
            <li>
              <Link href="/" className="text-indigo-600 hover:text-indigo-800">
                ストアフロントを表示
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
