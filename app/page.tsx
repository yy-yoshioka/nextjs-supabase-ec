"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      {/* ヒーローセクション */}
      <section className="w-full bg-gray-900 py-20 text-white">
        <div className="container mx-auto px-4 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            EC Shop へようこそ
          </h1>
          <p className="text-xl max-w-2xl mb-10">
            高品質な商品を取り揃えた、オンラインショッピングサイトです。
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/products"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300"
            >
              商品を見る
            </Link>
            <Link
              href="/auth/login"
              className="bg-transparent border-2 border-white hover:bg-white hover:text-gray-900 text-white font-semibold py-3 px-6 rounded-lg transition duration-300"
            >
              ログイン
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
