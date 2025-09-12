'use client';

import { DashboardMapper } from '@/src/application/mappers/backend/dashboard-mapper';
import { BackendDashboardViewModel } from '@/src/presentation/presenters/backend/dashboard/BackendDashboardPresenter';
import {
  Activity,
  CheckCircle,
  Clock,
  Store,
  TrendingUp,
  UserCheck,
  Users
} from 'lucide-react';

interface BackendDashboardViewProps {
  viewModel: BackendDashboardViewModel;
}

export function BackendDashboardView({ viewModel }: BackendDashboardViewProps) {
  const { dashboardData } = viewModel;
  const { stats, recentActivities, queueDistribution, popularServices } = dashboardData;

  const statsCards = [
    {
      title: 'ร้านค้าทั้งหมด',
      value: DashboardMapper.formatNumber(stats.totalShops),
      icon: Store,
      color: 'text-blue-600 bg-blue-50'
    },
    {
      title: 'ลูกค้าทั้งหมด',
      value: DashboardMapper.formatNumber(stats.totalCustomers),
      icon: Users,
      color: 'text-green-600 bg-green-50'
    },
    {
      title: 'คิวที่กำลังรอ',
      value: DashboardMapper.formatNumber(stats.activeQueues),
      icon: Clock,
      color: 'text-orange-600 bg-orange-50'
    },
    {
      title: 'รายได้รวม',
      value: DashboardMapper.formatCurrency(stats.totalRevenue),
      icon: TrendingUp,
      color: 'text-purple-600 bg-purple-50'
    }
  ];

  const queueStats = [
    { label: 'กำลังรอ', value: queueDistribution.waiting, color: 'bg-yellow-500' },
    { label: 'กำลังให้บริการ', value: queueDistribution.serving, color: 'bg-blue-500' },
    { label: 'เสร็จสิ้น', value: queueDistribution.completed, color: 'bg-green-500' },
    { label: 'ยกเลิก', value: queueDistribution.cancelled, color: 'bg-red-500' },
    { label: 'ไม่มาตามนัด', value: queueDistribution.noShow, color: 'bg-gray-500' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="backend-text">
        <h1 className="text-3xl font-bold">แดชบอร์ด</h1>
        <p className="backend-text-muted mt-2">
          ภาพรวมของระบบ Shop Queue - อัปเดตล่าสุด: {new Date(dashboardData.lastUpdated).toLocaleString('th-TH')}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="backend-sidebar-bg rounded-lg p-6 backend-sidebar-border border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="backend-text-muted text-sm font-medium">{card.title}</p>
                  <p className="text-2xl font-bold backend-text mt-2">{card.value}</p>
                </div>
                <div className={`p-3 rounded-full ${card.color}`}>
                  <Icon size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Queue Distribution */}
        <div className="backend-sidebar-bg rounded-lg p-6 backend-sidebar-border border">
          <h2 className="text-xl font-semibold backend-text mb-4">สถานะคิว</h2>
          <div className="space-y-3">
            {queueStats.map((stat, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${stat.color}`}></div>
                  <span className="backend-text-muted">{stat.label}</span>
                </div>
                <span className="font-semibold backend-text">{stat.value}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t backend-sidebar-border">
            <div className="flex justify-between text-sm">
              <span className="backend-text-muted">เวลารอเฉลี่ย:</span>
              <span className="font-medium backend-text">
                {DashboardMapper.formatWaitTime(stats.averageWaitTime)}
              </span>
            </div>
          </div>
        </div>

        {/* Popular Services */}
        <div className="backend-sidebar-bg rounded-lg p-6 backend-sidebar-border border">
          <h2 className="text-xl font-semibold backend-text mb-4">บริการยอดนิยม</h2>
          <div className="space-y-3">
            {popularServices.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🔧</div>
                <h3 className="text-lg font-medium backend-text mb-2">ยังไม่มีบริการในระบบ</h3>
                <p className="text-sm text-gray-400 mt-2">เพิ่มบริการแรกของคุณเพื่อเริ่มเก็บสถิติการใช้งาน</p>
              </div>
            ) : (
              popularServices.map((service, index) => (
              <div key={service.id} className="flex items-center justify-between p-3 backend-sidebar-hover rounded-lg">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium backend-text">{service.name}</span>
                    <span className="text-xs backend-text-muted px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                      {service.category}
                    </span>
                  </div>
                  <p className="text-sm backend-text-muted mt-1">
                    {service.queueCount} คิว • {DashboardMapper.formatCurrency(service.revenue)}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium backend-primary">#{index + 1}</div>
                </div>
              </div>
            ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="backend-sidebar-bg rounded-lg p-6 backend-sidebar-border border">
        <h2 className="text-xl font-semibold backend-text mb-4">กิจกรรมล่าสุด</h2>
        <div className="space-y-4">
          {recentActivities.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-lg font-medium backend-text mb-2">ยังไม่มีกิจกรรมล่าสุด</h3>
              <p className="text-sm text-gray-400 mt-2">กิจกรรมต่างๆ จะแสดงที่นี่เมื่อมีการใช้งานระบบ</p>
            </div>
          ) : (
            recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-4 p-4 backend-sidebar-hover rounded-lg">
              <div className={`p-2 rounded-full ${DashboardMapper.getActivityColor(activity.type)}`}>
                <span className="text-lg">{DashboardMapper.getActivityIcon(activity.type)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium backend-text">{activity.title}</p>
                <p className="backend-text-muted text-sm mt-1">{activity.description}</p>
                <p className="text-xs backend-text-muted mt-2">
                  {DashboardMapper.formatRelativeTime(activity.createdAt)}
                </p>
              </div>
            </div>
          ))
          )}
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="backend-sidebar-bg rounded-lg p-6 backend-sidebar-border border text-center">
          <CheckCircle className="mx-auto text-green-600 mb-3" size={32} />
          <p className="text-2xl font-bold backend-text">{stats.completedQueuesToday}</p>
          <p className="backend-text-muted text-sm">คิวที่เสร็จวันนี้</p>
        </div>

        <div className="backend-sidebar-bg rounded-lg p-6 backend-sidebar-border border text-center">
          <UserCheck className="mx-auto text-blue-600 mb-3" size={32} />
          <p className="text-2xl font-bold backend-text">{stats.totalEmployees}</p>
          <p className="backend-text-muted text-sm">พนักงานทั้งหมด</p>
        </div>

        <div className="backend-sidebar-bg rounded-lg p-6 backend-sidebar-border border text-center">
          <Activity className="mx-auto text-purple-600 mb-3" size={32} />
          <p className="text-2xl font-bold backend-text">{stats.totalQueues}</p>
          <p className="backend-text-muted text-sm">คิวทั้งหมด</p>
        </div>
      </div>
    </div>
  );
}
