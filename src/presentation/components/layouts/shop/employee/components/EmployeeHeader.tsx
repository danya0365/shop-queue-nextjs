"use client";

import Link from 'next/link';
import React from 'react';

interface EmployeeHeaderProps {
  shopId: string;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

const EmployeeHeader: React.FC<EmployeeHeaderProps> = ({
  shopId,
  sidebarOpen,
  toggleSidebar,
}) => {
  return (
    <header className="bg-green-600 text-white shadow-lg">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo and Menu Button */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg text-green-100 hover:bg-green-700 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <Link href="/" className="text-xl sm:text-2xl font-bold text-white">
              Shop Queue
            </Link>
            <span className="hidden sm:inline text-green-200">|</span>
            <span className="hidden sm:inline text-sm sm:text-lg font-medium text-green-100">
              ระบบพนักงาน
            </span>
          </div>
          
          {/* Right side - Status and User Info */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="hidden sm:flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-300 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-100">ออนไลน์</span>
            </div>
            <div className="hidden md:block text-sm text-green-100">
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
  );
};

export default EmployeeHeader;
