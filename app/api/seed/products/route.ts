import { NextResponse } from "next/server";
import { seedProducts } from "../../../(lib)/seedProducts";

// POSTリクエストのハンドラー
export async function POST(request: Request) {
  try {
    // シークレットキーによる認証（本番環境ではより強固な認証が必要）
    const { searchParams } = new URL(request.url);
    const apiKey = searchParams.get("key");

    // 簡易的な認証（APIキーの検証）
    // 本番環境では環境変数などでより安全に管理すべき
    if (apiKey !== "your-secret-api-key") {
      return NextResponse.json(
        { error: "認証エラー: 無効なAPIキーです" },
        { status: 401 }
      );
    }

    // シード処理の実行
    const products = await seedProducts();

    return NextResponse.json({
      success: true,
      message: `${products.length}件の商品データを登録しました`,
      count: products.length,
    });
  } catch (error) {
    console.error("商品データのシード処理中にエラーが発生しました:", error);

    return NextResponse.json(
      {
        error: "商品データの登録に失敗しました",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
