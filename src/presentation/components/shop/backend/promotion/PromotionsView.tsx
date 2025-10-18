"use client";

import Link from "next/link";
import { useState } from "react";
import {
  type PromotionData,
  PromotionsViewModel,
} from "@/src/presentation/presenters/shop/backend/PromotionsPresenter";
import { usePromotionsPresenter } from "@/src/presentation/presenters/shop/backend/usePromotionsPresenter";
import { CreatePromotionModal } from "./modals/CreatePromotionModal";
import { DeletePromotionConfirmation } from "./modals/DeletePromotionConfirmation";
import { EditPromotionModal } from "./modals/EditPromotionModal";
import { PromotionDetailModal } from "./modals/PromotionDetailModal";
import { PromotionCard } from "./PromotionCard";

interface PromotionsViewProps {
  shopId: string;
  initialViewModel: PromotionsViewModel;
}

export function PromotionsView({
  shopId,
  initialViewModel,
}: PromotionsViewProps) {
  const [state, actions] = usePromotionsPresenter(shopId, initialViewModel);
  const viewModel = state.viewModel;
  const pointsEnabled = viewModel?.pointsEnabled ?? false;
  const [detailPromotion, setDetailPromotion] = useState<PromotionData | null>(
    null
  );

  // Show loading only on initial load or when explicitly loading
  if (state.isLoading && !viewModel) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">
                กำลังโหลดข้อมูลโปรโมชั่น...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if there's an error but we have no data
  if (state.error && !viewModel) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <p className="text-red-600 dark:text-red-400 font-medium mb-2">
                เกิดข้อผิดพลาด
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {state.error}
              </p>
              <button
                onClick={actions.refreshData}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                ลองใหม่อีกครั้ง
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If we have no view model and not loading, show empty state
  if (!viewModel) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="text-gray-400 text-6xl mb-4">🏷️</div>
              <p className="text-gray-600 dark:text-gray-400 font-medium mb-2">
                ยังไม่มีข้อมูลโปรโมชั่น
              </p>
              <p className="text-gray-500 dark:text-gray-500 mb-4">
                ข้อมูลโปรโมชั่นจะแสดงที่นี่เมื่อมีการสร้างโปรโมชั่น
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Filter promotions based on search and status
  const filteredPromotions = viewModel.promotions.filter((promotion) => {
    const matchesSearch =
      promotion.name.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
      (promotion.description &&
        promotion.description
          .toLowerCase()
          .includes(state.searchTerm.toLowerCase()));
    const matchesStatus =
      state.statusFilter === "all" || promotion.status === state.statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex flex-col gap-8 relative">
      {!pointsEnabled && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 dark:border-amber-700 dark:bg-amber-900/30 p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <h2 className="text-lg font-semibold text-amber-800 dark:text-amber-200">
                  ระบบแต้มถูกปิดใช้งานอยู่
                </h2>
                <p className="text-sm text-amber-700/80 dark:text-amber-200/80">
                  เปิดใช้งานระบบแต้มจากหน้าการตั้งค่าเพื่อให้ลูกค้าสามารถสะสมแต้มและใช้โปรโมชั่นประเภทแต้มได้
                </p>
              </div>
            </div>
            <Link
              href={`/shop/${shopId}/backend/settings?tab=points`}
              className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              ไปที่การตั้งค่าระบบแต้ม
              <span aria-hidden>↗</span>
            </Link>
          </div>
        </div>
      )}

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
            onClick={actions.openCreateModal}
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
                {viewModel.stats.totalPromotions || 0}
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
                {viewModel.stats.activePromotions || 0}
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
                {viewModel.stats.scheduledPromotions || 0}
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
                {viewModel.stats.expiredPromotions || 0}
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
                {viewModel.stats.totalUsage || 0}
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
              value={state.searchTerm}
              onChange={(e) => actions.setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* Status Filter */}
          <div className="sm:w-48">
            <select
              value={state.statusFilter}
              onChange={(e) => actions.setStatusFilter(e.target.value)}
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
                {state.searchTerm || state.statusFilter !== "all"
                  ? "ไม่พบโปรโมชั่นที่ตรงกับเงื่อนไขการค้นหา"
                  : "ยังไม่มีโปรโมชั่นในระบบ"}
              </p>
              {state.searchTerm || state.statusFilter !== "all" ? (
                <p className="text-sm text-gray-400 mt-2">
                  ลองปรับเงื่อนไขการค้นหาหรือสร้างโปรโมชั่นใหม่
                </p>
              ) : (
                <p className="text-sm text-gray-400 mt-2">
                  คลิกปุ่ม &ldquo;สร้างโปรโมชั่น&rdquo;
                  เพื่อเริ่มสร้างโปรโมชั่นแรกของคุณ
                </p>
              )}
            </div>
          </div>
        ) : (
          filteredPromotions.map((promotion) => (
            <PromotionCard
              key={promotion.id}
              promotion={promotion}
              onEdit={() => {
                actions.setSelectedPromotion(promotion);
                actions.openEditModal(promotion);
              }}
              onDelete={() => {
                actions.setSelectedPromotion(promotion);
                actions.openDeleteModal(promotion);
              }}
              onToggleStatus={() => actions.togglePromotionStatus(promotion.id)}
              onView={() => setDetailPromotion(promotion)}
            />
          ))
        )}
      </div>

      {detailPromotion && (
        <PromotionDetailModal
          promotion={detailPromotion}
          onClose={() => setDetailPromotion(null)}
        />
      )}

      {/* Create Promotion Modal */}
      {state.showCreateModal && (
        <CreatePromotionModal
          onClose={actions.closeCreateModal}
          onSubmit={actions.createPromotion}
          loading={state.isCreating}
        />
      )}

      {/* Edit Promotion Modal */}
      {state.showEditModal && state.selectedPromotion && (
        <EditPromotionModal
          promotion={state.selectedPromotion}
          onClose={actions.closeEditModal}
          onSubmit={async (data) =>
            actions.updatePromotion({
              id: data.id,
              name: data.name,
              description: data.description,
              type: data.type,
              value: data.value,
              minPurchaseAmount: data.minPurchaseAmount,
              maxDiscountAmount: data.maxDiscountAmount,
              usageLimit: data.usageLimit,
              startAt: data.startAt,
              endAt: data.endAt,
              status: data.status,
              conditions: data.conditions,
            })
          }
          loading={state.isUpdating}
        />
      )}

      {/* Delete Confirmation */}
      {state.showDeleteModal && state.selectedPromotion && (
        <DeletePromotionConfirmation
          promotion={state.selectedPromotion}
          onClose={actions.closeDeleteModal}
          onConfirm={async () => {
            await actions.deletePromotion(state.selectedPromotion!.id);
          }}
          loading={state.isDeleting}
        />
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
    </div>
  );
}
