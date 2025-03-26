"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  // カテゴリーのドロップダウン状態
  const [openCategories, setOpenCategories] = useState<string[]>([]);

  // カテゴリーをトグルする関数
  const toggleCategory = (category: string) => {
    setOpenCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  // カテゴリーとサブカテゴリーのリスト
  const categories = [
    {
      name: "衣類",
      slug: "clothing",
      subcategories: [
        { name: "トップス", slug: "tops" },
        { name: "ボトムス", slug: "bottoms" },
        { name: "アウター", slug: "outerwear" },
        { name: "シューズ", slug: "shoes" },
      ],
    },
    {
      name: "家電",
      slug: "electronics",
      subcategories: [
        { name: "スマートフォン", slug: "smartphones" },
        { name: "タブレット", slug: "tablets" },
        { name: "ノートパソコン", slug: "laptops" },
        { name: "オーディオ", slug: "audio" },
      ],
    },
    {
      name: "ホーム&キッチン",
      slug: "home-kitchen",
      subcategories: [
        { name: "家具", slug: "furniture" },
        { name: "調理器具", slug: "cookware" },
        { name: "家庭用品", slug: "homeware" },
        { name: "収納", slug: "storage" },
      ],
    },
    {
      name: "ビューティー",
      slug: "beauty",
      subcategories: [
        { name: "スキンケア", slug: "skincare" },
        { name: "メイクアップ", slug: "makeup" },
        { name: "ヘアケア", slug: "haircare" },
        { name: "フレグランス", slug: "fragrance" },
      ],
    },
  ];

  // 特集セクション
  const featuredSections = [
    { name: "新着商品", slug: "new-arrivals" },
    { name: "セール", slug: "sale" },
    { name: "ギフト", slug: "gifts" },
    { name: "限定コレクション", slug: "limited-editions" },
  ];

  // アクティブなリンクかどうかを判定する関数
  const isActiveLink = (href: string) => {
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-full bg-white w-80 shadow-xl transform transition-transform duration-300 ease-in-out z-40 pt-16 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="h-full overflow-y-auto pb-20">
        {/* サイドバーヘッダーとクローズボタン */}
        <div className="px-6 py-4 flex justify-between items-center border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">カテゴリー</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label="Close sidebar"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* 特集セクション */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wider mb-3">
            特集
          </h3>
          <ul className="space-y-2">
            {featuredSections.map((section) => (
              <li key={section.slug}>
                <Link
                  href={`/products?feature=${section.slug}`}
                  onClick={onClose}
                  className={`block px-2 py-2 rounded-md text-sm ${
                    isActiveLink(`/products?feature=${section.slug}`)
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {section.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* カテゴリーとサブカテゴリー */}
        <div className="px-6 py-4">
          <ul className="space-y-1">
            {categories.map((category) => (
              <li key={category.slug} className="mb-2">
                <div className="mb-1">
                  <button
                    onClick={() => toggleCategory(category.slug)}
                    className={`flex justify-between items-center w-full px-2 py-2 text-left text-sm font-medium rounded-md ${
                      isActiveLink(`/products/category/${category.slug}`)
                        ? "text-indigo-600 bg-indigo-50"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <span>{category.name}</span>
                    {openCategories.includes(category.slug) ? (
                      <ChevronDownIcon className="h-4 w-4" />
                    ) : (
                      <ChevronRightIcon className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {openCategories.includes(category.slug) && (
                  <ul className="ml-4 space-y-1 border-l border-gray-200 pl-4">
                    {category.subcategories.map((subcategory) => (
                      <li key={subcategory.slug}>
                        <Link
                          href={`/products/category/${category.slug}/${subcategory.slug}`}
                          onClick={onClose}
                          className={`block px-2 py-2 text-sm rounded-md ${
                            isActiveLink(
                              `/products/category/${category.slug}/${subcategory.slug}`
                            )
                              ? "text-indigo-600 bg-indigo-50"
                              : "text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          {subcategory.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* 追加のリンク */}
        <div className="px-6 py-4 mt-4 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wider mb-3">
            サポート
          </h3>
          <ul className="space-y-2">
            <li>
              <Link
                href="/contact"
                onClick={onClose}
                className="block px-2 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
              >
                お問い合わせ
              </Link>
            </li>
            <li>
              <Link
                href="/faq"
                onClick={onClose}
                className="block px-2 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
              >
                よくある質問
              </Link>
            </li>
            <li>
              <Link
                href="/shipping"
                onClick={onClose}
                className="block px-2 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
              >
                配送について
              </Link>
            </li>
            <li>
              <Link
                href="/returns"
                onClick={onClose}
                className="block px-2 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
              >
                返品・交換ポリシー
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
}
