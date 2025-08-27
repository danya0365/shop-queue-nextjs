"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

interface EmployeeSidebarProps {
  shopId: string;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const EmployeeSidebar: React.FC<EmployeeSidebarProps> = ({
  shopId,
  sidebarOpen,
  setSidebarOpen,
}) => {
  const pathname = usePathname();

  const navigationItems = [
    { href: `/shop/${shopId}/employee`, label: 'หน้าหลัก', icon: '🏠' },
    { href: `/shop/${shopId}/employee/queue`, label: 'จัดการคิว', icon: '📋' },
    { href: `/shop/${shopId}/employee/serve`, label: 'ให้บริการ', icon: '🛎️' },
    { href: `/shop/${shopId}/employee/payment`, label: 'ชำระเงิน', icon: '💳' },
    { href: `/shop/${shopId}/employee/history`, label: 'ประวัติ', icon: '📚' },
  ];

  const isActive = (href: string) => {
    if (href === `/shop/${shopId}/employee`) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-64 bg-green-50 dark:bg-green-900 shadow-sm min-h-screen
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Mobile Close Button */}
        <div className="lg:hidden flex justify-end p-4">
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-lg text-green-600 hover:bg-green-100 transition-colors"
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
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive(item.href)
                    ? 'bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200 border-r-2 border-green-700'
                    : 'text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-800'
                  }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>

        {/* Quick Actions */}
        <div className="mt-8 px-4">
          <h3 className="text-sm font-medium text-green-600 dark:text-green-400 uppercase tracking-wide mb-4">
            การดำเนินการด่วน
          </h3>
          <div className="space-y-2">
            <button className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm">
              เรียกคิวถัดไป
            </button>
            <button className="w-full bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors text-sm">
              พักการให้บริการ
            </button>
          </div>
        </div>

        {/* Employee Info in Sidebar */}
        <div className="mt-8 px-4 py-4 border-t border-green-200 dark:border-green-700">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-600 dark:text-green-300">ออนไลน์</span>
          </div>
          <div className="text-sm text-green-600 dark:text-green-300">
            พนักงาน: <span className="font-medium">สมชาย ใจดี</span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default EmployeeSidebar;
