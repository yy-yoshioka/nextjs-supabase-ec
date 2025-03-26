"use client";

import Link from "next/link";
import { useAuth } from "../../(context)/AuthProvider";
import { usePathname } from "next/navigation";

export default function Header() {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-indigo-700">
            EC Shop
          </Link>

          <nav className="hidden md:flex space-x-6">
            <Link
              href="/"
              className={`transition-colors ${
                pathname === "/"
                  ? "text-indigo-700 font-medium"
                  : "text-gray-600 hover:text-indigo-700"
              }`}
            >
              ホーム
            </Link>
            <Link
              href="/products"
              className={`transition-colors ${
                pathname === "/products" || pathname.startsWith("/products/")
                  ? "text-indigo-700 font-medium"
                  : "text-gray-600 hover:text-indigo-700"
              }`}
            >
              商品一覧
            </Link>
            {user && user.role === "admin" && (
              <Link
                href="/admin/products/add"
                className={`transition-colors ${
                  pathname === "/admin/products/add"
                    ? "text-indigo-700 font-medium"
                    : "text-gray-600 hover:text-indigo-700"
                }`}
              >
                商品管理
              </Link>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            {isLoading ? (
              // ローディング中の表示
              <div className="h-6 w-24 bg-gray-200 animate-pulse rounded"></div>
            ) : user ? (
              <>
                <Link
                  href="/profile"
                  className={`transition-colors ${
                    pathname === "/profile" || pathname.startsWith("/profile/")
                      ? "text-indigo-700 font-medium"
                      : "text-gray-600 hover:text-indigo-700"
                  }`}
                >
                  マイページ
                </Link>
                <Link
                  href="/cart"
                  className={`relative transition-colors ${
                    pathname === "/cart"
                      ? "text-indigo-700 font-medium"
                      : "text-gray-600 hover:text-indigo-700"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className={`transition-colors ${
                    pathname === "/auth/login"
                      ? "text-indigo-700 font-medium"
                      : "text-gray-600 hover:text-indigo-700"
                  }`}
                >
                  ログイン
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                >
                  会員登録
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
