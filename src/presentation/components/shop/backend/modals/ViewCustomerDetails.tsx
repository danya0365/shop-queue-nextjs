"use client";

import type { CustomerDTO } from "@/src/application/dtos/shop/backend/customers-dto";
import { MembershipTier } from "@/src/domain/entities/shop/backend/backend-customer.entity";

interface ViewCustomerDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  customer: CustomerDTO | null;
}

export function ViewCustomerDetails({
  isOpen,
  onClose,
  customer,
}: ViewCustomerDetailsProps) {
  if (!isOpen || !customer) return null;

  const getMembershipTierColor = (tier: MembershipTier) => {
    switch (tier) {
      case MembershipTier.PLATINUM:
        return "text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900";
      case MembershipTier.GOLD:
        return "text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900";
      case MembershipTier.SILVER:
        return "text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900";
      default:
        return "text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900";
    }
  };

  const getMembershipTierIcon = (tier: MembershipTier) => {
    switch (tier) {
      case MembershipTier.PLATINUM:
        return "💎";
      case MembershipTier.GOLD:
        return "🥇";
      case MembershipTier.SILVER:
        return "🥈";
      default:
        return "👤";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            รายละเอียดลูกค้า
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Customer Info */}
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="flex items-center space-x-4">
            <div className="text-4xl">{customer.email ? "⭐" : "👤"}</div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {customer.name}
                </h4>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getMembershipTierColor(
                    customer.membershipTier
                  )}`}
                >
                  {getMembershipTierIcon(customer.membershipTier)}{" "}
                  {customer.membershipTier}
                </span>
              </div>
              <div className="flex items-center space-x-2 mt-1">
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    customer.isActive
                      ? "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900"
                      : "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900"
                  }`}
                >
                  {customer.isActive ? "ใช้งานอยู่" : "ไม่ใช้งาน"}
                </span>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
              ข้อมูลติดต่อ
            </h5>
            <div className="space-y-2">
              {customer.email && (
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500 dark:text-gray-400 w-20">
                    อีเมล:
                  </span>
                  <span className="text-gray-900 dark:text-white">
                    {customer.email}
                  </span>
                </div>
              )}
              {customer.phone && (
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500 dark:text-gray-400 w-20">
                    เบอร์โทร:
                  </span>
                  <span className="text-gray-900 dark:text-white">
                    {customer.phone}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Statistics */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
              สถิติการใช้งาน
            </h5>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {customer.totalPoints}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  แต้มสะสม
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {customer.totalQueues}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  คิวที่ใช้งาน
                </div>
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
              ข้อมูลเวลา
            </h5>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-gray-500 dark:text-gray-400 w-20">
                  สร้างเมื่อ:
                </span>
                <span className="text-gray-900 dark:text-white text-sm">
                  {new Date(customer.createdAt).toLocaleString("th-TH")}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-500 dark:text-gray-400 w-20">
                  อัพเดทล่าสุด:
                </span>
                <span className="text-gray-900 dark:text-white text-sm">
                  {new Date(customer.updatedAt).toLocaleString("th-TH")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
}
