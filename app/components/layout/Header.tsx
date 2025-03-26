"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShoppingCartIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../../(context)/AuthProvider";
import { useCart } from "../../(context)/CartContext";

interface HeaderProps {
  onMenuClick?: () => void;
}

interface CartItem {
  id: string;
  quantity: number;
  [key: string]: any;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const { items } = useCart();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // カートの商品数を計算
  const cartItemsCount = items.reduce(
    (total: number, item: CartItem) => total + item.quantity,
    0
  );

  // スクロール検出のためのイベントリスナー
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ナビゲーションリンク配列
  const navLinks = [
    { name: "ホーム", href: "/" },
    { name: "商品一覧", href: "/products" },
  ];

  // 管理者用のリンク
  const adminLinks = [{ name: "商品管理", href: "/admin/products" }];

  // ユーザー用のリンク
  const userLinks = [
    { name: "プロフィール", href: "/profile" },
    { name: "注文履歴", href: "/orders" },
  ];

  // アクティブなリンクかどうかを判定する関数
  const isActiveLink = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  // モバイルメニューボタンがクリックされたときの処理
  const handleMenuButtonClick = () => {
    if (onMenuClick) {
      onMenuClick();
    } else {
      setMobileMenuOpen(!mobileMenuOpen);
    }
  };

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md" : "bg-white/80 backdrop-blur-md"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* ロゴ */}
          <div className="flex items-center">
            {/* モバイルメニューボタン */}
            <button
              className="mr-2 text-gray-700 md:hidden"
              onClick={handleMenuButtonClick}
              aria-label="Open menu"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>

            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-indigo-600">EC Shop</span>
            </Link>
          </div>

          {/* デスクトップナビゲーション */}
          <nav className="hidden md:flex space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-indigo-600 ${
                  isActiveLink(link.href)
                    ? "text-indigo-600 border-b-2 border-indigo-600"
                    : "text-gray-700"
                }`}
              >
                {link.name}
              </Link>
            ))}
            {isAdmin &&
              adminLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-indigo-600 ${
                    isActiveLink(link.href)
                      ? "text-indigo-600 border-b-2 border-indigo-600"
                      : "text-gray-700"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
          </nav>

          {/* デスクトップ右側のアクション */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/cart"
              className="relative p-2 text-gray-700 hover:text-indigo-600 transition-colors"
            >
              <ShoppingCartIcon className="h-6 w-6" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative group">
                <Link
                  href="/profile"
                  className="flex items-center space-x-1 text-gray-700 hover:text-indigo-600 transition-colors"
                >
                  <UserIcon className="h-6 w-6" />
                  <span className="text-sm font-medium hidden md:inline">
                    アカウント
                  </span>
                </Link>
                <div className="absolute right-0 w-48 mt-2 py-2 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  {userLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                    >
                      {link.name}
                    </Link>
                  ))}
                  <hr className="my-1" />
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    onClick={() => {
                      // ログアウト機能（実装は別途）
                    }}
                  >
                    ログアウト
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-800 border border-indigo-600 rounded-md px-4 py-2 transition-colors hidden md:block"
              >
                ログイン
              </Link>
            )}
          </div>
        </div>

        {/* モバイルメニュー (サイドバーがない場合のみ表示) */}
        {!onMenuClick && mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-3 pb-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium px-4 py-2 rounded-md ${
                    isActiveLink(link.href)
                      ? "text-indigo-600 bg-indigo-50"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              {isAdmin &&
                adminLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm font-medium px-4 py-2 rounded-md ${
                      isActiveLink(link.href)
                        ? "text-indigo-600 bg-indigo-50"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
            </nav>

            <div className="border-t border-gray-200 pt-4 pb-3 space-y-3 px-4">
              <Link
                href="/cart"
                className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                <ShoppingCartIcon className="h-5 w-5" />
                <span>
                  カート {cartItemsCount > 0 && `(${cartItemsCount})`}
                </span>
              </Link>

              {user ? (
                <>
                  {userLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span>{link.name}</span>
                    </Link>
                  ))}
                  <button
                    className="flex items-center space-x-2 text-red-600 hover:text-red-800"
                    onClick={() => {
                      // ログアウト機能（実装は別途）
                      setMobileMenuOpen(false);
                    }}
                  >
                    <span>ログアウト</span>
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-800"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>ログイン / 新規登録</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
