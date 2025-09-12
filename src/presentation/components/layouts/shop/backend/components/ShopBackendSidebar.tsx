"use client";

import { ShopInfo } from "@/src/presentation/presenters/shop/BaseShopPresenter";
import { cn } from "@/src/presentation/utils/tailwind";
import {
  BarChart3,
  Clock,
  CreditCard,
  Gift,
  Image,
  LayoutDashboard,
  Scissors,
  Settings,
  Store,
  UserCheck,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface ShopBackendSidebarProps {
  shop: ShopInfo;
  sidebarOpen: boolean;
}

const ShopBackendSidebar: React.FC<ShopBackendSidebarProps> = ({
  shop,
  sidebarOpen,
}) => {
  const pathname = usePathname();

  const navItems = [
    {
      href: `/shop/${shop.id}/backend`,
      label: "แดชบอร์ด",
      icon: LayoutDashboard,
    },
    { href: `/shop/${shop.id}/backend/queue`, label: "จัดการคิว", icon: Clock },
    {
      href: `/shop/${shop.id}/backend/services`,
      label: "จัดการบริการ",
      icon: Scissors,
    },
    {
      href: `/shop/${shop.id}/backend/customers`,
      label: "จัดการลูกค้า",
      icon: Users,
    },
    {
      href: `/shop/${shop.id}/backend/employees`,
      label: "จัดการพนักงาน",
      icon: UserCheck,
    },
    {
      href: `/shop/${shop.id}/backend/departments`,
      label: "จัดการแผนก",
      icon: Store,
    },
    {
      href: `/shop/${shop.id}/backend/payments`,
      label: "การชำระเงิน",
      icon: CreditCard,
    },
    {
      href: `/shop/${shop.id}/backend/rewards`,
      label: "จัดการรางวัล",
      icon: Gift,
    },
    {
      href: `/shop/${shop.id}/backend/promotions`,
      label: "จัดการโปรโมชั่น",
      icon: Gift,
    },
    {
      href: `/shop/${shop.id}/backend/opening-hours`,
      label: "เวลาทำการ",
      icon: Clock,
    },
    {
      href: `/shop/${shop.id}/backend/posters`,
      label: "โปสเตอร์",
      icon: Image,
    },
    {
      href: `/shop/${shop.id}/backend/analytics`,
      label: "รายงาน",
      icon: BarChart3,
    },
    {
      href: `/shop/${shop.id}/backend/shop-settings`,
      label: "ตั้งค่าร้านค้า",
      icon: Settings,
    },
  ];

  return (
    <aside
      className={cn(
        "transition-all duration-300 ease-in-out z-20 shop-backend-sidebar-bg border-r shop-backend-sidebar-border",
        sidebarOpen ? "w-64" : "w-0 lg:w-16",
        "fixed lg:static h-full overflow-hidden"
      )}
    >
      <div className="h-full overflow-y-auto">
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2 rounded-md transition-colors",
                  isActive
                    ? "shop-backend-sidebar-active shop-backend-primary"
                    : "shop-backend-text shop-backend-sidebar-hover shop-backend-primary-hover",
                  !sidebarOpen && "lg:justify-center"
                )}
              >
                <Icon
                  size={20}
                  className={cn("flex-shrink-0", !sidebarOpen && "lg:mx-0")}
                />
                <span
                  className={cn(
                    "ml-3 font-medium",
                    !sidebarOpen && "lg:hidden"
                  )}
                >
                  {item.label}
                </span>
                {isActive && (
                  <div className="absolute left-0 w-1 h-8 shop-backend-primary rounded-r-full" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default ShopBackendSidebar;
