import { NextRequest, NextResponse } from "next/server";
import {
  getProductById,
  updateProduct,
  deleteProduct,
} from "../../../(lib)/supabaseDb";

// GETリクエストのハンドラー - 特定の商品の取得
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await getProductById(params.id);
    return NextResponse.json(product);
  } catch (error) {
    console.error(
      `商品の取得中にエラーが発生しました (ID: ${params.id}):`,
      error
    );
    return NextResponse.json(
      { error: "商品の取得に失敗しました", details: (error as Error).message },
      { status: 500 }
    );
  }
}

// PUTリクエストのハンドラー - 商品の更新
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // リクエストボディを解析
    const productData = await request.json();

    // バリデーション
    if (Object.keys(productData).length === 0) {
      return NextResponse.json(
        { error: "更新するデータがありません" },
        { status: 400 }
      );
    }

    // 価格のバリデーション（更新される場合）
    if (
      productData.price !== undefined &&
      (typeof productData.price !== "number" || productData.price <= 0)
    ) {
      return NextResponse.json(
        { error: "価格は正の数値である必要があります" },
        { status: 400 }
      );
    }

    // 更新前に商品の存在確認
    await getProductById(params.id);

    // 商品の更新
    const updatedProduct = await updateProduct(params.id, productData);

    return NextResponse.json({
      success: true,
      message: "商品が正常に更新されました",
      product: updatedProduct,
    });
  } catch (error) {
    console.error(
      `商品の更新中にエラーが発生しました (ID: ${params.id}):`,
      error
    );
    return NextResponse.json(
      { error: "商品の更新に失敗しました", details: (error as Error).message },
      { status: 500 }
    );
  }
}

// DELETEリクエストのハンドラー - 商品の削除
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 削除前に商品の存在確認
    await getProductById(params.id);

    // 商品の削除
    await deleteProduct(params.id);

    return NextResponse.json({
      success: true,
      message: "商品が正常に削除されました",
    });
  } catch (error) {
    console.error(
      `商品の削除中にエラーが発生しました (ID: ${params.id}):`,
      error
    );
    return NextResponse.json(
      { error: "商品の削除に失敗しました", details: (error as Error).message },
      { status: 500 }
    );
  }
}
