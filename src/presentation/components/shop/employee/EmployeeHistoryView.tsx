"use client";

import type {
  EmployeeHistoryViewModel,
  FilterOptions,
  HistoryQueue,
} from "@/src/presentation/presenters/shop/employee/EmployeeHistoryPresenter";
import { useState } from "react";

interface EmployeeHistoryViewProps {
  viewModel: EmployeeHistoryViewModel;
}

export function EmployeeHistoryView({ viewModel }: EmployeeHistoryViewProps) {
  const [filters, setFilters] = useState<FilterOptions>(
    viewModel.filterOptions
  );
  const [selectedQueue, setSelectedQueue] = useState<HistoryQueue | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const handleViewDetails = (queue: HistoryQueue) => {
    setSelectedQueue(queue);
    setShowDetailsModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "shop-employee-history-completed";
      case "cancelled":
        return "shop-employee-history-cancelled";
      case "no_show":
        return "shop-employee-history-no-show";
      default:
        return "shop-employee-history-default";
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

  const getPaymentMethodText = (method: string) => {
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
        return method;
    }
  };

  const getPaymentMethodIcon = (method: string) => {
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
        return "💳";
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={
          i < rating
            ? "shop-employee-history-star-filled"
            : "shop-employee-history-star-empty"
        }
      >
        ⭐
      </span>
    ));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold shop-employee-header-text">
            ประวัติการให้บริการ
          </h1>
          <p className="shop-employee-header-text-muted mt-1">
            ดูประวัติและสถิติการทำงานของคุณ • พนักงาน: {viewModel.employeeName}
          </p>
        </div>
      </div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="shop-employee-card rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium shop-employee-text-muted">
                คิวทั้งหมดวันนี้
              </p>
              <p className="text-2xl font-bold shop-employee-text">
                {viewModel.currentStats.totalQueues}
              </p>
            </div>
            <span className="text-3xl">👥</span>
          </div>
        </div>

        <div className="shop-employee-card rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium shop-employee-text-muted">
                เสร็จสิ้น
              </p>
              <p className="text-2xl font-bold shop-employee-history-stats-completed">
                {viewModel.currentStats.completedQueues}
              </p>
            </div>
            <span className="text-3xl">✅</span>
          </div>
        </div>

        <div className="shop-employee-card rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium shop-employee-text-muted">
                ยอดขายวันนี้
              </p>
              <p className="text-2xl font-bold shop-employee-history-stats-revenue">
                ฿{viewModel.currentStats.totalRevenue.toLocaleString()}
              </p>
            </div>
            <span className="text-3xl">💰</span>
          </div>
        </div>

        <div className="shop-employee-card rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium shop-employee-text-muted">
                คะแนนเฉลี่ย
              </p>
              <p className="text-2xl font-bold shop-employee-history-stats-rating">
                {viewModel.currentStats.averageRating.toFixed(1)}
              </p>
            </div>
            <span className="text-3xl">⭐</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="shop-employee-card rounded-xl shadow-sm">
        <div className="p-6 border-b shop-employee-sidebar-border">
          <h3 className="text-lg font-semibold shop-employee-text">
            ตัวกรอง
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium shop-employee-text mb-2">
                ช่วงเวลา
              </label>
              <select
                value={filters.dateRange}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    dateRange: e.target.value as FilterOptions["dateRange"],
                  })
                }
                className="w-full px-3 py-2 border rounded-lg shop-employee-history-filter-input shop-employee-text focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              >
                <option value="today">วันนี้</option>
                <option value="week">สัปดาห์นี้</option>
                <option value="month">เดือนนี้</option>
                <option value="custom">กำหนดเอง</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium shop-employee-text mb-2">
                สถานะ
              </label>
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    status: e.target.value as FilterOptions["status"],
                  })
                }
                className="w-full px-3 py-2 border rounded-lg shop-employee-history-filter-input shop-employee-text focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              >
                <option value="all">ทั้งหมด</option>
                <option value="completed">เสร็จสิ้น</option>
                <option value="cancelled">ยกเลิก</option>
                <option value="no_show">ไม่มาตามนัด</option>
              </select>
            </div>

            <div className="flex items-end">
              <button className="w-full shop-employee-history-filter-button text-white px-4 py-2 rounded-lg transition-colors">
                ค้นหา
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* History List */}
      <div className="shop-employee-card rounded-xl shadow-sm">
        <div className="p-6 border-b shop-employee-sidebar-border">
          <h2 className="text-xl font-semibold shop-employee-text">
            ประวัติการให้บริการ ({viewModel.historyQueues.length})
          </h2>
        </div>

        <div className="divide-y shop-employee-divide">
          {viewModel.historyQueues.length === 0 ? (
            <div className="text-center py-12">
              <span className="text-8xl mb-6 block">📋</span>
              <h3 className="text-2xl font-bold shop-employee-text mb-4">
                ไม่มีประวัติการให้บริการ
              </h3>
              <p className="shop-employee-text-muted">
                ประวัติการให้บริการจะแสดงที่นี่
              </p>
            </div>
          ) : (
            viewModel.historyQueues.map((queue) => (
              <div
                key={queue.id}
                className="p-6 shop-employee-history-item-hover transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="shop-employee-history-queue-number text-sm font-medium px-2.5 py-0.5 rounded">
                        คิว {queue.queueNumber}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                          queue.status
                        )}`}
                      >
                        {getStatusText(queue.status)}
                      </span>
                      <span className="text-xs shop-employee-text-muted">
                        {queue.servedAt} - {queue.completedAt}
                      </span>
                      <span className="text-xs shop-employee-text-muted">
                        ({queue.duration} นาที)
                      </span>
                    </div>

                    <h3 className="font-medium shop-employee-text mb-1">
                      {queue.customerName}
                    </h3>
                    <p className="text-sm shop-employee-text-muted mb-2">
                      {queue.customerPhone}
                    </p>

                    <div className="flex items-center gap-4 text-sm shop-employee-text-muted mb-2">
                      <span>฿{queue.total.toLocaleString()}</span>
                      <span className="flex items-center gap-1">
                        {getPaymentMethodIcon(queue.paymentMethod)}
                        {getPaymentMethodText(queue.paymentMethod)}
                      </span>
                      {queue.rating && (
                        <div className="flex items-center gap-1">
                          {renderStars(queue.rating)}
                          <span className="ml-1">({queue.rating})</span>
                        </div>
                      )}
                    </div>

                    <div className="text-sm shop-employee-text-muted">
                      {queue.services.map((service, index) => (
                        <span key={service.id}>
                          {service.name} x{service.quantity}
                          {index < queue.services.length - 1 && ", "}
                        </span>
                      ))}
                    </div>

                    {queue.feedback && (
                      <div className="mt-2 p-2 shop-employee-history-feedback-bg rounded text-sm shop-employee-history-feedback-text">
                        💬 {queue.feedback}
                      </div>
                    )}
                  </div>

                  <div className="ml-4">
                    <button
                      onClick={() => handleViewDetails(queue)}
                      className="shop-employee-history-details-button text-sm"
                    >
                      ดูรายละเอียด
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedQueue && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="shop-employee-card rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold shop-employee-text">
                รายละเอียดคิว {selectedQueue.queueNumber}
              </h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="shop-employee-history-modal-close"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Customer Info */}
              <div className="shop-employee-history-modal-info-bg rounded-lg p-4">
                <h4 className="font-medium shop-employee-text mb-2">
                  ข้อมูลลูกค้า
                </h4>
                <p className="text-sm shop-employee-text-muted">
                  ชื่อ: {selectedQueue.customerName}
                </p>
                <p className="text-sm shop-employee-text-muted">
                  เบอร์โทร: {selectedQueue.customerPhone}
                </p>
              </div>

              {/* Services */}
              <div>
                <h4 className="font-medium shop-employee-text mb-2">
                  บริการ
                </h4>
                <div className="space-y-2">
                  {selectedQueue.services.map((service) => (
                    <div
                      key={service.id}
                      className="flex justify-between items-center py-2 border-b shop-employee-history-modal-border"
                    >
                      <div>
                        <span className="font-medium shop-employee-text">
                          {service.name}
                        </span>
                        <span className="shop-employee-text-muted ml-2">
                          x{service.quantity}
                        </span>
                      </div>
                      <span className="font-medium shop-employee-text">
                        ฿{(service.price * service.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center py-2 font-bold text-lg shop-employee-text">
                    <span>รวมทั้งสิ้น</span>
                    <span>฿{selectedQueue.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Service Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                    เวลาให้บริการ
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    เริ่ม: {selectedQueue.servedAt}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    เสร็จ: {selectedQueue.completedAt}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    ระยะเวลา: {selectedQueue.duration} นาที
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                    การชำระเงิน
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    วิธีชำระ:{" "}
                    {getPaymentMethodIcon(selectedQueue.paymentMethod)}{" "}
                    {getPaymentMethodText(selectedQueue.paymentMethod)}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    สถานะ:{" "}
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                        selectedQueue.status
                      )}`}
                    >
                      {getStatusText(selectedQueue.status)}
                    </span>
                  </p>
                </div>
              </div>

              {/* Rating & Feedback */}
              {selectedQueue.rating && (
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                    คะแนนและความคิดเห็น
                  </h4>
                  <div className="flex items-center gap-2 mb-2">
                    {renderStars(selectedQueue.rating)}
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      ({selectedQueue.rating}/5)
                    </span>
                  </div>
                  {selectedQueue.feedback && (
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
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
                className="px-4 py-2 bg-gray-500 dark:bg-gray-600 text-white rounded-lg hover:bg-gray-600 dark:hover:bg-gray-700 transition-colors"
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
