"use client";

import { ThemeProvider } from "@/src/presentation/providers/ThemeProvider";
import React from "react";
import { FrontendFooter } from "./components/FrontendFooter";
import { FrontendHeader } from "./components/FrontendHeader";

interface LayoutProps {
  children: React.ReactNode;
}

const FrontendLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <ThemeProvider>
      <div className="flex flex-col min-h-screen bg-background">
        <FrontendHeader />
        <main className="flex-1 pt-0 pb-0">
          {children}
        </main>
        <FrontendFooter />
      </div>
    </ThemeProvider>
  );
};

export default FrontendLayout;
