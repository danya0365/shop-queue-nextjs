'use client';

import React, { useState } from 'react';
import type { CustomerHistoryViewModel, CustomerQueueHistory, HistoryFilters } from '@/src/presentation/presenters/shop/frontend/CustomerHistoryPresenter';

interface CustomerHistoryViewProps {
  viewModel: CustomerHistoryViewModel;
}

export function CustomerHistoryView({ viewModel }: CustomerHistoryViewProps) {
  const [filters, setFilters] = useState<HistoryFilters>(viewModel.filters);
  const [selectedQueue, setSelectedQueue] = useState<CustomerQueueHistory | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const handleViewDetails = (queue: CustomerQueueHistory) => {
    setSelectedQueue(queue);
    setShowDetailsModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'no_show':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
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

  const getPaymentMethodText = (method?: string) => {
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
        return '-';
    }
  };

  const getPaymentMethodIcon = (method?: string) => {
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
        return '';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'}>
        ⭐
      </span>
    ));
  };

  const filteredHistory = viewModel.queueHistory.filter(queue => {
    if (filters.status !== 'all' && queue.status !== filters.status) return false;
    // Add more filter logic as needed
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">ประวัติการใช้บริการ</h1>
                <p className="text-sm text-gray-600">ดูประวัติการจองคิวและการใช้บริการของคุณ</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">สวัสดี</p>
                <p className="text-lg font-medium text-gray-900">
                  {viewModel.customerName}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">📋</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">คิวทั้งหมด</p>
                <p className="text-2xl font-bold text-gray-900">
                  {viewModel.customerStats.totalQueues}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">เสร็จสิ้น</p>
                <p className="text-2xl font-bold text-green-600">
                  {viewModel.customerStats.completedQueues}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-2xl">💰</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">ยอดใช้จ่ายรวม</p>
                <p className="text-2xl font-bold text-purple-600">
                  ฿{viewModel.customerStats.totalSpent.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <span className="text-2xl">⭐</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">คะแนนเฉลี่ย</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {viewModel.customerStats.averageRating > 0 ? viewModel.customerStats.averageRating.toFixed(1) : '-'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Info */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">ข้อมูลสมาชิก</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-600">สมาชิกตั้งแต่</p>
              <p className="text-lg font-medium text-gray-900">
                {new Date(viewModel.customerStats.memberSince).toLocaleDateString('th-TH')}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">บริการที่ชื่นชอบ</p>
              <p className="text-lg font-medium text-gray-900">
                {viewModel.customerStats.favoriteService}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">สถานะ</p>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                สมาชิกปกติ
              </span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">ตัวกรอง</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                สถานะ
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">ทั้งหมด</option>
                <option value="completed">เสร็จสิ้น</option>
                <option value="cancelled">ยกเลิก</option>
                <option value="no_show">ไม่มาตามนัด</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ช่วงเวลา
              </label>
              <select
                value={filters.dateRange}
                onChange={(e) => setFilters({ ...filters, dateRange: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">ทั้งหมด</option>
                <option value="month">เดือนนี้</option>
                <option value="quarter">ไตรมาสนี้</option>
                <option value="year">ปีนี้</option>
              </select>
            </div>

            <div className="flex items-end">
              <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                ค้นหา
              </button>
            </div>
          </div>
        </div>

        {/* History List */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              ประวัติการใช้บริการ ({filteredHistory.length})
            </h3>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredHistory.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-400 text-6xl mb-4">📋</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  ไม่มีประวัติการใช้บริการ
                </h3>
                <p className="text-gray-600">เมื่อคุณใช้บริการ ประวัติจะแสดงที่นี่</p>
              </div>
            ) : (
              filteredHistory.map((queue) => (
                <div key={queue.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">
                          คิว {queue.queueNumber}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(queue.status)}`}>
                          {getStatusText(queue.status)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(queue.queueDate).toLocaleDateString('th-TH')} {queue.queueTime}
                        </span>
                      </div>

                      <h3 className="font-medium text-gray-900 mb-1">
                        {queue.shopName}
                      </h3>

                      <div className="text-sm text-gray-600 mb-2">
                        {queue.services.map((service, index) => (
                          <span key={service.id}>
                            {service.name} x{service.quantity}
                            {index < queue.services.length - 1 && ', '}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="font-medium text-blue-600">
                          ฿{queue.totalAmount.toLocaleString()}
                        </span>
                        {queue.paymentMethod && (
                          <span className="flex items-center gap-1">
                            {getPaymentMethodIcon(queue.paymentMethod)}
                            {getPaymentMethodText(queue.paymentMethod)}
                          </span>
                        )}
                        {queue.rating && (
                          <div className="flex items-center gap-1">
                            {renderStars(queue.rating)}
                            <span className="ml-1">({queue.rating})</span>
                          </div>
                        )}
                        {queue.waitTime && (
                          <span>รอ {queue.waitTime} นาที</span>
                        )}
                      </div>

                      {queue.feedback && (
                        <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-600">
                          💬 {queue.feedback}
                        </div>
                      )}
                    </div>

                    <div className="ml-4">
                      <button
                        onClick={() => handleViewDetails(queue)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
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
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedQueue && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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
                    <p className="text-gray-600">ร้าน: {selectedQueue.shopName}</p>
                    <p className="text-gray-600">วันที่: {new Date(selectedQueue.queueDate).toLocaleDateString('th-TH')}</p>
                    <p className="text-gray-600">เวลา: {selectedQueue.queueTime}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">
                      สถานะ: <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(selectedQueue.status)}`}>
                        {getStatusText(selectedQueue.status)}
                      </span>
                    </p>
                    {selectedQueue.completedAt && (
                      <p className="text-gray-600">เสร็จสิ้น: {selectedQueue.completedAt}</p>
                    )}
                    {selectedQueue.employeeName && (
                      <p className="text-gray-600">พนักงาน: {selectedQueue.employeeName}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Services */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">บริการ</h4>
                <div className="space-y-2">
                  {selectedQueue.services.map((service) => (
                    <div key={service.id} className="flex justify-between items-center py-2 border-b">
                      <div>
                        <span className="font-medium">{service.name}</span>
                        <span className="text-gray-600 ml-2">x{service.quantity}</span>
                      </div>
                      <span className="font-medium">฿{(service.price * service.quantity).toLocaleString()}</span>
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
                  <h4 className="font-medium text-gray-900 mb-2">การชำระเงิน</h4>
                  {selectedQueue.paymentMethod ? (
                    <p className="text-sm text-gray-600">
                      {getPaymentMethodIcon(selectedQueue.paymentMethod)} {getPaymentMethodText(selectedQueue.paymentMethod)}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-600">-</p>
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">เวลา</h4>
                  {selectedQueue.waitTime && (
                    <p className="text-sm text-gray-600">เวลารอ: {selectedQueue.waitTime} นาที</p>
                  )}
                  {selectedQueue.serviceTime && (
                    <p className="text-sm text-gray-600">เวลาให้บริการ: {selectedQueue.serviceTime} นาที</p>
                  )}
                </div>
              </div>

              {/* Rating & Feedback */}
              {selectedQueue.rating && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">คะแนนและความคิดเห็น</h4>
                  <div className="flex items-center gap-2 mb-2">
                    {renderStars(selectedQueue.rating)}
                    <span className="font-medium">({selectedQueue.rating}/5)</span>
                  </div>
                  {selectedQueue.feedback && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm text-gray-700">{selectedQueue.feedback}</p>
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
