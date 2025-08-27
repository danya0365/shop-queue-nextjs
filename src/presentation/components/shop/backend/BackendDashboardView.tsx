'use client';

import { BackendDashboardViewModel } from '@/src/presentation/presenters/shop/backend/DashboardPresenter';

interface BackendDashboardViewProps {
  viewModel: BackendDashboardViewModel;
}

export function BackendDashboardView({ viewModel }: BackendDashboardViewProps) {
  const { queueStats, revenueStats, employeeStats, recentActivities, shopName, currentTime } = viewModel;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">แดชบอร์ดจัดการร้าน</h1>
          <p className="text-gray-600 mt-1">{shopName} • {currentTime}</p>
        </div>
        <div className="flex space-x-4">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
            📊 ดูรายงานเต็ม
          </button>
          <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
            ⚙️ ตั้งค่าด่วน
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Queue Stats */}
        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">สถานะคิว</h3>
            <span className="text-2xl">📋</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">รอดำเนินการ</span>
              <span className="font-semibold text-orange-600">{queueStats.waiting}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">กำลังให้บริการ</span>
              <span className="font-semibold text-blue-600">{queueStats.serving}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">เสร็จสิ้น</span>
              <span className="font-semibold text-green-600">{queueStats.completed}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">ยกเลิก</span>
              <span className="font-semibold text-red-600">{queueStats.cancelled}</span>
            </div>
          </div>
        </div>

        {/* Revenue Stats */}
        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">รายได้</h3>
            <span className="text-2xl">💰</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">วันนี้</span>
              <span className="font-semibold">฿{revenueStats.today.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">สัปดาห์นี้</span>
              <span className="font-semibold">฿{revenueStats.thisWeek.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">เดือนนี้</span>
              <span className="font-semibold">฿{revenueStats.thisMonth.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">เติบโต</span>
              <span className="font-semibold text-green-600">+{revenueStats.growth}%</span>
            </div>
          </div>
        </div>

        {/* Employee Stats */}
        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">พนักงาน</h3>
            <span className="text-2xl">👥</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">ทั้งหมด</span>
              <span className="font-semibold">{employeeStats.total}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">ออนไลน์</span>
              <span className="font-semibold text-green-600">{employeeStats.online}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">กำลังให้บริการ</span>
              <span className="font-semibold text-blue-600">{employeeStats.serving}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">ว่าง</span>
              <span className="font-semibold text-gray-600">{employeeStats.online - employeeStats.serving}</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">การดำเนินการด่วน</h3>
            <span className="text-2xl">⚡</span>
          </div>
          <div className="space-y-2">
            <button className="w-full bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm">
              📱 สร้าง QR Code
            </button>
            <button className="w-full bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm">
              📢 ประกาศร้าน
            </button>
            <button className="w-full bg-purple-500 text-white px-3 py-2 rounded-lg hover:bg-purple-600 transition-colors text-sm">
              🎁 สร้างโปรโมชัน
            </button>
            <button className="w-full bg-orange-500 text-white px-3 py-2 rounded-lg hover:bg-orange-600 transition-colors text-sm">
              📊 ดูรายงาน
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">กิจกรรมล่าสุด</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <span className="text-2xl">{activity.icon}</span>
                <div className="flex-1">
                  <p className="text-gray-900 font-medium">{activity.message}</p>
                  <p className="text-sm text-gray-500">{activity.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <button className="text-blue-600 hover:text-blue-700 font-medium">
              ดูกิจกรรมทั้งหมด →
            </button>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Queue Chart */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">กราฟคิวรายชั่วโมง</h2>
          </div>
          <div className="p-6">
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <span className="text-4xl mb-2 block">📊</span>
                <p>กราฟแสดงจำนวนคิวรายชั่วโมง</p>
                <p className="text-sm">(Mock Chart - ใช้ Chart.js หรือ Recharts)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">กราฟรายได้รายวัน</h2>
          </div>
          <div className="p-6">
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <span className="text-4xl mb-2 block">💹</span>
                <p>กราฟแสดงรายได้รายวัน</p>
                <p className="text-sm">(Mock Chart - ใช้ Chart.js หรือ Recharts)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
