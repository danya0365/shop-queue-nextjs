"use client";

import { ThemeProvider } from "@/src/presentation/providers/ThemeProvider";
import React, { ReactNode, useState } from "react";
import { ThemeToggle } from "../../../ui/ThemeToggle";
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
      <div className="flex flex-col h-screen">
        <EmployeeHeader
          shopId={shopId}
          sidebarOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
        />

        <div className="flex flex-1 overflow-hidden">
          <EmployeeSidebar
            shopId={shopId}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />

          {/* Main Content */}
          <main className="flex-1 w-full lg:w-auto overflow-y-auto p-4 sm:p-6 transition-all duration-300">
            <div className="flex justify-end mb-4">
              <ThemeToggle />
            </div>
            {children}
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default EmployeeLayout;
