"use client";

import { ShopInfo } from "@/src/presentation/presenters/shop/BaseShopPresenter";
import { ThemeProvider } from "@/src/presentation/providers/ThemeProvider";
import { cn } from "@/src/utils/cn";
import { Bell, Home, List } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { ReactNode, useEffect, useState } from "react";
import FrontendHeader from "./components/FrontendHeader";
import FrontendSidebar from "./components/FrontendSidebar";

interface FrontendLayoutProps {
  children: ReactNode;
  shop?: ShopInfo | undefined;
}

const NAV_ITEMS = [
  {
    name: "หน้าหลัก",
    href: (shopId: string) => `/shop/${shopId}`,
    icon: Home,
    emoji: "🏠",
    activePath: (path: string, shopId: string) => path === `/shop/${shopId}`,
  },
  {
    name: "เข้าคิว",
    href: (shopId: string) => `/shop/${shopId}/queue`,
    icon: List,
    emoji: "📝",
    activePath: (path: string, shopId: string) =>
      path.startsWith(`/shop/${shopId}/queue`),
  },
  {
    name: "สถานะคิว",
    href: (shopId: string) => `/shop/${shopId}/status`,
    icon: List,
    emoji: "⏰",
    activePath: (path: string, shopId: string) =>
      path.startsWith(`/shop/${shopId}/status`),
  },
  {
    name: "ประวัติ",
    href: (shopId: string) => `/shop/${shopId}/history`,
    icon: List,
    emoji: "📚",
    activePath: (path: string, shopId: string) =>
      path.startsWith(`/shop/${shopId}/history`),
  },
  {
    name: "แต้มสะสม",
    href: (shopId: string) => `/shop/${shopId}/rewards`,
    icon: Bell,
    emoji: "🎁",
    activePath: (path: string, shopId: string) =>
      path.startsWith(`/shop/${shopId}/rewards`),
  },
];

const FrontendLayout: React.FC<FrontendLayoutProps> = ({ children, shop }) => {
  const [sidebarOpen, setSidebarOpen] = useState(
    () => window.innerWidth > 1024
  );
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 1024);
  const pathname = usePathname();
  const shopId = shop?.id || "";

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const isActive = (item: (typeof NAV_ITEMS)[0]) => {
    return item.activePath(pathname, shopId);
  };

  return (
    <ThemeProvider>
      <div className="flex flex-col h-screen shop-frontend-bg">
        <FrontendHeader
          shop={shop}
          isShowToggleSidebarButton={!isMobile}
          sidebarOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
        />

        <div className="flex flex-row flex-1 overflow-hidden">
          {/* Desktop Sidebar */}
          {shop && !isMobile && (
            <FrontendSidebar
              shop={shop}
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
            />
          )}

          {/* Main Content */}
          <main className="flex-1 w-full lg:w-auto overflow-y-auto transition-all duration-300 relative">
            {/* Content Area */}
            <div className="min-h-full">
              <div
                className={cn(
                  "max-w-7xl mx-auto p-4 sm:p-6",
                  isMobile ? "mb-24" : "mb-6"
                )}
              >
                {children}
              </div>
            </div>

            {/* Mobile Bottom Navigation */}
            {isMobile && shop && (
              <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-40">
                <div className="flex justify-around items-center h-16">
                  {NAV_ITEMS.map((item) => {
                    const active = isActive(item);
                    return (
                      <Link
                        key={item.name}
                        href={item.href(shopId)}
                        className={cn(
                          "flex flex-col items-center justify-center flex-1 h-full",
                          "text-sm font-medium transition-colors",
                          active
                            ? "text-primary-600 dark:text-primary-400 border-t-2 border-purple-600 dark:border-purple-400"
                            : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        )}
                      >
                        <span className="text-lg mb-1">{item.emoji}</span>
                        <span className="text-xs">{item.name}</span>
                        {active && (
                          <span className="absolute bottom-0 w-1/2 h-1 bg-primary-600 dark:bg-primary-400 rounded-t-full" />
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Footer - Only show on desktop */}
            {!isMobile && (
              <footer className="shop-frontend-footer-bg border-t shop-frontend-footer-border mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                  <div className="text-center">
                    <p className="mb-1 text-sm shop-frontend-footer-text">
                      © {new Date().getFullYear()} Shop Queue -
                      ระบบจัดการคิวอัจฉริยะ
                    </p>
                    <p className="text-xs shop-frontend-text-muted">
                      พัฒนาด้วย ❤️ เพื่อประสบการณ์ที่ดีขึ้น
                    </p>
                  </div>
                </div>
              </footer>
            )}
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default FrontendLayout;
