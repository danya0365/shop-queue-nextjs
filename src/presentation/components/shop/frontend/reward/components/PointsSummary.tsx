"use client";

import { useCustomerStore } from "@/src/presentation/stores/customer-store";
import { cn } from "@/src/utils/cn";

interface PointItemProps {
  value: number;
  label: string;
  isSuccess?: boolean;
  isMuted?: boolean;
  icon?: React.ReactNode;
}

interface PointsSummaryProps {
  currentPoints: number;
  totalEarned: number;
  totalRedeemed: number;
  shopId: string;
  className?: string;
}

function PointItem({ value, label, isSuccess, isMuted, icon }: PointItemProps) {
  return (
    <div
      className={cn(
        "p-4 rounded-lg border transition-colors duration-200",
        isSuccess && "bg-green-50 border-green-100 dark:bg-green-900/30 dark:border-green-800/50",
        isMuted && "bg-gray-50 border-gray-100 dark:bg-gray-800/50 dark:border-gray-700/50",
        !isSuccess && !isMuted && "bg-blue-50 border-blue-100 dark:bg-blue-900/30 dark:border-blue-800/50"
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <div
            className={cn(
              "text-2xl font-bold",
              isSuccess
                ? "text-green-700 dark:text-green-300"
                : isMuted
                ? "text-gray-500 dark:text-gray-400"
                : "text-blue-700 dark:text-blue-300"
            )}
          >
            {value}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            {label}
          </div>
        </div>
        {icon && (
          <div
            className={cn(
              "p-2 rounded-full",
              isSuccess
                ? "bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-300"
                : isMuted
                ? "bg-gray-100 text-gray-400 dark:bg-gray-700/50 dark:text-gray-400"
                : "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300"
            )}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
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
      <div className={cn("shop-frontend-card relative bg-white dark:bg-gray-800 shadow-sm", className)}>
        <div className="absolute inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/20 dark:bg-gray-900/80 backdrop-blur-sm"></div>
          <div className="text-center py-8 z-10">
            <div className="text-4xl mb-4">❌</div>
            <p className="text-gray-600 dark:text-gray-400">
              ไม่พบข้อมูลสมาชิก
            </p>
          </div>
        </div>
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
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

  const customerName = customer.name || "ลูกค้า";
  const initials = (() => {
    const parts = customerName.split(" ").filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    } else if (customerName.length >= 2) {
      return customerName.slice(0, 2).toUpperCase();
    }
    return (customerName[0] || " ").toUpperCase() + " ";
  })();

  return (
    <div className={cn("bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden", className)}>
      {/* Customer Profile Section */}
      <div className="relative bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 p-6">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            <div className="h-16 w-16 rounded-full bg-blue-500 dark:bg-blue-600 flex items-center justify-center text-white text-xl font-bold">
              {initials}
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white truncate">
              {customerName}
            </h2>
            {customer.phone && (
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                {customer.phone}
              </p>
            )}
            {customer.joinedDate && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                สมาชิกเมื่อ {customer.joinedDate}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Points Summary */}
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          สรุปแต้ม
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <PointItem value={currentPoints} label="แต้มปัจจุบัน" />
          <PointItem value={totalEarned} label="แต้มที่ได้รับ" isSuccess />
          <PointItem value={totalRedeemed} label="แต้มที่ใช้แล้ว" isMuted />
        </div>
      </div>
    </div>
  );
}
