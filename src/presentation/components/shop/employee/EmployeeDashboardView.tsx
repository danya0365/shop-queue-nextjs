'use client';

import { EmployeeDashboardViewModel } from '@/src/presentation/presenters/shop/employee/EmployeeDashboardPresenter';
import { useState } from 'react';

interface EmployeeDashboardViewProps {
  viewModel: EmployeeDashboardViewModel;
}

export function EmployeeDashboardView({ viewModel }: EmployeeDashboardViewProps) {
  const { employeeName, currentQueue, nextQueues, stats, isOnDuty, shiftStartTime, totalWaitingQueues } = viewModel;
  const [dutyStatus, setDutyStatus] = useState(isOnDuty);

  const toggleDutyStatus = () => {
    setDutyStatus(!dutyStatus);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">สวัสดี {employeeName}</h1>
          <p className="text-gray-600 mt-1">เริ่มงาน: {shiftStartTime} • คิวรอ: {totalWaitingQueues} คิว</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${dutyStatus ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
            <span className="text-sm font-medium">{dutyStatus ? 'ปฏิบัติงาน' : 'พักงาน'}</span>
          </div>
          <button
            onClick={toggleDutyStatus}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              dutyStatus 
                ? 'bg-red-500 text-white hover:bg-red-600' 
                : 'bg-green-500 text-white hover:bg-green-600'
            }`}
          >
            {dutyStatus ? '🛑 พักงาน' : '▶️ เริ่มงาน'}
          </button>
        </div>
      </div>

      {/* Current Queue Card */}
      {currentQueue ? (
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg text-white">
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">🛎️ กำลังให้บริการ</h2>
              <div className="text-right">
                <div className="text-3xl font-bold">{currentQueue.queueNumber}</div>
                <div className="text-sm opacity-90">เริ่ม: {currentQueue.startTime}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">{currentQueue.customerName}</h3>
                <p className="opacity-90 mb-4">{currentQueue.customerPhone}</p>
                <div className="space-y-2">
                  <p className="font-medium">บริการ:</p>
                  <ul className="list-disc list-inside opacity-90">
                    {currentQueue.services.map((service, index) => (
                      <li key={index}>{service}</li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="flex flex-col justify-center space-y-4">
                <div className="text-center">
                  <p className="text-sm opacity-90">เวลาโดยประมาณ</p>
                  <p className="text-2xl font-bold">{currentQueue.estimatedDuration} นาที</p>
                </div>
                <button className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  ✅ เสร็จสิ้นการให้บริการ
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-100 rounded-xl border-2 border-dashed border-gray-300">
          <div className="p-8 text-center">
            <span className="text-6xl mb-4 block">😴</span>
            <h2 className="text-2xl font-bold text-gray-600 mb-2">ไม่มีคิวที่กำลังให้บริการ</h2>
            <p className="text-gray-500">คลิก "เรียกคิวถัดไป" เพื่อเริ่มให้บริการ</p>
            <button className="mt-4 bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors">
              📞 เรียกคิวถัดไป
            </button>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">ให้บริการวันนี้</p>
              <p className="text-2xl font-bold text-green-600">{stats.servedToday}</p>
            </div>
            <span className="text-3xl">👥</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">เวลาเฉลี่ย</p>
              <p className="text-2xl font-bold text-blue-600">{stats.averageServiceTime} นาที</p>
            </div>
            <span className="text-3xl">⏱️</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">คะแนนความพึงพอใจ</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.customerSatisfaction}/5</p>
            </div>
            <span className="text-3xl">⭐</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">รายได้วันนี้</p>
              <p className="text-2xl font-bold text-purple-600">฿{stats.totalRevenue.toLocaleString()}</p>
            </div>
            <span className="text-3xl">💰</span>
          </div>
        </div>
      </div>

      {/* Next Queues */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">คิวถัดไป</h2>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
              📞 เรียกคิวถัดไป
            </button>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {nextQueues.map((queue, index) => (
            <div key={queue.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${
                      index === 0 ? 'bg-green-500' : index === 1 ? 'bg-blue-500' : 'bg-gray-400'
                    }`}>
                      {queue.queueNumber}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-gray-900">{queue.customerName}</h3>
                    <p className="text-sm text-gray-600">บริการ: {queue.services.join(', ')}</p>
                    <p className="text-xs text-orange-600">รอ: {queue.waitTime} นาที</p>
                  </div>
                </div>

                <div className="flex space-x-2">
                  {index === 0 && (
                    <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
                      เรียก
                    </button>
                  )}
                  <button className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors">
                    ดูรายละเอียด
                  </button>
                </div>
              </div>
            </div>
          ))}
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
              ⏸️ พักการให้บริการ
            </button>
            <button className="w-full bg-purple-500 text-white px-4 py-3 rounded-lg hover:bg-purple-600 transition-colors">
              📝 เพิ่มหมายเหตุ
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">ข้อความแนะนำ</h3>
          <div className="space-y-2 text-sm">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="font-medium">ลูกค้าไม่มา:</p>
              <p className="text-gray-600">"ขออภัยครับ ลูกค้าไม่มารับบริการ"</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="font-medium">เสร็จสิ้น:</p>
              <p className="text-gray-600">"ขอบคุณครับ เรียบร้อยแล้ว"</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">สถิติเร็ว</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">เวลาทำงาน:</span>
              <span className="font-medium">2 ชม. 35 นาที</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">คิวรอ:</span>
              <span className="font-medium text-orange-600">{totalWaitingQueues} คิว</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">เป้าหมายวันนี้:</span>
              <span className="font-medium text-green-600">30 คิว</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
