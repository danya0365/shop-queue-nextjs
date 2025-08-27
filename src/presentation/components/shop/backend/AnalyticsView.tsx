'use client';

import React, { useState } from 'react';
import type { AnalyticsViewModel, AnalyticsFilters } from '@/src/presentation/presenters/shop/backend/AnalyticsPresenter';

interface AnalyticsViewProps {
  viewModel: AnalyticsViewModel;
}

export function AnalyticsView({ viewModel }: AnalyticsViewProps) {
  const [filters, setFilters] = useState<AnalyticsFilters>(viewModel.filters);
  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'employees' | 'customers'>('overview');

  const formatCurrency = (amount: number) => {
    return `฿${amount.toLocaleString()}`;
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getGrowthColor = (rate: number) => {
    return rate >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getGrowthIcon = (rate: number) => {
    return rate >= 0 ? '📈' : '📉';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">รายงานและวิเคราะห์</h1>
                <p className="text-sm text-gray-600">ดูสถิติและประสิทธิภาพของร้านค้า</p>
              </div>
              <div className="flex items-center space-x-4">
                <select
                  value={filters.dateRange}
                  onChange={(e) => setFilters({ ...filters, dateRange: e.target.value as any })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="today">วันนี้</option>
                  <option value="week">สัปดาห์นี้</option>
                  <option value="month">เดือนนี้</option>
                  <option value="quarter">ไตรมาสนี้</option>
                  <option value="year">ปีนี้</option>
                  <option value="custom">กำหนดเอง</option>
                </select>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  ส่งออกรายงาน
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">ยอดขายรวม</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(viewModel.totalRevenue)}
                </p>
                <div className="flex items-center mt-1">
                  <span className="text-sm mr-1">{getGrowthIcon(viewModel.growthRate)}</span>
                  <span className={`text-sm font-medium ${getGrowthColor(viewModel.growthRate)}`}>
                    {formatPercentage(viewModel.growthRate)}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">จากเดือนที่แล้ว</span>
                </div>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">💰</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">จำนวนออเดอร์</p>
                <p className="text-2xl font-bold text-gray-900">
                  {viewModel.totalOrders.toLocaleString()}
                </p>
                <div className="flex items-center mt-1">
                  <span className="text-sm mr-1">📊</span>
                  <span className="text-sm text-gray-500">
                    เฉลี่ย {Math.round(viewModel.totalOrders / 30)} ออเดอร์/วัน
                  </span>
                </div>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">📋</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">ค่าเฉลี่ยต่อออเดอร์</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(viewModel.avgOrderValue)}
                </p>
                <div className="flex items-center mt-1">
                  <span className="text-sm mr-1">💳</span>
                  <span className="text-sm text-gray-500">
                    เป้าหมาย ฿200
                  </span>
                </div>
              </div>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <span className="text-2xl">💵</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">ความพึงพอใจ</p>
                <p className="text-2xl font-bold text-gray-900">
                  {viewModel.customerInsights.customerSatisfaction.toFixed(1)}
                </p>
                <div className="flex items-center mt-1">
                  <span className="text-sm mr-1">⭐</span>
                  <span className="text-sm text-gray-500">
                    จาก 5 คะแนน
                  </span>
                </div>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-2xl">😊</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', name: 'ภาพรวม', icon: '📊' },
                { id: 'services', name: 'บริการ', icon: '🛎️' },
                { id: 'employees', name: 'พนักงาน', icon: '👥' },
                { id: 'customers', name: 'ลูกค้า', icon: '👤' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span>{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Chart Placeholder */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">ยอดขายรายวัน</h3>
                  <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                    <div className="text-center">
                      <span className="text-4xl mb-2 block">📈</span>
                      <p className="text-gray-500">กราฟยอดขายจะแสดงที่นี่</p>
                      <p className="text-sm text-gray-400 mt-1">
                        ยอดขายสูงสุด: {formatCurrency(Math.max(...viewModel.revenueData.map(d => d.revenue)))}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Peak Hours */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">ช่วงเวลาที่มีลูกค้ามาก</h3>
                  <div className="space-y-3">
                    {viewModel.customerInsights.peakHours
                      .sort((a, b) => b.queueCount - a.queueCount)
                      .slice(0, 5)
                      .map((hour, index) => (
                        <div key={hour.hour} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <span className="w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-medium mr-3">
                              {index + 1}
                            </span>
                            <span className="font-medium">
                              {hour.hour.toString().padStart(2, '0')}:00 - {(hour.hour + 1).toString().padStart(2, '0')}:00
                            </span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{
                                  width: `${(hour.queueCount / Math.max(...viewModel.customerInsights.peakHours.map(h => h.queueCount))) * 100}%`
                                }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-gray-900">
                              {hour.queueCount} คิว
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Services Tab */}
          {activeTab === 'services' && (
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">สถิติบริการ</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        อันดับ
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        บริการ
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        จำนวนออเดอร์
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ยอดขาย
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        คะแนนเฉลี่ย
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {viewModel.serviceStats.map((service) => (
                      <tr key={service.serviceId}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                            {service.popularityRank}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {service.serviceName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {service.totalOrders.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(service.totalRevenue)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-yellow-400 mr-1">⭐</span>
                            <span className="text-sm font-medium text-gray-900">
                              {service.avgRating.toFixed(1)}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Employees Tab */}
          {activeTab === 'employees' && (
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">ประสิทธิภาพพนักงาน</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {viewModel.employeePerformance.map((employee) => (
                  <div key={employee.employeeId} className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-medium text-gray-900">
                        {employee.employeeName}
                      </h4>
                      <div className="flex items-center">
                        <span className="text-sm text-gray-500 mr-2">ประสิทธิภาพ</span>
                        <span className="text-lg font-bold text-blue-600">
                          {employee.efficiency}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">คิวที่ให้บริการ</p>
                        <p className="text-xl font-bold text-gray-900">
                          {employee.totalQueues}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">ยอดขาย</p>
                        <p className="text-xl font-bold text-green-600">
                          {formatCurrency(employee.totalRevenue)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">เวลาเฉลี่ย/คิว</p>
                        <p className="text-xl font-bold text-yellow-600">
                          {employee.avgServiceTime} นาที
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">คะแนนลูกค้า</p>
                        <div className="flex items-center">
                          <span className="text-yellow-400 mr-1">⭐</span>
                          <span className="text-xl font-bold text-purple-600">
                            {employee.customerRating.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Customers Tab */}
          {activeTab === 'customers' && (
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">ข้อมูลลูกค้า</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-600">ลูกค้าทั้งหมด</h4>
                    <span className="text-2xl">👥</span>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">
                    {viewModel.customerInsights.totalCustomers.toLocaleString()}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-600">ลูกค้าใหม่</h4>
                    <span className="text-2xl">🆕</span>
                  </div>
                  <p className="text-3xl font-bold text-green-600">
                    {viewModel.customerInsights.newCustomers.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {((viewModel.customerInsights.newCustomers / viewModel.customerInsights.totalCustomers) * 100).toFixed(1)}% ของลูกค้าทั้งหมด
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-600">ลูกค้าเก่า</h4>
                    <span className="text-2xl">🔄</span>
                  </div>
                  <p className="text-3xl font-bold text-blue-600">
                    {viewModel.customerInsights.returningCustomers.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    เฉลี่ย {viewModel.customerInsights.avgVisitsPerCustomer.toFixed(1)} ครั้ง/คน
                  </p>
                </div>
              </div>

              <div className="mt-6 bg-gray-50 rounded-lg p-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">ความพึงพอใจของลูกค้า</h4>
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl font-bold text-purple-600 mb-2">
                      {viewModel.customerInsights.customerSatisfaction.toFixed(1)}
                    </div>
                    <div className="flex justify-center mb-2">
                      {Array.from({ length: 5 }, (_, i) => (
                        <span
                          key={i}
                          className={`text-2xl ${
                            i < Math.floor(viewModel.customerInsights.customerSatisfaction)
                              ? 'text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        >
                          ⭐
                        </span>
                      ))}
                    </div>
                    <p className="text-gray-600">จาก 5 คะแนน</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
