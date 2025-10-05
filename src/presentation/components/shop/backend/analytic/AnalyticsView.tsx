"use client";

import type {
  AnalyticsFilters,
  AnalyticsViewModel,
} from "@/src/presentation/presenters/shop/backend/AnalyticsPresenter";
import Link from "next/link";
import { useState } from "react";
import { DataRetentionWarning } from "./components/DataRetentionWarning";

// define enum
enum Tab {
  OVERVIEW = "overview",
  SERVICES = "services",
  EMPLOYEES = "employees",
  CUSTOMERS = "customers",
}

interface AnalyticsViewProps {
  viewModel: AnalyticsViewModel;
}

export function AnalyticsView({ viewModel }: AnalyticsViewProps) {
  const [filters, setFilters] = useState<AnalyticsFilters>(viewModel.filters);
  const [activeTab, setActiveTab] = useState<Tab>(Tab.OVERVIEW);

  const formatCurrency = (amount: number) => {
    return `฿${amount.toLocaleString()}`;
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getGrowthColor = (rate: number) => {
    return rate >= 0
      ? "text-green-600 dark:text-green-400"
      : "text-red-600 dark:text-red-400";
  };

  const getGrowthIcon = (rate: number) => {
    return rate >= 0 ? "📈" : "📉";
  };

  return (
    <div className="space-y-8 relative">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            รายงานและวิเคราะห์
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            ดูสถิติและประสิทธิภาพของร้านค้า
          </p>
        </div>
        <div className="flex space-x-4">
          <select
            value={filters.dateRange}
            onChange={(e) =>
              setFilters({
                ...filters,
                dateRange: e.target.value as AnalyticsFilters["dateRange"],
              })
            }
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="today">วันนี้</option>
            <option value="week">สัปดาห์นี้</option>
            <option value="month">เดือนนี้</option>
            <option value="quarter">ไตรมาสนี้</option>
            <option value="year">ปีนี้</option>
            <option value="custom">กำหนดเอง</option>
          </select>
          <button className="bg-blue-500 dark:bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors">
            ส่งออกรายงาน
          </button>
        </div>
      </div>
      {/* Data Retention Warning */}
      <DataRetentionWarning
        limits={viewModel.subscription.limits}
        usage={viewModel.subscription.usage}
        hasDataRetentionLimit={viewModel.subscription.hasDataRetentionLimit}
        dataRetentionDays={viewModel.subscription.dataRetentionDays}
        isFreeTier={viewModel.subscription.isFreeTier}
      />

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                ยอดขายรวม
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {formatCurrency(viewModel.totalRevenue)}
              </p>
              <div className="flex items-center mt-1">
                <span className="text-sm mr-1">
                  {getGrowthIcon(viewModel.growthRate)}
                </span>
                <span
                  className={`text-sm font-medium ${getGrowthColor(
                    viewModel.growthRate
                  )}`}
                >
                  {formatPercentage(viewModel.growthRate)}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                  จากเดือนที่แล้ว
                </span>
              </div>
            </div>
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <span className="text-2xl">💰</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                จำนวนออเดอร์
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {viewModel.totalOrders.toLocaleString()}
              </p>
              <div className="flex items-center mt-1">
                <span className="text-sm mr-1">📊</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  เฉลี่ย {Math.round(viewModel.totalOrders / 30)} ออเดอร์/วัน
                </span>
              </div>
            </div>
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <span className="text-2xl">📋</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                ค่าเฉลี่ยต่อออเดอร์
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {formatCurrency(viewModel.avgOrderValue)}
              </p>
              <div className="flex items-center mt-1">
                <span className="text-sm mr-1">💳</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  เป้าหมาย ฿200
                </span>
              </div>
            </div>
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <span className="text-2xl">💵</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                ความพึงพอใจ
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {viewModel.customerInsights.customerSatisfaction.toFixed(1)}
              </p>
              <div className="flex items-center mt-1">
                <span className="text-sm mr-1">⭐</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  จาก 5 คะแนน
                </span>
              </div>
            </div>
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <span className="text-2xl">😊</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 relative">
        {/* Free Tier Blur Overlay */}
        {viewModel.subscription.isFreeTier && (
          <div className="absolute inset-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg z-10 flex items-center justify-center">
            <div className="text-center p-8">
              <div className="text-6xl mb-4">🔒</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                อัปเกรดเพื่อดูรายงานโดยละเอียด
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                รายงานและการวิเคราะห์ขั้นสูงสำหรับแพ็กเกจ Pro และ Enterprise
                เท่านั้น
              </p>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
                <div className="flex items-center justify-center">
                  <span className="mr-2">✨</span>
                  <span>รายงานการขายแบบละเอียด</span>
                </div>
                <div className="flex items-center justify-center">
                  <span className="mr-2">📊</span>
                  <span>การวิเคราะห์ประสิทธิภาพพนักงาน</span>
                </div>
                <div className="flex items-center justify-center">
                  <span className="mr-2">👥</span>
                  <span>ข้อมูลลูกค้าเชิงลึก</span>
                </div>
                <div className="flex items-center justify-center">
                  <span className="mr-2">📈</span>
                  <span>กราฟและแผนภูมิแบบเรียลไทม์</span>
                </div>
              </div>
              <Link
                href="/pricing"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                อัปเกรดตอนนี้
              </Link>
            </div>
          </div>
        )}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {[
              { id: Tab.OVERVIEW, name: "ภาพรวม", icon: "📊" },
              { id: Tab.SERVICES, name: "บริการ", icon: "🛎️" },
              { id: Tab.EMPLOYEES, name: "พนักงาน", icon: "👥" },
              { id: Tab.CUSTOMERS, name: "ลูกค้า", icon: "👤" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                <span>{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Chart Placeholder */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                  ยอดขายรายวัน
                </h3>
                <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                  <div className="text-center">
                    <span className="text-4xl mb-2 block">📈</span>
                    <p className="text-gray-500 dark:text-gray-400">
                      กราฟยอดขายจะแสดงที่นี่
                    </p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                      ยอดขายสูงสุด:{" "}
                      {formatCurrency(
                        Math.max(...viewModel.revenueData.map((d) => d.revenue))
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Peak Hours */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                  ช่วงเวลาที่มีลูกค้ามาก
                </h3>
                <div className="space-y-3">
                  {viewModel.customerInsights.peakHours
                    .sort((a, b) => b.queueCount - a.queueCount)
                    .slice(0, 5)
                    .map((hour, index) => (
                      <div
                        key={hour.hour}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          <span className="w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full flex items-center justify-center text-xs font-medium mr-3">
                            {index + 1}
                          </span>
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {hour.hour.toString().padStart(2, "0")}:00 -{" "}
                            {(hour.hour + 1).toString().padStart(2, "0")}:00
                          </span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-24 bg-gray-200 dark:bg-gray-600 rounded-full h-2 mr-3">
                            <div
                              className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full"
                              style={{
                                width: `${
                                  (hour.queueCount /
                                    Math.max(
                                      ...viewModel.customerInsights.peakHours.map(
                                        (h) => h.queueCount
                                      )
                                    )) *
                                  100
                                }%`,
                              }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
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
        {activeTab === "services" && (
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              สถิติบริการ
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      อันดับ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      บริการ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      จำนวนออเดอร์
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      ยอดขาย
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      คะแนนเฉลี่ย
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {viewModel.serviceStats.map((service) => (
                    <tr key={service.serviceId}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
                          {service.popularityRank}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {service.serviceName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {service.totalOrders.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {formatCurrency(service.totalRevenue)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-yellow-400 mr-1">⭐</span>
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
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
        {activeTab === "employees" && (
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              ประสิทธิภาพพนักงาน
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {viewModel.employeePerformance.map((employee) => (
                <div
                  key={employee.employeeId}
                  className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      {employee.employeeName}
                    </h4>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">
                        ประสิทธิภาพ
                      </span>
                      <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {employee.efficiency}%
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        คิวที่ให้บริการ
                      </p>
                      <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                        {employee.totalQueues}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        ยอดขาย
                      </p>
                      <p className="text-xl font-bold text-green-600 dark:text-green-400">
                        {formatCurrency(employee.totalRevenue)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        เวลาเฉลี่ย/คิว
                      </p>
                      <p className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
                        {employee.avgServiceTime} นาที
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        คะแนนลูกค้า
                      </p>
                      <div className="flex items-center">
                        <span className="text-yellow-400 mr-1">⭐</span>
                        <span className="text-xl font-bold text-purple-600 dark:text-purple-400">
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
        {activeTab === "customers" && (
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              ข้อมูลลูกค้า
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    ลูกค้าทั้งหมด
                  </h4>
                  <span className="text-2xl">👥</span>
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {viewModel.customerInsights.totalCustomers.toLocaleString()}
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    ลูกค้าใหม่
                  </h4>
                  <span className="text-2xl">🆕</span>
                </div>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {viewModel.customerInsights.newCustomers.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {(
                    (viewModel.customerInsights.newCustomers /
                      viewModel.customerInsights.totalCustomers) *
                    100
                  ).toFixed(1)}
                  % ของลูกค้าทั้งหมด
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    ลูกค้าเก่า
                  </h4>
                  <span className="text-2xl">🔄</span>
                </div>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {viewModel.customerInsights.returningCustomers.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  เฉลี่ย{" "}
                  {viewModel.customerInsights.avgVisitsPerCustomer.toFixed(1)}{" "}
                  ครั้ง/คน
                </p>
              </div>
            </div>

            <div className="mt-6 bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
              <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                ความพึงพอใจของลูกค้า
              </h4>
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                    {viewModel.customerInsights.customerSatisfaction.toFixed(1)}
                  </div>
                  <div className="flex justify-center mb-2">
                    {Array.from({ length: 5 }, (_, i) => (
                      <span
                        key={i}
                        className={`text-2xl ${
                          i <
                          Math.floor(
                            viewModel.customerInsights.customerSatisfaction
                          )
                            ? "text-yellow-400"
                            : "text-gray-300 dark:text-gray-600"
                        }`}
                      >
                        ⭐
                      </span>
                    ))}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    จาก 5 คะแนน
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
