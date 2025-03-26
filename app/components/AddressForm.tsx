"use client";

import { useState, FormEvent } from "react";
import { UserAddress } from "@/app/(lib)/types/database";

interface AddressFormProps {
  address?: UserAddress | null;
  onSubmit: (addressData: Partial<UserAddress>) => Promise<void>;
  onCancel?: () => void;
  submitButtonText?: string;
}

export default function AddressForm({
  address,
  onSubmit,
  onCancel,
  submitButtonText = "保存",
}: AddressFormProps) {
  const [formData, setFormData] = useState<Partial<UserAddress>>({
    name: address?.name || "",
    recipient_name: address?.recipient_name || "",
    postal_code: address?.postal_code || "",
    prefecture: address?.prefecture || "",
    city: address?.city || "",
    street_address: address?.street_address || "",
    building: address?.building || "",
    phone_number: address?.phone_number || "",
    is_default: address?.is_default || false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    setFormData({
      ...formData,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit(formData);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "住所情報の送信中にエラーが発生しました"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // 日本の都道府県一覧
  const prefectures = [
    "北海道",
    "青森県",
    "岩手県",
    "宮城県",
    "秋田県",
    "山形県",
    "福島県",
    "茨城県",
    "栃木県",
    "群馬県",
    "埼玉県",
    "千葉県",
    "東京都",
    "神奈川県",
    "新潟県",
    "富山県",
    "石川県",
    "福井県",
    "山梨県",
    "長野県",
    "岐阜県",
    "静岡県",
    "愛知県",
    "三重県",
    "滋賀県",
    "京都府",
    "大阪府",
    "兵庫県",
    "奈良県",
    "和歌山県",
    "鳥取県",
    "島根県",
    "岡山県",
    "広島県",
    "山口県",
    "徳島県",
    "香川県",
    "愛媛県",
    "高知県",
    "福岡県",
    "佐賀県",
    "長崎県",
    "熊本県",
    "大分県",
    "宮崎県",
    "鹿児島県",
    "沖縄県",
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-4 mb-4 text-sm text-red-800 bg-red-100 rounded-lg">
          {error}
        </div>
      )}

      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          住所名称 (例: 自宅、会社など) <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name || ""}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label
          htmlFor="recipient_name"
          className="block text-sm font-medium text-gray-700"
        >
          受取人名 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="recipient_name"
          name="recipient_name"
          value={formData.recipient_name || ""}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="postal_code"
            className="block text-sm font-medium text-gray-700"
          >
            郵便番号
          </label>
          <input
            type="text"
            id="postal_code"
            name="postal_code"
            value={formData.postal_code || ""}
            onChange={handleChange}
            placeholder="123-4567"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label
            htmlFor="prefecture"
            className="block text-sm font-medium text-gray-700"
          >
            都道府県
          </label>
          <select
            id="prefecture"
            name="prefecture"
            value={formData.prefecture || ""}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">選択してください</option>
            {prefectures.map((pref) => (
              <option key={pref} value={pref}>
                {pref}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label
          htmlFor="city"
          className="block text-sm font-medium text-gray-700"
        >
          市区町村
        </label>
        <input
          type="text"
          id="city"
          name="city"
          value={formData.city || ""}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label
          htmlFor="street_address"
          className="block text-sm font-medium text-gray-700"
        >
          番地・町名 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="street_address"
          name="street_address"
          value={formData.street_address || ""}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label
          htmlFor="building"
          className="block text-sm font-medium text-gray-700"
        >
          建物名・部屋番号
        </label>
        <input
          type="text"
          id="building"
          name="building"
          value={formData.building || ""}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label
          htmlFor="phone_number"
          className="block text-sm font-medium text-gray-700"
        >
          電話番号
        </label>
        <input
          type="tel"
          id="phone_number"
          name="phone_number"
          value={formData.phone_number || ""}
          onChange={handleChange}
          placeholder="090-1234-5678"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="is_default"
          name="is_default"
          checked={formData.is_default || false}
          onChange={handleChange}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <label
          htmlFor="is_default"
          className="ml-2 block text-sm text-gray-700"
        >
          デフォルト住所に設定する
        </label>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            キャンセル
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isSubmitting ? "処理中..." : submitButtonText}
        </button>
      </div>
    </form>
  );
}
