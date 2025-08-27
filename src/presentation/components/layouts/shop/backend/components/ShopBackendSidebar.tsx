"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

interface ShopBackendSidebarProps {
  shopId: string;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const ShopBackendSidebar: React.FC<ShopBackendSidebarProps> = ({
  shopId,
  sidebarOpen,
  setSidebarOpen,
}) => {
  const pathname = usePathname();

  const navigationItems = [
    { href: `/shop/${shopId}/backend`, label: 'แดชบอร์ด', icon: '📊' },
    { href: `/shop/${shopId}/backend/queue`, label: 'จัดการคิว', icon: '📋' },
    { href: `/shop/${shopId}/backend/employees`, label: 'จัดการพนักงาน', icon: '👥' },
    { href: `/shop/${shopId}/backend/promotions`, label: 'โปรโมชัน', icon: '🎁' },
    { href: `/shop/${shopId}/backend/posters`, label: 'โปสเตอร์', icon: '🖼️' },
    { href: `/shop/${shopId}/backend/analytics`, label: 'รายงาน', icon: '📈' },
    { href: `/shop/${shopId}/backend/settings`, label: 'ตั้งค่าร้าน', icon: '⚙️' },
  ];

  const isActive = (href: string) => {
    if (href === `/shop/${shopId}/backend`) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-64 bg-blue-50 dark:bg-blue-900 shadow-sm min-h-screen
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Mobile Close Button */}
        <div className="lg:hidden flex justify-end p-4">
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-lg text-blue-600 hover:bg-blue-100 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-4 lg:mt-8">
          <div className="px-4 space-y-2">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.href)
                    ? 'bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200 border-r-2 border-blue-700'
                    : 'text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-800'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>

        {/* Shop ID in Sidebar */}
        <div className="mt-8 px-4 py-4 border-t border-blue-200 dark:border-blue-700">
          <div className="text-sm text-blue-600 dark:text-blue-300">
            ร้าน ID: <span className="font-mono">{shopId}</span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default ShopBackendSidebar;
