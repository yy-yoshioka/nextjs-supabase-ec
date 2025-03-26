import { NextRequest, NextResponse } from "next/server";
import { stripe, getStripeUrls } from "../../(lib)/stripe";
import { CartItem } from "../../(context)/CartContext";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../../(lib)/types/database";

export async function POST(request: NextRequest) {
  try {
    // リクエストからカートデータを取得
    const { items, customerId } = (await request.json()) as {
      items: CartItem[];
      customerId?: string;
    };

    // カートが空の場合はエラーを返す
    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "カートに商品がありません" },
        { status: 400 }
      );
    }

    // 開発環境かどうかでドメインを決定
    const domain = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // StripeのURLを取得
    const { success_url, cancel_url } = getStripeUrls(domain);

    // Stripe用の商品ラインアイテムの作成
    const lineItems = items.map((item) => ({
      price_data: {
        currency: "jpy",
        product_data: {
          name: item.product.name,
          description: item.product.description || undefined,
          images: item.product.image_url ? [item.product.image_url] : undefined,
        },
        unit_amount: item.product.price,
      },
      quantity: item.quantity,
    }));

    // メタデータとしてユーザーIDと商品IDを保存（後でwebhookで使用）
    const metadata: Record<string, string> = {
      items: JSON.stringify(
        items.map((item) => ({
          id: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
        }))
      ),
    };

    // ユーザーがログインしている場合、メタデータにユーザーIDを追加
    if (customerId) {
      metadata.userId = customerId;
    }

    // Stripeチェックアウトセッションの作成
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url,
      cancel_url,
      metadata,
    });

    // フロントエンドにセッションIDを返す
    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error("Stripeチェックアウトセッションの作成エラー:", error);
    return NextResponse.json(
      { error: "チェックアウトセッションの作成に失敗しました" },
      { status: 500 }
    );
  }
}
