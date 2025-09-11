'use client';

import { cn } from '@/src/presentation/utils/tailwind';
import {
  Home,
  Clock,
  Bell,
  CreditCard,
  History
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

interface EmployeeSidebarProps {
  shopId: string;
  sidebarOpen: boolean;
}

const EmployeeSidebar: React.FC<EmployeeSidebarProps> = ({ 
  shopId, 
  sidebarOpen 
}) => {
  const pathname = usePathname();

  const navItems = [
    { href: `/shop/${shopId}/employee`, label: 'หน้าหลัก', icon: Home },
    { href: `/shop/${shopId}/employee/queue`, label: 'จัดการคิว', icon: Clock },
    { href: `/shop/${shopId}/employee/serve`, label: 'ให้บริการ', icon: Bell },
    { href: `/shop/${shopId}/employee/payment`, label: 'ชำระเงิน', icon: CreditCard },
    { href: `/shop/${shopId}/employee/history`, label: 'ประวัติ', icon: History },
  ];

  return (
    <aside
      className={cn(
        "transition-all duration-300 ease-in-out z-20 employee-sidebar-bg border-r employee-sidebar-border",
        sidebarOpen ? "w-64" : "w-0 lg:w-16",
        "fixed lg:static h-full overflow-hidden"
      )}
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
                    ? "employee-sidebar-active employee-primary"
                    : "employee-text employee-sidebar-hover employee-primary-hover",
                  !sidebarOpen && "lg:justify-center"
                )}
              >
                <Icon size={20} className={cn("flex-shrink-0", !sidebarOpen && "lg:mx-0")} />
                <span className={cn(
                  "ml-3 font-medium",
                  !sidebarOpen && "lg:hidden"
                )}>
                  {item.label}
                </span>
                {isActive && (
                  <div className="absolute left-0 w-1 h-8 employee-primary rounded-r-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Quick Actions - Only show when sidebar is open */}
        {sidebarOpen && (
          <div className="mt-8 px-4">
            <h3 className="text-sm font-medium employee-text-muted uppercase tracking-wide mb-4">
              การดำเนินการด่วน
            </h3>
            <div className="space-y-2">
              <button className="w-full employee-button-primary px-4 py-2 rounded-lg transition-colors text-sm">
                เรียกคิวถัดไป
              </button>
              <button className="w-full employee-button-secondary px-4 py-2 rounded-lg transition-colors text-sm">
                พักการให้บริการ
              </button>
            </div>
          </div>
        )}

        {/* Employee Status - Only show when sidebar is open */}
        {sidebarOpen && (
          <div className="mt-8 px-4 py-4 border-t employee-sidebar-border">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-3 h-3 employee-status-online rounded-full"></div>
              <span className="text-sm employee-text-muted">ออนไลน์</span>
            </div>
            <div className="text-sm employee-text-muted">
              พนักงาน: <span className="font-medium employee-primary">สมชาย ใจดี</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default EmployeeSidebar;
