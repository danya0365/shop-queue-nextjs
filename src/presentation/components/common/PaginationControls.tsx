"use client";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  perPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPerPageChange: (perPage: number) => void;
  onNextPage: () => void;
  onPrevPage: () => void;
  hasNext: boolean;
  hasPrev: boolean;
  loading?: boolean;
}

export function PaginationControls({
  currentPage,
  totalPages,
  perPage,
  totalItems,
  onPageChange,
  onPerPageChange,
  onNextPage,
  onPrevPage,
  hasNext,
  hasPrev,
  loading = false,
}: PaginationControlsProps) {
  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else if (currentPage <= 3) {
      // Show first 5 pages when current page is near the start
      for (let i = 1; i <= maxVisiblePages; i++) {
        pages.push(i);
      }
    } else if (currentPage >= totalPages - 2) {
      // Show last 5 pages when current page is near the end
      for (let i = totalPages - maxVisiblePages + 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show pages around current page
      for (let i = currentPage - 2; i <= currentPage + 2; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  const startItem = (currentPage - 1) * perPage + 1;
  const endItem = Math.min(currentPage * perPage, totalItems);

  return (
    <div className="space-y-4">
      {/* Mobile Layout - Stacked */}
      <div className="flex flex-col space-y-4 sm:hidden">
        {/* Info and Per Page Dropdown */}
        <div className="flex flex-col space-y-3">
          <div className="text-sm text-gray-700 dark:text-gray-300 text-center">
            แสดง {startItem} - {endItem} จาก {totalItems} รายการ
          </div>

          <div className="flex items-center justify-center space-x-2">
            <span className="text-sm text-gray-700 dark:text-gray-300">
              แสดงต่อหน้า:
            </span>
            <select
              value={perPage}
              onChange={(e) => onPerPageChange(Number(e.target.value))}
              disabled={loading}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <button
            onClick={onPrevPage}
            disabled={!hasPrev || loading}
            className={`px-4 py-2 rounded-md text-sm font-medium min-w-[80px] ${
              hasPrev && !loading
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed"
            }`}
          >
            ก่อนหน้า
          </button>

          <div className="text-sm text-gray-700 dark:text-gray-300 font-medium">
            หน้า {currentPage} / {totalPages}
          </div>

          <button
            onClick={onNextPage}
            disabled={!hasNext || loading}
            className={`px-4 py-2 rounded-md text-sm font-medium min-w-[80px] ${
              hasNext && !loading
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed"
            }`}
          >
            ถัดไป
          </button>
        </div>
      </div>

      {/* Desktop Layout - Horizontal */}
      <div className="hidden sm:flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            แสดง {startItem} - {endItem} จาก {totalItems} รายการ
          </div>

          {/* Per Page Dropdown */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700 dark:text-gray-300">
              แสดงต่อหน้า:
            </span>
            <select
              value={perPage}
              onChange={(e) => onPerPageChange(Number(e.target.value))}
              disabled={loading}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        {/* Page Numbers */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onPrevPage}
            disabled={!hasPrev || loading}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              hasPrev && !loading
                ? "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
                : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed"
            }`}
          >
            ก่อนหน้า
          </button>

          <div className="flex space-x-1">
            {getPageNumbers().map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                disabled={loading}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  pageNum === currentPage
                    ? "bg-blue-500 text-white"
                    : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
                }`}
              >
                {pageNum}
              </button>
            ))}
          </div>

          <button
            onClick={onNextPage}
            disabled={!hasNext || loading}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              hasNext && !loading
                ? "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
                : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed"
            }`}
          >
            ถัดไป
          </button>
        </div>
      </div>
    </div>
  );
}
