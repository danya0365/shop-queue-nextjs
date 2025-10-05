"use client";

import type { PromotionData } from "@/src/presentation/presenters/shop/backend/PromotionsPresenter";

interface DeletePromotionConfirmationProps {
  promotion: PromotionData;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  loading?: boolean;
}

export function DeletePromotionConfirmation({
  promotion,
  onClose,
  onConfirm,
  loading,
}: DeletePromotionConfirmationProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex items-start">
          <div className="text-red-500 text-3xl mr-3">⚠️</div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              ยืนยันการลบโปรโมชั่น
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              คุณต้องการลบโปรโมชั่น &quot;{promotion.name}&quot; ใช่หรือไม่?
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
            disabled={loading}
          >
            ยกเลิก
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "กำลังลบ..." : "ลบ"}
          </button>
        </div>
      </div>
    </div>
  );
}
