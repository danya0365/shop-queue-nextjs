"use client";

import { PromotionsViewModel } from "@/src/presentation/presenters/shop/backend/PromotionsPresenter";
import { usePromotionsPresenter } from "@/src/presentation/presenters/shop/backend/usePromotionsPresenter";
import { useState } from "react";

interface PromotionsViewProps {
  viewModel: PromotionsViewModel;
}

export function PromotionsView({ viewModel }: PromotionsViewProps) {
  const [state, actions] = usePromotionsPresenter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Filter promotions based on search and status
  const filteredPromotions = viewModel.promotions.filter((promotion) => {
    const matchesSearch =
      promotion.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (promotion.description &&
        promotion.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus =
      statusFilter === "all" || promotion.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string | null) => {
    const statusConfig = {
      active: {
        label: "ใช้งาน",
        class:
          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      },
      inactive: {
        label: "ไม่ใช้งาน",
        class: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
      },
      expired: {
        label: "หมดอายุ",
        class: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      },
      scheduled: {
        label: "กำหนดการ",
        class: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] ||
      statusConfig.inactive;
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.class}`}
      >
        {config.label}
      </span>
    );
  };

  const getPromotionTypeLabel = (type: string) => {
    const typeLabels = {
      percentage: "ส่วนลด %",
      fixed_amount: "ส่วนลดคงที่",
      buy_x_get_y: "ซื้อ X แถม Y",
      free_shipping: "ส่งฟรี",
    };
    return typeLabels[type as keyof typeof typeLabels] || type;
  };

  const getPromotionTypeColor = (type: string) => {
    const colors = {
      percentage:
        "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      fixed_amount:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      buy_x_get_y:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      free_shipping:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    };
    return (
      colors[type as keyof typeof colors] ||
      "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    );
  };

  const formatValue = (type: string, value: number) => {
    if (type === "percentage") {
      return `${value}%`;
    } else if (type === "fixed_amount") {
      return `฿${value.toLocaleString()}`;
    }
    return value.toString();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-8 relative">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            จัดการโปรโมชั่น
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            สร้างและจัดการโปรโมชั่นส่วนลดสำหรับร้านของคุณ
          </p>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => actions.setShowCreateModal(true)}
            className="bg-blue-500 dark:bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
          >
            🏷️ สร้างโปรโมชั่น
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                โปรโมชั่นทั้งหมด
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {viewModel.stats.totalPromotions}
              </p>
            </div>
            <div className="text-2xl">🏷️</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                เปิดใช้งาน
              </p>
              <p className="text-2xl font-bold text-green-600">
                {viewModel.stats.activePromotions}
              </p>
            </div>
            <div className="text-2xl">✅</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                กำหนดการ
              </p>
              <p className="text-2xl font-bold text-blue-600">
                {viewModel.stats.scheduledPromotions}
              </p>
            </div>
            <div className="text-2xl">⏰</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                ส่วนลดรวม
              </p>
              <p className="text-2xl font-bold text-purple-600">
                ฿{(viewModel.stats.totalDiscountGiven || 0).toLocaleString()}
              </p>
            </div>
            <div className="text-2xl">💰</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                หมดอายุ
              </p>
              <p className="text-2xl font-bold text-red-600">
                {viewModel.stats.expiredPromotions}
              </p>
            </div>
            <div className="text-2xl">❌</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                ถูกใช้แล้ว
              </p>
              <p className="text-2xl font-bold text-orange-600">
                {viewModel.stats.totalUsage}
              </p>
            </div>
            <div className="text-2xl">🎯</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="ค้นหาโปรโมชั่น..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* Status Filter */}
          <div className="sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">สถานะทั้งหมด</option>
              <option value="active">ใช้งาน</option>
              <option value="inactive">ไม่ใช้งาน</option>
              <option value="scheduled">กำหนดการ</option>
              <option value="expired">หมดอายุ</option>
            </select>
          </div>
        </div>
      </div>

      {/* Promotions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPromotions.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-500 dark:text-gray-400">
              <div className="text-4xl mb-4">🏷️</div>
              <p className="text-lg">
                {searchTerm || statusFilter !== "all" 
                  ? "ไม่พบโปรโมชั่นที่ตรงกับเงื่อนไขการค้นหา"
                  : "ยังไม่มีโปรโมชั่นในระบบ"}
              </p>
              {searchTerm || statusFilter !== "all" ? (
                <p className="text-sm text-gray-400 mt-2">
                  ลองปรับเงื่อนไขการค้นหาหรือสร้างโปรโมชั่นใหม่
                </p>
              ) : (
                <p className="text-sm text-gray-400 mt-2">
                  คลิกปุ่ม &ldquo;สร้างโปรโมชั่น&rdquo; เพื่อเริ่มสร้างโปรโมชั่นแรกของคุณ
                </p>
              )}
            </div>
          </div>
        ) : (
          filteredPromotions.map((promotion) => (
            <div
              key={promotion.id}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow"
            >
              {/* Promotion Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="text-3xl mr-3">🏷️</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {promotion.name}
                    </h3>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPromotionTypeColor(
                        promotion.type
                      )}`}
                    >
                      {getPromotionTypeLabel(promotion.type)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => {
                      actions.setSelectedPromotion(promotion);
                      actions.setShowEditModal(true);
                    }}
                    className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => {
                      actions.setSelectedPromotion(promotion);
                      actions.setShowDeleteModal(true);
                    }}
                    className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Promotion Description */}
              {promotion.description && (
                <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                  {promotion.description}
                </p>
              )}

              {/* Promotion Details */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    ค่าส่วนลด:
                  </span>
                  <span className="font-semibold text-blue-600">
                    {formatValue(promotion.type, promotion.value)}
                  </span>
                </div>

                {promotion.minPurchaseAmount && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      ยอดซื้อขั้นต่ำ:
                    </span>
                    <span className="font-semibold text-green-600">
                      ฿{promotion.minPurchaseAmount.toLocaleString()}
                    </span>
                  </div>
                )}

                {promotion.maxDiscountAmount && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      ส่วนลดสูงสุด:
                    </span>
                    <span className="font-semibold text-orange-600">
                      ฿{promotion.maxDiscountAmount.toLocaleString()}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    ระยะเวลา:
                  </span>
                  <span className="text-sm text-gray-900 dark:text-white">
                    {formatDate(promotion.startAt)} -{" "}
                    {formatDate(promotion.endAt)}
                  </span>
                </div>

                {promotion.usageLimit && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      จำกัดการใช้:
                    </span>
                    <span className="font-semibold text-purple-600">
                      {promotion.usageLimit} ครั้ง
                    </span>
                  </div>
                )}
              </div>

              {/* Status Badge */}
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  {getStatusBadge(promotion.status)}
                  <button
                    className={`text-sm font-medium ${
                      promotion.status === "active"
                        ? "text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        : "text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                    }`}
                  >
                    {promotion.status === "active" ? "ปิดใช้งาน" : "เปิดใช้งาน"}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Promotion Modal Placeholder */}
      {state.showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              เพิ่มโปรโมชั่นใหม่
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              ฟีเจอร์นี้จะพัฒนาในเร็วๆ นี้
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => actions.setShowCreateModal(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {state.error && (
        <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800 dark:text-red-200">
                {state.error}
              </p>
            </div>
            <div className="ml-auto pl-3">
              <button
                onClick={() => actions.setError(null)}
                className="text-red-400 hover:text-red-600 dark:hover:text-red-300"
              >
                <svg
                  className="h-5 w-5"
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
          </div>
        </div>
      )}
      {/* Development Status Overlay */}
      <div className="absolute inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
        <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md mx-4 text-center border border-gray-200 dark:border-gray-700">
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
              <span className="text-3xl">🚧</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              กำลังพัฒนาระบบ
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              เปิดใช้งานเร็วๆ นี้
            </p>
          </div>
          <div className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span>กำลังปรับปรุงฟีเจอร์การจัดการโปรโมชั่น</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-100"></div>
              <span>เพิ่มประสิทธิภาพการทำงาน</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse delay-200"></div>
              <span>ปรับปรุงประสบการณ์ผู้ใช้</span>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-400 dark:text-gray-500">
              ขออภัยในความไม่สะดวก
              <br />
              ทีมงานกำลังพัฒนาเพื่อคุณ
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
