"use client";

import { DepartmentsViewModel } from "@/src/presentation/presenters/shop/backend/DepartmentsPresenter";
import { useState } from "react";

interface DepartmentsViewProps {
  viewModel: DepartmentsViewModel;
}

export function DepartmentsView({ viewModel }: DepartmentsViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Filter departments based on search
  const filteredDepartments = viewModel.departments.filter(
    (department) =>
      department.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (department.description &&
        department.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex flex-col gap-8 relative">
      {/* Development Status Overlay */}
      <div className="absolute inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
        <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md mx-4 text-center border border-gray-200 dark:border-gray-700">
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
              <span className="text-3xl">🚧</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              กำลังพัฒนาระบบ
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              เปิดใช้งานเร็วๆ นี้
            </p>
          </div>
          <div className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span>กำลังปรับปรุงฟีเจอร์การจัดการแผนก</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-100"></div>
              <span>เพิ่มประสิทธิภาพการทำงาน</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse delay-200"></div>
              <span>ปรับปรุงประสบการณ์ผู้ใช้</span>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-400 dark:text-gray-500">
              ขออภัยในความไม่สะดวก
              <br />
              ทีมงานกำลังพัฒนาเพื่อคุณ
            </p>
          </div>
        </div>
      </div>
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
            onClick={() => setShowCreateModal(true)}
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
                {viewModel.totalDepartments}
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
                {viewModel.totalEmployees}
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
                {viewModel.averageEmployeesPerDepartment.toFixed(1)}
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
                  ...viewModel.departments.map((d) => d.employeeCount),
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
                {searchTerm
                  ? "ไม่พบแผนกที่ตรงกับเงื่อนไขการค้นหา"
                  : "ยังไม่มีแผนกในระบบ"}
              </p>
              {searchTerm ? (
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
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow"
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
                  <button className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
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
                  <button className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
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
                    }).format(department.createdAt)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 flex space-x-2">
                <button className="flex-1 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-300 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                  ดูพนักงาน
                </button>
                <button className="flex-1 bg-green-50 hover:bg-green-100 dark:bg-green-900 dark:hover:bg-green-800 text-green-700 dark:text-green-300 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                  แก้ไข
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Department Modal Placeholder */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              เพิ่มแผนกใหม่
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
