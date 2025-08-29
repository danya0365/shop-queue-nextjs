'use client';

import { useAuthStore } from '@/src/presentation/stores/auth-store';
import { LogOut, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';

interface BackendHeaderProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

const BackendHeader: React.FC<BackendHeaderProps> = ({ 
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
    <header className="backend-header-bg border-b backend-header-border shadow-sm z-10">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center">
          <button 
            onClick={toggleSidebar}
            className="p-2 mr-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold backend-primary">ShopQueue</span>
            <span className="ml-2 text-sm font-medium px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 rounded">แผงควบคุม</span>
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <Link 
            href="/" 
            className="flex items-center text-sm backend-text-muted backend-primary-hover"
          >
            <span>กลับไปยังเว็บไซต์</span>
          </Link>
          <button 
            onClick={handleLogout} 
            className="flex items-center text-sm backend-text-muted backend-danger-hover cursor-pointer"
          >
            <LogOut size={18} className="mr-1" />
            <span>ออกจากระบบ</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default BackendHeader;
