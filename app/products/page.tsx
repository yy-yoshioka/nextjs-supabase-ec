"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProductGrid from "../components/products/ProductGrid";
import { useAuth } from "../(context)/AuthProvider";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database, Product } from "../(lib)/types/database";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    async function fetchProducts() {
      setIsLoading(true);
      try {
        const supabase = createClientComponentClient<Database>();
        const { data, error } = await supabase.from("products").select("*");

        if (error) {
          console.error("商品の取得に失敗しました:", error);
          return;
        }

        setProducts(data || []);
      } catch (error) {
        console.error("商品の取得中にエラーが発生しました:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, []);

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

      {isLoading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">商品がありません。</p>
        </div>
      ) : (
        <ProductGrid products={products} />
      )}
    </div>
  );
}
