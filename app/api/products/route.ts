import { NextResponse } from "next/server";
import { createProduct } from "../../(lib)/supabaseDb";
import { Product } from "../../(lib)/types/database";

// POSTリクエストのハンドラー - 商品の追加
export async function POST(request: Request) {
  try {
    // リクエストボディを解析
    const productData = await request.json();

    // 必須項目のバリデーション
    if (!productData.name || !productData.price) {
      return NextResponse.json(
        { error: "商品名と価格は必須です" },
        { status: 400 }
      );
    }

    // 価格のバリデーション
    if (typeof productData.price !== "number" || productData.price <= 0) {
      return NextResponse.json(
        { error: "価格は正の数値である必要があります" },
        { status: 400 }
      );
    }

    // 商品データから必要なフィールドだけを抽出
    const newProduct = {
      name: productData.name,
      price: productData.price,
      description: productData.description || null,
      image_url: productData.image_url || null,
    };

    // 商品の作成
    const createdProduct = await createProduct(newProduct);

    return NextResponse.json({
      success: true,
      message: "商品が正常に作成されました",
      product: createdProduct,
    });
  } catch (error) {
    console.error("商品の作成中にエラーが発生しました:", error);

    return NextResponse.json(
      { error: "商品の作成に失敗しました", details: (error as Error).message },
      { status: 500 }
    );
  }
}
