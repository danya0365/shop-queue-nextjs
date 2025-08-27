'use client';

import { EmployeeQueueViewModel } from '@/src/presentation/presenters/shop/employee/EmployeeQueuePresenter';
import { useState } from 'react';

interface EmployeeQueueViewProps {
  viewModel: EmployeeQueueViewModel;
}

export function EmployeeQueueView({ viewModel }: EmployeeQueueViewProps) {
  const { myQueues, waitingQueues, totalQueues, employeeName, isOnDuty } = viewModel;
  const [selectedTab, setSelectedTab] = useState<'my' | 'waiting'>('my');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting': return 'bg-orange-100 text-orange-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'serving': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-yellow-100 text-yellow-800';
      case 'vip': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'waiting': return 'รอดำเนินการ';
      case 'confirmed': return 'ยืนยันแล้ว';
      case 'serving': return 'กำลังให้บริการ';
      case 'completed': return 'เสร็จสิ้น';
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">จัดการคิว</h1>
          <p className="text-gray-600 mt-1">พนักงาน: {employeeName} • คิวทั้งหมด: {totalQueues}</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
            isOnDuty ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            <div className={`w-3 h-3 rounded-full ${isOnDuty ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="font-medium">{isOnDuty ? 'ปฏิบัติงาน' : 'พักงาน'}</span>
          </div>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
            📞 เรียกคิวถัดไป
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="border-b">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setSelectedTab('my')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                selectedTab === 'my'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              คิวของฉัน ({myQueues.length})
            </button>
            <button
              onClick={() => setSelectedTab('waiting')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                selectedTab === 'waiting'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              คิวรอ ({waitingQueues.length})
            </button>
          </nav>
        </div>

        {/* Queue List */}
        <div className="p-6">
          {selectedTab === 'my' && (
            <div className="space-y-4">
              {myQueues.length === 0 ? (
                <div className="text-center py-12">
                  <span className="text-6xl mb-4 block">😴</span>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">ไม่มีคิวที่กำลังให้บริการ</h3>
                  <p className="text-gray-500">คลิก "เรียกคิวถัดไป" เพื่อรับคิวใหม่</p>
                </div>
              ) : (
                myQueues.map((queue) => (
                  <div key={queue.id} className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-lg">{queue.queueNumber}</span>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-xl font-semibold text-gray-900">{queue.customerName}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(queue.status)}`}>
                              {getStatusText(queue.status)}
                            </span>
                            {queue.priority !== 'normal' && (
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(queue.priority)}`}>
                                {getPriorityText(queue.priority)}
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 mb-1">{queue.customerPhone}</p>
                          <p className="text-sm text-gray-500">บริการ: {queue.services.join(', ')}</p>
                          <p className="text-sm font-medium text-green-600">฿{queue.totalPrice} • ~{queue.estimatedTime} นาที</p>
                          {queue.notes && (
                            <p className="text-sm text-blue-600 mt-1">หมายเหตุ: {queue.notes}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2">
                        <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
                          ✅ เสร็จสิ้น
                        </button>
                        <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors">
                          ⏸️ พัก
                        </button>
                        <button className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors">
                          📝 หมายเหตุ
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {selectedTab === 'waiting' && (
            <div className="space-y-4">
              {waitingQueues.length === 0 ? (
                <div className="text-center py-12">
                  <span className="text-6xl mb-4 block">🎉</span>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">ไม่มีคิวรอ</h3>
                  <p className="text-gray-500">คิวทั้งหมดได้รับการดำเนินการแล้ว</p>
                </div>
              ) : (
                waitingQueues.map((queue, index) => (
                  <div key={queue.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${
                          index === 0 ? 'bg-blue-500' : index === 1 ? 'bg-orange-500' : 'bg-gray-400'
                        }`}>
                          {queue.queueNumber}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="text-lg font-semibold text-gray-900">{queue.customerName}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(queue.status)}`}>
                              {getStatusText(queue.status)}
                            </span>
                            {queue.priority !== 'normal' && (
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(queue.priority)}`}>
                                {getPriorityText(queue.priority)}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-1">{queue.customerPhone}</p>
                          <p className="text-sm text-gray-500">บริการ: {queue.services.join(', ')}</p>
                          <p className="text-sm text-gray-500">฿{queue.totalPrice} • ~{queue.estimatedTime} นาที • {queue.createdAt}</p>
                          {queue.notes && (
                            <p className="text-sm text-blue-600 mt-1">หมายเหตุ: {queue.notes}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2">
                        {index === 0 && (
                          <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
                            📞 รับคิว
                          </button>
                        )}
                        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                          👁️ ดูรายละเอียด
                        </button>
                        {queue.status === 'waiting' && (
                          <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors">
                            ✅ ยืนยัน
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">การดำเนินการด่วน</h3>
          <div className="space-y-3">
            <button className="w-full bg-green-500 text-white px-4 py-3 rounded-lg hover:bg-green-600 transition-colors">
              📞 เรียกคิวถัดไป
            </button>
            <button className="w-full bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 transition-colors">
              🔄 รีเฟรชคิว
            </button>
            <button className="w-full bg-orange-500 text-white px-4 py-3 rounded-lg hover:bg-orange-600 transition-colors">
              ⏸️ พักการให้บริการ
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">สถิติวันนี้</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">คิวที่ให้บริการ:</span>
              <span className="font-semibold">15</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">เวลาเฉลี่ย:</span>
              <span className="font-semibold">8 นาที</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">คะแนนความพึงพอใจ:</span>
              <span className="font-semibold text-yellow-600">4.8/5</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">ข้อความแนะนำ</h3>
          <div className="space-y-2 text-sm">
            <div className="p-2 bg-gray-50 rounded">
              <p className="font-medium">เรียกคิว:</p>
              <p className="text-gray-600">"เรียกคิว {myQueues[0]?.queueNumber || 'A000'} ครับ"</p>
            </div>
            <div className="p-2 bg-gray-50 rounded">
              <p className="font-medium">เสร็จสิ้น:</p>
              <p className="text-gray-600">"ขอบคุณครับ เรียบร้อยแล้ว"</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
