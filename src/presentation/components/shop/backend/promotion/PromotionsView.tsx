"use client";

import type {
  Promotion,
  PromotionFilters,
  PromotionsViewModel,
} from "@/src/presentation/presenters/shop/backend/PromotionsPresenter";
import Link from "next/link";
import { useState } from "react";
import CreatePromotionView from "./components/CreatePromotionView";
import PromotionDetailModal from "./components/PromotionDetailModal";
import PromotionStatView from "./components/PromotionStatView";

interface PromotionsViewProps {
  viewModel: PromotionsViewModel;
}

export function PromotionsView({ viewModel }: PromotionsViewProps) {
  const [filters, setFilters] = useState<PromotionFilters>(viewModel.filters);
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(
    null
  );
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const handleViewDetails = (promotion: Promotion) => {
    setSelectedPromotion(promotion);
    setShowDetailsModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200";
      case "inactive":
        return "bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200";
      case "expired":
        return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200";
      case "scheduled":
        return "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200";
      default:
        return "bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "ใช้งานอยู่";
      case "inactive":
        return "ปิดใช้งาน";
      case "expired":
        return "หมดอายุ";
      case "scheduled":
        return "กำหนดการ";
      default:
        return status;
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case "percentage":
        return "ส่วนลดเปอร์เซ็นต์";
      case "fixed_amount":
        return "ส่วนลดจำนวนคงที่";
      case "buy_x_get_y":
        return "ซื้อ X ฟรี Y";
      case "service_upgrade":
        return "อัพเกรดบริการ";
      default:
        return type;
    }
  };

  const formatPromotionValue = (promotion: Promotion) => {
    switch (promotion.type) {
      case "percentage":
        return `${promotion.value}%`;
      case "fixed_amount":
        return `฿${promotion.value}`;
      case "buy_x_get_y":
        return `ฟรี ${promotion.value} ชิ้น`;
      case "service_upgrade":
        return "อัพเกรดฟรี";
      default:
        return promotion.value.toString();
    }
  };

  const filteredPromotions = viewModel.promotions.filter((promotion) => {
    if (filters.status !== "all" && promotion.status !== filters.status)
      return false;
    if (filters.type !== "all" && promotion.type !== filters.type) return false;
    if (
      filters.search &&
      !promotion.name.toLowerCase().includes(filters.search.toLowerCase()) &&
      !promotion.description
        .toLowerCase()
        .includes(filters.search.toLowerCase())
    )
      return false;
    return true;
  });

  const handleSubmitCreatePromotion = (promotion: Record<string, unknown>) => {
    console.log(promotion);
    setShowAddModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  จัดการโปรโมชั่น
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  สร้างและจัดการโปรโมชั่นและส่วนลดสำหรับลูกค้า
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  viewModel.subscription.hasPromotionFeature
                    ? "bg-blue-600 dark:bg-blue-600 text-white hover:bg-blue-700 dark:hover:bg-blue-700"
                    : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                }`}
                disabled={!viewModel.subscription.hasPromotionFeature}
              >
                + สร้างโปรโมชั่น
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Free Tier Promotion Feature Warning */}
        {!viewModel.subscription.hasPromotionFeature && (
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 mb-6">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 text-blue-500">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-blue-800">
                      ฟีเจอร์โปรโมชั่นสำหรับแพ็กเกจ Pro และ Enterprise
                    </h3>
                    <p className="text-sm text-blue-700 mt-1">
                      สร้างและจัดการโปรโมชั่น ส่วนลด
                      และข้อเสนอพิเศษเพื่อดึงดูดลูกค้า
                    </p>
                    <div className="mt-3 text-xs">
                      <p className="text-blue-600">
                        💡 <strong>อัปเกรดเพื่อรับสิทธิ์:</strong>
                      </p>
                      <ul className="list-disc list-inside text-blue-600 mt-1 space-y-0.5">
                        <li>สร้างโปรโมชั่นไม่จำกัด</li>
                        <li>ส่วนลดแบบเปอร์เซ็นต์และจำนวนคงที่</li>
                        <li>โปรโมชั่นซื้อ X ฟรี Y</li>
                        <li>การอัปเกรดบริการฟรี</li>
                      </ul>
                    </div>
                  </div>
                  <div className="flex-shrink-0 ml-4">
                    <Link
                      href="/pricing"
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                    >
                      อัปเกรด
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <PromotionStatView viewModel={viewModel} />

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
            ตัวกรอง
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                ค้นหา
              </label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
                placeholder="ชื่อหรือคำอธิบาย"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                สถานะ
              </label>
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    status: e.target.value as PromotionFilters["status"],
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="all">ทั้งหมด</option>
                <option value="active">ใช้งานอยู่</option>
                <option value="inactive">ปิดใช้งาน</option>
                <option value="expired">หมดอายุ</option>
                <option value="scheduled">กำหนดการ</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ประเภท
              </label>
              <select
                value={filters.type}
                onChange={(e) =>
                  setFilters({ ...filters, type: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">ทั้งหมด</option>
                <option value="percentage">ส่วนลดเปอร์เซ็นต์</option>
                <option value="fixed_amount">ส่วนลดจำนวนคงที่</option>
                <option value="buy_x_get_y">ซื้อ X ฟรี Y</option>
                <option value="service_upgrade">อัพเกรดบริการ</option>
              </select>
            </div>

            <div className="flex items-end">
              <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                ค้นหา
              </button>
            </div>
          </div>
        </div>

        {/* Promotions List */}
        <div className="bg-white rounded-lg shadow-sm border relative">
          {/* Free Tier Blur Overlay */}
          {viewModel.subscription.isFreeTier && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-lg z-10 flex items-center justify-center">
              <div className="text-center p-8">
                <div className="text-6xl mb-4">🎯</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  อัปเกรดเพื่อใช้งานโปรโมชั่น
                </h3>
                <p className="text-gray-600 mb-4">
                  สร้างและจัดการโปรโมชั่นเพื่อเพิ่มยอดขายและดึงดูดลูกค้า
                </p>
                <div className="space-y-2 text-sm text-gray-600 mb-6">
                  <div className="flex items-center justify-center">
                    <span className="mr-2">💰</span>
                    <span>ส่วนลดแบบเปอร์เซ็นต์และจำนวนคงที่</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <span className="mr-2">🎁</span>
                    <span>โปรโมชั่นซื้อ X ฟรี Y</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <span className="mr-2">⬆️</span>
                    <span>การอัปเกรดบริการฟรี</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <span className="mr-2">📊</span>
                    <span>รายงานการใช้งานโปรโมชั่น</span>
                  </div>
                </div>
                <Link
                  href="/pricing"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  อัปเกรดตอนนี้
                </Link>
              </div>
            </div>
          )}
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              รายการโปรโมชั่น ({filteredPromotions.length})
            </h3>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredPromotions.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-400 text-6xl mb-4">🎯</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  ไม่พบโปรโมชั่น
                </h3>
                <p className="text-gray-600">
                  ลองเปลี่ยนเงื่อนไขการค้นหาหรือสร้างโปรโมชั่นใหม่
                </p>
              </div>
            ) : (
              filteredPromotions.map((promotion) => (
                <div key={promotion.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">
                          {promotion.name}
                        </h3>
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            promotion.status
                          )}`}
                        >
                          {getStatusText(promotion.status)}
                        </span>
                        <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                          {getTypeText(promotion.type)}
                        </span>
                      </div>

                      <p className="text-gray-600 mb-3">
                        {promotion.description}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">ค่าส่วนลด</p>
                          <p className="font-medium text-blue-600">
                            {formatPromotionValue(promotion)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">ระยะเวลา</p>
                          <p className="font-medium">
                            {promotion.startDate} - {promotion.endDate}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">การใช้งาน</p>
                          <p className="font-medium">
                            {promotion.usedCount}
                            {promotion.usageLimit &&
                              ` / ${promotion.usageLimit}`}
                          </p>
                        </div>
                      </div>

                      {promotion.conditions.length > 0 && (
                        <div className="mt-3">
                          <p className="text-sm text-gray-500 mb-1">
                            เงื่อนไข:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {promotion.conditions.map((condition, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800"
                              >
                                {condition}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="ml-4 flex flex-col space-y-2">
                      <button
                        onClick={() => handleViewDetails(promotion)}
                        className="text-blue-600 hover:text-blue-900 text-sm"
                      >
                        ดูรายละเอียด
                      </button>
                      <button className="text-green-600 hover:text-green-900 text-sm">
                        แก้ไข
                      </button>
                      <button className="text-red-600 hover:text-red-900 text-sm">
                        ลบ
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Promotion Details Modal */}
      {showDetailsModal && selectedPromotion && (
        <PromotionDetailModal
          selectedPromotion={selectedPromotion}
          viewModel={viewModel}
          setShowDetailsModal={setShowDetailsModal}
        />
      )}

      {/* Add Promotion Modal */}
      {showAddModal && (
        <CreatePromotionView
          setShowAddModal={setShowAddModal}
          submitCallback={handleSubmitCreatePromotion}
        />
      )}
    </div>
  );
}
