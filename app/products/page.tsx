"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProductGrid from "../components/products/ProductGrid";
import Pagination from "../components/ui/Pagination";
import ProductFilter from "../components/products/ProductFilter";
import ErrorMessage from "../components/ui/ErrorMessage";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { useAuth } from "../(context)/AuthProvider";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database, Product } from "../(lib)/types/database";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  // ページネーション用の状態
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const productsPerPage = 2; // 1ページあたりの商品数を2に減らす（確実にページネーションを表示させるため）

  // フィルター用の状態
  const [searchQuery, setSearchQuery] = useState("");
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [sortOption, setSortOption] = useState("created_at-desc");

  // 商品データの取得
  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const supabase = createClientComponentClient<Database>();
      let query = supabase.from("products").select("*");

      const { data, error } = await query;

      if (error) {
        console.error("商品の取得に失敗しました:", error);
        setError("商品データの読み込みに失敗しました。");
        return;
      }

      setProducts(data || []);
    } catch (error) {
      console.error("商品の取得中にエラーが発生しました:", error);
      setError("予期せぬエラーが発生しました。もう一度お試しください。");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 検索、フィルター、ソートの適用
  useEffect(() => {
    if (products.length === 0) return;

    let result = [...products];

    // 検索の適用
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(lowerQuery) ||
          (product.description &&
            product.description.toLowerCase().includes(lowerQuery))
      );
    }

    // 価格範囲フィルターの適用
    if (minPrice !== null) {
      result = result.filter((product) => product.price >= minPrice);
    }
    if (maxPrice !== null) {
      result = result.filter((product) => product.price <= maxPrice);
    }

    // ソートの適用
    const [sortField, sortDirection] = sortOption.split("-");
    result.sort((a, b) => {
      let comparison = 0;
      if (sortField === "name") {
        comparison = a.name.localeCompare(b.name);
      } else if (sortField === "price") {
        comparison = a.price - b.price;
      } else if (sortField === "created_at") {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        comparison = dateA - dateB;
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });

    // フィルター適用後の結果を設定
    setFilteredProducts(result);

    // ページ数の計算
    const calculatedTotalPages = Math.max(
      1,
      Math.ceil(result.length / productsPerPage)
    );
    setTotalPages(calculatedTotalPages);

    // デバッグログ
    console.log("商品総数:", result.length);
    console.log("1ページあたりの商品数:", productsPerPage);
    console.log("総ページ数:", calculatedTotalPages);

    // 現在のページが有効範囲外になった場合、1ページ目に戻す
    if (currentPage > Math.ceil(result.length / productsPerPage)) {
      setCurrentPage(1);
    }
  }, [
    products,
    searchQuery,
    minPrice,
    maxPrice,
    sortOption,
    currentPage,
    productsPerPage,
  ]);

  // 表示する商品のページネーション
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  // ページの変更ハンドラー
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // ページトップへスクロール
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // フィルターをクリアする関数
  const clearFilters = () => {
    setSearchQuery("");
    setMinPrice(null);
    setMaxPrice(null);
    setSortOption("created_at-desc");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">商品一覧</h1>
        {isAdmin && (
          <Link
            href="/admin/products/add"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
          >
            商品を追加
          </Link>
        )}
      </div>

      {/* フィルターコンポーネント */}
      <ProductFilter
        onSearch={setSearchQuery}
        onPriceRangeChange={(min, max) => {
          setMinPrice(min);
          setMaxPrice(max);
        }}
        onSortChange={setSortOption}
      />

      {isLoading ? (
        <div className="flex justify-center items-center py-16">
          <LoadingSpinner size="large" text="商品を読み込み中..." />
        </div>
      ) : error ? (
        <ErrorMessage
          message={error}
          onRetry={fetchProducts}
          className="my-6"
        />
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">
            {searchQuery || minPrice || maxPrice
              ? "検索条件に一致する商品が見つかりません。"
              : "商品がありません。"}
          </p>
          {(searchQuery || minPrice || maxPrice) && (
            <button
              onClick={clearFilters}
              className="mt-2 text-indigo-600 underline"
            >
              フィルターをクリア
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="mb-4 text-sm text-gray-500">
            {filteredProducts.length}件の商品が見つかりました
            {(searchQuery || minPrice || maxPrice) && (
              <button
                onClick={clearFilters}
                className="ml-2 text-indigo-600 underline"
              >
                フィルターをクリア
              </button>
            )}
          </div>
          <ProductGrid products={currentProducts} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}
