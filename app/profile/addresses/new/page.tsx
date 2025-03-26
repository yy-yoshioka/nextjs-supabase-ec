"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/app/(lib)/auth";
import { UserAddress } from "@/app/(lib)/types/database";
import { createUserAddress } from "@/app/(lib)/addresses";
import AddressForm from "@/app/components/AddressForm";

export default function NewAddressPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);

        // ユーザー認証確認
        const user = await getCurrentUser();
        if (!user) {
          router.push("/login?redirect=/profile/addresses/new");
          return;
        }

        setUserId(user.id);
      } catch (err) {
        console.error("Error in checkAuth:", err);
        setError("認証エラーが発生しました。再度ログインしてください。");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleSubmit = async (addressData: Partial<UserAddress>) => {
    if (!userId) {
      setError("ユーザーIDが取得できません。再度ログインしてください。");
      return;
    }

    try {
      // 必須フィールドのチェック
      if (
        !addressData.name ||
        !addressData.recipient_name ||
        !addressData.street_address
      ) {
        setError("必須項目を入力してください。");
        return;
      }

      const newAddressData = {
        ...addressData,
        user_id: userId,
      } as Omit<UserAddress, "id" | "created_at">;

      const { data, error } = await createUserAddress(newAddressData);

      if (error) {
        console.error("Failed to create address:", error);
        setError("住所の作成に失敗しました。");
        return;
      }

      // 作成成功したら住所一覧ページにリダイレクト
      router.push("/profile/addresses");
    } catch (err) {
      console.error("Error in handleSubmit:", err);
      setError("エラーが発生しました。再度お試しください。");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">新しい配送先住所</h1>
        <div className="text-center py-12">
          <div className="spinner"></div>
          <p className="mt-4">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">新しい配送先住所</h1>
        <p className="text-gray-600 mt-2">
          配送先の住所情報を入力してください。
        </p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
          {error}
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <AddressForm
          onSubmit={handleSubmit}
          onCancel={() => router.push("/profile/addresses")}
          submitButtonText="住所を追加"
        />
      </div>

      <div className="mt-8">
        <Link
          href="/profile/addresses"
          className="text-indigo-600 hover:underline"
        >
          ← 住所一覧に戻る
        </Link>
      </div>
    </div>
  );
}
