'use client';

import { QueueManagementViewModel } from '@/src/presentation/presenters/shop/backend/QueueManagementPresenter';
import { useState } from 'react';
import { QueueLimitsWarning } from './QueueLimitsWarning';

interface QueueManagementViewProps {
  viewModel: QueueManagementViewModel;
}

export function QueueManagementView({ viewModel }: QueueManagementViewProps) {
  const { queues, totalQueues, waitingCount, servingCount, completedToday, averageWaitTime, subscription } = viewModel;
  console.log('QueueManagementView props', { queues, totalQueues, waitingCount, servingCount, completedToday, averageWaitTime, subscription });
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredQueues = queues.filter(queue => {
    const matchesStatus = selectedStatus === 'all' || queue.status === selectedStatus;
    const matchesPriority = selectedPriority === 'all' || queue.priority === selectedPriority;
    const matchesSearch = searchTerm === '' ||
      queue.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      queue.queueNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      queue.customerPhone.includes(searchTerm);

    return matchesStatus && matchesPriority && matchesSearch;
  });

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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">คิวทั้งหมด</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{totalQueues}</p>
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

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">สถานะ</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
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
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Queue List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            รายการคิว ({filteredQueues.length})
          </h2>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredQueues.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-gray-500 dark:text-gray-400">
                <div className="text-4xl mb-4">📋</div>
                <p className="text-lg">
                  {searchTerm || selectedStatus !== 'all' || selectedPriority !== 'all'
                    ? "ไม่พบรายการคิวที่ตรงกับเงื่อนไขการค้นหา"
                    : "ยังไม่มีรายการคิวในระบบ"}
                </p>
                {searchTerm || selectedStatus !== 'all' || selectedPriority !== 'all' ? (
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
            filteredQueues.map((queue) => (
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
                        <button className="bg-green-500 dark:bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-600 dark:hover:bg-green-700 transition-colors">
                          ยืนยัน
                        </button>
                        <button className="bg-blue-500 dark:bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors">
                          เรียก
                        </button>
                      </>
                    )}
                    {queue.status === 'serving' && (
                      <button className="bg-purple-500 dark:bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-600 dark:hover:bg-purple-700 transition-colors">
                        เสร็จสิ้น
                      </button>
                    )}
                    <button className="bg-gray-500 dark:bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-600 dark:hover:bg-gray-700 transition-colors">
                      แก้ไข
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
          )}
        </div>
      </div>
    </div>
  );
}
