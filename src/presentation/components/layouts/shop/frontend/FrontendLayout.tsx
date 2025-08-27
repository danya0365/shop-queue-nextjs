"use client";

import { ThemeProvider } from "@/src/presentation/providers/ThemeProvider";
import React, { ReactNode, useState } from "react";
import FrontendHeader from "./components/FrontendHeader";
import FrontendSidebar from "./components/FrontendSidebar";

interface FrontendLayoutProps {
  children: ReactNode;
  shopId: string;
}

const FrontendLayout: React.FC<FrontendLayoutProps> = ({ children, shopId }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <ThemeProvider>
      <div className="flex flex-col h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900">
        <FrontendHeader
          shopId={shopId}
          sidebarOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
        />

        <div className="flex flex-1 overflow-hidden">
          <FrontendSidebar
            shopId={shopId}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />

          {/* Main Content */}
          <main className="flex-1 w-full lg:w-auto overflow-y-auto p-4 sm:p-6 transition-all duration-300">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>

        {/* Footer */}
        <footer className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-t border-purple-200 dark:border-purple-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <div className="text-center text-gray-600 dark:text-gray-300">
              <p className="mb-1 text-sm">© 2024 Shop Queue - ระบบจัดการคิวอัจฉริยะ</p>
              <p className="text-xs">พัฒนาด้วย ❤️ เพื่อประสบการณ์ที่ดีขึ้น</p>
            </div>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
};

export default FrontendLayout;
