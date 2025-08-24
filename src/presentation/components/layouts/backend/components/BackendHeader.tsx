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
    <header style={{
      backgroundColor: 'var(--backend-header-bg)',
      borderBottom: '1px solid var(--backend-header-border)',
    }} className="shadow-sm z-10">
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
            <span className="text-xl font-bold text-blue-600 dark:text-blue-400">FilmNest</span>
            <span className="ml-2 text-sm font-medium px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 rounded">แผงควบคุม</span>
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <Link 
            href="/" 
            className="flex items-center text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
          >
            <span>กลับไปยังเว็บไซต์</span>
          </Link>
          <button 
            onClick={handleLogout} 
            className="flex items-center text-sm text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 cursor-pointer"
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
