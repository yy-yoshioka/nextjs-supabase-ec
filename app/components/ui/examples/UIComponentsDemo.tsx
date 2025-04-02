"use client";

import React, { useState } from "react";
import { Button } from "../Button";
import { Input } from "../Input";
import { Modal } from "../Modal";
import {
  NotificationProvider,
  useNotification,
  SuccessMessage,
  ErrorMessage,
} from "../Notification";
import {
  Mail,
  Lock,
  Search,
  User,
  Bell,
  Settings,
  Plus,
  FileText,
  Calendar,
  ChevronRight,
} from "lucide-react";

export default function UIComponentsExamplePage() {
  return (
    <NotificationProvider>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">UIコンポーネント一覧</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <ButtonsSection />
            <InputsSection />
          </div>
          <div className="space-y-8">
            <ModalsSection />
            <NotificationsSection />
            <MessagesSection />
          </div>
        </div>
      </div>
    </NotificationProvider>
  );
}

function ButtonsSection() {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold border-b pb-2">ボタン</h2>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium mb-3">バリアント</h3>
          <div className="flex flex-wrap gap-2">
            <Button variant="primary">プライマリ</Button>
            <Button variant="secondary">セカンダリ</Button>
            <Button variant="outline">アウトライン</Button>
            <Button variant="ghost">ゴースト</Button>
            <Button variant="link">リンク</Button>
            <Button variant="danger">危険</Button>
            <Button variant="success">成功</Button>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-3">サイズ</h3>
          <div className="flex flex-wrap items-center gap-2">
            <Button size="xs">極小</Button>
            <Button size="sm">小</Button>
            <Button size="md">中</Button>
            <Button size="lg">大</Button>
            <Button size="xl">特大</Button>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-3">状態</h3>
          <div className="flex flex-wrap gap-2">
            <Button disabled>無効</Button>
            <Button isLoading>読み込み中</Button>
            <Button isLoading variant="outline">
              読み込み中
            </Button>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-3">幅</h3>
          <div className="space-y-2">
            <Button>通常の幅</Button>
            <Button fullWidth>全幅</Button>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-3">アイコン付き</h3>
          <div className="flex flex-wrap gap-2">
            <Button leftIcon={<Mail />}>メール送信</Button>
            <Button rightIcon={<ChevronRight />}>続ける</Button>
            <Button variant="outline" leftIcon={<Plus />}>
              追加
            </Button>
            <Button
              variant="success"
              leftIcon={<FileText />}
              rightIcon={<ChevronRight />}
            >
              レポートを表示
            </Button>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-3">リンク</h3>
          <div className="flex flex-wrap gap-2">
            <Button href="/" target="_blank">
              ホームへ
            </Button>
            <Button variant="outline" href="/" leftIcon={<Calendar />}>
              予定を見る
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function InputsSection() {
  const [showPassword, setShowPassword] = useState(true);

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold border-b pb-2">入力フィールド</h2>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium mb-3">バリアント</h3>
          <div className="flex flex-col gap-4">
            <Input label="デフォルト" placeholder="テキストを入力" />
            <Input
              label="エラー"
              placeholder="メールアドレス"
              error="有効なメールアドレスを入力してください"
            />
            <Input
              label="無効"
              placeholder="編集できません"
              disabled
              value="無効なフィールド"
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-3">サイズ</h3>
          <div className="flex flex-col gap-4">
            <Input label="小" size="sm" placeholder="小さいサイズ" />
            <Input label="中（デフォルト）" size="md" placeholder="中サイズ" />
            <Input label="大" size="lg" placeholder="大きいサイズ" />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-3">アイコン付き</h3>
          <div className="flex flex-col gap-4">
            <Input
              label="左アイコン"
              placeholder="検索"
              startIcon={<Search className="h-5 w-5" />}
            />
            <Input
              label="右アイコン"
              placeholder="ユーザー名"
              endIcon={<User className="h-5 w-5" />}
            />
            <Input
              label="パスワード"
              type="password"
              placeholder="パスワード"
              startIcon={<Lock className="h-5 w-5" />}
              showPasswordToggle={showPassword}
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-3">ヘルパーテキスト</h3>
          <div className="flex flex-col gap-4">
            <Input
              label="ユーザー名"
              placeholder="johndoe"
              helperText="半角英数字で入力してください"
            />
            <Input
              type="password"
              label="パスワード"
              placeholder="8文字以上"
              helperText="英字・数字・記号を組み合わせると安全です"
              showPasswordToggle
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function ModalsSection() {
  const [basicModal, setBasicModal] = useState(false);
  const [withDescriptionModal, setWithDescriptionModal] = useState(false);
  const [withFooterModal, setWithFooterModal] = useState(false);
  const [largeModal, setLargeModal] = useState(false);
  const [smallModal, setSmallModal] = useState(false);

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold border-b pb-2">モーダル</h2>

      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => setBasicModal(true)}>基本</Button>
          <Button onClick={() => setWithDescriptionModal(true)}>
            説明付き
          </Button>
          <Button onClick={() => setWithFooterModal(true)}>フッター付き</Button>
          <Button onClick={() => setLargeModal(true)}>大サイズ</Button>
          <Button onClick={() => setSmallModal(true)}>小サイズ</Button>
        </div>

        {/* 基本モーダル */}
        <Modal
          isOpen={basicModal}
          onClose={() => setBasicModal(false)}
          title="基本モーダル"
        >
          <div className="py-4">
            <p>
              モーダルのコンテンツをここに記述します。任意のコンテンツを配置できます。
            </p>
          </div>
        </Modal>

        {/* 説明付きモーダル */}
        <Modal
          isOpen={withDescriptionModal}
          onClose={() => setWithDescriptionModal(false)}
          title="説明付きモーダル"
          description="モーダルの用途や入力内容について説明するテキストを配置できます。"
        >
          <div className="py-4">
            <p>モーダルのコンテンツをここに記述します。</p>
          </div>
        </Modal>

        {/* フッター付きモーダル */}
        <Modal
          isOpen={withFooterModal}
          onClose={() => setWithFooterModal(false)}
          title="フッター付きモーダル"
          showCloseButton
          footer={
            <Button onClick={() => setWithFooterModal(false)}>保存</Button>
          }
        >
          <div className="py-4">
            <p>
              フッターにはボタンやその他のコンテンツを配置できます。「閉じる」ボタンも必要に応じて表示可能です。
            </p>
          </div>
        </Modal>

        {/* 大サイズモーダル */}
        <Modal
          isOpen={largeModal}
          onClose={() => setLargeModal(false)}
          title="大サイズモーダル"
          maxWidth="xl"
        >
          <div className="py-4">
            <p>大きなコンテンツを表示するときに適したサイズです。</p>
            <div className="h-60 bg-gray-100 rounded-lg mt-4 flex items-center justify-center">
              コンテンツエリア
            </div>
          </div>
        </Modal>

        {/* 小サイズモーダル */}
        <Modal
          isOpen={smallModal}
          onClose={() => setSmallModal(false)}
          title="小サイズモーダル"
          maxWidth="sm"
        >
          <div className="py-4">
            <p>
              シンプルなダイアログや確認画面に適したコンパクトなサイズです。
            </p>
          </div>
        </Modal>
      </div>
    </section>
  );
}

