"use client";

import { ShopInfo } from "@/src/presentation/presenters/shop/BaseShopPresenter";
import { useAuthStore } from "@/src/presentation/stores/auth-store";
import { LogOut, Menu, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { ShopBackendThemeToggle } from "./ShopBackendThemeToggle";

interface ShopBackendHeaderProps {
  shop: ShopInfo | undefined;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

const ShopBackendHeader: React.FC<ShopBackendHeaderProps> = ({
  shop,
  sidebarOpen,
  toggleSidebar,
}) => {
  const router = useRouter();
  const { signOut } = useAuthStore();

  const handleLogout = async () => {
    await signOut();
    router.push("/");
    router.refresh(); // เพื่อให้แน่ใจว่า state ทั้งหมดถูก reset
  };

  return (
    <header className="shop-backend-header-bg border-b shop-backend-header-border shadow-sm z-10">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="p-2 mr-2 rounded-md shop-backend-sidebar-hover lg:hidden"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold shop-backend-primary">
              ShopQueue
            </span>
            <span className="ml-2 text-sm font-medium px-2 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-300 rounded">
              ระบบจัดการร้าน
            </span>
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <div className="hidden md:block text-sm shop-backend-text-muted">
            ร้าน :
            <span className="shop-backend-primary">{shop?.name || ""}</span>
          </div>
          <ShopBackendThemeToggle />
          <Link
            href="/"
            className="flex items-center text-sm shop-backend-text-muted shop-backend-primary-hover"
          >
            <span>กลับไปยังเว็บไซต์</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center text-sm shop-backend-text-muted shop-backend-danger-hover cursor-pointer"
          >
            <LogOut size={18} className="mr-1" />
            <span>ออกจากระบบ</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default ShopBackendHeader;
