'use client';

import { useState } from 'react';
import { useQueueManagementPresenter } from '@/src/presentation/presenters/shop/backend/useQueueManagementPresenter';
import { QueueLimitsWarning } from './QueueLimitsWarning';
import { QueueItem, QueueManagementViewModel } from '@/src/presentation/presenters/shop/backend/QueueManagementPresenter';
import { EditQueueModal } from './modals/EditQueueModal';
import { DeleteConfirmationModal } from './modals/DeleteConfirmationModal';
import { CreateQueueModal } from './modals/CreateQueueModal';

interface QueueManagementViewProps {
  shopId: string;
  initialViewModel?: QueueManagementViewModel;
}

export function QueueManagementView({ shopId, initialViewModel }: QueueManagementViewProps) {
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
    actionLoading,
  } = useQueueManagementPresenter(shopId, initialViewModel);

  // Modal states
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedQueue, setSelectedQueue] = useState<QueueItem | null>(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">กำลังโหลดข้อมูลคิว...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">❌</div>
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={refreshData}
            className="bg-blue-500 dark:bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
          >
            ลองใหม่อีกครั้ง
          </button>
        </div>
      </div>
    );
  }

  if (!viewModel) {
    return null;
  }

  const { queues, waitingCount, servingCount, completedToday, subscription } = viewModel;
  const { data: queueData, pagination } = queues;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting': return 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200';
      case 'confirmed': return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
      case 'serving': return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      case 'completed': return 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200';
      case 'cancelled': return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
      default: return 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
      case 'vip': return 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200';
      default: return 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'waiting': return 'รอดำเนินการ';
      case 'confirmed': return 'ยืนยันแล้ว';
      case 'serving': return 'กำลังให้บริการ';
      case 'completed': return 'เสร็จสิ้น';
      case 'cancelled': return 'ยกเลิก';
      default: return status;
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'สำคัญ';
      case 'vip': return 'VIP';
      case 'normal': return 'ปกติ';
      default: return priority;
    }
  };

  // Action handlers
  const handleEditQueue = (queue: QueueItem) => {
    setSelectedQueue(queue);
    setEditModalOpen(true);
  };

  const handleUpdateQueue = async (queueId: string, data: {
    services: string[];
    priority: 'normal' | 'high' | 'vip';
    notes?: string;
  }) => {
    await updateQueue(queueId, {
      services: data.services,
      priority: data.priority,
      notes: data.notes,
    });
  };

  const handleStatusUpdate = async (queueId: string, newStatus: string) => {
    try {
      await updateQueueStatus(queueId, newStatus);
    } catch (error) {
      console.error('Error updating queue status:', error);
    }
  };

  const handleDeleteQueue = async (queueId: string) => {
    setSelectedQueue(queueData.find(q => q.id === queueId) || null);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedQueue) {
      try {
        await deleteQueue(selectedQueue.id);
        setDeleteModalOpen(false);
        setSelectedQueue(null);
      } catch (error) {
        console.error('Error deleting queue:', error);
      }
    }
  };

  const handleCreateQueue = async (data: {
    customerName: string;
    customerPhone: string;
    services: string[];
    priority: 'normal' | 'high' | 'vip';
    notes?: string;
  }) => {
    try {
      await createQueue(data);
      setCreateModalOpen(false);
      // Success notification could be added here
    } catch (error) {
      console.error('Error creating queue:', error);
      // Error is already handled by the presenter and shown in the UI
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">จัดการคิว</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">ติดตามและจัดการคิวลูกค้าทั้งหมด</p>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => setCreateModalOpen(true)}
            className={`px-4 py-2 rounded-lg transition-colors ${subscription.canCreateQueue
                ? 'bg-green-500 dark:bg-green-600 text-white hover:bg-green-600 dark:hover:bg-green-700'
                : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              }`}
            disabled={!subscription.canCreateQueue}
          >
            📝 เพิ่มคิวใหม่
          </button>
          <button className="bg-blue-500 dark:bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors">
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
            <p className="text-sm mt-2">ข้อมูลสถิติคิวจะแสดงเมื่อมีลูกค้าจองคิว</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">คิวทั้งหมด</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{pagination.totalCount}</p>
              </div>
              <span className="text-3xl">📋</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">รอดำเนินการ</p>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{waitingCount}</p>
              </div>
              <span className="text-3xl">⏳</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">กำลังให้บริการ</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{servingCount}</p>
              </div>
              <span className="text-3xl">🔔️</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">เสร็จสิ้นวันนี้</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{completedToday}</p>
              </div>
              <span className="text-3xl">✅</span>
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">สถานะ</label>
                <select
                  value={filters.status}
                  onChange={(e) => handleStatusFilter(e.target.value)}
                  className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="all">ทั้งหมด</option>
                  <option value="waiting">รอดำเนินการ</option>
                  <option value="confirmed">ยืนยันแล้ว</option>
                  <option value="serving">กำลังให้บริการ</option>
                  <option value="completed">เสร็จสิ้น</option>
                  <option value="cancelled">ยกเลิก</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ระดับความสำคัญ</label>
                <select
                  value={filters.priority}
                  onChange={(e) => handlePriorityFilter(e.target.value)}
                  className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="all">ทั้งหมด</option>
                  <option value="normal">ปกติ</option>
                  <option value="high">สำคัญ</option>
                  <option value="vip">VIP</option>
                </select>
              </div>
            </div>

            <div className="flex-1 max-w-md">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ค้นหา</label>
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
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {queueData.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-gray-500 dark:text-gray-400">
                <div className="text-4xl mb-4">📋</div>
                <p className="text-lg">
                  {filters.search || filters.status !== 'all' || filters.priority !== 'all'
                    ? "ไม่พบรายการคิวที่ตรงกับเงื่อนไขการค้นหา"
                    : "ยังไม่มีรายการคิวในระบบ"}
                </p>
                {filters.search || filters.status !== 'all' || filters.priority !== 'all' ? (
                  <p className="text-sm text-gray-400 mt-2">
                    ลองปรับเงื่อนไขการค้นหาหรือเพิ่มรายการคิวใหม่
                  </p>
                ) : (
                  <p className="text-sm text-gray-400 mt-2">
                    คลิกปุ่ม &lsquo;เพิ่มคิวใหม่&rsquo; เพื่อเริ่มบันทึกรายการแรกของคุณ
                  </p>
                )}
              </div>
            </div>
          ) : (
            queueData.map((queue: QueueItem) => (
            <div key={queue.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 dark:text-blue-300 font-bold">{queue.queueNumber}</span>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{queue.customerName}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(queue.status)}`}>
                        {getStatusText(queue.status)}
                      </span>
                      {queue.priority !== 'normal' && (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(queue.priority)}`}>
                          {getPriorityText(queue.priority)}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{queue.customerPhone}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">บริการ: {queue.services.join(', ')}</p>
                    {queue.notes && (
                      <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">หมายเหตุ: {queue.notes}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-500 dark:text-gray-400">เวลา</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{queue.createdAt}</p>
                    {queue.estimatedTime > 0 && (
                      <p className="text-xs text-orange-600 dark:text-orange-400">รอ ~{queue.estimatedTime} นาที</p>
                    )}
                  </div>

                  <div className="flex flex-col space-y-2">
                    {queue.status === 'waiting' && (
                      <>
                        <button 
                          onClick={() => handleStatusUpdate(queue.id, 'confirmed')}
                          disabled={actionLoading.updateStatus}
                          className="bg-green-500 dark:bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-600 dark:hover:bg-green-700 transition-colors disabled:opacity-50"
                        >
                          ยืนยัน
                        </button>
                        <button 
                          onClick={() => handleStatusUpdate(queue.id, 'serving')}
                          disabled={actionLoading.updateStatus}
                          className="bg-blue-500 dark:bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                          เรียก
                        </button>
                      </>
                    )}
                    {queue.status === 'serving' && (
                      <button 
                        onClick={() => handleStatusUpdate(queue.id, 'completed')}
                        disabled={actionLoading.updateStatus}
                        className="bg-purple-500 dark:bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-600 dark:hover:bg-purple-700 transition-colors disabled:opacity-50"
                      >
                        เสร็จสิ้น
                      </button>
                    )}
                    <button 
                      onClick={() => handleEditQueue(queue)}
                      disabled={actionLoading.updateQueue}
                      className="bg-gray-500 dark:bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-600 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                    >
                      แก้ไข
                    </button>
                    {queue.status === 'waiting' && (
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
                    {[5, 10, 20, 50].map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
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
                    {[5, 10, 20, 50].map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
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

      {/* Edit Queue Modal */}
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
    </div>
  );
}
