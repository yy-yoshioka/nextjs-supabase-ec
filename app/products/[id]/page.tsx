"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database, Product } from "../../(lib)/types/database";
import AddToCartButton from "../../components/products/AddToCartButton";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = typeof params.id === "string" ? params.id : params.id?.[0];
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!productId) {
      router.push("/products");
      return;
    }

    async function fetchProduct() {
      setIsLoading(true);
      try {
        const supabase = createClientComponentClient<Database>();
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("id", productId)
          .single();

        if (error) {
          console.error("商品の取得に失敗しました:", error);
          router.push("/404");
          return;
        }

        setProduct(data || null);
      } catch (error) {
        console.error("商品の取得中にエラーが発生しました:", error);
        router.push("/404");
      } finally {
        setIsLoading(false);
      }
    }

    fetchProduct();
  }, [productId, router]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">商品が見つかりません</h1>
        <Link
          href="/products"
          className="inline-flex items-center text-indigo-600 hover:text-indigo-800"
        >
          商品一覧に戻る
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <Link
          href="/products"
          className="inline-flex items-center text-indigo-600 hover:text-indigo-800"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          商品一覧に戻る
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden md:flex">
        <div className="md:w-1/2 relative h-96 md:h-auto">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-20 w-20"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
        </div>

        <div className="p-6 md:w-1/2">
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-2xl font-bold text-indigo-700 mb-6">
            ¥{product.price.toLocaleString()}
          </p>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">商品説明</h2>
            <p className="text-gray-700 whitespace-pre-line">
              {product.description || "商品の説明はありません。"}
            </p>
          </div>

          <AddToCartButton product={product} />
        </div>
      </div>
    </div>
  );
}
