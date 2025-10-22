"use client";

import type { CustomerDTO } from "@/src/application/dtos/shop/backend/customers-dto";
import { getPaginationConfig } from "@/src/infrastructure/config/PaginationConfig";
import { CustomersViewModel } from "@/src/presentation/presenters/shop/backend/CustomersPresenter";
import { useCustomersPresenter } from "@/src/presentation/presenters/shop/backend/useCustomersPresenter";
import Link from "next/link";
import { useState } from "react";
import { CreateCustomerModal } from "./modals/CreateCustomerModal";
import { DeleteCustomerConfirmation } from "./modals/DeleteCustomerConfirmation";
import { EditCustomerModal } from "./modals/EditCustomerModal";
import { ViewCustomerDetails } from "./modals/ViewCustomerDetails";

interface CustomersViewProps {
  shopId: string;
  initialViewModel?: CustomersViewModel;
}

export function CustomersView({
  shopId,
  initialViewModel,
}: CustomersViewProps) {
  const {
    viewModel,
    loading,
    error,
    filters,
    handlePageChange,
    handleNextPage,
    handlePrevPage,
    handlePerPageChange,
    handleSearchChange,
    handleMembershipTierChange,
    handleIsActiveChange,
    handleMinTotalPointsChange,
    handleMaxTotalPointsChange,
    handleMinTotalQueuesChange,
    handleMaxTotalQueuesChange,
    resetFilters,
    refreshData,
    createCustomer,
    updateCustomer,
    handleDeleteCustomer,
    actionLoading,
  } = useCustomersPresenter(shopId, initialViewModel);

  // Extract data from view model with null checks
  const customers = viewModel?.customers?.data || [];
  const pagination = viewModel?.customers?.pagination || null;

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerDTO | null>(
    null
  );

  // Show loading only on initial load or when explicitly loading
  if (loading && !viewModel) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">
                กำลังโหลดข้อมูลลูกค้า...
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

  // Data is already extracted above

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
    }).format(price);
  };

  const formatDate = (date: string | undefined) => {
    if (!date) return "ไม่เคย";
    return new Intl.DateTimeFormat("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(date));
  };

  const getCustomerTypeLabel = (customer: CustomerDTO) => {
    return customer.profileId ? "สมาชิก" : "ลูกค้าทั่วไป";
  };

  const getCustomerTypeColor = (customer: CustomerDTO) => {
    return customer.profileId
      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            จัดการลูกค้า
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            จัดการข้อมูลลูกค้า ดูประวัติการใช้บริการ และจัดการโปรแกรมสมาชิก
          </p>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-500 dark:bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
          >
            👤 เพิ่มลูกค้าใหม่
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                ลูกค้าทั้งหมด
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {viewModel.totalCustomers}
              </p>
            </div>
            <div className="text-2xl">👥</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">สมาชิก</p>
              <p className="text-2xl font-bold text-green-600">
                {viewModel.registeredCustomers}
              </p>
            </div>
            <div className="text-2xl">⭐</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                ลูกค้าทั่วไป
              </p>
              <p className="text-2xl font-bold text-gray-600">
                {viewModel.guestCustomers}
              </p>
            </div>
            <div className="text-2xl">👤</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                รายได้รวม
              </p>
              <p className="text-lg font-bold text-blue-600">
                {formatPrice(viewModel.totalRevenue)}
              </p>
            </div>
            <div className="text-2xl">💰</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                ค่าเฉลี่ย/คน
              </p>
              <p className="text-lg font-bold text-purple-600">
                {formatPrice(viewModel.averageSpent)}
              </p>
            </div>
            <div className="text-2xl">📊</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                อัตราสมาชิก
              </p>
              <p className="text-lg font-bold text-orange-600">
                {viewModel.totalCustomers > 0
                  ? Math.round(
                      (viewModel.registeredCustomers /
                        viewModel.totalCustomers) *
                        100
                    )
                  : 0}
                %
              </p>
            </div>
            <div className="text-2xl">📈</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="ค้นหาลูกค้า (ชื่อ หรือ เบอร์โทร)..."
                value={filters.searchQuery ?? ""}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            {/* Membership Tier Filter */}
            <div className="lg:w-48">
              <select
                value={filters.membershipTierFilter ?? ""}
                onChange={(e) => handleMembershipTierChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">ทุกระดับสมาชิก</option>
                <option value="bronze">Bronze</option>
                <option value="silver">Silver</option>
                <option value="gold">Gold</option>
                <option value="platinum">Platinum</option>
              </select>
            </div>

            {/* Active Status Filter */}
            <div className="lg:w-48">
              <select
                value={filters.isActiveFilter?.toString() ?? ""}
                onChange={(e) => handleIsActiveChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">ทุกสถานะ</option>
                <option value="true">ใช้งานอยู่</option>
                <option value="false">ระงับการใช้งาน</option>
              </select>
            </div>

            {/* Reset Filters */}
            <div className="lg:w-auto">
              <button
                onClick={resetFilters}
                className="w-full lg:w-auto px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                รีเซ็ตตัวกรอง
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                แต้มขั้นต่ำ
              </label>
              <input
                type="number"
                placeholder="0"
                value={filters.minTotalPoints?.toString() ?? ""}
                onChange={(e) => handleMinTotalPointsChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                แต้มสูงสุด
              </label>
              <input
                type="number"
                placeholder="ไม่จำกัด"
                value={filters.maxTotalPoints?.toString() ?? ""}
                onChange={(e) => handleMaxTotalPointsChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                จำนวนครั้งขั้นต่ำ
              </label>
              <input
                type="number"
                placeholder="0"
                value={filters.minTotalQueues?.toString() ?? ""}
                onChange={(e) => handleMinTotalQueuesChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                จำนวนครั้งสูงสุด
              </label>
              <input
                type="number"
                placeholder="ไม่จำกัด"
                value={filters.maxTotalQueues?.toString() ?? ""}
                onChange={(e) => handleMaxTotalQueuesChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            รายการลูกค้า ({customers.length})
            {pagination && pagination.total > pagination.perPage && (
              <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                หน้า {pagination.page} จาก {pagination.totalPages}
              </span>
            )}
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  ลูกค้า
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  ประเภท
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  จำนวนครั้ง
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  ครั้งล่าสุด
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  ยอดรวม
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  แต้ม
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  การจัดการ
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="text-gray-500 dark:text-gray-400">
                      <div className="text-4xl mb-4">👥</div>
                      <p className="text-lg">
                        {filters.searchQuery ||
                        filters.membershipTierFilter ||
                        filters.isActiveFilter !== undefined ||
                        filters.minTotalPoints !== undefined ||
                        filters.maxTotalPoints !== undefined ||
                        filters.minTotalQueues !== undefined ||
                        filters.maxTotalQueues !== undefined
                          ? "ไม่พบลูกค้าที่ตรงกับเงื่อนไขการค้นหา"
                          : "ยังไม่มีลูกค้าในระบบ"}
                      </p>
                      {filters.searchQuery ||
                      filters.membershipTierFilter ||
                      filters.isActiveFilter !== undefined ||
                      filters.minTotalPoints !== undefined ||
                      filters.maxTotalPoints !== undefined ||
                      filters.minTotalQueues !== undefined ||
                      filters.maxTotalQueues !== undefined ? (
                        <p className="text-sm text-gray-400 mt-2">
                          ลองปรับเงื่อนไขการค้นหาหรือเพิ่มลูกค้าใหม่
                        </p>
                      ) : (
                        <p className="text-sm text-gray-400 mt-2">
                          คลิกปุ่ม &lsquo;เพิ่มลูกค้าใหม่&rsquo;
                          เพื่อเริ่มเพิ่มลูกค้าคนแรกของคุณ
                        </p>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                customers.map((customer: CustomerDTO) => (
                  <tr
                    key={customer.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-2xl mr-3">
                          {customer.email ? "⭐" : "👤"}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {customer.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {customer.phone || "ไม่ระบุเบอร์โทร"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCustomerTypeColor(
                          customer
                        )}`}
                      >
                        {getCustomerTypeLabel(customer)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {customer.totalQueues || 0} ครั้ง
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {formatDate(customer.lastVisit)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {formatPrice(0)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                        {customer.totalPoints || 0} แต้ม
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/shop/${shopId}/backend/customer-points?customerId=${customer.id}`}
                          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                        >
                          จัดการแต้ม
                        </Link>
                        <button
                          onClick={() => {
                            setSelectedCustomer(customer);
                            setShowViewModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          ดูรายละเอียด
                        </button>
                        <button
                          onClick={() => {
                            setSelectedCustomer(customer);
                            setShowEditModal(true);
                          }}
                          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                        >
                          แก้ไข
                        </button>
                        <button
                          onClick={() => {
                            setSelectedCustomer(customer);
                            setShowDeleteModal(true);
                          }}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
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

        {/* Pagination */}
        {pagination && pagination.totalPages > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            {/* Mobile Layout - Stacked */}
            <div className="flex flex-col space-y-4 sm:hidden">
              {/* Info and Per Page Dropdown */}
              <div className="flex flex-col space-y-3">
                <div className="text-sm text-gray-700 dark:text-gray-300 text-center">
                  แสดง {(pagination.page - 1) * pagination.perPage + 1} -{" "}
                  {Math.min(
                    pagination.page * pagination.perPage,
                    pagination.total
                  )}{" "}
                  จาก {pagination.total} รายการ
                </div>

                <div className="flex items-center justify-center space-x-2">
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    แสดงต่อหน้า:
                  </span>
                  <select
                    value={pagination.perPage}
                    onChange={(e) =>
                      handlePerPageChange(Number(e.target.value))
                    }
                    disabled={loading}
                    className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {getPaginationConfig().PER_PAGE_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Pagination Controls - Mobile */}
              <div className="flex items-center justify-between">
                <button
                  onClick={handlePrevPage}
                  disabled={!pagination.hasPrev || loading}
                  className={`px-4 py-2 rounded-md text-sm font-medium min-w-[80px] ${
                    pagination.hasPrev && !loading
                      ? "bg-blue-500 text-white hover:bg-blue-600"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                  }`}
                >
                  ก่อนหน้า
                </button>

                <div className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                  หน้า {pagination.page} / {pagination.totalPages}
                </div>

                <button
                  onClick={handleNextPage}
                  disabled={!pagination.hasNext || loading}
                  className={`px-4 py-2 rounded-md text-sm font-medium min-w-[80px] ${
                    pagination.hasNext && !loading
                      ? "bg-blue-500 text-white hover:bg-blue-600"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                  }`}
                >
                  ถัดไป
                </button>
              </div>
            </div>

            {/* Desktop Layout - Horizontal */}
            <div className="hidden sm:flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  แสดง {(pagination.page - 1) * pagination.perPage + 1} -{" "}
                  {Math.min(
                    pagination.page * pagination.perPage,
                    pagination.total
                  )}{" "}
                  จาก {pagination.total} รายการ
                </div>

                {/* Per Page Dropdown */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    แสดงต่อหน้า:
                  </span>
                  <select
                    value={pagination.perPage}
                    onChange={(e) =>
                      handlePerPageChange(Number(e.target.value))
                    }
                    disabled={loading}
                    className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {getPaginationConfig().PER_PAGE_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePrevPage}
                  disabled={!pagination.hasPrev || loading}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${
                    pagination.hasPrev && !loading
                      ? "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                  }`}
                >
                  ก่อนหน้า
                </button>

                <div className="flex space-x-1">
                  {Array.from(
                    {
                      length: Math.min(pagination.totalPages, 5),
                    },
                    (_, i) => {
                      let pageNum;
                      if (pagination.totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (pagination.page <= 3) {
                        pageNum = i + 1;
                      } else if (pagination.page >= pagination.totalPages - 2) {
                        pageNum = pagination.totalPages - 4 + i;
                      } else {
                        pageNum = pagination.page - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          disabled={loading}
                          className={`px-3 py-1 rounded-md text-sm font-medium ${
                            pageNum === pagination.page
                              ? "bg-blue-500 text-white"
                              : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                  )}
                </div>

                <button
                  onClick={handleNextPage}
                  disabled={!pagination.hasNext || loading}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${
                    pagination.hasNext && !loading
                      ? "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                  }`}
                >
                  ถัดไป
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateCustomerModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={async (customerData) => {
          await createCustomer({ ...customerData, shopId, profileId: null });
          setShowCreateModal(false);
        }}
        loading={actionLoading.create}
      />

      <EditCustomerModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedCustomer(null);
        }}
        onSubmit={async (customerData) => {
          if (selectedCustomer) {
            await updateCustomer({ ...customerData, id: selectedCustomer.id });
            setShowEditModal(false);
            setSelectedCustomer(null);
          }
        }}
        customer={selectedCustomer}
        loading={actionLoading.update}
      />

      <DeleteCustomerConfirmation
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedCustomer(null);
        }}
        onConfirm={async () => {
          if (selectedCustomer) {
            await handleDeleteCustomer(selectedCustomer.id);
            setShowDeleteModal(false);
            setSelectedCustomer(null);
          }
        }}
        customer={selectedCustomer}
        loading={actionLoading.delete}
      />

      <ViewCustomerDetails
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedCustomer(null);
        }}
        customer={selectedCustomer}
      />
    </div>
  );
}
