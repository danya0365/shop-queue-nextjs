"use client";

import { EmployeesViewModel } from "@/src/presentation/presenters/shop/backend/EmployeesPresenter";
import { useEmployeesPresenter } from "@/src/presentation/presenters/shop/backend/useEmployeesPresenter";
import { EmployeeLimitsWarning } from "./EmployeeLimitsWarning";

interface EmployeesViewProps {
  shopId: string;
  initialViewModel?: EmployeesViewModel;
}

export function EmployeesView({
  shopId,
  initialViewModel,
}: EmployeesViewProps) {
  const {
    viewModel,
    loading,
    error,
    refreshData,
    // Modal states
    showAddModal,
    showDetailsModal,
    selectedEmployee,
    // Filter states
    filters,
    // Event handlers
    handleEmployeeClick,
    handleSearchChange,
    handleStatusChange,
    handleDepartmentChange,
    openAddModal,
    closeAddModal,
    closeDetailsModal,
    // Computed data
    filteredEmployees,
  } = useEmployeesPresenter(shopId, initialViewModel);

  // Show loading only on initial load or when explicitly loading
  if (loading && !viewModel) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">
                กำลังโหลดข้อมูลพนักงาน...
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
              <span>กำลังปรับปรุงฟีเจอร์การจัดการพนักงาน</span>
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
            จัดการพนักงาน
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            จัดการข้อมูลพนักงานและสิทธิ์การเข้าถึง
          </p>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={openAddModal}
            className={`px-4 py-2 rounded-lg transition-colors ${
              viewModel.subscription.canAddEmployee
                ? "bg-blue-500 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-700"
                : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
            }`}
            disabled={!viewModel.subscription.canAddEmployee}
          >
            👥 เพิ่มพนักงาน
          </button>
        </div>
      </div>

      {/* Employee Limits Warning */}
      <EmployeeLimitsWarning
        limits={viewModel.subscription.limits}
        usage={viewModel.subscription.usage}
        staffLimitReached={viewModel.subscription.staffLimitReached}
        canAddEmployee={viewModel.subscription.canAddEmployee}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <span className="text-2xl">👥</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                พนักงานทั้งหมด
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {viewModel.totalEmployees}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <span className="text-2xl">✅</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                พนักงานที่ทำงาน
              </p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {viewModel.activeEmployees}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <span className="text-2xl">🏖️</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                พนักงานลา
              </p>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {viewModel.onLeaveEmployees}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <span className="text-2xl">💰</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                ค่าใช้จ่ายเงินเดือน
              </p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                ฿{viewModel.totalSalaryExpense.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
            ตัวกรอง
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                ค้นหา
              </label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="ชื่อหรืออีเมล"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                สถานะ
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">สถานะทั้งหมด</option>
                <option value="active">ทำงาน</option>
                <option value="inactive">ไม่ทำงาน</option>
                <option value="on_leave">ลา</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                แผนก
              </label>
              <select
                value={filters.department}
                onChange={(e) => handleDepartmentChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">แผนกทั้งหมด</option>
                {viewModel.departments.map((dept) => (
                  <option key={dept.id} value={dept.name}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button className="w-full bg-blue-600 dark:bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-700 transition-colors">
                ค้นหา
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Employees List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            รายชื่อพนักงาน ({filteredEmployees.length})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  พนักงาน
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  แผนก/ตำแหน่ง
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  สถานะ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  เงินเดือน
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  วันที่เริ่มงาน
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  การจัดการ
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredEmployees.map((employee) => (
                <tr
                  key={employee.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => handleEmployeeClick(employee)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-lg">
                          {employee.avatar || "👤"}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {employee.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {employee.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-100">
                      {employee.department}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {employee.position}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        employee.status === "active"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : employee.status === "on_leave"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}
                    >
                      {employee.status === "active"
                        ? "ทำงาน"
                        : employee.status === "on_leave"
                        ? "ลา"
                        : "ไม่ทำงาน"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    ฿{employee.salary.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {employee.hireDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleEmployeeClick(employee)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                      >
                        ดูรายละเอียด
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredEmployees.length === 0 && (
          <div className="text-center py-8">
            <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">
              👥
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              {filters.search ||
              filters.status !== "all" ||
              filters.department !== "all" ||
              filters.position !== "all"
                ? "ไม่พบพนักงานที่ตรงกับเงื่อนไขการค้นหา"
                : "ยังไม่มีพนักงานในระบบ"}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {filters.search ||
              filters.status !== "all" ||
              filters.department !== "all" ||
              filters.position !== "all"
                ? "ลองปรับเงื่อนไขการค้นหาหรือเพิ่มพนักงานใหม่"
                : "คลิกปุ่ม 'เพิ่มพนักงาน' เพื่อเริ่มเพิ่มพนักงานคนแรกของคุณ"}
            </p>
          </div>
        )}
      </div>

      {/* Employee Details Modal */}
      {showDetailsModal && selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                รายละเอียดพนักงาน
              </h3>
              <button
                onClick={closeDetailsModal}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {/* Personal Info */}
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-2xl">
                  {selectedEmployee?.avatar || "👤"}
                </div>
                <div>
                  <h4 className="text-xl font-medium text-gray-900 dark:text-gray-100">
                    {selectedEmployee?.name}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    {selectedEmployee?.position}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    {selectedEmployee?.department}
                  </p>
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                    ข้อมูลติดต่อ
                  </h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    อีเมล: {selectedEmployee?.email}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    เบอร์โทร: {selectedEmployee?.phone}
                  </p>
                </div>
                <div>
                  <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                    ข้อมูลการทำงาน
                  </h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    วันที่เริ่มงาน: {selectedEmployee?.hireDate}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    เงินเดือน: ฿{selectedEmployee?.salary?.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Today's Performance */}
              <div>
                <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                  ประสิทธิภาพวันนี้
                </h5>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      คิวที่ให้บริการ
                    </p>
                    <p className="text-lg font-bold text-blue-600">
                      {selectedEmployee?.todayStats?.queuesServed || 0}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      ยอดขาย
                    </p>
                    <p className="text-lg font-bold text-green-600">
                      ฿
                      {selectedEmployee?.todayStats?.revenue?.toLocaleString() ||
                        "0"}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      เวลาเฉลี่ย/คิว
                    </p>
                    <p className="text-lg font-bold text-yellow-600">
                      {selectedEmployee?.todayStats?.averageServiceTime || 0}{" "}
                      นาที
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      คะแนนเฉลี่ย
                    </p>
                    <p className="text-lg font-bold text-purple-600">
                      {selectedEmployee?.todayStats?.rating &&
                      selectedEmployee?.todayStats?.rating > 0
                        ? selectedEmployee.todayStats.rating.toFixed(1)
                        : "-"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Permissions */}
              <div>
                <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                  สิทธิ์การเข้าถึง
                </h5>
                <div className="flex flex-wrap gap-2">
                  {selectedEmployee?.permissions?.map(
                    (permissionId: string) => {
                      const permission = viewModel.permissions.find(
                        (p) => p.id === permissionId
                      );
                      return permission ? (
                        <span
                          key={permission.id}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {permission.name}
                        </span>
                      ) : null;
                    }
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={closeDetailsModal}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              เพิ่มพนักงานใหม่
            </h3>
            <p className="text-gray-600 mb-4">ฟีเจอร์นี้จะพัฒนาในเร็วๆ นี้</p>

            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ชื่อ-นามสกุล
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="กรอกชื่อ-นามสกุล"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  อีเมล
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="กรอกอีเมล"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  เบอร์โทรศัพท์
                </label>
                <input
                  type="tel"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="กรอกเบอร์โทรศัพท์"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  แผนก
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="">เลือกแผนก</option>
                  {viewModel.departments.map((dept, index) => (
                    <option key={index} value={String(dept)}>
                      {String(dept)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ตำแหน่ง
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="กรอกตำแหน่ง"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  เงินเดือน
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="กรอกเงินเดือน"
                />
              </div>
            </form>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={closeAddModal}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={closeAddModal}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                เพิ่มพนักงาน
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
