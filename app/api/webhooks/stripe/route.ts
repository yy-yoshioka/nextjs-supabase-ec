import { NextRequest, NextResponse } from "next/server";
import { stripe } from "../../../(lib)/stripe";
import { createOrder } from "../../../(lib)/orders";
import { Stripe } from "stripe";

// バッファをストリームから読み込む関数
async function getRawBody(req: NextRequest): Promise<Buffer> {
  const chunks: Buffer[] = [];
  const reader = req.body!.getReader();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(Buffer.from(value));
  }

  return Buffer.concat(chunks);
}

// Stripeイベントを検証する関数
const verifyStripeEvent = async (
  req: NextRequest,
  rawBody: Buffer
): Promise<Stripe.Event | null> => {
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    console.error("署名がリクエストヘッダーにありません");
    return null;
  }

  try {
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      throw new Error("STRIPE_WEBHOOK_SECRET環境変数が設定されていません");
    }

    return stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Stripeイベントの検証に失敗しました:", err);
    return null;
  }
};

// Webhook処理のメインハンドラー
export async function POST(req: NextRequest) {
  try {
    // リクエストボディを取得
    const rawBody = await getRawBody(req);

    // Stripeイベントを検証
    const event = await verifyStripeEvent(req, rawBody);

    if (!event) {
      return NextResponse.json(
        { error: "イベントの検証に失敗しました" },
        { status: 400 }
      );
    }

    // イベントタイプに応じて処理
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(event);
        break;

      case "payment_intent.succeeded":
        console.log("支払いが成功しました:", event.id);
        break;

      default:
        console.log(`未処理のイベントタイプ: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhookの処理中にエラーが発生しました:", error);
    return NextResponse.json(
      { error: "Webhookの処理中にエラーが発生しました" },
      { status: 500 }
    );
  }
}

// checkout.session.completedイベントの処理
async function handleCheckoutSessionCompleted(event: Stripe.Event) {
  const session = event.data.object as Stripe.Checkout.Session;

  // セッションのメタデータからアイテムとユーザー情報を取得
  const items = session.metadata?.items;
  const userId = session.metadata?.userId;

  if (!items) {
    console.error("セッションにアイテム情報がありません:", session.id);
    return;
  }

  try {
    // メタデータからパースしたアイテム
    const parsedItems = JSON.parse(items);

    // 注文データを準備
    const orderData = {
      userId: userId || "guest", // ユーザーIDがない場合はゲスト購入
      items: parsedItems,
      totalPrice: session.amount_total ? session.amount_total / 100 : 0, // Stripeは金額をセント単位で保存
      status: "completed",
    };

    // データベースに注文を作成
    const result = await createOrder(orderData);

    if (!result.success) {
      console.error("注文の作成に失敗しました:", result.error);
    } else {
      console.log("注文が正常に作成されました:", result.order.id);
    }
  } catch (error) {
    console.error("注文処理中にエラーが発生しました:", error);
  }
}
