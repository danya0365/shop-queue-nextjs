"use client";

import { ThemeProvider } from "@/src/presentation/providers/ThemeProvider";
import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

const FrontendLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <ThemeProvider>
      <div
        className="flex flex-col min-h-screen"
      >
        <main className="flex-1">
          {children}
        </main>
      </div>
    </ThemeProvider>
  );
};

export default FrontendLayout;
