"use client";

import { ShopInfo } from "@/src/presentation/presenters/shop/BaseShopPresenter";
import { ThemeProvider } from "@/src/presentation/providers/ThemeProvider";
import React, { ReactNode, useState } from "react";
import FrontendHeader from "./components/FrontendHeader";
import FrontendSidebar from "./components/FrontendSidebar";

interface FrontendLayoutProps {
  children: ReactNode;
  shop?: ShopInfo | undefined;
}

const FrontendLayout: React.FC<FrontendLayoutProps> = ({ children, shop }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <ThemeProvider>
      <div className="flex flex-col h-screen frontend-bg">
        <FrontendHeader
          shop={shop}
          sidebarOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
        />

        <div className="flex flex-row flex-1 overflow-hidden">
          {shop && (
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
              <div className="max-w-7xl mx-auto p-4 sm:p-6 pb-24">
                {children}
              </div>
            </div>
            
            {/* Footer */}
            <footer className="frontend-footer-bg border-t frontend-footer-border mt-auto">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                <div className="text-center">
                  <p className="mb-1 text-sm frontend-footer-text">
                    © 2024 Shop Queue - ระบบจัดการคิวอัจฉริยะ
                  </p>
                  <p className="text-xs frontend-text-muted">
                    พัฒนาด้วย ❤️ เพื่อประสบการณ์ที่ดีขึ้น
                  </p>
                </div>
              </div>
            </footer>
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default FrontendLayout;
