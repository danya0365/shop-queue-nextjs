"use client";

import { ThemeToggle } from '@/src/presentation/components/ui/ThemeToggle';
import Link from 'next/link';
import React from 'react';

interface ShopBackendHeaderProps {
  shopId: string;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

const ShopBackendHeader: React.FC<ShopBackendHeaderProps> = ({
  shopId,
  sidebarOpen,
  toggleSidebar,
}) => {
  console.log('ShopBackendHeader', { shopId, sidebarOpen });
  return (
    <header className="bg-blue-600 text-white shadow-lg">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo and Menu Button */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg text-blue-100 hover:bg-blue-700 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <Link href="/" className="text-xl sm:text-2xl font-bold text-white">
              Shop Queue
            </Link>
            <span className="hidden sm:inline text-blue-200">|</span>
            <span className="hidden sm:inline text-sm sm:text-lg font-medium text-blue-100">
              ระบบจัดการร้าน
            </span>
          </div>

          {/* Right side - Shop ID and Logout */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="hidden md:block text-sm text-blue-100">
              ร้าน ID: <span className="font-mono">{shopId}</span>
            </div>
            <ThemeToggle />
            <button className="bg-red-500 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm">
              <span className="hidden sm:inline">ออกจากระบบ</span>
              <span className="sm:hidden">ออก</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ShopBackendHeader;
