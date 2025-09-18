"use client";

import type { Department } from "@/src/presentation/presenters/shop/backend/DepartmentsPresenter";

interface ViewDepartmentDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  department: Department | null;
}

export function ViewDepartmentDetails({
  isOpen,
  onClose,
  department,
}: ViewDepartmentDetailsProps) {
  if (!isOpen || !department) return null;

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("th-TH", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            รายละเอียดแผนก
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
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

        {/* Department Header */}
        <div className="flex items-center mb-6">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-2xl">
            🏢
          </div>
          <div className="ml-4">
            <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
              {department.name}
            </h4>
            <p className="text-gray-600 dark:text-gray-400">{department.slug}</p>
          </div>
        </div>

        {/* Status Badge */}
        <div className="mb-6">
          {department.status === "active" ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              <span className="w-1.5 h-1.5 mr-1.5 bg-green-400 rounded-full"></span>
              ใช้งาน
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
              <span className="w-1.5 h-1.5 mr-1.5 bg-red-400 rounded-full"></span>
              ไม่ใช้งาน
            </span>
          )}
        </div>

        {/* Department Details */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                ชื่อแผนก
              </label>
              <p className="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded">
                {department.name}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Slug
              </label>
              <p className="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded">
                {department.slug}
              </p>
            </div>

            {department.description && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  คำอธิบาย
                </label>
                <p className="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded">
                  {department.description}
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  จำนวนพนักงาน
                </label>
                <p className="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded">
                  {department.employeeCount} คน
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  สถานะ
                </label>
                <p className="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded">
                  {department.status === "active" ? "ใช้งาน" : "ไม่ใช้งาน"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  วันที่สร้าง
                </label>
                <p className="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded">
                  {formatDate(department.createdAt)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  วันที่อัปเดตล่าสุด
                </label>
                <p className="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded">
                  {formatDate(department.updatedAt)}
                </p>
              </div>
            </div>

            {/* Additional Stats */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                สถิติเพิ่มเติม
              </h5>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                    {department.averageServiceTime || "-"}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    เวลาบริการเฉลี่ย (นาที)
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                    {department.totalQueues || "-"}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    คิวทั้งหมด
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-purple-600 dark:text-purple-400">
                    {department.totalRevenue ? `฿${department.totalRevenue.toLocaleString()}` : "-"}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    รายได้ทั้งหมด
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
}
