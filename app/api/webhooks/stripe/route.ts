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
  console.log("Stripeウェブフックを受信しました");

  try {
    // リクエストボディを取得
    const rawBody = await getRawBody(req);
    console.log("リクエストボディを取得しました");

    // Stripeイベントを検証
    const event = await verifyStripeEvent(req, rawBody);
    console.log("イベント検証結果:", event ? event.type : "検証失敗");

    if (!event) {
      console.error("イベントの検証に失敗しました");
      return NextResponse.json(
        { error: "イベントの検証に失敗しました" },
        { status: 400 }
      );
    }

    // イベントタイプに応じて処理
    switch (event.type) {
      case "checkout.session.completed":
        console.log("checkout.session.completedイベントを処理します");
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
  console.log("==================================================");
  console.log("チェックアウト完了イベントの処理を開始します");
  const session = event.data.object as Stripe.Checkout.Session;
  console.log("セッションID:", session.id);
  console.log(
    "セッションメタデータ:",
    JSON.stringify(session.metadata, null, 2)
  );
  console.log(
    "セッション全体:",
    JSON.stringify(
      {
        id: session.id,
        amount_total: session.amount_total,
        customer: session.customer,
        payment_status: session.payment_status,
      },
      null,
      2
    )
  );

  // セッションのメタデータからアイテムとユーザー情報を取得
  const items = session.metadata?.items;
  const userId = session.metadata?.userId;

  if (!items) {
    console.error("セッションにアイテム情報がありません:", session.id);
    return;
  }

  try {
    // メタデータからパースしたアイテム
    console.log("アイテムデータをパースします:", items);
    let parsedItems;
    try {
      parsedItems = JSON.parse(items);
      console.log("パース済みアイテム:", JSON.stringify(parsedItems, null, 2));
    } catch (parseError) {
      console.error("JSONのパースに失敗しました:", parseError);
      console.error("元のJSON文字列:", items);
      return;
    }

    // パースされたアイテムの検証
    if (!Array.isArray(parsedItems) || parsedItems.length === 0) {
      console.error(
        "パースされたアイテムが配列ではないか、空です:",
        parsedItems
      );
      return;
    }

    // ユーザーIDの確認
    const finalUserId = userId || "guest";
    console.log("注文に使用するユーザーID:", finalUserId);

    // 注文データを準備
    const orderData = {
      userId: finalUserId,
      items: parsedItems,
      totalPrice: session.amount_total ? session.amount_total / 100 : 0, // Stripeは金額をセント単位で保存
      status: "completed",
    };
    console.log("注文データ:", JSON.stringify(orderData, null, 2));

    // データベースに注文を作成
    console.log("注文データをデータベースに保存します");
    const result = await createOrder(orderData);

    if (!result.success) {
      console.error("注文の作成に失敗しました:", result.error);
    } else {
      console.log("注文が正常に作成されました:", result.order.id);

      // この注文IDをセッションに関連付けるためのメタデータを更新
      try {
        console.log("セッションメタデータを更新します");
        await stripe.checkout.sessions.update(session.id, {
          metadata: {
            ...session.metadata,
            orderId: result.order.id,
          },
        });
        console.log("セッションメタデータを更新しました");
      } catch (err) {
        console.error("セッションのメタデータ更新に失敗しました:", err);
      }
    }
  } catch (error) {
    console.error("注文処理中にエラーが発生しました:", error);
  }
  console.log("==================================================");
}
