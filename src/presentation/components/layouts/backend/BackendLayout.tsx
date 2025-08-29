"use client";

import { ThemeProvider } from "@/src/presentation/providers/ThemeProvider";
import React, { useState } from "react";
import { ThemeToggle } from "../../ui/ThemeToggle";
import BackendHeader from "./components/BackendHeader";
import BackendSidebar from "./components/BackendSidebar";

interface BackendLayoutProps {
  children: React.ReactNode;
}

const BackendLayout: React.FC<BackendLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <ThemeProvider>
      <div className="flex flex-col h-screen backend-bg">
        <BackendHeader
          sidebarOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
        />

        <div className="flex flex-1 overflow-hidden">
          <BackendSidebar sidebarOpen={sidebarOpen} />

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto p-6 transition-all duration-300 backend-text">
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

export default BackendLayout;
