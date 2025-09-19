"use client";

import type { CreatePaymentParams } from "@/src/application/dtos/shop/backend/payments-dto";
import { PaymentMethod } from "@/src/application/dtos/shop/backend/payments-dto";
import { QueueStatus } from "@/src/domain/entities/shop/backend/backend-queue.entity";
import { getPaginationConfig } from "@/src/infrastructure/config/PaginationConfig";
import {
  QueueItem,
  QueueManagementViewModel,
} from "@/src/presentation/presenters/shop/backend/QueueManagementPresenter";
import {
  PriorityFilter,
  StatusFilter,
  useQueueManagementPresenter,
} from "@/src/presentation/presenters/shop/backend/useQueueManagementPresenter";
import { useState } from "react";
import { PaymentModal } from "../payment/modals/PaymentModal";
import { QueueLimitsWarning } from "./components/QueueLimitsWarning";
import { CreateQueueModal } from "./modals/CreateQueueModal";
import { DeleteConfirmationModal } from "./modals/DeleteConfirmationModal";
import { EditQueueModal } from "./modals/EditQueueModal";
import { QRCodeModal } from "./modals/QRCodeModal";

interface QueueManagementViewProps {
  shopId: string;
  initialViewModel?: QueueManagementViewModel;
}

export function QueueManagementView({
  shopId,
  initialViewModel,
}: QueueManagementViewProps) {
  const {
    viewModel,
    loading,
    error,
    currentPage,
    filters,
    handlePageChange,
    handleNextPage,
    handlePrevPage,
    handlePerPageChange,
    handleStatusFilter,
    handlePriorityFilter,
    handleSearch,
    resetFilters,
    refreshData,
    updateQueueStatus,
    updateQueue,
    deleteQueue,
    createQueue,
    createQueuePayment,
    actionLoading,
  } = useQueueManagementPresenter(shopId, initialViewModel);

  // Modal states
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [qrCodeModalOpen, setQrCodeModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedQueue, setSelectedQueue] = useState<QueueItem | null>(null);

  // Show loading only on initial load or when explicitly loading
  if (loading && !viewModel) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">
                กำลังโหลดข้อมูลคิว...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if there's an error but we have no data
  if (error && !viewModel) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <p className="text-red-600 dark:text-red-400 font-medium mb-2">
                {error}
              </p>
              <button
                onClick={refreshData}
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

  if (!viewModel) {
    return null;
  }

  const {
    queues,
    waitingCount,
    confirmedCount,
    servingCount,
    completedCount,
    subscription,
  } = viewModel;
  const { data: queueData, pagination } = queues;

  const getStatusColor = (status: QueueItem["status"]) => {
    switch (status) {
      case "waiting":
        return "bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200";
      case "confirmed":
        return "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200";
      case "serving":
        return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200";
      case "completed":
        return "bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200";
      case "cancelled":
        return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200";
      default:
        return "bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200";
    }
  };

  const getPriorityColor = (priority: QueueItem["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200";
      case "urgent":
        return "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200";
      default:
        return "bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "waiting":
        return "รอยืนยัน";
      case "confirmed":
        return "ยืนยันแล้ว";
      case "serving":
        return "กำลังให้บริการ";
      case "completed":
        return "เสร็จสิ้น";
      case "cancelled":
        return "ยกเลิก";
      default:
        return status;
    }
  };

  const getPriorityText = (priority: QueueItem["priority"]) => {
    switch (priority) {
      case "high":
        return "สูง";
      case "urgent":
        return "ด่วน";
      case "normal":
        return "ปกติ";
      default:
        return priority;
    }
  };

  // Helper function to check if queue has unpaid balance
  const hasUnpaidBalance = (queue: QueueItem): boolean => {
    if (!queue.payments || queue.payments.length === 0) {
      return true; // No payments means unpaid
    }

    // Calculate total paid amount from all payments
    const totalPaid = queue.payments.reduce((sum, payment) => {
      return sum + (payment.paidAmount || 0);
    }, 0);

    // Calculate total amount from queue services
    const totalAmount = queue.queueServices.reduce((sum, service) => {
      return sum + (service.total || service.price * service.quantity);
    }, 0);

    return totalPaid < totalAmount;
  };

  // Action handlers
  const handleEditQueue = (queue: QueueItem) => {
    setSelectedQueue(queue);
    setEditModalOpen(true);
  };

  const handleUpdateQueue = async (
    queueId: string,
    data: {
      services: {
        serviceId: string;
        quantity: number;
        price?: number;
      }[];
      priority: QueueItem["priority"];
      notes?: string;
    }
  ) => {
    await updateQueue(queueId, {
      services: data.services,
      priority: data.priority,
      notes: data.notes,
    });
  };

  const handleStatusUpdate = async (
    queueId: string,
    newStatus: QueueStatus
  ) => {
    try {
      await updateQueueStatus(queueId, newStatus);
    } catch (error) {
      console.error("Error updating queue status:", error);
    }
  };

  const handleDeleteQueue = async (queueId: string) => {
    setSelectedQueue(queueData.find((q) => q.id === queueId) || null);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedQueue) {
      try {
        await deleteQueue(selectedQueue.id);
        setDeleteModalOpen(false);
        setSelectedQueue(null);
      } catch (error) {
        console.error("Error deleting queue:", error);
      }
    }
  };

  const handleCreateQueue = async (data: {
    customerName: string;
    customerPhone: string;
    services: {
      serviceId: string;
      price?: number;
      quantity: number;
    }[];
    priority: QueueItem["priority"];
    notes?: string;
  }) => {
    try {
      await createQueue({
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        priority: data.priority,
        notes: data.notes,
        services: data.services,
      });
      setCreateModalOpen(false);
      // Success notification could be added here
    } catch (error) {
      console.error("Error creating queue:", error);
      // Error is already handled by the presenter and shown in the UI
    }
  };

  const handlePayment = (queue: QueueItem) => {
    setSelectedQueue(queue);
    setPaymentModalOpen(true);
  };

  const handlePaymentSubmit = async (paymentData: CreatePaymentParams) => {
    try {
      await createQueuePayment({
        queueId: paymentData.queueId,
        totalAmount: paymentData.totalAmount,
        paymentMethod: paymentData.paymentMethod || PaymentMethod.CASH,
        processedByEmployeeId: paymentData.processedByEmployeeId || "",
        shopId: paymentData.shopId,
      });
      setPaymentModalOpen(false);
      setSelectedQueue(null);
    } catch (error) {
      console.error("Error creating payment:", error);
    }
  };

  return (
    <div className="flex flex-col gap-8 relative">
      {/* Draft Status Overlay */}
      {viewModel.shop.status === "draft" && (
        <div className="absolute inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md mx-4 text-center border border-gray-200 dark:border-gray-700">
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl">🏗️</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                ร้านค้ายังไม่พร้อมเปิด
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                กรุณาตั้งค่าร้านค้าก่อนเริ่มใช้งาน
              </p>
            </div>
            <div className="space-y-3 text-sm text-gray-500 dark:text-gray-400 mb-6">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                <span>ร้านค้าอยู่ในสถานะร่าง (Draft)</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse delay-100"></div>
                <span>ต้องทำการตั้งค่าข้อมูลร้านค้าให้สมบูรณ์</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse delay-200"></div>
                <span>ยังไม่สามารถเปิดรับคิวลูกค้าได้</span>
              </div>
            </div>
            <div className="space-y-3">
              <button
                onClick={() =>
                  (window.location.href = `/shop/${shopId}/backend/settings`)
                }
                className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-3 rounded-lg hover:from-amber-600 hover:to-orange-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                ⚙️ ไปที่การตั้งค่าร้านค้า
              </button>
              <button
                onClick={() => window.history.back()}
                className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
              >
                ← กลับหน้าก่อนหน้า
              </button>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-400 dark:text-gray-500">
                เมื่อตั้งค่าร้านค้าเสร็จสิ้นแล้ว
                <br />
                ระบบจะพร้อมให้บริการจัดการคิวลูกค้าของคุณ
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Empty Shop Services Overlay */}
      {viewModel.shop.servicesCount === 0 && (
        <div className="absolute inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md mx-4 text-center border border-gray-200 dark:border-gray-700">
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl">🛒</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                ยังไม่มีบริการ
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                กรุณาเพิ่มบริการของคุณก่อนเริ่มใช้งาน
              </p>
            </div>
            <div className="space-y-3 text-sm text-gray-500 dark:text-gray-400 mb-6">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                <span>ยังไม่มีบริการของคุณ</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse delay-100"></div>
                <span>ต้องทำการเพิ่มบริการของคุณ</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse delay-200"></div>
                <span>ยังไม่สามารถจัดการคิวลูกค้าได้</span>
              </div>
            </div>
            <div className="space-y-3">
              <button
                onClick={() =>
                  (window.location.href = `/shop/${shopId}/backend/services`)
                }
                className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-3 rounded-lg hover:from-amber-600 hover:to-orange-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                📝 เพิ่มบริการใหม่
              </button>
              <button
                onClick={() => window.history.back()}
                className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
              >
                ← กลับหน้าก่อนหน้า
              </button>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-400 dark:text-gray-500">
                เมื่อเพิ่มบริการของคุณเสร็จสิ้นแล้ว
                <br />
                ระบบจะพร้อมให้บริการจัดการคิวลูกค้าของคุณ
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            จัดการคิว
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            ติดตามและจัดการคิวลูกค้าทั้งหมด
          </p>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => setCreateModalOpen(true)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              subscription.canCreateQueue
                ? "bg-green-500 dark:bg-green-600 text-white hover:bg-green-600 dark:hover:bg-green-700"
                : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
            }`}
            disabled={!subscription.canCreateQueue}
          >
            📝 เพิ่มคิวใหม่
          </button>
          <button
            onClick={() => setQrCodeModalOpen(true)}
            className="bg-blue-500 dark:bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
          >
            📱 สร้าง QR Code
          </button>
        </div>
      </div>

      {/* Queue Limits Warning */}
      <QueueLimitsWarning
        limits={subscription.limits}
        usage={subscription.usage}
        canCreateQueue={subscription.canCreateQueue}
        dailyLimitReached={subscription.dailyLimitReached}
      />

      {/* Stats Cards */}
      {pagination.totalCount === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-12 border border-gray-200 dark:border-gray-700 text-center">
          <div className="text-gray-500 dark:text-gray-400">
            <div className="text-4xl mb-4">📊</div>
            <p className="text-lg font-medium">ยังไม่มีข้อมูลสถิติคิว</p>
            <p className="text-sm mt-2">
              ข้อมูลสถิติคิวจะแสดงเมื่อมีลูกค้าจองคิว
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  คิวทั้งหมด
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {pagination.totalCount}
                </p>
              </div>
              <span className="text-3xl">📋</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  รอยืนยัน
                </p>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {waitingCount}
                </p>
              </div>
              <span className="text-3xl">⏳</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  ยืนยันแล้ว
                </p>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {confirmedCount}
                </p>
              </div>
              <span className="text-3xl">✔️</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  กำลังให้บริการ
                </p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {servingCount}
                </p>
              </div>
              <span className="text-3xl">🔔️</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  เสร็จสิ้น
                </p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {completedCount}
                </p>
              </div>
              <span className="text-3xl">🎉</span>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  สถานะ
                </label>
                <select
                  value={filters.status}
                  onChange={(e) =>
                    handleStatusFilter(e.target.value as StatusFilter)
                  }
                  className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="all">ทั้งหมด</option>
                  <option value="waiting">รอยืนยัน</option>
                  <option value="confirmed">ยืนยันแล้ว</option>
                  <option value="serving">กำลังให้บริการ</option>
                  <option value="completed">เสร็จสิ้น</option>
                  <option value="cancelled">ยกเลิก</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  ระดับความสำคัญ
                </label>
                <select
                  value={filters.priority}
                  onChange={(e) =>
                    handlePriorityFilter(e.target.value as PriorityFilter)
                  }
                  className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="all">ทั้งหมด</option>
                  <option value="normal">ปกติ</option>
                  <option value="high">สำคัญ</option>
                  <option value="urgent">ด่วน</option>
                </select>
              </div>
            </div>

            <div className="flex-1 max-w-md">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                ค้นหา
              </label>
              <input
                type="text"
                placeholder="ค้นหาชื่อ, เบอร์โทร, หรือหมายเลขคิว"
                value={filters.search}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={resetFilters}
                disabled={loading}
                className="px-4 py-2 bg-gray-500 dark:bg-gray-600 text-white rounded-lg hover:bg-gray-600 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                รีเซ็ต
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Queue List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            รายการคิว ({queueData.length})
          </h2>

          {/* Active Filters */}
          {(filters.search ||
            filters.status !== "all" ||
            filters.priority !== "all") && (
            <div className="mt-3 flex flex-wrap gap-2">
              {filters.search && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                  ค้นหา: &ldquo;{filters.search}&rdquo;
                </span>
              )}
              {filters.status !== "all" && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                  สถานะ: {getStatusText(filters.status)}
                </span>
              )}
              {filters.priority !== "all" && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
                  ความสำคัญ: {getPriorityText(filters.priority)}
                </span>
              )}
            </div>
          )}
        </div>
        <div className="relative min-h-[200px]">
          {/* Loading and Error Overlay */}
          {(loading || error) && (
            <div className="absolute inset-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm flex items-center justify-center z-10">
              <div className="text-center">
                {loading && (
                  <div className="flex flex-col items-center space-y-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                      กำลังโหลดข้อมูล...
                    </p>
                  </div>
                )}
                {error && (
                  <div className="flex flex-col items-center space-y-3">
                    <div className="text-red-500 text-2xl">⚠️</div>
                    <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                      {error}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* List Data */}
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {queueData.length === 0 ? (
              <div className="p-12 text-center">
                <div className="text-gray-500 dark:text-gray-400">
                  <div className="text-4xl mb-4">📋</div>
                  <p className="text-lg">
                    {filters.search ||
                    filters.status !== "all" ||
                    filters.priority !== "all"
                      ? "ไม่พบรายการคิวที่ตรงกับเงื่อนไขการค้นหา"
                      : "ยังไม่มีรายการคิวในระบบ"}
                  </p>
                  {filters.search ||
                  filters.status !== "all" ||
                  filters.priority !== "all" ? (
                    <p className="text-sm text-gray-400 mt-2">
                      ลองปรับเงื่อนไขการค้นหาหรือเพิ่มรายการคิวใหม่
                    </p>
                  ) : (
                    <p className="text-sm text-gray-400 mt-2">
                      คลิกปุ่ม &lsquo;เพิ่มคิวใหม่&rsquo;
                      เพื่อเริ่มบันทึกรายการแรกของคุณ
                    </p>
                  )}
                </div>
              </div>
            ) : (
              queueData.map((queue: QueueItem) => (
                <div
                  key={queue.id}
                  className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 dark:text-blue-300 font-bold">
                            {queue.queueNumber}
                          </span>
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                            {queue.customerName}
                          </h3>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              queue.status
                            )}`}
                          >
                            {getStatusText(queue.status)}
                          </span>
                          {queue.priority !== "normal" && (
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                                queue.priority
                              )}`}
                            >
                              {getPriorityText(queue.priority)}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {queue.customerPhone}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          บริการ: {queue.serviceNames.join(", ")}
                        </p>
                        {queue.notes && (
                          <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                            หมายเหตุ: {queue.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          เวลา
                        </p>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {queue.createdAt}
                        </p>
                        {queue.estimatedWaitTime > 0 && (
                          <p className="text-xs text-orange-600 dark:text-orange-400">
                            รอ ~{queue.estimatedWaitTime} นาที
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col space-y-2">
                        {queue.status === QueueStatus.WAITING && (
                          <>
                            <button
                              onClick={() =>
                                handleStatusUpdate(
                                  queue.id,
                                  QueueStatus.CONFIRMED
                                )
                              }
                              disabled={actionLoading.updateStatus}
                              className="bg-green-500 dark:bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-600 dark:hover:bg-green-700 transition-colors disabled:opacity-50"
                            >
                              ยืนยัน
                            </button>
                            <button
                              onClick={() =>
                                handleStatusUpdate(
                                  queue.id,
                                  QueueStatus.SERVING
                                )
                              }
                              disabled={actionLoading.updateStatus}
                              className="bg-blue-500 dark:bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                              เรียก
                            </button>
                          </>
                        )}
                        {queue.status === QueueStatus.CONFIRMED && (
                          <>
                            <button
                              onClick={() =>
                                handleStatusUpdate(
                                  queue.id,
                                  QueueStatus.SERVING
                                )
                              }
                              disabled={actionLoading.updateStatus}
                              className="bg-blue-500 dark:bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                              เรียก
                            </button>
                          </>
                        )}
                        {queue.status === QueueStatus.SERVING && (
                          <>
                            <button
                              onClick={() =>
                                handleStatusUpdate(
                                  queue.id,
                                  QueueStatus.COMPLETED
                                )
                              }
                              disabled={actionLoading.updateStatus}
                              className="bg-purple-500 dark:bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-600 dark:hover:bg-purple-700 transition-colors disabled:opacity-50"
                            >
                              เสร็จสิ้น
                            </button>
                          </>
                        )}

                        {hasUnpaidBalance(queue) && (
                          <button
                            onClick={() => handlePayment(queue)}
                            disabled={actionLoading.updateStatus}
                            className="bg-yellow-500 dark:bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600 dark:hover:bg-yellow-700 transition-colors disabled:opacity-50"
                          >
                            ชำระเงิน
                          </button>
                        )}
                        <button
                          onClick={() => handleEditQueue(queue)}
                          disabled={actionLoading.updateQueue}
                          className="bg-gray-500 dark:bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-600 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                        >
                          แก้ไข
                        </button>
                        {queue.status === QueueStatus.WAITING && (
                          <button
                            onClick={() => handleDeleteQueue(queue.id)}
                            disabled={actionLoading.deleteQueue}
                            className="bg-red-500 dark:bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-600 dark:hover:bg-red-700 transition-colors disabled:opacity-50"
                          >
                            ลบ
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {viewModel?.queues.pagination.totalPages > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
              {/* Mobile Layout - Stacked */}
              <div className="flex flex-col space-y-4 sm:hidden">
                {/* Info and Per Page Dropdown */}
                <div className="flex flex-col space-y-3">
                  <div className="text-sm text-gray-700 dark:text-gray-300 text-center">
                    แสดง{" "}
                    {(viewModel.queues.pagination.currentPage - 1) *
                      viewModel.queues.pagination.perPage +
                      1}{" "}
                    -{" "}
                    {Math.min(
                      viewModel.queues.pagination.currentPage *
                        viewModel.queues.pagination.perPage,
                      viewModel.queues.pagination.totalCount
                    )}{" "}
                    จาก {viewModel.queues.pagination.totalCount} รายการ
                  </div>

                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      แสดงต่อหน้า:
                    </span>
                    <select
                      value={viewModel.queues.pagination.perPage}
                      onChange={(e) =>
                        handlePerPageChange(Number(e.target.value))
                      }
                      disabled={loading}
                      className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {getPaginationConfig().PER_PAGE_OPTIONS.map(
                        (option: number) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                </div>

                {/* Pagination Controls - Mobile */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage <= 1 || loading}
                    className={`px-4 py-2 rounded-md text-sm font-medium min-w-[80px] ${
                      currentPage > 1 && !loading
                        ? "bg-blue-500 text-white hover:bg-blue-600"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    ก่อนหน้า
                  </button>

                  <div className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                    หน้า {currentPage} /{" "}
                    {viewModel.queues.pagination.totalPages}
                  </div>

                  <button
                    onClick={handleNextPage}
                    disabled={
                      currentPage >= viewModel.queues.pagination.totalPages ||
                      loading
                    }
                    className={`px-4 py-2 rounded-md text-sm font-medium min-w-[80px] ${
                      currentPage < viewModel.queues.pagination.totalPages &&
                      !loading
                        ? "bg-blue-500 text-white hover:bg-blue-600"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    ถัดไป
                  </button>
                </div>
              </div>

              {/* Desktop Layout - Horizontal */}
              <div className="hidden sm:flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    แสดง{" "}
                    {(viewModel.queues.pagination.currentPage - 1) *
                      viewModel.queues.pagination.perPage +
                      1}{" "}
                    -{" "}
                    {Math.min(
                      viewModel.queues.pagination.currentPage *
                        viewModel.queues.pagination.perPage,
                      viewModel.queues.pagination.totalCount
                    )}{" "}
                    จาก {viewModel.queues.pagination.totalCount} รายการ
                  </div>

                  {/* Per Page Dropdown */}
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      แสดงต่อหน้า:
                    </span>
                    <select
                      value={viewModel.queues.pagination.perPage}
                      onChange={(e) =>
                        handlePerPageChange(Number(e.target.value))
                      }
                      disabled={loading}
                      className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {getPaginationConfig().PER_PAGE_OPTIONS.map(
                        (option: number) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage <= 1 || loading}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${
                      currentPage > 1 && !loading
                        ? "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    ก่อนหน้า
                  </button>

                  <div className="flex space-x-1">
                    {Array.from(
                      {
                        length: Math.min(
                          viewModel.queues.pagination.totalPages,
                          5
                        ),
                      },
                      (_, i) => {
                        let pageNum;
                        if (viewModel.queues.pagination.totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (
                          currentPage >=
                          viewModel.queues.pagination.totalPages - 2
                        ) {
                          pageNum =
                            viewModel.queues.pagination.totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }

                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            disabled={loading}
                            className={`px-3 py-1 rounded-md text-sm font-medium ${
                              pageNum === currentPage
                                ? "bg-blue-500 text-white"
                                : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      }
                    )}
                  </div>

                  <button
                    onClick={handleNextPage}
                    disabled={
                      currentPage >= viewModel.queues.pagination.totalPages ||
                      loading
                    }
                    className={`px-3 py-1 rounded-md text-sm font-medium ${
                      currentPage < viewModel.queues.pagination.totalPages &&
                      !loading
                        ? "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    ถัดไป
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Queue Modal */}
      {selectedQueue ? (
        <EditQueueModal
          isOpen={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setSelectedQueue(null);
          }}
          queue={selectedQueue}
          onSave={handleUpdateQueue}
          isLoading={actionLoading.updateQueue}
        />
      ) : null}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedQueue(null);
        }}
        onConfirm={handleConfirmDelete}
        queueNumber={selectedQueue?.queueNumber}
        customerName={selectedQueue?.customerName}
        isLoading={actionLoading.deleteQueue}
      />

      {/* Create Queue Modal */}
      <CreateQueueModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSave={handleCreateQueue}
        isLoading={actionLoading.createQueue}
        shopId={shopId}
      />

      {/* QR Code Modal */}
      <QRCodeModal
        isOpen={qrCodeModalOpen}
        onClose={() => setQrCodeModalOpen(false)}
        shopName={viewModel.shop.name}
        shopDescription={viewModel.shop.description}
        shopId={shopId}
      />

      {/* Payment Modal */}
      {selectedQueue && (
        <PaymentModal
          isOpen={paymentModalOpen}
          onClose={() => {
            setPaymentModalOpen(false);
            setSelectedQueue(null);
          }}
          onSubmit={handlePaymentSubmit}
          queue={selectedQueue}
          shopId={shopId}
        />
      )}
    </div>
  );
}