function NotificationsSection() {
  // 通知を使用するためのフック
  const { showNotification } = useNotification();

  const showSuccessNotification = () => {
    showNotification({
      type: "success",
      title: "成功",
      message: "操作が正常に完了しました",
    });
  };

  const showErrorNotification = () => {
    showNotification({
      type: "error",
      title: "エラー",
      message: "エラーが発生しました。もう一度お試しください。",
    });
  };

  const showWarningNotification = () => {
    showNotification({
      type: "warning",
      title: "警告",
      message: "この操作は取り消せません。本当に続けますか？",
    });
  };

  const showInfoNotification = () => {
    showNotification({
      type: "info",
      title: "お知らせ",
      message: "新しい機能が利用可能になりました",
    });
  };

  const showLongDurationNotification = () => {
    showNotification({
      type: "info",
      message: "この通知は10秒間表示されます",
      duration: 10000,
    });
  };

  const showPositionedNotification = () => {
    showNotification({
      type: "success",
      message: "下部中央に表示される通知です",
      position: "bottom-center",
    });
  };

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold border-b pb-2">通知 (トースト)</h2>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium mb-3">タイプ</h3>
          <div className="flex flex-wrap gap-2">
            <Button onClick={showSuccessNotification}>成功</Button>
            <Button onClick={showErrorNotification}>エラー</Button>
            <Button onClick={showWarningNotification}>警告</Button>
            <Button onClick={showInfoNotification}>情報</Button>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-3">カスタマイズ</h3>
          <div className="flex flex-wrap gap-2">
            <Button onClick={showLongDurationNotification}>表示時間延長</Button>
            <Button onClick={showPositionedNotification}>位置指定</Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function MessagesSection() {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold border-b pb-2">
        インラインメッセージ
      </h2>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium mb-3">タイプ</h3>
          <div className="space-y-4">
            <SuccessMessage message="データが正常に保存されました" />
            <ErrorMessage message="エラーが発生しました" />
            <ErrorMessage
              message="ファイルのアップロードに失敗しました"
              onRetry={() => alert("再試行が開始されました")}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
