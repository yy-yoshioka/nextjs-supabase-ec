import Stripe from "stripe";

// .env.localでStripe秘密鍵が定義されていることを確認
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY環境変数が設定されていません");
}

// Stripeインスタンスを作成
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-02-24.acacia", // 最新のAPIバージョンを使用
});

// チェックアウトセッションの成功URLと失敗URL
export const getStripeUrls = (host?: string) => {
  // 本番環境とローカル環境で適切なドメインを使用
  const domain =
    host || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return {
    success_url: `${domain}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${domain}/checkout/cancel`,
  };
};
