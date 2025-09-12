"use client";

import { ShopInfo } from "@/src/presentation/presenters/shop/BaseShopPresenter";
import { ThemeProvider } from "@/src/presentation/providers/ThemeProvider";
import React, { ReactNode, useState } from "react";
import ShopBackendHeader from "./components/ShopBackendHeader";
import ShopBackendSidebar from "./components/ShopBackendSidebar";

interface BackendLayoutProps {
  children: ReactNode;
  shop?: ShopInfo | undefined;
}

const BackendLayout: React.FC<BackendLayoutProps> = ({ children, shop }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <ThemeProvider>
      <div className="flex flex-col h-screen shop-backend-bg">
        <ShopBackendHeader
          shop={shop}
          sidebarOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
        />

        <div className="flex flex-1 overflow-hidden">
          {shop && <ShopBackendSidebar shop={shop} sidebarOpen={sidebarOpen} />}

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto p-6 transition-all duration-300 shop-backend-text">
            {children}
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default BackendLayout;
