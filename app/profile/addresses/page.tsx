"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/app/(lib)/auth";
import { UserAddress } from "@/app/(lib)/types/database";
import {
  getUserAddresses,
  deleteUserAddress,
  setDefaultUserAddress,
} from "@/app/(lib)/addresses";
import AddressCard from "@/app/components/AddressCard";

export default function AddressesPage() {
  const router = useRouter();
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuthAndLoadAddresses = async () => {
      try {
        setLoading(true);
        setError(null);

        // ユーザー認証確認
        const user = await getCurrentUser();
        if (!user) {
          router.push("/login?redirect=/profile/addresses");
          return;
        }

        // 住所一覧を取得
        const { data, error } = await getUserAddresses(user.id);
        if (error) {
          console.error("Failed to fetch addresses:", error);
          setError("住所情報の取得に失敗しました。");
          return;
        }

        setAddresses(data || []);
      } catch (err) {
        console.error("Error in checkAuthAndLoadAddresses:", err);
        setError("エラーが発生しました。再度お試しください。");
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndLoadAddresses();
  }, [router]);

  const handleDeleteAddress = async (addressId: string) => {
    try {
      const { success, error } = await deleteUserAddress(addressId);
      if (error) {
        console.error("Failed to delete address:", error);
        setError("住所の削除に失敗しました。");
        return;
      }

      if (success) {
        // 住所一覧を更新
        setAddresses(addresses.filter((addr) => addr.id !== addressId));
      }
    } catch (err) {
      console.error("Error in handleDeleteAddress:", err);
      setError("エラーが発生しました。再度お試しください。");
    }
  };

  const handleSetDefaultAddress = async (addressId: string) => {
    try {
      const { success, error } = await setDefaultUserAddress(addressId);
      if (error) {
        console.error("Failed to set default address:", error);
        setError("デフォルト住所の設定に失敗しました。");
        return;
      }

      if (success) {
        // 住所一覧を更新（デフォルト設定を反映）
        setAddresses(
          addresses.map((addr) => ({
            ...addr,
            is_default: addr.id === addressId,
          }))
        );
      }
    } catch (err) {
      console.error("Error in handleSetDefaultAddress:", err);
      setError("エラーが発生しました。再度お試しください。");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">配送先住所</h1>
        <div className="text-center py-12">
          <div className="spinner"></div>
          <p className="mt-4">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">配送先住所</h1>
        <Link
          href="/profile/addresses/new"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          新しい住所を追加
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
          {error}
        </div>
      )}

      {addresses.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">配送先住所が登録されていません。</p>
          <p className="mt-2">
            <Link
              href="/profile/addresses/new"
              className="text-indigo-600 hover:underline"
            >
              住所を追加する
            </Link>
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              onEdit={() =>
                router.push(`/profile/addresses/${address.id}/edit`)
              }
              onDelete={() => handleDeleteAddress(address.id)}
              onSetDefault={() => handleSetDefaultAddress(address.id)}
            />
          ))}
        </div>
      )}

      <div className="mt-8">
        <Link href="/profile" className="text-indigo-600 hover:underline">
          ← プロフィールに戻る
        </Link>
      </div>
    </div>
  );
}
