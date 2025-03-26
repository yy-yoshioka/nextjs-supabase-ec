import { NextRequest, NextResponse } from "next/server";
import { stripe, getStripeUrls } from "../../(lib)/stripe";
import { CartItem } from "../../(context)/CartContext";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../../(lib)/types/database";

export async function POST(request: NextRequest) {
  try {
    console.log("チェックアウトAPIが呼び出されました");

    // リクエストからカートデータを取得
    const requestData = await request.json();
    const { items, customerId } = requestData as {
      items: CartItem[];
      customerId?: string;
    };

    console.log("リクエストデータ:", {
      itemsCount: items?.length,
      hasCustomerId: !!customerId,
    });

    // カートが空の場合はエラーを返す
    if (!items || items.length === 0) {
      console.error("カートに商品がありません");
      return NextResponse.json(
        { error: "カートに商品がありません" },
        { status: 400 }
      );
    }

    // 開発環境かどうかでドメインを決定
    const domain = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    console.log("使用するドメイン:", domain);

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
    console.log(lineItems);

    // メタデータとしてユーザーIDと商品IDを保存（後でwebhookで使用）
    // 注文アイテムを単純化して保存
    const simplifiedItems = items.map((item) => ({
      id: item.product.id,
      quantity: item.quantity,
      price: item.product.price,
    }));

    // JSON文字列を安全に作成
    const itemsJson = JSON.stringify(simplifiedItems);
    console.log("メタデータに保存するアイテムJSON:", itemsJson);

    const metadata: Record<string, string> = {
      items: itemsJson,
    };

    // ユーザーがログインしている場合、メタデータにユーザーIDを追加
    if (customerId) {
      metadata.userId = customerId;
      console.log("メタデータにユーザーIDを追加:", customerId);
    }

    // Stripeチェックアウトセッションの作成
    console.log("Stripeチェックアウトセッションを作成します");
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url,
      cancel_url,
      metadata,
    });

    console.log("チェックアウトセッションが作成されました:", session.id);

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
