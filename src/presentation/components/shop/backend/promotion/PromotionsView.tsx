"use client";

import { PromotionsViewModel } from "@/src/presentation/presenters/shop/backend/PromotionsPresenter";
import { usePromotionsPresenter } from "@/src/presentation/presenters/shop/backend/usePromotionsPresenter";
import { CreatePromotionModal } from "./modals/CreatePromotionModal";
import { EditPromotionModal } from "./modals/EditPromotionModal";
import { DeletePromotionConfirmation } from "./modals/DeletePromotionConfirmation";

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
      free_item: "ของแถม",
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
      free_item:
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
                      actions.openEditModal(promotion);
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
                      actions.openDeleteModal(promotion);
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
                    onClick={() => actions.togglePromotionStatus(promotion.id)}
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

      {/* Create Promotion Modal */}
      {state.showCreateModal && (
        <CreatePromotionModal
          shopId={shopId}
          onClose={actions.closeCreateModal}
          onSubmit={actions.createPromotion}
          loading={state.isCreating}
        />
      )}

      {/* Edit Promotion Modal */}
      {state.showEditModal && state.selectedPromotion && (
        <EditPromotionModal
          promotion={state.selectedPromotion}
          shopId={shopId}
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
