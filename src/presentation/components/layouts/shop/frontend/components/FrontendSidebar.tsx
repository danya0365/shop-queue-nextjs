"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface FrontendSidebarProps {
  shopId: string;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const FrontendSidebar: React.FC<FrontendSidebarProps> = ({
  shopId,
  sidebarOpen,
  setSidebarOpen,
}) => {
  const pathname = usePathname();

  const navigationItems = [
    { href: `/shop/${shopId}`, label: "หน้าหลัก", icon: "🏠" },
    { href: `/shop/${shopId}/queue`, label: "เข้าคิว", icon: "📝" },
    { href: `/shop/${shopId}/status`, label: "สถานะคิว", icon: "⏰" },
    { href: `/shop/${shopId}/history`, label: "ประวัติ", icon: "📚" },
    { href: `/shop/${shopId}/rewards`, label: "แต้มสะสม", icon: "🎁" },
  ];

  const isActive = (href: string) => {
    if (href === `/shop/${shopId}`) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 frontend-overlay z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-64 frontend-sidebar-bg shadow-sm h-full overflow-y-auto
        flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        {/* Mobile Close Button */}
        <div className="lg:hidden flex justify-end p-4 flex-none">
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-lg frontend-sidebar-text-muted frontend-sidebar-hover transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="h-full overflow-y-auto flex-1">
          <div className="p-4 space-y-2">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.href)
                    ? "frontend-sidebar-active"
                    : "frontend-sidebar-text frontend-sidebar-hover"
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>

        {/* Shop Info in Sidebar */}
        <div className="p-4 border-t frontend-sidebar-border flex-none">
          <div className="text-sm frontend-sidebar-text-muted">
            <div className="font-medium mb-1">ร้านกาแฟดีใจ</div>
            <div className="text-xs opacity-75">เปิดทุกวัน 08:00 - 20:00</div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default FrontendSidebar;
