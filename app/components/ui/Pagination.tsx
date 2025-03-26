"use client";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  // デバッグ情報
  console.log("Pagination コンポーネント:", { currentPage, totalPages });

  // ページネーションのリンクを生成
  const renderPaginationLinks = () => {
    const links = [];
    const maxVisiblePages = 5; // 表示する最大ページ数

    // 先頭のページリンク
    if (currentPage > 1) {
      links.push(
        <button
          key="prev"
          onClick={() => onPageChange(currentPage - 1)}
          className="px-3 py-1 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
          aria-label="前のページに移動"
        >
          &laquo;
        </button>
      );
    }

    // ページ番号の表示範囲を決定
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // 表示ページ数が最大に達していない場合の調整
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // 最初のページへのリンク（必要な場合）
    if (startPage > 1) {
      links.push(
        <button
          key="1"
          onClick={() => onPageChange(1)}
          className="px-3 py-1 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
        >
          1
        </button>
      );
      if (startPage > 2) {
        links.push(
          <span key="start-ellipsis" className="px-2 py-1 text-gray-500">
            ...
          </span>
        );
      }
    }

    // ページ番号のリンク
    for (let i = startPage; i <= endPage; i++) {
      links.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`px-3 py-1 rounded-md text-sm font-medium ${
            i === currentPage
              ? "bg-indigo-600 text-white"
              : "text-gray-700 hover:bg-gray-100"
          }`}
          aria-current={i === currentPage ? "page" : undefined}
        >
          {i}
        </button>
      );
    }

    // 最後のページへのリンク（必要な場合）
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        links.push(
          <span key="end-ellipsis" className="px-2 py-1 text-gray-500">
            ...
          </span>
        );
      }
      links.push(
        <button
          key={totalPages}
          onClick={() => onPageChange(totalPages)}
          className="px-3 py-1 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
        >
          {totalPages}
        </button>
      );
    }

    // 次のページへのリンク
    if (currentPage < totalPages) {
      links.push(
        <button
          key="next"
          onClick={() => onPageChange(currentPage + 1)}
          className="px-3 py-1 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
          aria-label="次のページに移動"
        >
          &raquo;
        </button>
      );
    }

    return links;
  };

  // totalPages <= 1 の場合は何も表示しない
  // 一時的に条件を無効化してどのような場合でも表示する
  /* if (totalPages <= 1) {
    console.log("ページネーション非表示: totalPages ≤ 1");
    return null;
  } */

  return (
    <nav className="flex justify-center mt-8" aria-label="ページネーション">
      <div className="flex space-x-1">{renderPaginationLinks()}</div>
    </nav>
  );
}
