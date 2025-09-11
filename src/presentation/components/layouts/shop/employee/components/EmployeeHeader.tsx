'use client';

import { useAuthStore } from '@/src/presentation/stores/auth-store';
import { LogOut, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import { EmployeeThemeToggle } from './EmployeeThemeToggle';

interface EmployeeHeaderProps {
  shopId: string;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

const EmployeeHeader: React.FC<EmployeeHeaderProps> = ({
  shopId,
  sidebarOpen,
  toggleSidebar
}) => {
  const router = useRouter();
  const { signOut } = useAuthStore();

  const handleLogout = async () => {
    await signOut();
    router.push('/');
    router.refresh(); // เพื่อให้แน่ใจว่า state ทั้งหมดถูก reset
  };

  return (
    <header className="employee-header-bg border-b employee-header-border shadow-sm z-10">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="p-2 mr-2 rounded-md employee-sidebar-hover lg:hidden"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold employee-primary">ShopQueue</span>
            <span className="ml-2 text-sm font-medium px-2 py-1 bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300 rounded">ระบบพนักงาน</span>
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex items-center space-x-2">
            <div className="w-3 h-3 employee-status-online rounded-full"></div>
            <span className="text-sm employee-text-muted">ออนไลน์</span>
          </div>
          <div className="hidden md:block text-sm employee-text-muted">
            พนักงาน: <span className="font-medium employee-primary">สมชาย ใจดี</span>
          </div>
          <EmployeeThemeToggle />
          <Link
            href="/"
            className="flex items-center text-sm employee-text-muted employee-primary-hover"
          >
            <span>กลับไปยังเว็บไซต์</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center text-sm employee-text-muted employee-danger-hover cursor-pointer"
          >
            <LogOut size={18} className="mr-1" />
            <span>ออกจากระบบ</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default EmployeeHeader;
