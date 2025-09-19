"use client";

import type { Employee } from "@/src/presentation/presenters/shop/backend/EmployeesPresenter";

interface ViewEmployeeDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
}

export function ViewEmployeeDetails({
  isOpen,
  onClose,
  employee,
}: ViewEmployeeDetailsProps) {
  if (!isOpen || !employee) return null;

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

  const calculateWorkDuration = (hireDate: string) => {
    try {
      const start = new Date(hireDate);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const years = Math.floor(diffDays / 365);
      const months = Math.floor((diffDays % 365) / 30);

      if (years > 0) {
        return `${years} ปี ${months > 0 ? `${months} เดือน` : ""}`;
      } else if (months > 0) {
        return `${months} เดือน`;
      } else {
        return `${diffDays} วัน`;
      }
    } catch {
      return "ไม่สามารถคำนวณได้";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            รายละเอียดพนักงาน
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

        {/* Employee Header */}
        <div className="flex items-center mb-6">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-2xl">
            👤
          </div>
          <div className="ml-4">
            <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
              {employee.name}
            </h4>
            <p className="text-gray-600 dark:text-gray-400">
              {employee.position}
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <div className="mb-6">
          {employee.status === "active" ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              <span className="w-1.5 h-1.5 mr-1.5 bg-green-400 rounded-full"></span>
              ทำงาน
            </span>
          ) : employee.status === "on_leave" ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
              <span className="w-1.5 h-1.5 mr-1.5 bg-yellow-400 rounded-full"></span>
              ลา
            </span>
          ) : employee.status === "inactive" ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
              <span className="w-1.5 h-1.5 mr-1.5 bg-red-400 rounded-full"></span>
              ไม่ทำงาน
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
              <span className="w-1.5 h-1.5 mr-1.5 bg-gray-400 rounded-full"></span>
              ระงับ
            </span>
          )}
        </div>

        {/* Employee Details */}
        <div className="space-y-4">
          {/* Department */}
          <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              แผนก
            </span>
            <span className="text-sm text-gray-900 dark:text-white">
              {employee.department}
            </span>
          </div>

          {/* Employee Code */}
          <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              รหัสพนักงาน
            </span>
            <span className="text-sm text-gray-900 dark:text-white font-mono">
              {employee.employeeCode}
            </span>
          </div>

          {/* Email */}
          {employee.email && (
            <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                อีเมล
              </span>
              <span className="text-sm text-gray-900 dark:text-white">
                {employee.email}
              </span>
            </div>
          )}

          {/* Phone */}
          {employee.phone && (
            <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                เบอร์โทรศัพท์
              </span>
              <span className="text-sm text-gray-900 dark:text-white">
                {employee.phone}
              </span>
            </div>
          )}

          {/* Permissions */}
          <div className="py-2 border-b border-gray-200 dark:border-gray-700">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400 block mb-2">
              สิทธิ์การเข้าถึง
            </span>
            <div className="flex flex-wrap gap-2">
              {employee.permissions.map((permission, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                >
                  {permission}
                </span>
              ))}
            </div>
          </div>

          {/* Salary */}
          <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              เงินเดือน
            </span>
            <span className="text-sm text-gray-900 dark:text-white">
              ฿{employee.salary?.toLocaleString("th-TH") || "0"}
            </span>
          </div>

          {/* Hire Date */}
          <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              วันที่เริ่มงาน
            </span>
            <span className="text-sm text-gray-900 dark:text-white">
              {formatDate(employee.hireDate)}
            </span>
          </div>

          {/* Work Duration */}
          <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              ระยะเวลาทำงาน
            </span>
            <span className="text-sm text-gray-900 dark:text-white">
              {calculateWorkDuration(employee.hireDate)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-2 pt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
}
