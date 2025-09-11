"use client";

import { ThemeProvider } from "@/src/presentation/providers/ThemeProvider";
import React, { ReactNode, useState } from "react";
import EmployeeHeader from "./components/EmployeeHeader";
import EmployeeSidebar from "./components/EmployeeSidebar";

interface EmployeeLayoutProps {
  children: ReactNode;
  shopId: string;
}

const EmployeeLayout: React.FC<EmployeeLayoutProps> = ({ children, shopId }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <ThemeProvider>
      <div className="flex flex-col h-screen employee-bg">
        <EmployeeHeader
          shopId={shopId}
          sidebarOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
        />

        <div className="flex flex-1 overflow-hidden">
          <EmployeeSidebar shopId={shopId} sidebarOpen={sidebarOpen} />

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto p-6 transition-all duration-300 employee-text">
            {children}
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default EmployeeLayout;
