"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

interface FrontendSidebarProps {
  shopId: string;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const FrontendSidebar: React.FC<FrontendSidebarProps> = ({
  shopId,
  sidebarOpen,
  setSidebarOpen,
}) => {
  const pathname = usePathname();

  const navigationItems = [
    { href: `/shop/${shopId}`, label: 'หน้าหลัก', icon: '🏠' },
    { href: `/shop/${shopId}/queue`, label: 'เข้าคิว', icon: '📝' },
    { href: `/shop/${shopId}/status`, label: 'สถานะคิว', icon: '⏰' },
    { href: `/shop/${shopId}/history`, label: 'ประวัติ', icon: '📚' },
    { href: `/shop/${shopId}/rewards`, label: 'แต้มสะสม', icon: '🎁' },
  ];

  const isActive = (href: string) => {
    if (href === `/shop/${shopId}`) {
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
        w-64 bg-purple-50 dark:bg-purple-900 shadow-sm min-h-screen
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Mobile Close Button */}
        <div className="lg:hidden flex justify-end p-4">
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-lg text-purple-600 hover:bg-purple-100 transition-colors"
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
                    ? 'bg-purple-100 dark:bg-purple-800 text-purple-700 dark:text-purple-200 border-r-2 border-purple-700'
                    : 'text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-800'
                  }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>

        {/* Shop Info in Sidebar */}
        <div className="mt-8 px-4 py-4 border-t border-purple-200 dark:border-purple-700">
          <div className="text-sm text-purple-600 dark:text-purple-300">
            <div className="font-medium mb-1">ร้านกาแฟดีใจ</div>
            <div className="text-xs opacity-75">เปิดทุกวัน 08:00 - 20:00</div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default FrontendSidebar;
