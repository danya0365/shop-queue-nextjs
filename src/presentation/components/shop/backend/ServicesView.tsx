"use client";

import { ServicesViewModel } from "@/src/presentation/presenters/shop/backend/ServicesPresenter";
import { useState } from "react";

interface ServicesViewProps {
  viewModel: ServicesViewModel;
}

export function ServicesView({ viewModel }: ServicesViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Filter services based on search and category
  const filteredServices = viewModel.services.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (service.description &&
        service.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory =
      selectedCategory === "all" || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
    }).format(price);
  };

  const formatDuration = (minutes: number | null) => {
    if (minutes === null) {
      return "ไม่ระบุ";
    }
    if (minutes < 60) {
      return `${minutes} นาที`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0
      ? `${hours} ชม. ${remainingMinutes} นาที`
      : `${hours} ชม.`;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            จัดการบริการ
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            จัดการบริการที่ให้ลูกค้า ราคา และเวลาในการให้บริการ
          </p>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-500 dark:bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
          >
            🛎️ เพิ่มบริการใหม่
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                บริการทั้งหมด
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {viewModel.totalServices}
              </p>
            </div>
            <div className="text-2xl">📋</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                บริการที่เปิดใช้งาน
              </p>
              <p className="text-2xl font-bold text-green-600">
                {viewModel.activeServices}
              </p>
            </div>
            <div className="text-2xl">✅</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                บริการที่ปิดใช้งาน
              </p>
              <p className="text-2xl font-bold text-red-600">
                {viewModel.inactiveServices}
              </p>
            </div>
            <div className="text-2xl">❌</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                หมวดหมู่
              </p>
              <p className="text-2xl font-bold text-blue-600">
                {viewModel.categories.length}
              </p>
            </div>
            <div className="text-2xl">🏷️</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="ค้นหาบริการ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            {/* Category Filter */}
            <div className="sm:w-48">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">หมวดหมู่ทั้งหมด</option>
                {viewModel.categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Services Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            รายการบริการ ({filteredServices.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  บริการ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  หมวดหมู่
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  ราคา
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  ระยะเวลา
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  สถานะ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  การจัดการ
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredServices.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    <div className="text-gray-500 dark:text-gray-400">
                      <div className="text-4xl mb-4">🛎️</div>
                      <p className="text-lg">
                        {searchTerm || selectedCategory !== "all" 
                          ? "ไม่พบบริการที่ตรงกับเงื่อนไขการค้นหา"
                          : "ยังไม่มีบริการในระบบ"}
                      </p>
                      {searchTerm || selectedCategory !== "all" ? (
                        <p className="text-sm text-gray-400 mt-2">
                          ลองปรับเงื่อนไขการค้นหาหรือเพิ่มบริการใหม่
                        </p>
                      ) : (
                        <p className="text-sm text-gray-400 mt-2">
                          คลิกปุ่ม &ldquo;เพิ่มบริการใหม่&rdquo; เพื่อเริ่มเพิ่มบริการแรกของคุณ
                        </p>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredServices.map((service) => (
                  <tr
                    key={service.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-2xl mr-3">
                          {service.icon || "🔧"}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {service.name}
                          </div>
                          {service.description && (
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {service.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {service.category || "ไม่ระบุ"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {formatPrice(service.price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {formatDuration(service.estimatedDuration || null)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          service.isAvailable
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        }`}
                      >
                        {service.isAvailable ? "เปิดใช้งาน" : "ปิดใช้งาน"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                          แก้ไข
                        </button>
                        <button
                          className={`${
                            service.isAvailable
                              ? "text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                              : "text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                          }`}
                        >
                          {service.isAvailable ? "ปิดใช้งาน" : "เปิดใช้งาน"}
                        </button>
                        <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                          ลบ
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Service Modal Placeholder */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              เพิ่มบริการใหม่
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              ฟีเจอร์นี้จะพัฒนาในเร็วๆ นี้
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
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
