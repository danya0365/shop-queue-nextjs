"use client";

import { cn } from "@/src/utils/cn";
import { useCustomerStore } from "@/src/presentation/stores/customer-store";

interface PointsSummaryProps {
  currentPoints: number;
  totalEarned: number;
  totalRedeemed: number;
  shopId: string;
  className?: string;
}

export function PointsSummary({
  currentPoints,
  totalEarned,
  totalRedeemed,
  shopId,
  className,
}: PointsSummaryProps) {
  const { getCustomer } = useCustomerStore();
  const customer = getCustomer(shopId);

  if (!customer) {
    return (
      <div className={cn("shop-frontend-card relative", className)}>
        <div className="absolute inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
          <div className="text-center py-8 z-10">
            <div className="text-4xl mb-4">❌</div>
            <p className="text-gray-600 dark:text-gray-400">
              ไม่พบข้อมูลสมาชิก
            </p>
          </div>
        </div>
        <div className="p-6 border-b shop-frontend-card-border">
          <h2 className="text-xl font-semibold shop-frontend-text-primary">
            สรุปแต้ม
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <PointItem value={currentPoints} label="แต้มปัจจุบัน" />
            <PointItem value={totalEarned} label="แต้มที่ได้รับ" isSuccess />
            <PointItem value={totalRedeemed} label="แต้มที่ใช้แล้ว" isMuted />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("shop-frontend-card", className)}>
      <div className="p-6 border-b shop-frontend-card-border">
        <h2 className="text-xl font-semibold shop-frontend-text-primary">
          สรุปแต้ม
        </h2>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <PointItem value={currentPoints} label="แต้มปัจจุบัน" />
          <PointItem value={totalEarned} label="แต้มที่ได้รับ" isSuccess />
          <PointItem value={totalRedeemed} label="แต้มที่ใช้แล้ว" isMuted />
        </div>
      </div>
    </div>
  );
}

interface PointItemProps {
  value: number;
  label: string;
  isSuccess?: boolean;
  isMuted?: boolean;
}

function PointItem({ value, label, isSuccess, isMuted }: PointItemProps) {
  return (
    <div className="text-center">
      <div
        className={cn(
          "text-3xl font-bold mb-2",
          isSuccess
            ? "shop-frontend-text-success"
            : isMuted
            ? "shop-frontend-text-muted"
            : "shop-frontend-text-primary"
        )}
      >
        {value}
      </div>
      <div className="text-sm shop-frontend-text-secondary">{label}</div>
    </div>
  );
}
