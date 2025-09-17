'use client';

import { useState, useEffect, useRef } from 'react';
import { useDepartments } from '@/src/presentation/hooks/shop/backend/useDepartments';
import type { Department } from '@/src/presentation/hooks/shop/backend/useDepartments';

interface DepartmentSelectionDropdownProps {
  shopId: string;
  selectedDepartment: Department | null;
  onDepartmentSelect: (department: Department) => void;
  onCreateNewDepartment: () => void;
  placeholder?: string;
  disabled?: boolean;
}

export function DepartmentSelectionDropdown({
  shopId,
  selectedDepartment,
  onDepartmentSelect,
  onCreateNewDepartment,
  placeholder = 'เลือกแผนก...',
  disabled = false
}: DepartmentSelectionDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const { departments, loading, error, searchDepartments } = useDepartments(shopId);

  // Filter departments based on search query
  const filteredDepartments = departments.filter(department =>
    department.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    department.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        searchDepartments(searchQuery);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, searchDepartments]);

  const handleDepartmentSelect = (department: Department) => {
    onDepartmentSelect(department);
    setIsOpen(false);
    setSearchQuery('');
  };

  const getDepartmentStatusColor = (isActive: boolean) => {
    return isActive 
      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200'
      : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
  };

  const getDepartmentStatusLabel = (isActive: boolean) => {
    return isActive ? 'ใช้งาน' : 'ไม่ใช้งาน';
  };

  return (
    <div ref={dropdownRef} className="relative">
      {/* Selected Department Display / Trigger */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full px-4 py-3 text-left bg-white dark:bg-gray-800 border rounded-lg
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-600
          disabled:opacity-50 disabled:cursor-not-allowed
          ${isOpen ? 'ring-2 ring-blue-500 border-blue-500' : 'border-gray-300 dark:border-gray-600'}
        `}
      >
        {selectedDepartment ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 dark:text-purple-400 font-semibold">
                    {selectedDepartment.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {selectedDepartment.name}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getDepartmentStatusColor(selectedDepartment.isActive)}`}>
                    {getDepartmentStatusLabel(selectedDepartment.isActive)}
                  </span>
                  {selectedDepartment.employeeCount > 0 && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {selectedDepartment.employeeCount} พนักงาน
                    </span>
                  )}
                </div>
              </div>
            </div>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <span className="text-gray-500 dark:text-gray-400">{placeholder}</span>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg">
          {/* Search Input */}
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหาชื่อแผนกหรือรายละเอียด..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                autoFocus
              />
            </div>
          </div>

          {/* Department List */}
          <div className="max-h-64 overflow-y-auto">
            {loading && (
              <div className="p-4 text-center">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">กำลังโหลด...</p>
              </div>
            )}

            {error && (
              <div className="p-4 text-center">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {!loading && !error && filteredDepartments.length === 0 && (
              <div className="p-4 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {searchQuery ? 'ไม่พบแผนกที่ตรงกับการค้นหา' : 'ไม่มีแผนกในระบบ'}
                </p>
              </div>
            )}

            {!loading && !error && filteredDepartments.map((department) => (
              <button
                key={department.id}
                type="button"
                onClick={() => handleDepartmentSelect(department)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 dark:text-purple-400 text-sm font-semibold">
                        {department.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {department.name}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getDepartmentStatusColor(department.isActive)}`}>
                        {getDepartmentStatusLabel(department.isActive)}
                      </span>
                      {department.employeeCount > 0 && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {department.employeeCount} พนักงาน
                        </span>
                      )}
                      {department.description && (
                        <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {department.description}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}

            {/* Create New Department Button */}
            {!loading && !error && (
              <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => {
                    onCreateNewDepartment();
                    setIsOpen(false);
                    setSearchQuery('');
                  }}
                  className="w-full px-4 py-2 text-left text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-150 flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="text-sm font-medium">สร้างแผนกใหม่</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
