"use client";

import { ThemeProvider } from "@/src/presentation/providers/ThemeProvider";
import React, { ReactNode, useState } from "react";
import ShopBackendHeader from "./components/ShopBackendHeader";
import ShopBackendSidebar from "./components/ShopBackendSidebar";

interface BackendLayoutProps {
  children: ReactNode;
  shopId: string;
}

const BackendLayout: React.FC<BackendLayoutProps> = ({ children, shopId }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <ThemeProvider>
      <div className="flex flex-col h-screen">
        <ShopBackendHeader
          shopId={shopId}
          sidebarOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
        />

        <div className="flex flex-1 overflow-hidden">
          <ShopBackendSidebar
            shopId={shopId}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />

          {/* Main Content */}
          <main className="flex-1 w-full lg:w-auto overflow-y-auto p-4 sm:p-6 transition-all duration-300">
            {children}
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default BackendLayout;
