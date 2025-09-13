"use client";

import { ServicesViewModel } from "@/src/presentation/presenters/shop/backend/ServicesPresenter";
import { useServicesPresenter } from "@/src/presentation/presenters/shop/backend/useServicesPresenter";
import { useState } from "react";
import { EmojiPicker } from "./EmojiPicker";
import type { ServiceDTO } from "@/src/application/dtos/shop/backend/services-dto";
import { getPaginationConfig } from "@/src/infrastructure/config/PaginationConfig";

interface ServicesViewProps {
  initialViewModel: ServicesViewModel;
  shopId: string;
}

export function ServicesView({ initialViewModel, shopId }: ServicesViewProps) {
  const {
    viewModel,
    loading,
    error,
    currentPage,
    filters,
    handlePageChange,
    handleNextPage,
    handlePrevPage,
    handlePerPageChange,
    handleSearchChange,
    handleCategoryChange,
    handleAvailabilityChange,
    resetFilters,
    refreshData,
    handleCreateService,
    handleUpdateService,
    getServiceById,
    handleDeleteService,
  } = useServicesPresenter(shopId, initialViewModel);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState("");
  const [editingService, setEditingService] = useState<ServiceDTO | null>(null);
  const [deletingService, setDeletingService] = useState<ServiceDTO | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Handle edit service
  const handleEditService = async (serviceId: string) => {
    try {
      setEditLoading(true);
      const service = await getServiceById(serviceId);
      if (service) {
        setEditingService(service);
        setSelectedIcon(service.icon || "");
        setShowEditModal(true);
      }
    } catch (error) {
      console.error("Error fetching service for edit:", error);
    } finally {
      setEditLoading(false);
    }
  };

  // Handle edit form submission
  const handleEditServiceLocal = async (event: React.FormEvent) => {
    try {
      // Add selected icon to form data
      const form = event.target as HTMLFormElement;
      const iconInput = form.querySelector('input[name="icon"]') as HTMLInputElement;
      if (iconInput) {
        iconInput.value = selectedIcon;
      }
      
      await handleUpdateService(event);
      // Close modal and reset icon on success
      setShowEditModal(false);
      setEditingService(null);
      setSelectedIcon("");
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  // Close edit modal
  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingService(null);
    setSelectedIcon("");
  };

  // Handle delete service
  const handleDeleteServiceLocal = async (serviceId: string) => {
    try {
      setDeleteLoading(true);
      await handleDeleteService(serviceId);
      // Close modal on success
      setShowDeleteModal(false);
      setDeletingService(null);
    } catch (error) {
      console.error("Error deleting service:", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  // Open delete confirmation modal
  const openDeleteModal = (service: ServiceDTO) => {
    setDeletingService(service);
    setShowDeleteModal(true);
  };

  // Close delete modal
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setDeletingService(null);
  };

  // Handle form submission with error handling
  const handleCreateServiceLocal = async (event: React.FormEvent) => {
    try {
      // Add selected icon to form data
      const form = event.target as HTMLFormElement;
      const iconInput = form.querySelector('input[name="icon"]') as HTMLInputElement;
      if (iconInput) {
        iconInput.value = selectedIcon;
      }
      
      await handleCreateService(event);
      // Close modal and reset icon on success
      setShowCreateModal(false);
      setSelectedIcon("");
    } catch (error) {
      // Error is handled by the hook, but we can add additional UI feedback here if needed
      console.error("Form submission error:", error);
    }
  };

  // Reset icon when modal is closed
  const handleCloseModal = () => {
    setShowCreateModal(false);
    setSelectedIcon("");
  };

  const { searchQuery, categoryFilter, availabilityFilter } = filters;

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

  // Show loading only on initial load or when explicitly loading
  if (loading && !viewModel) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">
                กำลังโหลดข้อมูลบริการ...
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
                เกิดข้อผิดพลาด
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
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

  // If we have no view model and not loading, show empty state
  if (!viewModel) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="text-gray-400 text-6xl mb-4">🔧</div>
              <p className="text-gray-600 dark:text-gray-400 font-medium mb-2">
                ยังไม่มีข้อมูลบริการ
              </p>
              <p className="text-gray-500 dark:text-gray-500 mb-4">
                ข้อมูลบริการจะแสดงที่นี่เมื่อมีการสร้างบริการ
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                สร้างบริการแรก
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Category Filter */}
            <div className="sm:w-48">
              <select
                value={categoryFilter}
                onChange={(e) => handleCategoryChange(e.target.value)}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="all">หมวดหมู่ทั้งหมด</option>
                {viewModel.allCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Availability Filter */}
            <div className="sm:w-48">
              <select
                value={availabilityFilter}
                onChange={(e) => handleAvailabilityChange(e.target.value)}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="all">สถานะทั้งหมด</option>
                <option value="available">เปิดใช้งาน</option>
                <option value="unavailable">ปิดใช้งาน</option>
              </select>
            </div>

            {/* Reset Button */}
            <div className="flex items-end">
              <button
                onClick={resetFilters}
                disabled={loading}
                className="px-4 py-2 bg-gray-500 dark:bg-gray-600 text-white rounded-lg hover:bg-gray-600 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                รีเซ็ต
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Services Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            รายการบริการ ({viewModel.services.pagination.totalCount})
          </h2>
          
          {/* Active Filters */}
          {(searchQuery || categoryFilter !== "all" || availabilityFilter !== "all") && (
            <div className="mt-3 flex flex-wrap gap-2">
              {searchQuery && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                  ค้นหา: &ldquo;{searchQuery}&rdquo;
                </span>
              )}
              {categoryFilter !== "all" && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                  หมวดหมู่: {categoryFilter}
                </span>
              )}
              {availabilityFilter !== "all" && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
                  สถานะ: {availabilityFilter === "available" ? "เปิดใช้งาน" : "ปิดใช้งาน"}
                </span>
              )}
            </div>
          )}
          
          {loading && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              กำลังโหลดข้อมูล...
            </p>
          )}
          {error && (
            <p className="text-sm text-red-500 dark:text-red-400 mt-1">
              {error}
            </p>
          )}
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
              {viewModel.services.data.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    <div className="text-gray-500 dark:text-gray-400">
                      <div className="text-4xl mb-4">🛎️</div>
                      <p className="text-lg">
                        {searchQuery || categoryFilter !== "all" || availabilityFilter !== "all"
                          ? "ไม่พบบริการที่ตรงกับเงื่อนไขการค้นหา"
                          : "ยังไม่มีบริการในระบบ"}
                      </p>
                      {searchQuery || categoryFilter !== "all" || availabilityFilter !== "all" ? (
                        <p className="text-sm text-gray-400 mt-2">
                          ลองปรับเงื่อนไขการค้นหาหรือเพิ่มบริการใหม่
                        </p>
                      ) : (
                        <p className="text-sm text-gray-400 mt-2">
                          คลิกปุ่ม &ldquo;เพิ่มบริการใหม่&rdquo;
                          เพื่อเริ่มเพิ่มบริการแรกของคุณ
                        </p>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                viewModel.services.data.map((service) => (
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
                        <button 
                          onClick={() => handleEditService(service.id)}
                          disabled={editLoading}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
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
                        <button 
                          onClick={() => openDeleteModal(service)}
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
        {viewModel.services.pagination.totalPages > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            {/* Mobile Layout - Stacked */}
            <div className="flex flex-col space-y-4 sm:hidden">
              {/* Info and Per Page Dropdown */}
              <div className="flex flex-col space-y-3">
                <div className="text-sm text-gray-700 dark:text-gray-300 text-center">
                  แสดง {(viewModel.services.pagination.currentPage - 1) * viewModel.services.pagination.perPage + 1} - {Math.min(viewModel.services.pagination.currentPage * viewModel.services.pagination.perPage, viewModel.services.pagination.totalCount)} จาก {viewModel.services.pagination.totalCount} รายการ
                </div>
                
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    แสดงต่อหน้า:
                  </span>
                  <select
                    value={viewModel.services.pagination.perPage}
                    onChange={(e) => handlePerPageChange(Number(e.target.value))}
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
                  disabled={currentPage <= 1 || loading}
                  className={`px-4 py-2 rounded-md text-sm font-medium min-w-[80px] ${
                    currentPage > 1 && !loading
                      ? "bg-blue-500 text-white hover:bg-blue-600"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                  }`}
                >
                  ก่อนหน้า
                </button>
                
                <div className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                  หน้า {currentPage} / {viewModel.services.pagination.totalPages}
                </div>
                
                <button
                  onClick={handleNextPage}
                  disabled={currentPage >= viewModel.services.pagination.totalPages || loading}
                  className={`px-4 py-2 rounded-md text-sm font-medium min-w-[80px] ${
                    currentPage < viewModel.services.pagination.totalPages && !loading
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
                  แสดง{" "}
                  {(viewModel.services.pagination.currentPage - 1) *
                    viewModel.services.pagination.perPage +
                    1}{" "}
                  -{" "}
                  {Math.min(
                    viewModel.services.pagination.currentPage *
                      viewModel.services.pagination.perPage,
                    viewModel.services.pagination.totalCount
                  )}{" "}
                  จาก {viewModel.services.pagination.totalCount} รายการ
                </div>
                
                {/* Per Page Dropdown */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    แสดงต่อหน้า:
                  </span>
                  <select
                    value={viewModel.services.pagination.perPage}
                    onChange={(e) => handlePerPageChange(Number(e.target.value))}
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
                  disabled={currentPage <= 1 || loading}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${
                    currentPage > 1 && !loading
                      ? "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                  }`}
                >
                  ก่อนหน้า
                </button>

                <div className="flex space-x-1">
                  {Array.from(
                    {
                      length: Math.min(
                        viewModel.services.pagination.totalPages,
                        5
                      ),
                    },
                    (_, i) => {
                      let pageNum;
                      if (viewModel.services.pagination.totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (
                        currentPage >=
                        viewModel.services.pagination.totalPages - 2
                      ) {
                        pageNum =
                          viewModel.services.pagination.totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          disabled={loading}
                          className={`px-3 py-1 rounded-md text-sm font-medium ${
                            pageNum === currentPage
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
                  disabled={
                    currentPage >= viewModel.services.pagination.totalPages ||
                    loading
                  }
                  className={`px-3 py-1 rounded-md text-sm font-medium ${
                    currentPage < viewModel.services.pagination.totalPages &&
                    !loading
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
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              เพิ่มบริการใหม่
            </h3>

            <form onSubmit={handleCreateServiceLocal} className="space-y-4">
              {/* ชื่อบริการ */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  ชื่อบริการ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="เช่น ตัดผมชาย, ตัดผมหญิง"
                  maxLength={100}
                  required
                />
              </div>

              {/* คำอธิบาย */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  คำอธิบาย
                </label>
                <textarea
                  name="description"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="กรอกคำอธิบายบริการ (ไม่บังคับ)"
                  rows={3}
                />
              </div>

              {/* หมวดหมู่ */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  หมวดหมู่ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="category"
                  list="category-list"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="เลือกหรือพิมพ์หมวดหมู่..."
                  required
                />
                <datalist id="category-list">
                  {viewModel.allCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                  <option value="other">อื่นๆ</option>
                </datalist>
                <p className="text-gray-500 text-sm mt-1">เลือกจากรายการหรือพิมพ์หมวดหมู่ใหม่</p>
              </div>

              {/* ราคา */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  ราคา (บาท) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="price"
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="0.00"
                  required
                />
              </div>

              {/* ระยะเวลา */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  ระยะเวลา (นาที)
                </label>
                <input
                  type="number"
                  name="estimatedDuration"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="เช่น 30"
                />
                <p className="text-gray-500 text-sm mt-1">
                  ปล่อยว่างไว้ถ้าไม่ระบุระยะเวลา
                </p>
              </div>

              {/* Icon */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Icon
                </label>
                <div className="flex items-center space-x-3">
                  <EmojiPicker
                    selectedEmoji={selectedIcon}
                    onEmojiSelect={setSelectedIcon}
                  />
                  <div className="flex-1">
                    <input
                      type="text"
                      name="icon"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="เช่น 💇‍♀️, ✂️, 💅"
                      maxLength={10}
                      value={selectedIcon}
                      onChange={(e) => setSelectedIcon(e.target.value)}
                    />
                  </div>
                </div>
                <p className="text-gray-500 text-sm mt-1">
                  ใช้ emoji 1-2 ตัว (ไม่บังคับ) - คลิกที่ปุ่มเพื่อเลือก emoji หรือพิมพ์เอง
                </p>
              </div>

              {/* สถานะ */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  สถานะ
                </label>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isAvailable"
                    defaultChecked={true}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    เปิดใช้งานบริการนี้
                  </label>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
                >
                  บันทึก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Service Modal */}
      {showEditModal && editingService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                แก้ไขบริการ
              </h3>
              <button
                onClick={closeEditModal}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleEditServiceLocal} className="space-y-4">
              {/* Hidden ID field */}
              <input type="hidden" name="id" value={editingService.id} />

              {/* Service Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  ชื่อบริการ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  defaultValue={editingService.name}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="เช่น ตัดผมชาย"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  คำอธิบาย
                </label>
                <textarea
                  name="description"
                  rows={3}
                  defaultValue={editingService.description || ""}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="เช่น ตัดผมชายสไตล์ทันสมัย"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  หมวดหมู่ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="category"
                  list="category-list"
                  required
                  defaultValue={editingService.category || ""}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="เลือกหรือพิมพ์หมวดหมู่..."
                />
                <datalist id="category-list">
                  {viewModel.allCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                  <option value="other">อื่นๆ</option>
                </datalist>
                <p className="text-gray-500 text-sm mt-1">เลือกจากรายการหรือพิมพ์หมวดหมู่ใหม่</p>
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  ราคา (บาท) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="price"
                  required
                  min="1"
                  max="999999"
                  step="1"
                  defaultValue={editingService.price}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="เช่น 150"
                />
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  ระยะเวลา (นาที)
                </label>
                <input
                  type="number"
                  name="estimatedDuration"
                  min="1"
                  max="1440"
                  step="1"
                  defaultValue={editingService.estimatedDuration || ""}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="เช่น 30"
                />
                <p className="text-gray-500 text-sm mt-1">
                  ปล่อยว่างไว้ถ้าไม่ระบุระยะเวลา
                </p>
              </div>

              {/* Icon */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Icon
                </label>
                <div className="flex items-center space-x-3">
                  <EmojiPicker
                    selectedEmoji={selectedIcon}
                    onEmojiSelect={setSelectedIcon}
                  />
                  <div className="flex-1">
                    <input
                      type="text"
                      name="icon"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="เช่น 💇‍♀️, ✂️, 💅"
                      maxLength={10}
                      value={selectedIcon}
                      onChange={(e) => setSelectedIcon(e.target.value)}
                    />
                  </div>
                </div>
                <p className="text-gray-500 text-sm mt-1">
                  ใช้ emoji 1-2 ตัว (ไม่บังคับ) - คลิกที่ปุ่มเพื่อเลือก emoji หรือพิมพ์เอง
                </p>
              </div>

              {/* สถานะ */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  สถานะ
                </label>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isAvailable"
                    id="editIsAvailable"
                    defaultChecked={editingService.isAvailable}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="editIsAvailable" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    เปิดใช้งานบริการนี้
                  </label>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editLoading ? "กำลังบันทึก..." : "บันทึกการแก้ไข"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deletingService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              ยืนยันการลบบริการ
            </h3>
            
            <div className="mb-6">
              <p className="text-gray-700 dark:text-gray-300 mb-2">
                คุณต้องการลบบริการนี้ใช่หรือไม่?
              </p>
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <p className="font-medium text-gray-900 dark:text-white">
                  {deletingService.icon} {deletingService.name}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {deletingService.category} • {deletingService.price.toLocaleString()} บาท
                </p>
              </div>
              <p className="text-sm text-red-600 dark:text-red-400 mt-3">
                ⚠️ การลบบริการจะไม่สามารถกู้คืนได้
              </p>
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={deleteLoading}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={() => handleDeleteServiceLocal(deletingService.id)}
                disabled={deleteLoading}
                className="px-4 py-2 bg-red-500 dark:bg-red-600 text-white rounded-lg hover:bg-red-600 dark:hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleteLoading ? "กำลังลบ..." : "ลบบริการ"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ServicesView;
