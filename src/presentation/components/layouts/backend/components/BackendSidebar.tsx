'use client';

import { cn } from '@/src/presentation/utils/tailwind';
import {
  Clock,
  CreditCard,
  FolderOpen,
  LayoutDashboard,
  Shield,
  Store,
  UserCheck,
  Users
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
    { href: '/backend/auth-users', label: 'จัดการผู้ใช้งาน', icon: Shield },
    { href: '/backend/profiles', label: 'จัดการโปรไฟล์', icon: UserCheck },
    { href: '/backend/shops', label: 'จัดการร้านค้า', icon: Store },
    { href: '/backend/queues', label: 'จัดการคิว', icon: Clock },
    { href: '/backend/services', label: 'จัดการบริการ', icon: Clock },
    { href: '/backend/customers', label: 'จัดการลูกค้า', icon: Users },
    { href: '/backend/employees', label: 'จัดการพนักงาน', icon: UserCheck },
    { href: '/backend/categories', label: 'จัดการหมวดหมู่', icon: FolderOpen },
    { href: '/backend/payments', label: 'จัดการการชำระเงิน', icon: CreditCard },
  ];

  return (
    <aside
      className={cn(
        "transition-all duration-300 ease-in-out z-20 backend-sidebar-bg border-r backend-sidebar-border",
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
                    ? "backend-sidebar-active backend-primary"
                    : "backend-text backend-sidebar-hover backend-primary-hover",
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
                  <div className="absolute left-0 w-1 h-8 backend-primary rounded-r-full" />
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
