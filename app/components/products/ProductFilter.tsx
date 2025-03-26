"use client";

import { useEffect, useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

interface ProductFilterProps {
  onSearch: (query: string) => void;
  onPriceRangeChange: (min: number | null, max: number | null) => void;
  onSortChange: (sort: string) => void;
}

export default function ProductFilter({
  onSearch,
  onPriceRangeChange,
  onSortChange,
}: ProductFilterProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [sortOption, setSortOption] = useState("created_at-desc");

  // 検索クエリの変更を反映
  useEffect(() => {
    const delaySearch = setTimeout(() => {
      onSearch(searchQuery);
    }, 500); // 0.5秒のディレイを設定

    return () => clearTimeout(delaySearch);
  }, [searchQuery, onSearch]);

  // 価格範囲の変更を反映
  useEffect(() => {
    const minPriceValue = minPrice ? parseInt(minPrice) : null;
    const maxPriceValue = maxPrice ? parseInt(maxPrice) : null;

    const delayPriceRangeUpdate = setTimeout(() => {
      onPriceRangeChange(minPriceValue, maxPriceValue);
    }, 500);

    return () => clearTimeout(delayPriceRangeUpdate);
  }, [minPrice, maxPrice, onPriceRangeChange]);

  // ソートオプションの変更を反映
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSortOption(value);
    onSortChange(value);
  };

  // 価格入力の検証
  const validatePriceInput = (value: string) => {
    // 空または数値のみを許可
    return value === "" || /^\d+$/.test(value);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6 space-y-4">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="商品を検索..."
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label
            htmlFor="sort"
            className="block text-sm font-medium text-gray-700"
          >
            並び替え
          </label>
          <select
            id="sort"
            name="sort"
            value={sortOption}
            onChange={handleSortChange}
            className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="created_at-desc">新着順</option>
            <option value="price-asc">価格: 安い順</option>
            <option value="price-desc">価格: 高い順</option>
            <option value="name-asc">名前: A-Z</option>
            <option value="name-desc">名前: Z-A</option>
          </select>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="min-price"
            className="block text-sm font-medium text-gray-700"
          >
            最低価格
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">¥</span>
            </div>
            <input
              type="text"
              name="min-price"
              id="min-price"
              value={minPrice}
              onChange={(e) => {
                if (validatePriceInput(e.target.value)) {
                  setMinPrice(e.target.value);
                }
              }}
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-3 sm:text-sm border-gray-300 rounded-md"
              placeholder="0"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="max-price"
            className="block text-sm font-medium text-gray-700"
          >
            最高価格
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">¥</span>
            </div>
            <input
              type="text"
              name="max-price"
              id="max-price"
              value={maxPrice}
              onChange={(e) => {
                if (validatePriceInput(e.target.value)) {
                  setMaxPrice(e.target.value);
                }
              }}
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-3 sm:text-sm border-gray-300 rounded-md"
              placeholder="100000"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
