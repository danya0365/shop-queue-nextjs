"use client";

import type { Employee } from "@/src/presentation/presenters/shop/backend/EmployeesPresenter";

interface DeleteEmployeeConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  employee: Employee | null;
  loading?: boolean;
}

export function DeleteEmployeeConfirmation({
  isOpen,
  onClose,
  onConfirm,
  employee,
  loading = false,
}: DeleteEmployeeConfirmationProps) {
  if (!isOpen || !employee) return null;

  const handleConfirm = async () => {
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-red-600 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              ยืนยันการลบพนักงาน
            </h3>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            คุณแน่ใจหรือไม่ว่าต้องการลบพนักงานรายนี้?
            การกระทำนี้ไม่สามารถย้อนกลับได้
          </p>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center">
              <div className="text-2xl mr-3">
                👤
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {employee.name}
                </div>
                {employee.email && (
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {employee.email}
                  </div>
                )}
                {employee.phone && (
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {employee.phone}
                  </div>
                )}
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  ตำแหน่ง: {employee.position}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  แผนก: {employee.department}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 disabled:opacity-50"
          >
            ยกเลิก
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "กำลังลบ..." : "ลบพนักงาน"}
          </button>
        </div>
      </div>
    </div>
  );
}
