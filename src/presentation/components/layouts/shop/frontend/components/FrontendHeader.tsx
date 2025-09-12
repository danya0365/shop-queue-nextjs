"use client";

import { ThemeToggle } from "@/src/presentation/components/ui/ThemeToggle";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import React from "react";

interface FrontendHeaderProps {
  shopId: string;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

const FrontendHeader: React.FC<FrontendHeaderProps> = ({
  shopId,
  sidebarOpen,
  toggleSidebar,
}) => {
  console.log("FrontendHeader", { shopId, sidebarOpen });
  return (
    <header className="bg-purple-600 text-white shadow-lg">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo and Menu Button */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg text-purple-100 hover:bg-purple-700 transition-colors lg:hidden"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <Link href="/" className="text-xl sm:text-2xl font-bold text-white">
              Shop Queue
            </Link>
            <span className="hidden sm:inline text-purple-200">|</span>
            <span className="hidden sm:inline text-sm sm:text-lg font-medium text-purple-100">
              ร้านกาแฟดีใจ
            </span>
          </div>

          {/* Right side - Login Button */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <ThemeToggle />
            <button className="bg-white text-purple-600 px-3 sm:px-4 py-2 rounded-lg hover:bg-purple-50 transition-colors text-sm font-medium">
              <span className="hidden sm:inline">เข้าสู่ระบบ</span>
              <span className="sm:hidden">เข้าสู่ระบบ</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default FrontendHeader;
