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
          <h1 className="text-3xl font-bold shop-employee-header-text">สวัสดี {employeeName}</h1>
          <p className="shop-employee-header-text-muted mt-1">เริ่มงาน: {shiftStartTime} • คิวรอ: {totalWaitingQueues} คิว</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${dutyStatus ? 'shop-employee-status-online' : 'shop-employee-status-offline-bg'}`}></div>
            <span className="text-sm font-medium shop-employee-header-text">{dutyStatus ? 'ปฏิบัติงาน' : 'พักงาน'}</span>
          </div>
          <button
            onClick={toggleDutyStatus}
            className={`px-4 py-2 rounded-lg font-medium transition-colors text-white ${dutyStatus
              ? 'shop-employee-button-stop'
              : 'shop-employee-button-primary'
              }`}
          >
            {dutyStatus ? '🛑 พักงาน' : '▶️ เริ่มงาน'}
          </button>
        </div>
      </div>

      {/* Current Queue Card */}
      {currentQueue ? (
        <div className="shop-employee-current-queue-bg rounded-xl shadow-lg text-white">
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
                <button className="shop-employee-current-queue-button px-6 py-3 rounded-lg font-semibold transition-colors">
                  ✅ เสร็จสิ้นการให้บริการ
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="shop-employee-empty-queue-bg rounded-xl border-2 border-dashed">
          <div className="p-8 text-center">
            <span className="text-6xl mb-4 block">😴</span>
            <h2 className="text-2xl font-bold shop-employee-empty-queue-text mb-2">ไม่มีคิวที่กำลังให้บริการ</h2>
            <p className="shop-employee-empty-queue-text-muted">คลิก &quot;เรียกคิวถัดไป&quot; เพื่อเริ่มให้บริการ</p>
            <button className="mt-4 shop-employee-button-primary text-white px-6 py-3 rounded-lg font-semibold transition-colors">
              📞 เรียกคิวถัดไป
            </button>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="shop-employee-card rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium shop-employee-text-muted">ให้บริการวันนี้</p>
              <p className="text-2xl font-bold shop-employee-stats-served">{stats.servedToday}</p>
            </div>
            <span className="text-3xl">👥</span>
          </div>
        </div>

        <div className="shop-employee-card rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium shop-employee-text-muted">เวลาเฉลี่ย</p>
              <p className="text-2xl font-bold shop-employee-stats-time">{stats.averageServiceTime} นาที</p>
            </div>
            <span className="text-3xl">⏱️</span>
          </div>
        </div>

        <div className="shop-employee-card rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium shop-employee-text-muted">คะแนนความพึงพอใจ</p>
              <p className="text-2xl font-bold shop-employee-stats-satisfaction">{stats.customerSatisfaction}/5</p>
            </div>
            <span className="text-3xl">⭐</span>
          </div>
        </div>

        <div className="shop-employee-card rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium shop-employee-text-muted">รายได้วันนี้</p>
              <p className="text-2xl font-bold shop-employee-stats-revenue">฿{stats.totalRevenue.toLocaleString()}</p>
            </div>
            <span className="text-3xl">💰</span>
          </div>
        </div>
      </div>

      {/* Next Queues */}
      <div className="shop-employee-card rounded-xl shadow-sm">
        <div className="p-6 border-b shop-employee-sidebar-border">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold shop-employee-text">คิวถัดไป</h2>
            <button className="shop-employee-button-blue text-white px-4 py-2 rounded-lg transition-colors">
              📞 เรียกคิวถัดไป
            </button>
          </div>
        </div>
        <div className="divide-y shop-employee-divide">
          {nextQueues.map((queue, index) => (
            <div key={queue.id} className="p-6 shop-employee-queue-item-hover transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${index === 0 ? 'shop-employee-queue-number-first' : index === 1 ? 'shop-employee-queue-number-second' : 'shop-employee-queue-number-other'
                      }`}>
                      {queue.queueNumber}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium shop-employee-text">{queue.customerName}</h3>
                    <p className="text-sm shop-employee-text-muted">บริการ: {queue.services.join(', ')}</p>
                    <p className="text-xs shop-employee-wait-time-text">รอ: {queue.waitTime} นาที</p>
                  </div>
                </div>

                <div className="flex space-x-2">
                  {index === 0 && (
                    <button className="shop-employee-button-primary text-white px-4 py-2 rounded-lg transition-colors">
                      เรียก
                    </button>
                  )}
                  <button className="shop-employee-button-secondary px-4 py-2 rounded-lg transition-colors">
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
        <div className="shop-employee-card rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold shop-employee-text mb-4">การดำเนินการด่วน</h3>
          <div className="space-y-3">
            <button className="w-full shop-employee-button-primary text-white px-4 py-3 rounded-lg transition-colors">
              📞 เรียกคิวถัดไป
            </button>
            <button className="w-full shop-employee-button-blue text-white px-4 py-3 rounded-lg transition-colors">
              ⏸️ พักการให้บริการ
            </button>
            <button className="w-full shop-employee-button-purple text-white px-4 py-3 rounded-lg transition-colors">
              📝 เพิ่มหมายเหตุ
            </button>
          </div>
        </div>

        <div className="shop-employee-card rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold shop-employee-text mb-4">ข้อความแนะนำ</h3>
          <div className="space-y-2 text-sm">
            <div className="p-3 shop-employee-info-bg rounded-lg">
              <p className="font-medium shop-employee-info-text">ลูกค้าไม่มา:</p>
              <p className="shop-employee-info-text-muted">&quot;ขออภัยครับ ลูกค้าไม่มารับบริการ&quot;</p>
            </div>
            <div className="p-3 shop-employee-info-bg rounded-lg">
              <p className="font-medium shop-employee-info-text">เสร็จสิ้น:</p>
              <p className="shop-employee-info-text-muted">&quot;ขอบคุณครับ เรียบร้อยแล้ว&quot;</p>
            </div>
          </div>
        </div>

        <div className="shop-employee-card rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold shop-employee-text mb-4">สถิติเร็ว</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="shop-employee-text-muted">เวลาทำงาน:</span>
              <span className="font-medium shop-employee-text">2 ชม. 35 นาที</span>
            </div>
            <div className="flex justify-between">
              <span className="shop-employee-text-muted">คิวรอ:</span>
              <span className="font-medium shop-employee-wait-time-text">{totalWaitingQueues} คิว</span>
            </div>
            <div className="flex justify-between">
              <span className="shop-employee-text-muted">เป้าหมายวันนี้:</span>
              <span className="font-medium shop-employee-target-text">30 คิว</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
