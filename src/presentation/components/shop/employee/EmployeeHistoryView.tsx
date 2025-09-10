'use client';

import React, { useState } from 'react';
import type { EmployeeHistoryViewModel, HistoryQueue, FilterOptions } from '@/src/presentation/presenters/shop/employee/EmployeeHistoryPresenter';

interface EmployeeHistoryViewProps {
  viewModel: EmployeeHistoryViewModel;
}

export function EmployeeHistoryView({ viewModel }: EmployeeHistoryViewProps) {
  const [filters, setFilters] = useState<FilterOptions>(viewModel.filterOptions);
  const [selectedQueue, setSelectedQueue] = useState<HistoryQueue | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const handleViewDetails = (queue: HistoryQueue) => {
    setSelectedQueue(queue);
    setShowDetailsModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200';
      case 'cancelled':
        return 'bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-200';
      case 'no_show':
        return 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-200';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'เสร็จสิ้น';
      case 'cancelled':
        return 'ยกเลิก';
      case 'no_show':
        return 'ไม่มาตามนัด';
      default:
        return status;
    }
  };

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case 'cash':
        return 'เงินสด';
      case 'card':
        return 'บัตรเครดิต';
      case 'qr':
        return 'QR Code';
      case 'transfer':
        return 'โอนเงิน';
      default:
        return method;
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'cash':
        return '💵';
      case 'card':
        return '💳';
      case 'qr':
        return '📱';
      case 'transfer':
        return '🏦';
      default:
        return '💳';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? 'text-yellow-400 dark:text-yellow-300' : 'text-gray-300 dark:text-gray-600'}>
        ⭐
      </span>
    ));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">ประวัติการให้บริการ</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">ดูประวัติและสถิติการทำงานของคุณ • พนักงาน: {viewModel.employeeName}</p>
        </div>
      </div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">คิวทั้งหมดวันนี้</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{viewModel.currentStats.totalQueues}</p>
            </div>
            <span className="text-3xl">👥</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">เสร็จสิ้น</p>
              <p className="text-2xl font-bold text-green-600">{viewModel.currentStats.completedQueues}</p>
            </div>
            <span className="text-3xl">✅</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">ยอดขายวันนี้</p>
              <p className="text-2xl font-bold text-yellow-600">฿{viewModel.currentStats.totalRevenue.toLocaleString()}</p>
            </div>
            <span className="text-3xl">💰</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">คะแนนเฉลี่ย</p>
              <p className="text-2xl font-bold text-purple-600">{viewModel.currentStats.averageRating.toFixed(1)}</p>
            </div>
            <span className="text-3xl">⭐</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">ตัวกรอง</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                ช่วงเวลา
              </label>
              <select
                value={filters.dateRange}
                onChange={(e) => setFilters({ ...filters, dateRange: e.target.value as FilterOptions['dateRange'] })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="today">วันนี้</option>
                <option value="week">สัปดาห์นี้</option>
                <option value="month">เดือนนี้</option>
                <option value="custom">กำหนดเอง</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                สถานะ
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value as FilterOptions['status'] })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">ทั้งหมด</option>
                <option value="completed">เสร็จสิ้น</option>
                <option value="cancelled">ยกเลิก</option>
                <option value="no_show">ไม่มาตามนัด</option>
              </select>
            </div>

            <div className="flex items-end">
              <button className="w-full bg-blue-500 dark:bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors">
                ค้นหา
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* History List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            ประวัติการให้บริการ ({viewModel.historyQueues.length})
          </h2>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {viewModel.historyQueues.length === 0 ? (
            <div className="text-center py-12">
              <span className="text-8xl mb-6 block">📋</span>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                ไม่มีประวัติการให้บริการ
              </h3>
              <p className="text-gray-600 dark:text-gray-400">ประวัติการให้บริการจะแสดงที่นี่</p>
            </div>
          ) : (
            viewModel.historyQueues.map((queue) => (
              <div key={queue.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 text-sm font-medium px-2.5 py-0.5 rounded">
                        คิว {queue.queueNumber}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(queue.status)}`}>
                        {getStatusText(queue.status)}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {queue.servedAt} - {queue.completedAt}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        ({queue.duration} นาที)
                      </span>
                    </div>

                    <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                      {queue.customerName}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {queue.customerPhone}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
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

                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {queue.services.map((service, index) => (
                        <span key={service.id}>
                          {service.name} x{service.quantity}
                          {index < queue.services.length - 1 && ', '}
                        </span>
                      ))}
                    </div>

                    {queue.feedback && (
                      <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-700 rounded text-sm text-gray-600 dark:text-gray-400">
                        💬 {queue.feedback}
                      </div>
                    )}
                  </div>

                  <div className="ml-4">
                    <button
                      onClick={() => handleViewDetails(queue)}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                รายละเอียดคิว {selectedQueue.queueNumber}
              </h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Customer Info */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">ข้อมูลลูกค้า</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">ชื่อ: {selectedQueue.customerName}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">เบอร์โทร: {selectedQueue.customerPhone}</p>
              </div>

              {/* Services */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">บริการ</h4>
                <div className="space-y-2">
                  {selectedQueue.services.map((service) => (
                    <div key={service.id} className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                      <div>
                        <span className="font-medium text-gray-900 dark:text-gray-100">{service.name}</span>
                        <span className="text-gray-600 dark:text-gray-400 ml-2">x{service.quantity}</span>
                      </div>
                      <span className="font-medium text-gray-900 dark:text-gray-100">฿{(service.price * service.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center py-2 font-bold text-lg text-gray-900 dark:text-gray-100">
                    <span>รวมทั้งสิ้น</span>
                    <span>฿{selectedQueue.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Service Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">เวลาให้บริการ</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">เริ่ม: {selectedQueue.servedAt}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">เสร็จ: {selectedQueue.completedAt}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">ระยะเวลา: {selectedQueue.duration} นาที</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">การชำระเงิน</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    วิธีชำระ: {getPaymentMethodIcon(selectedQueue.paymentMethod)} {getPaymentMethodText(selectedQueue.paymentMethod)}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    สถานะ: <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(selectedQueue.status)}`}>
                      {getStatusText(selectedQueue.status)}
                    </span>
                  </p>
                </div>
              </div>

              {/* Rating & Feedback */}
              {selectedQueue.rating && (
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">คะแนนและความคิดเห็น</h4>
                  <div className="flex items-center gap-2 mb-2">
                    {renderStars(selectedQueue.rating)}
                    <span className="font-medium text-gray-900 dark:text-gray-100">({selectedQueue.rating}/5)</span>
                  </div>
                  {selectedQueue.feedback && (
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                      <p className="text-sm text-gray-700 dark:text-gray-300">{selectedQueue.feedback}</p>
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
