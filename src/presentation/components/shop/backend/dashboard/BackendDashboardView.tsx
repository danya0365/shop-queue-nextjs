'use client';

import { BackendDashboardViewModel } from '@/src/presentation/presenters/shop/backend/DashboardPresenter';
import { useBackendDashboardPresenter } from '@/src/presentation/presenters/shop/backend/useBackendDashboardPresenter';

interface BackendDashboardViewProps {
  shopId: string;
  initialViewModel?: BackendDashboardViewModel;
}

export function BackendDashboardView({
  shopId,
  initialViewModel,
}: BackendDashboardViewProps) {
  const {
    viewModel,
    loading,
    error,
    refreshData,
  } = useBackendDashboardPresenter(shopId, initialViewModel);

  // Show loading only on initial load or when explicitly loading
  if (loading && !viewModel) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">
                กำลังโหลดข้อมูลแดชบอร์ด...
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

  const { queueStats, revenueStats, employeeStats, recentActivities, shopName, currentTime } = viewModel;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">แดชบอร์ดจัดการร้าน</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">{shopName} • {currentTime}</p>
        </div>
        <div className="flex space-x-4">
          <button className="bg-blue-500 dark:bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors">
            📊 ดูรายงานเต็ม
          </button>
          <button className="bg-green-500 dark:bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-600 dark:hover:bg-green-700 transition-colors">
            ⚙️ ตั้งค่าด่วน
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Queue Stats */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">สถานะคิว</h3>
            <span className="text-2xl">📋</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">รอดำเนินการ</span>
              <span className="font-semibold text-orange-600 dark:text-orange-400">{queueStats.waiting}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">กำลังให้บริการ</span>
              <span className="font-semibold text-blue-600 dark:text-blue-400">{queueStats.serving}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">เสร็จสิ้น</span>
              <span className="font-semibold text-green-600 dark:text-green-400">{queueStats.completed}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">ยกเลิก</span>
              <span className="font-semibold text-red-600 dark:text-red-400">{queueStats.cancelled}</span>
            </div>
          </div>
        </div>

        {/* Revenue Stats */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">รายได้</h3>
            <span className="text-2xl">💰</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">วันนี้</span>
              <span className="font-semibold text-gray-900 dark:text-gray-100">฿{revenueStats.today.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">สัปดาห์นี้</span>
              <span className="font-semibold text-gray-900 dark:text-gray-100">฿{revenueStats.thisWeek.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">เดือนนี้</span>
              <span className="font-semibold text-gray-900 dark:text-gray-100">฿{revenueStats.thisMonth.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-300">เติบโต</span>
              <span className="font-semibold text-green-600 dark:text-green-400">+{revenueStats.growth}%</span>
            </div>
          </div>
        </div>

        {/* Employee Stats */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">พนักงาน</h3>
            <span className="text-2xl">👥</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">ทั้งหมด</span>
              <span className="font-semibold text-gray-900 dark:text-gray-100">{employeeStats.total}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">ออนไลน์</span>
              <span className="font-semibold text-green-600 dark:text-green-400">{employeeStats.online}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">กำลังให้บริการ</span>
              <span className="font-semibold text-blue-600 dark:text-blue-400">{employeeStats.serving}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">ว่าง</span>
              <span className="font-semibold text-gray-600 dark:text-gray-300">{employeeStats.online - employeeStats.serving}</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">การดำเนินการด่วน</h3>
            <span className="text-2xl">⚡</span>
          </div>
          <div className="space-y-2">
            <button className="w-full bg-blue-500 dark:bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors text-sm">
              📱 สร้าง QR Code
            </button>
            <button className="w-full bg-green-500 dark:bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-600 dark:hover:bg-green-700 transition-colors text-sm">
              📢 ประกาศร้าน
            </button>
            <button className="w-full bg-purple-500 dark:bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-600 dark:hover:bg-purple-700 transition-colors text-sm">
              🎁 สร้างโปรโมชัน
            </button>
            <button className="w-full bg-orange-500 dark:bg-orange-600 text-white px-3 py-2 rounded-lg hover:bg-orange-600 dark:hover:bg-orange-700 transition-colors text-sm">
              📊 ดูรายงาน
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">กิจกรรมล่าสุด</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-2xl">{activity.icon}</span>
                <div className="flex-1">
                  <p className="text-gray-900 dark:text-gray-100 font-medium">{activity.message}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{activity.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
              ดูกิจกรรมทั้งหมด →
            </button>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Queue Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">กราฟคิวรายชั่วโมง</h2>
          </div>
          <div className="p-6">
            <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500 dark:text-gray-400">
                <span className="text-4xl mb-2 block">📊</span>
                <p>กราฟแสดงจำนวนคิวรายชั่วโมง</p>
                <p className="text-sm">(Mock Chart - ใช้ Chart.js หรือ Recharts)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">กราฟรายได้รายวัน</h2>
          </div>
          <div className="p-6">
            <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500 dark:text-gray-400">
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
