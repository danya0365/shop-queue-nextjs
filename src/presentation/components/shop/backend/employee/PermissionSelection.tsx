"use client";

import { EmployeePermission } from "@/src/domain/entities/shop/backend/backend-employee.entity";

interface PermissionSelectionProps {
  selectedPermissions: EmployeePermission[];
  onPermissionChange: (permissions: EmployeePermission[]) => void;
  disabled?: boolean;
}

const PERMISSION_LABELS: Record<EmployeePermission, string> = {
  [EmployeePermission.MANAGE_QUEUES]: "จัดการคิว",
  [EmployeePermission.MANAGE_EMPLOYEES]: "จัดการพนักงาน",
  [EmployeePermission.MANAGE_SERVICES]: "จัดการบริการ",
  [EmployeePermission.MANAGE_CUSTOMERS]: "จัดการลูกค้า",
  [EmployeePermission.MANAGE_SETTINGS]: "จัดการตั้งค่า",
};

const PERMISSION_DESCRIPTIONS: Record<EmployeePermission, string> = {
  [EmployeePermission.MANAGE_QUEUES]: "สามารถจัดการคิวลูกค้า",
  [EmployeePermission.MANAGE_EMPLOYEES]: "สามารถจัดการพนักงาน",
  [EmployeePermission.MANAGE_SERVICES]: "สามารถจัดการบริการ",
  [EmployeePermission.MANAGE_CUSTOMERS]: "สามารถจัดการลูกค้า",
  [EmployeePermission.MANAGE_SETTINGS]: "สามารถจัดการตั้งค่า",
};

const PERMISSION_CATEGORIES: Record<EmployeePermission, string> = {
  [EmployeePermission.MANAGE_QUEUES]: "คิว",
  [EmployeePermission.MANAGE_EMPLOYEES]: "พนักงาน",
  [EmployeePermission.MANAGE_SERVICES]: "บริการ",
  [EmployeePermission.MANAGE_CUSTOMERS]: "ลูกค้า",
  [EmployeePermission.MANAGE_SETTINGS]: "ตั้งค่า",
};

export function PermissionSelection({
  selectedPermissions,
  onPermissionChange,
  disabled = false,
}: PermissionSelectionProps) {
  const handlePermissionToggle = (permission: EmployeePermission) => {
    const isSelected = selectedPermissions.includes(permission);
    
    if (isSelected) {
      onPermissionChange(selectedPermissions.filter(p => p !== permission));
    } else {
      onPermissionChange([...selectedPermissions, permission]);
    }
  };

  const handleSelectAll = () => {
    const allPermissions = Object.values(EmployeePermission);
    const allSelected = allPermissions.every(permission => 
      selectedPermissions.includes(permission)
    );
    
    if (allSelected) {
      onPermissionChange([]);
    } else {
      onPermissionChange(allPermissions);
    }
  };

  const allPermissions = Object.values(EmployeePermission);
  const allSelected = allPermissions.every(permission => 
    selectedPermissions.includes(permission)
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          สิทธิ์การเข้าถึง
        </label>
        <button
          type="button"
          onClick={handleSelectAll}
          disabled={disabled}
          className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {allSelected ? "ยกเลิกทั้งหมด" : "เลือกทั้งหมด"}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {allPermissions.map((permission) => {
          const isSelected = selectedPermissions.includes(permission);
          const category = PERMISSION_CATEGORIES[permission];
          
          return (
            <div
              key={permission}
              className={`flex items-start space-x-3 p-3 rounded-lg border transition-colors cursor-pointer ${
                isSelected
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                  : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
              } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={() => !disabled && handlePermissionToggle(permission)}
            >
              <div className="flex-shrink-0 mt-1">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handlePermissionToggle(permission)}
                  disabled={disabled}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {PERMISSION_LABELS[permission]}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {PERMISSION_DESCRIPTIONS[permission]}
                    </p>
                  </div>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                    {category}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedPermissions.length > 0 && (
        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            สิทธิ์ที่เลือก: {selectedPermissions.length} รายการ
          </p>
          <div className="flex flex-wrap gap-1 mt-2">
            {selectedPermissions.map((permission) => (
              <span
                key={permission}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
              >
                {PERMISSION_LABELS[permission]}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
