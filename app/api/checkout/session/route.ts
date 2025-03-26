import { NextRequest, NextResponse } from "next/server";
import { stripe } from "../../../(lib)/stripe";
import { headers } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    // URLからセッションIDを取得
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("id");

    if (!sessionId) {
      return NextResponse.json(
        { error: "セッションIDが指定されていません" },
        { status: 400 }
      );
    }

    // セキュリティチェック（本番環境用）
    // const headersList = headers();
    // const origin = headersList.get("origin");
    // const allowedOrigins = [process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"];
    // if (!allowedOrigins.includes(origin || "")) {
    //   return NextResponse.json(
    //     { error: "不正なオリジンからのリクエストです" },
    //     { status: 403 }
    //   );
    // }

    // Stripe APIでセッションの詳細を取得
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // 注文IDとその他必要な情報を返す
    return NextResponse.json({
      orderId: session.metadata?.orderId || null,
      paymentStatus: session.payment_status,
      customerEmail: session.customer_details?.email,
    });
  } catch (error) {
    console.error("セッション情報の取得に失敗しました:", error);
    return NextResponse.json(
      { error: "セッション情報の取得に失敗しました" },
      { status: 500 }
    );
  }
}
