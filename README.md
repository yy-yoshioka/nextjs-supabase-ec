This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Stripeの設定

### 1. Stripeアカウントの設定

1. [Stripe Dashboard](https://dashboard.stripe.com)でアカウントを作成
2. APIキーを取得（テストモード）
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: パブリックキー
   - `STRIPE_SECRET_KEY`: シークレットキー

### 2. Webhookの設定

開発環境でWebhookをテストするには:

1. [Stripe CLI](https://stripe.com/docs/stripe-cli)をインストール
2. 以下のコマンドを実行して、ローカル環境でWebhookをテスト:

```bash
stripe login
stripe listen --forward-to http://localhost:3000/api/webhooks/stripe
```

3. 表示されたWebhook Signing Secretを `.env.local` に追加:

```
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxx
```

本番環境では:

1. [Stripe Dashboard](https://dashboard.stripe.com/webhooks)でWebhookエンドポイントを追加
2. エンドポイントURL: `https://あなたのドメイン/api/webhooks/stripe`
3. イベントタイプ: `checkout.session.completed`, `payment_intent.succeeded` を選択
4. Signing Secretを `.env` に追加

### 3. Webhook動作確認

1. Webhookのログを確認: `stripe listen --forward-to http://localhost:3000/api/webhooks/stripe`
2. テスト購入を行う
3. ログに以下のメッセージが表示されることを確認:
   - `checkout.session.completedイベントを処理します`
   - `注文が正常に作成されました`

問題が発生した場合は、ログを確認して問題を特定してください。
