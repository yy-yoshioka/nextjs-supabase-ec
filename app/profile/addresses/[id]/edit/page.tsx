"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/app/(lib)/auth";
import { UserAddress } from "@/app/(lib)/types/database";
import { getUserAddresses, updateUserAddress } from "@/app/(lib)/addresses";
import AddressForm from "@/app/components/AddressForm";

export default function EditAddressPage() {
  const router = useRouter();
  const params = useParams();
  const addressId = typeof params?.id === "string" ? params.id : "";

  const [address, setAddress] = useState<UserAddress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAddressData = async () => {
      try {
        setLoading(true);
        setError(null);

        // ユーザー認証確認
        const user = await getCurrentUser();
        if (!user) {
          router.push(`/login?redirect=/profile/addresses/${addressId}/edit`);
          return;
        }

        // 住所データを取得
        const { data, error } = await getUserAddresses(user.id);
        if (error) {
          console.error("Failed to fetch addresses:", error);
          setError("住所情報の取得に失敗しました。");
          return;
        }

        // 編集対象の住所を見つける
        const targetAddress = data?.find((addr) => addr.id === addressId);
        if (!targetAddress) {
          setError("指定された住所が見つかりません。");
          return;
        }

        setAddress(targetAddress);
      } catch (err) {
        console.error("Error in loadAddressData:", err);
        setError("エラーが発生しました。再度お試しください。");
      } finally {
        setLoading(false);
      }
    };

    if (addressId) {
      loadAddressData();
    } else {
      setError("住所IDが指定されていません。");
      setLoading(false);
    }
  }, [addressId, router]);

  const handleSubmit = async (addressData: Partial<UserAddress>) => {
    if (!addressId) {
      setError("住所IDが指定されていません。");
      return;
    }

    try {
      const { data, error } = await updateUserAddress(addressId, addressData);

      if (error) {
        console.error("Failed to update address:", error);
        setError("住所の更新に失敗しました。");
        return;
      }

      // 更新成功したら住所一覧ページにリダイレクト
      router.push("/profile/addresses");
    } catch (err) {
      console.error("Error in handleSubmit:", err);
      setError("エラーが発生しました。再度お試しください。");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">住所を編集</h1>
        <div className="text-center py-12">
          <div className="spinner"></div>
          <p className="mt-4">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error && !address) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">住所を編集</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
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

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">住所を編集</h1>
        <p className="text-gray-600 mt-2">
          {address?.name || "住所"} の情報を編集します。
        </p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
          {error}
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <AddressForm
          address={address}
          onSubmit={handleSubmit}
          onCancel={() => router.push("/profile/addresses")}
          submitButtonText="更新する"
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
