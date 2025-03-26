"use client";

import { UserAddress } from "@/app/(lib)/types/database";
import Link from "next/link";

interface AddressCardProps {
  address: UserAddress;
  onEdit?: () => void;
  onDelete?: () => Promise<void>;
  onSetDefault?: () => Promise<void>;
  isSelected?: boolean;
  selectable?: boolean;
  onSelect?: () => void;
}

export default function AddressCard({
  address,
  onEdit,
  onDelete,
  onSetDefault,
  isSelected,
  selectable,
  onSelect,
}: AddressCardProps) {
  const formatAddress = () => {
    const parts = [];
    if (address.postal_code) parts.push(`〒${address.postal_code}`);
    if (address.prefecture) parts.push(address.prefecture);
    if (address.city) parts.push(address.city);
    if (address.street_address) parts.push(address.street_address);
    if (address.building) parts.push(address.building);
    return parts.join(" ");
  };

  const handleDelete = async () => {
    if (!onDelete) return;

    // 削除確認
    if (window.confirm("この住所を削除してもよろしいですか？")) {
      await onDelete();
    }
  };

  return (
    <div
      className={`border rounded-lg p-4 shadow-sm ${
        isSelected ? "border-indigo-500 bg-indigo-50" : "border-gray-200"
      } ${selectable ? "cursor-pointer hover:border-indigo-300" : ""}`}
      onClick={selectable && onSelect ? onSelect : undefined}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-medium text-lg flex items-center">
            {address.name}
            {address.is_default && (
              <span className="ml-2 px-2 py-1 text-xs bg-indigo-100 text-indigo-800 rounded-full">
                デフォルト
              </span>
            )}
          </h3>
          <p className="text-gray-500 text-sm">{address.recipient_name}</p>
        </div>

        {selectable && (
          <div className="flex items-center h-5">
            <input
              type="radio"
              checked={isSelected}
              onChange={onSelect}
              onClick={(e) => e.stopPropagation()}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
            />
          </div>
        )}
      </div>

      <div className="mt-3 mb-3">
        <p className="text-gray-700">{formatAddress()}</p>
        {address.phone_number && (
          <p className="text-gray-700 mt-1">TEL: {address.phone_number}</p>
        )}
      </div>

      <div className="flex space-x-2 mt-4">
        {onEdit && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="text-sm text-indigo-600 hover:text-indigo-800"
          >
            編集
          </button>
        )}

        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
            className="text-sm text-red-600 hover:text-red-800"
          >
            削除
          </button>
        )}

        {onSetDefault && !address.is_default && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSetDefault();
            }}
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            デフォルトに設定
          </button>
        )}
      </div>
    </div>
  );
}
