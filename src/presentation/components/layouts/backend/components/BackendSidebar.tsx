'use client';

import { cn } from '@/src/presentation/utils/tailwind';
import {
  LayoutDashboard,
  Settings
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

interface BackendSidebarProps {
  sidebarOpen: boolean;
}

const BackendSidebar: React.FC<BackendSidebarProps> = ({ sidebarOpen }) => {
  const pathname = usePathname();

  const navItems = [
    { href: '/backend', label: 'แดชบอร์ด', icon: LayoutDashboard },
    { href: '/backend/settings', label: 'ตั้งค่า', icon: Settings },
  ];

  return (
    <aside
      className={cn(
        "transition-all duration-300 ease-in-out z-20",
        sidebarOpen ? "w-64" : "w-0 lg:w-16",
        "fixed lg:static h-full overflow-hidden"
      )}
      style={{
        backgroundColor: 'var(--backend-sidebar-bg)',
        borderRight: '1px solid var(--backend-sidebar-border)'
      }}
    >
      <div className="h-full overflow-y-auto">
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2 rounded-md transition-colors",
                  isActive
                    ? "text-primary"
                    : "hover:text-primary hover:bg-backend-sidebar-hover",
                  !sidebarOpen && "lg:justify-center"
                )}
                style={{
                  backgroundColor: isActive ? 'var(--backend-sidebar-active)' : 'transparent',
                  color: isActive ? 'var(--primary)' : 'var(--foreground)'
                }}
              >
                <Icon size={20} className={cn("flex-shrink-0", !sidebarOpen && "lg:mx-0")} />
                <span className={cn(
                  "ml-3 font-medium",
                  !sidebarOpen && "lg:hidden"
                )}>
                  {item.label}
                </span>
                {isActive && (
                  <div className="absolute left-0 w-1 h-8 bg-blue-600 dark:bg-blue-400 rounded-r-full" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default BackendSidebar;
