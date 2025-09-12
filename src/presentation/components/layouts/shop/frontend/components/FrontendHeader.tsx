"use client";

import { FrontendThemeToggle } from "./FrontendThemeToggle";
import { ShopInfo } from "@/src/presentation/presenters/shop/BaseShopPresenter";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useAuthStore } from "@/src/presentation/stores/auth-store";
import { useProfileStore } from "@/src/presentation/stores/profile-store";
import { FrontendProfileMenu } from "./FrontendProfileMenu";

interface FrontendHeaderProps {
  shop: ShopInfo | undefined;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

const FrontendHeader: React.FC<FrontendHeaderProps> = ({
  shop,
  sidebarOpen,
  toggleSidebar,
}) => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { authAccount, signOut } = useAuthStore();
  const { activeProfile } = useProfileStore();

  const handleLogout = async () => {
    await signOut();
    setIsMenuOpen(false);
    router.push("/");
    router.refresh(); // เพื่อให้แน่ใจว่า state ทั้งหมดถูก reset
  };

  const toggleMobileMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <header className="frontend-header-bg frontend-header-text shadow-lg">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left side - Logo and Menu Button */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-lg frontend-header-text-light frontend-header-hover transition-colors lg:hidden"
              >
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>

              <Link
                href="/"
                className="text-xl sm:text-2xl font-bold frontend-header-text"
              >
                Shop Queue
              </Link>
              <span className="hidden sm:inline frontend-header-text-muted">
                |
              </span>
              <span className="hidden sm:inline text-sm sm:text-lg font-medium frontend-header-text-light">
                {shop?.name || "ไม่พบข้อมูลร้านค้า"}
              </span>
            </div>

            {/* Right side - Auth & Theme Toggle */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <FrontendThemeToggle />
              
              {/* Desktop Auth */}
              <div className="hidden md:flex items-center space-x-4">
                {activeProfile ? (
                  <FrontendProfileMenu profile={activeProfile} onLogout={handleLogout} />
                ) : (
                  <>
                    <Link
                      href="/auth/login"
                      className="frontend-button-primary px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                    >
                      เข้าสู่ระบบ
                    </Link>
                    <Link
                      href="/auth/register"
                      className="frontend-button-primary px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                    >
                      สมัครใช้งาน
                    </Link>
                  </>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={toggleMobileMenu}
                className="md:hidden p-2 rounded-lg frontend-header-text-light frontend-header-hover transition-colors"
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden frontend-header-bg border-t frontend-sidebar-border">
          <div className="px-4 py-3 space-y-3">
            {authAccount && activeProfile ? (
              <>
                {/* Mobile Profile Info */}
                <div className="flex items-center space-x-3 p-3 frontend-sidebar-bg rounded-lg">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                    {activeProfile.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium frontend-header-text">{activeProfile.name}</p>
                    <p className="text-xs frontend-header-text-muted">@{activeProfile.username}</p>
                  </div>
                </div>

                {/* Mobile Profile Menu Items */}
                <div className="space-y-1">
                  <Link
                    href="/account"
                    className="flex items-center px-3 py-2 text-sm frontend-header-text frontend-header-hover rounded-md transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    จัดการโปรไฟล์
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-3 py-2 text-sm frontend-text-danger hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                  >
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    ออกจากระบบ
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="block w-full px-4 py-2 text-center frontend-button-primary rounded-lg transition-colors text-sm font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  เข้าสู่ระบบ
                </Link>
                <Link
                  href="/auth/register"
                  className="block w-full px-4 py-2 text-center frontend-button-primary rounded-lg transition-colors text-sm font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  สมัครใช้งาน
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default FrontendHeader;
