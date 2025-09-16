'use client';

import { useState, useEffect, useRef } from 'react';
import { useCustomers } from '@/src/presentation/hooks/shop/backend/useCustomers';
import type { Customer } from '@/src/presentation/hooks/shop/backend/useCustomers';

interface CustomerSelectionDropdownProps {
  shopId: string;
  selectedCustomer: Customer | null;
  onCustomerSelect: (customer: Customer) => void;
  onCreateNewCustomer: () => void;
  placeholder?: string;
  disabled?: boolean;
}

export function CustomerSelectionDropdown({
  shopId,
  selectedCustomer,
  onCustomerSelect,
  onCreateNewCustomer,
  placeholder = 'เลือกลูกค้า...',
  disabled = false
}: CustomerSelectionDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const { customers, loading, error, searchCustomers } = useCustomers(shopId);

  // Filter customers based on search query
  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.phone?.includes(searchQuery) ||
    customer.email?.toLowerCase().includes(searchQuery.toLowerCase())
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
        searchCustomers(searchQuery);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, searchCustomers]);

  const handleCustomerSelect = (customer: Customer) => {
    onCustomerSelect(customer);
    setIsOpen(false);
    setSearchQuery('');
  };

  const getMembershipTierColor = (tier: Customer['membershipTier']) => {
    const colors = {
      regular: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
      bronze: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200',
      silver: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200',
      gold: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200',
      platinum: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200'
    };
    return colors[tier];
  };

  const getMembershipTierLabel = (tier: Customer['membershipTier']) => {
    const labels = {
      regular: 'ทั่วไป',
      bronze: 'บรอนซ์',
      silver: 'ซิลเวอร์',
      gold: 'โกลด์',
      platinum: 'แพลตินัม'
    };
    return labels[tier];
  };

  return (
    <div ref={dropdownRef} className="relative">
      {/* Selected Customer Display / Trigger */}
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
        {selectedCustomer ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 dark:text-blue-400 font-semibold">
                    {selectedCustomer.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {selectedCustomer.name}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getMembershipTierColor(selectedCustomer.membershipTier)}`}>
                    {getMembershipTierLabel(selectedCustomer.membershipTier)}
                  </span>
                  {selectedCustomer.phone && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {selectedCustomer.phone}
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
                placeholder="ค้นหาชื่อ, เบอร์โทร, หรืออีเมล..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                autoFocus
              />
            </div>
          </div>

          {/* Customer List */}
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

            {!loading && !error && filteredCustomers.length === 0 && (
              <div className="p-4 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {searchQuery ? 'ไม่พบลูกค้าที่ตรงกับการค้นหา' : 'ไม่มีลูกค้าในระบบ'}
                </p>
              </div>
            )}

            {!loading && !error && filteredCustomers.map((customer) => (
              <button
                key={customer.id}
                type="button"
                onClick={() => handleCustomerSelect(customer)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 dark:text-blue-400 text-sm font-semibold">
                        {customer.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {customer.name}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getMembershipTierColor(customer.membershipTier)}`}>
                        {getMembershipTierLabel(customer.membershipTier)}
                      </span>
                      {customer.phone && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {customer.phone}
                        </span>
                      )}
                      <span className="text-xs text-gray-400">
                        คิว {customer.totalQueues} • แต้ม {customer.totalPoints}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Create New Customer Button */}
          <div className="p-3 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => {
                onCreateNewCustomer();
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-150 flex items-center justify-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>สร้างลูกค้าใหม่</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
