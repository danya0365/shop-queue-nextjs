"use client";

import type { PromotionsViewModel } from "@/src/presentation/presenters/shop/backend/PromotionsPresenter";

interface PromotionStatViewProps {
  viewModel: PromotionsViewModel;
}

export default function PromotionStatView({
  viewModel,
}: PromotionStatViewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center">
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <span className="text-2xl">🎯</span>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              โปรโมชั่นทั้งหมด
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {viewModel.stats.totalPromotions}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center">
          <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
            <span className="text-2xl">✅</span>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              ใช้งานอยู่
            </p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {viewModel.stats.activePromotions}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center">
          <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
            <span className="text-2xl">📊</span>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              การใช้งานรวม
            </p>
            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {viewModel.stats.totalUsage}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center">
          <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
            <span className="text-2xl">💰</span>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              ส่วนลดรวม
            </p>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              ฿{viewModel.stats.totalDiscount.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
