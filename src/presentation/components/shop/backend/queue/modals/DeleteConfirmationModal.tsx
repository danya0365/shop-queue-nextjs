"use client";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  queueNumber?: string;
  customerName?: string;
  isLoading?: boolean;
}

export function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  queueNumber,
  customerName,
  isLoading = false,
}: DeleteConfirmationModalProps) {
  if (!isOpen) return null;

  const handleConfirm = async () => {
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error("Error deleting queue:", error);
      // ไม่ต้องปิด modal ถ้าเกิด error เพื่อให้ user ลองใหม่ได้
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <div className="text-center">
          {/* Warning Icon */}
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
            <svg
              className="h-6 w-6 text-red-600 dark:text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">
            ยืนยันการลบคิว
          </h2>

          {/* Content */}
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            {queueNumber && customerName ? (
              <p>
                คุณแน่ใจหรือไม่ว่าต้องการลบคิว{" "}
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  #{queueNumber}
                </span>{" "}
                ของลูกค้า{" "}
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {customerName}
                </span>
                ?
              </p>
            ) : (
              <p>คุณแน่ใจหรือไม่ว่าต้องการลบคิวนี้?</p>
            )}
            <p className="mt-2 text-red-600 dark:text-red-400">
              ⚠️ การกระทำนี้ไม่สามารถย้อนกลับได้
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isLoading}
              className="px-4 py-2 text-white bg-red-600 dark:bg-red-700 rounded-md hover:bg-red-700 dark:hover:bg-red-800 disabled:opacity-50 transition-colors flex items-center space-x-2"
            >
              {isLoading && (
                <svg
                  className="animate-spin h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
              <span>ลบคิว</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
