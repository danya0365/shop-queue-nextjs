"use client";

import { cn } from "@/src/utils/cn";

interface Reward {
  id: string;
  name: string;
  pointsCost: number;
  imageUrl?: string; // Made optional to match AvailableReward type
}

interface RedeemConfirmationModalProps {
  isOpen: boolean;
  reward: Reward | null;
  currentPoints: number;
  onConfirm: () => void;
  onCancel: () => void;
  className?: string;
}

export function RedeemConfirmationModal({
  isOpen,
  reward,
  currentPoints,
  onConfirm,
  onCancel,
  className,
}: RedeemConfirmationModalProps) {
  if (!isOpen || !reward) return null;

  return (
    <div 
      className={cn(
        "fixed inset-0 bg-black/50 flex items-center justify-center z-50",
        className
      )}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">{reward.imageUrl}</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            ยืนยันการแลกของรางวัล
          </h3>
          <p className="text-gray-600">{reward.name}</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">ของรางวัล:</span>
            <span className="font-medium">{reward.name}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">ใช้แต้ม:</span>
            <span className="font-medium text-blue-600">
              {reward.pointsCost} แต้ม
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">แต้มคงเหลือ:</span>
            <span className="font-medium">
              {(currentPoints - reward.pointsCost).toLocaleString()} แต้ม
            </span>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            ยกเลิก
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            ยืนยันการแลก
          </button>
        </div>
      </div>
    </div>
  );
}
