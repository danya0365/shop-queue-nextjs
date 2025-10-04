"use client";

import { useCustomerStore } from "@/src/presentation/stores/customer-store";
import { cn } from "@/src/utils/cn";

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

  const customerName = customer.name || "ลูกค้า";
  const initials = (() => {
    // Split by space and filter out empty strings
    const parts = customerName.split(" ").filter(Boolean);

    if (parts.length >= 2) {
      // If there are 2 or more parts, take first letter of first two parts
      return (parts[0][0] + parts[1][0]).toUpperCase();
    } else if (customerName.length >= 2) {
      // If only one part but has 2+ characters, take first 2 characters
      return customerName.slice(0, 2).toUpperCase();
    }
    // Fallback to first character + space if needed
    return (customerName[0] || " ").toUpperCase() + " ";
  })();

  return (
    <div className={cn("shop-frontend-card overflow-hidden", className)}>
      {/* Customer Profile Section */}
      <div className="relative bg-gradient-to-r from-blue-50 to-blue-100 p-6">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            <div className="h-16 w-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-xl font-bold">
              {initials}
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-bold text-gray-900 truncate">
              {customerName}
            </h2>
            {customer.phone && (
              <p className="text-sm text-gray-600 mt-1">{customer.phone}</p>
            )}
            {customer.joinedDate && (
              <p className="text-xs text-gray-500 mt-1">
                สมาชิกเมื่อ {customer.joinedDate}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Points Summary */}
      <div className="p-6">
        <h2 className="text-lg font-semibold shop-frontend-text-primary mb-4">
          สรุปแต้ม
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <PointItem
            value={currentPoints}
            label="แต้มปัจจุบัน"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
              </svg>
            }
          />
          <PointItem
            value={totalEarned}
            label="แต้มที่ได้รับ"
            isSuccess
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            }
          />
          <PointItem
            value={totalRedeemed}
            label="แต้มที่ใช้แล้ว"
            isMuted
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            }
          />
        </div>

        {currentPoints > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                ความคืบหน้าสู่ระดับถัดไป
              </span>
              <span className="text-xs text-gray-500">
                {currentPoints}/1000 แต้ม
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{
                  width: `${Math.min(100, (currentPoints / 1000) * 100)}%`,
                }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface PointItemProps {
  value: number;
  label: string;
  isSuccess?: boolean;
  isMuted?: boolean;
  icon?: React.ReactNode;
}

function PointItem({ value, label, isSuccess, isMuted, icon }: PointItemProps) {
  return (
    <div
      className={cn(
        "p-4 rounded-lg transition-all duration-200 hover:shadow-sm border",
        isSuccess
          ? "bg-green-50 border-green-100 hover:bg-green-100"
          : isMuted
          ? "bg-gray-50 border-gray-100 hover:bg-gray-100"
          : "bg-blue-50 border-blue-100 hover:bg-blue-100"
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <div
            className={cn(
              "text-2xl font-bold",
              isSuccess
                ? "text-green-700"
                : isMuted
                ? "text-gray-500"
                : "text-blue-700"
            )}
          >
            {value}
          </div>
          <div className="text-sm text-gray-600">{label}</div>
        </div>
        {icon && (
          <div
            className={cn(
              "p-2 rounded-full",
              isSuccess
                ? "bg-green-100 text-green-600"
                : isMuted
                ? "bg-gray-100 text-gray-400"
                : "bg-blue-100 text-blue-600"
            )}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
