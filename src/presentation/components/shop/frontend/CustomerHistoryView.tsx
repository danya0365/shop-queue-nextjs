"use client";

import { PaginationControls } from "@/src/presentation/components/common/PaginationControls";
import type {
  CustomerHistoryViewModel,
  CustomerQueueHistory,
  HistoryFilterType,
} from "@/src/presentation/presenters/shop/frontend/CustomerHistoryPresenter";
import { useCustomerHistoryPresenter } from "@/src/presentation/presenters/shop/frontend/useCustomerHistoryPresenter";
import { useState } from "react";

interface CustomerHistoryViewProps {
  shopId: string;
  initialViewModel?: CustomerHistoryViewModel;
}

export function CustomerHistoryView({
  shopId,
  initialViewModel,
}: CustomerHistoryViewProps) {
  const {
    viewModel,
    loading,
    error,
    currentPage,
    perPage,
    filters,
    pagination,
    handlePageChange,
    handleNextPage,
    handlePrevPage,
    handlePerPageChange,
    handleStatusFilterChange,
    handleDateRangeFilterChange,
    handleShopFilterChange,
    handleCustomDateRangeChange,
    handleViewQueueDetails,
    actionLoading,
    refreshData,
  } = useCustomerHistoryPresenter(shopId, initialViewModel);

  const [selectedQueue, setSelectedQueue] =
    useState<CustomerQueueHistory | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const handleViewDetails = (queue: CustomerQueueHistory) => {
    setSelectedQueue(queue);
    setShowDetailsModal(true);
    handleViewQueueDetails(queue);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "no_show":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "เสร็จสิ้น";
      case "cancelled":
        return "ยกเลิก";
      case "no_show":
        return "ไม่มาตามนัด";
      default:
        return status;
    }
  };

  const getPaymentMethodText = (method?: string) => {
    switch (method) {
      case "cash":
        return "เงินสด";
      case "card":
        return "บัตรเครดิต";
      case "qr":
        return "QR Code";
      case "transfer":
        return "โอนเงิน";
      default:
        return "-";
    }
  };

  const getPaymentMethodIcon = (method?: string) => {
    switch (method) {
      case "cash":
        return "💵";
      case "card":
        return "💳";
      case "qr":
        return "📱";
      case "transfer":
        return "🏦";
      default:
        return "";
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={i < rating ? "text-yellow-400" : "text-gray-300"}
      >
        ⭐
      </span>
    ));
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold shop-frontend-text-primary mb-2">
            ประวัติการใช้บริการ
          </h1>
          <p className="shop-frontend-text-secondary">
            ดูประวัติคิวและการใช้บริการของคุณ
          </p>
        </div>
        <div className="shop-frontend-card">
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="shop-frontend-text-secondary">กำลังโหลดข้อมูล...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold shop-frontend-text-primary mb-2">
            ประวัติการใช้บริการ
          </h1>
          <p className="shop-frontend-text-secondary">
            ดูประวัติคิวและการใช้บริการของคุณ
          </p>
        </div>
        <div className="shop-frontend-card">
          <div className="p-12 text-center">
            <span className="text-6xl mb-4 block">❌</span>
            <h4 className="text-xl font-semibold shop-frontend-text-primary mb-2">
              เกิดข้อผิดพลาด
            </h4>
            <p className="shop-frontend-text-secondary mb-4">{error}</p>
            <button
              onClick={refreshData}
              className="shop-frontend-button-primary px-4 py-2 rounded-lg text-sm font-medium"
            >
              ลองใหม่อีกครั้ง
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No data state
  if (!viewModel) {
    return (
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold shop-frontend-text-primary mb-2">
            ประวัติการใช้บริการ
          </h1>
          <p className="shop-frontend-text-secondary">
            ดูประวัติคิวและการใช้บริการของคุณ
          </p>
        </div>
        <div className="shop-frontend-card">
          <div className="p-12 text-center">
            <span className="text-6xl mb-4 block">📜</span>
            <h4 className="text-xl font-semibold shop-frontend-text-primary mb-2">
              ไม่มีข้อมูล
            </h4>
            <p className="shop-frontend-text-secondary">
              เมื่อคุณใช้บริการ ประวัติจะแสดงที่นี่
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold shop-frontend-text-primary mb-2">
          ประวัติการใช้บริการ
        </h1>
        <p className="shop-frontend-text-secondary">
          ดูประวัติคิวและการใช้บริการของคุณ
        </p>
      </div>

      {/* Filters */}
      <div className="shop-frontend-card">
        <div className="p-6 border-b shop-frontend-card-border">
          <h3 className="text-lg font-medium shop-frontend-text-primary">
            ตัวกรอง
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium shop-frontend-text-primary mb-1">
                สถานะ
              </label>
              <select
                value={filters.status || ""}
                onChange={(e) =>
                  handleStatusFilterChange(
                    (e.target.value || "all") as HistoryFilterType
                  )
                }
                className="shop-frontend-input w-full"
              >
                <option value="">ทั้งหมด</option>
                <option value="completed">เสร็จสิ้น</option>
                <option value="cancelled">ยกเลิก</option>
                <option value="no_show">ไม่มาตามนัด</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium shop-frontend-text-primary mb-1">
                วันที่เริ่มต้น
              </label>
              <input
                type="date"
                value={filters.startDate || ""}
                onChange={(e) =>
                  handleCustomDateRangeChange(
                    e.target.value || undefined,
                    filters.endDate
                  )
                }
                className="shop-frontend-input w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium shop-frontend-text-primary mb-1">
                วันที่สิ้นสุด
              </label>
              <input
                type="date"
                value={filters.endDate || ""}
                onChange={(e) =>
                  handleCustomDateRangeChange(
                    filters.startDate,
                    e.target.value || undefined
                  )
                }
                className="shop-frontend-input w-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* History List */}
      <div className="shop-frontend-card">
        <div className="p-6 border-b shop-frontend-card-border">
          <h3 className="text-lg font-medium shop-frontend-text-primary">
            ประวัติการใช้บริการ
          </h3>
        </div>
        <div className="p-6">
          {viewModel.queueHistory.length === 0 ? (
            <div className="text-center py-12">
              <span className="text-6xl mb-4 block">📜</span>
              <h4 className="text-xl font-semibold shop-frontend-text-primary mb-2">
                ไม่มีประวัติการใช้บริการ
              </h4>
              <p className="shop-frontend-text-secondary">
                เมื่อคุณใช้บริการ ประวัติจะแสดงที่นี่
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {viewModel.queueHistory.map((queue) => (
                <div key={queue.id}>
                  <div className="shop-frontend-card shop-frontend-card-hover p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="shop-frontend-badge-info px-3 py-1 rounded-full text-sm font-medium">
                          #{queue.queueNumber}
                        </div>
                        <div>
                          <h4 className="font-medium shop-frontend-text-primary">
                            {queue.shopName}
                          </h4>
                          <p className="text-sm shop-frontend-text-secondary">
                            {queue.queueDate} เวลา {queue.queueTime}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="font-bold shop-frontend-service-price">
                            ฿{queue.totalAmount}
                          </p>
                          <p className="text-sm shop-frontend-text-secondary">
                            {queue.services.length} รายการ
                          </p>
                        </div>

                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            queue.status === "completed"
                              ? "shop-frontend-badge-success"
                              : queue.status === "cancelled"
                              ? "shop-frontend-status-cancelled"
                              : "shop-frontend-badge-warning"
                          }`}
                        >
                          {getStatusText(queue.status)}
                        </span>

                        <button
                          onClick={() => handleViewDetails(queue)}
                          className="shop-frontend-button-secondary px-4 py-2 rounded-lg text-sm font-medium"
                        >
                          ดูรายละเอียด
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 0 && (
          <div className="px-6 py-4 border-t shop-frontend-card-border">
            <PaginationControls
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              perPage={pagination.perPage}
              totalItems={pagination.totalItems}
              onPageChange={handlePageChange}
              onPerPageChange={handlePerPageChange}
              onNextPage={handleNextPage}
              onPrevPage={handlePrevPage}
              hasNext={pagination.hasNext}
              hasPrev={pagination.hasPrev}
            />
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedQueue && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                รายละเอียดคิว {selectedQueue.queueNumber}
              </h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Queue Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">ข้อมูลคิว</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">
                      ร้าน: {selectedQueue.shopName}
                    </p>
                    <p className="text-gray-600">
                      วันที่:{" "}
                      {new Date(selectedQueue.queueDate).toLocaleDateString(
                        "th-TH"
                      )}
                    </p>
                    <p className="text-gray-600">
                      เวลา: {selectedQueue.queueTime}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">
                      สถานะ:{" "}
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                          selectedQueue.status
                        )}`}
                      >
                        {getStatusText(selectedQueue.status)}
                      </span>
                    </p>
                    {selectedQueue.completedAt && (
                      <p className="text-gray-600">
                        เสร็จสิ้น: {selectedQueue.completedAt}
                      </p>
                    )}
                    {selectedQueue.employeeName && (
                      <p className="text-gray-600">
                        พนักงาน: {selectedQueue.employeeName}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Services */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">บริการ</h4>
                <div className="space-y-2">
                  {selectedQueue.services.map((service) => (
                    <div
                      key={service.id}
                      className="flex justify-between items-center py-2 border-b"
                    >
                      <div>
                        <span className="font-medium">{service.name}</span>
                        <span className="text-gray-600 ml-2">
                          x{service.quantity}
                        </span>
                      </div>
                      <span className="font-medium">
                        ฿{(service.price * service.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center py-2 font-bold text-lg">
                    <span>รวมทั้งสิ้น</span>
                    <span>฿{selectedQueue.totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Payment & Timing */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    การชำระเงิน
                  </h4>
                  {selectedQueue.paymentMethod ? (
                    <p className="text-sm text-gray-600">
                      {getPaymentMethodIcon(selectedQueue.paymentMethod)}{" "}
                      {getPaymentMethodText(selectedQueue.paymentMethod)}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-600">-</p>
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">เวลา</h4>
                  {selectedQueue.waitTime && (
                    <p className="text-sm text-gray-600">
                      เวลารอ: {selectedQueue.waitTime} นาที
                    </p>
                  )}
                  {selectedQueue.serviceTime && (
                    <p className="text-sm text-gray-600">
                      เวลาให้บริการ: {selectedQueue.serviceTime} นาที
                    </p>
                  )}
                </div>
              </div>

              {/* Rating & Feedback */}
              {selectedQueue.rating && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    คะแนนและความคิดเห็น
                  </h4>
                  <div className="flex items-center gap-2 mb-2">
                    {renderStars(selectedQueue.rating)}
                    <span className="font-medium">
                      ({selectedQueue.rating}/5)
                    </span>
                  </div>
                  {selectedQueue.feedback && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm text-gray-700">
                        {selectedQueue.feedback}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
