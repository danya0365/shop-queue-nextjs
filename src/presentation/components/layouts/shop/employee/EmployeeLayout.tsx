'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode, useState } from 'react';

interface EmployeeLayoutProps {
  children: ReactNode;
  shopId: string;
}

export default function EmployeeLayout({ children, shopId }: EmployeeLayoutProps) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left side - Logo and Menu Button */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              
              <Link href="/" className="text-xl sm:text-2xl font-bold text-green-600">
                Shop Queue
              </Link>
              <span className="hidden sm:inline text-gray-400">|</span>
              <span className="hidden sm:inline text-sm sm:text-lg font-medium text-gray-700">
                ระบบพนักงาน
              </span>
            </div>
            
            {/* Right side - Status and User Info */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="hidden sm:flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">ออนไลน์</span>
              </div>
              <div className="hidden md:block text-sm text-gray-600">
                พนักงาน: <span className="font-medium">สมชาย ใจดี</span>
              </div>
              <button className="bg-red-500 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm">
                <span className="hidden sm:inline">ออกจากระบบ</span>
                <span className="sm:hidden">ออก</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex relative">
        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div 
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-64 bg-white shadow-sm min-h-screen
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          {/* Mobile Close Button */}
          <div className="lg:hidden flex justify-end p-4">
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
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
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive(item.href)
                      ? 'bg-green-50 text-green-700 border-r-2 border-green-700'
                      : 'text-gray-700 hover:bg-gray-50'
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
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
              การดำเนินการด่วน
            </h3>
            <div className="space-y-2">
              <button className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm">
                เรียกคิวถัดไป
              </button>
              <button className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm">
                พักการให้บริการ
              </button>
            </div>
          </div>

          {/* Mobile User Info */}
          <div className="lg:hidden mt-8 px-4 py-4 border-t border-gray-200">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">ออนไลน์</span>
            </div>
            <div className="text-sm text-gray-600">
              พนักงาน: <span className="font-medium">สมชาย ใจดี</span>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 w-full lg:w-auto">
          <div className="p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
