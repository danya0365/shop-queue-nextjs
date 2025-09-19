"use client";

import { useState } from "react";
import { DepartmentsViewModel } from "@/src/presentation/presenters/shop/backend/DepartmentsPresenter";
import { useDepartmentsPresenter } from "@/src/presentation/presenters/shop/backend/useDepartmentsPresenter";
import {
  CreateDepartmentModal,
  EditDepartmentModal,
  DeleteDepartmentConfirmation,
  ViewDepartmentDetails,
} from "./modals";
import { UnderConstructionModal } from "@/src/presentation/components/shop/backend/dashboard/modals/UnderConstructionModal";

interface DepartmentsViewProps {
  shopId: string;
  initialViewModel?: DepartmentsViewModel;
}

export function DepartmentsView({
  shopId,
  initialViewModel,
}: DepartmentsViewProps) {
  const {
    viewModel,
    loading,
    error,
    refreshData,
    showCreateModal,
    showEditModal,
    showDeleteModal,
    showViewModal,
    selectedDepartment,
    filters,
    handleDepartmentClick,
    handleSearchChange,
    openCreateModal,
    closeCreateModal,
    openEditModal,
    closeEditModal,
    openDeleteModal,
    closeDeleteModal,
    openViewModal,
    closeViewModal,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    filteredDepartments,
    actionLoading,
  } = useDepartmentsPresenter(shopId, initialViewModel);

  // State for Under Construction Modal
  const [showUnderConstructionModal, setShowUnderConstructionModal] = useState(false);
  const [selectedDepartmentForEmployees, setSelectedDepartmentForEmployees] = useState<{
    id: string;
    name: string;
  } | null>(null);

  // Function to handle viewing employees
  const handleViewEmployees = (departmentId: string, departmentName: string) => {
    setSelectedDepartmentForEmployees({ id: departmentId, name: departmentName });
    setShowUnderConstructionModal(true);
  };

  // Function to close under construction modal
  const closeUnderConstructionModal = () => {
    setShowUnderConstructionModal(false);
    setSelectedDepartmentForEmployees(null);
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
                กำลังโหลดข้อมูลแผนก...
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

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            จัดการแผนก
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            จัดการแผนกงานและการจัดกลุ่มพนักงาน
          </p>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={openCreateModal}
            className="bg-blue-500 dark:bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
          >
            🏢 เพิ่มแผนกใหม่
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                แผนกทั้งหมด
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {viewModel?.totalDepartments || 0}
              </p>
            </div>
            <div className="text-2xl">🏢</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                พนักงานทั้งหมด
              </p>
              <p className="text-2xl font-bold text-blue-600">
                {viewModel?.totalEmployees || 0}
              </p>
            </div>
            <div className="text-2xl">👥</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                เฉลี่ย/แผนก
              </p>
              <p className="text-2xl font-bold text-green-600">
                {viewModel?.averageEmployeesPerDepartment?.toFixed(1) || "0.0"}
              </p>
            </div>
            <div className="text-2xl">📊</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                แผนกที่ใหญ่ที่สุด
              </p>
              <p className="text-lg font-bold text-purple-600">
                {Math.max(
                  ...(viewModel?.departments?.map((d) => d.employeeCount) ||
                    []),
                  0
                )}{" "}
                คน
              </p>
            </div>
            <div className="text-2xl">🏆</div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="ค้นหาแผนก..."
              value={filters.search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDepartments.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-500 dark:text-gray-400">
              <div className="text-4xl mb-4">🏢</div>
              <p className="text-lg">
                {filters.search
                  ? "ไม่พบแผนกที่ตรงกับเงื่อนไขการค้นหา"
                  : "ยังไม่มีแผนกในระบบ"}
              </p>
              {filters.search ? (
                <p className="text-sm text-gray-400 mt-2">
                  ลองปรับเงื่อนไขการค้นหาหรือเพิ่มแผนกใหม่
                </p>
              ) : (
                <p className="text-sm text-gray-400 mt-2">
                  คลิกปุ่ม &lsquo;เพิ่มแผนกใหม่&rsquo;
                  เพื่อเริ่มเพิ่มแผนกแรกของคุณ
                </p>
              )}
            </div>
          </div>
        ) : (
          filteredDepartments.map((department) => (
            <div
              key={department.id}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleDepartmentClick(department)}
            >
              {/* Department Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="text-3xl mr-3">🏢</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {department.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      แผนก ID: {department.id}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      openViewModal(department);
                    }}
                    className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    title="ดูรายละเอียด"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditModal(department);
                    }}
                    className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    title="แก้ไข"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      openDeleteModal(department);
                    }}
                    className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    title="ลบ"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Department Description */}
              {department.description && (
                <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                  {department.description}
                </p>
              )}

              {/* Employee Count */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <span className="text-2xl mr-2">👥</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    จำนวนพนักงาน
                  </span>
                </div>
                <span className="text-lg font-semibold text-blue-600">
                  {department.employeeCount} คน
                </span>
              </div>

              {/* Department Stats */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    สร้างเมื่อ:
                  </span>
                  <span className="text-gray-900 dark:text-white">
                    {new Intl.DateTimeFormat("th-TH", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    }).format(new Date(department.createdAt))}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 grid grid-cols-1 gap-2">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewEmployees(department.id, department.name);
                  }}
                  className="w-full bg-purple-50 hover:bg-purple-100 dark:bg-purple-900 dark:hover:bg-purple-800 text-purple-700 dark:text-purple-300 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <span>👥</span>
                  <span>ดูรายชื่อพนักงาน</span>
                </button>
                <div className="flex space-x-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      openViewModal(department);
                    }}
                    className="flex-1 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-300 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    ดูรายละเอียด
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditModal(department);
                    }}
                    className="flex-1 bg-green-50 hover:bg-green-100 dark:bg-green-900 dark:hover:bg-green-800 text-green-700 dark:text-green-300 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    แก้ไข
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modals */}
      <CreateDepartmentModal
        isOpen={showCreateModal}
        onClose={closeCreateModal}
        onSubmit={createDepartment}
        loading={actionLoading.create}
        shopId={shopId}
      />
      
      {selectedDepartment && (
        <>
          <EditDepartmentModal
            isOpen={showEditModal}
            onClose={closeEditModal}
            onSubmit={updateDepartment}
            department={selectedDepartment}
            loading={actionLoading.update}
          />
          
          <DeleteDepartmentConfirmation
            isOpen={showDeleteModal}
            onClose={closeDeleteModal}
            onConfirm={() => deleteDepartment(selectedDepartment.id)}
            department={selectedDepartment}
            loading={actionLoading.delete}
          />
          
          <ViewDepartmentDetails
            isOpen={showViewModal}
            onClose={closeViewModal}
            department={selectedDepartment}
          />
        </>
      )}

      {/* Under Construction Modal */}
      <UnderConstructionModal
        isOpen={showUnderConstructionModal}
        onClose={closeUnderConstructionModal}
        featureName={`ดูรายชื่อพนักงานในแผนก${selectedDepartmentForEmployees?.name || ''}`}
      />
    </div>
  );
}
