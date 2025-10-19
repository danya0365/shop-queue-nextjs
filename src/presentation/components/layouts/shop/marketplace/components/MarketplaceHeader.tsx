"use client";

import { MarketplaceThemeToggle } from "@/src/presentation/components/common/ThemeToggle";
import { useLoginRedirect } from "@/src/presentation/hooks/login-redirect";
import { useAuthStore } from "@/src/presentation/stores/auth-store";
import { useProfileStore } from "@/src/presentation/stores/profile-store";
import {
  Bell,
  Heart,
  LogIn,
  Menu,
  Search,
  ShoppingBag,
  User,
  UserPlus,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import { NavigationLink } from "../ShopMarketplaceLayout";

interface MarketplaceHeaderProps {
  navigationLinks: NavigationLink[];
  onSearch?: (query: string) => void;
  searchQuery?: string;
}

const MarketplaceHeader: React.FC<MarketplaceHeaderProps> = ({
  navigationLinks,
  onSearch,
  searchQuery = "",
}) => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(searchQuery);
  const { authAccount, signOut } = useAuthStore();
  const { activeProfile } = useProfileStore();
  const { saveAndRedirect } = useLoginRedirect();
  const pathname = usePathname();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchValue);
    }
  };

  const handleLogout = async () => {
    await signOut();
    setIsMenuOpen(false);
    router.push("/");
    router.refresh();
  };

  return (
    <>
      <header className="marketplace-header-bg sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="text-2xl font-bold marketplace-text-primary"
              >
                Shop Queue
              </Link>
              <span className="hidden sm:inline marketplace-text-muted">|</span>
              <span className="hidden sm:inline text-lg font-medium marketplace-text-secondary">
                ตลาดร้านค้า
              </span>
            </div>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <form onSubmit={handleSearch} className="w-full relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="ค้นหาร้านค้า, บริการ, หรือสถานที่..."
                    className="w-full pl-10 pr-4 py-2.5 marketplace-search-bg marketplace-search-focus rounded-lg text-sm"
                  />
                </div>
              </form>
            </div>

            {/* Navigation - Desktop */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navigationLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="marketplace-nav-link"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-3">
              {/* Theme Toggle */}
              <MarketplaceThemeToggle />

              {/* User Actions - Desktop */}
              <div className="hidden md:flex items-center space-x-3">
                {authAccount && activeProfile ? (
                  <>
                    {/* Notifications */}
                    <button className="p-2 marketplace-header-hover rounded-lg transition-colors relative">
                      <Bell className="w-5 h-5 marketplace-text-secondary" />
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                    </button>

                    {/* Favorites */}
                    <button className="p-2 marketplace-header-hover rounded-lg transition-colors">
                      <Heart className="w-5 h-5 marketplace-text-secondary" />
                    </button>

                    {/* Profile Menu */}
                    <div className="relative group">
                      <button className="flex items-center space-x-2 p-2 marketplace-header-hover rounded-lg transition-colors">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {activeProfile.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-medium marketplace-text-primary">
                          {activeProfile.name}
                        </span>
                      </button>

                      {/* Dropdown Menu */}
                      <div className="absolute right-0 mt-2 w-48 marketplace-card shadow-lg rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                        <div className="py-2">
                          <Link
                            href="/switch-profile"
                            className="flex items-center px-4 py-2 text-sm marketplace-text-secondary hover:bg-slate-50 dark:hover:bg-slate-700"
                          >
                            <User className="w-4 h-4 mr-3" />
                            สลับโปรไฟล์
                          </Link>
                          <Link
                            href="/shop/customer/dashboard"
                            className="flex items-center px-4 py-2 text-sm marketplace-text-secondary hover:bg-slate-50 dark:hover:bg-slate-700"
                          >
                            <ShoppingBag className="w-4 h-4 mr-3" />
                            แดชบอร์ดสำหรับลูกค้า
                          </Link>
                          <Link
                            href="/shop/dashboard/shops"
                            className="flex items-center px-4 py-2 text-sm marketplace-text-secondary hover:bg-slate-50 dark:hover:bg-slate-700"
                          >
                            <ShoppingBag className="w-4 h-4 mr-3" />
                            แดชบอร์ดสำหรับร้านค้า
                          </Link>
                          <hr className="my-2 border-slate-200 dark:border-slate-700" />
                          <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <X className="w-4 h-4 mr-3" />
                            ออกจากระบบ
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => saveAndRedirect(pathname, "/shop/login")}
                      className="flex items-center space-x-2 marketplace-button-secondary px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>เข้าสู่ระบบ</span>
                    </button>
                    <Link
                      href="/shop/register"
                      className="flex items-center space-x-2 marketplace-button-primary px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>สมัครใช้งาน</span>
                    </Link>
                  </>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 marketplace-header-hover rounded-lg transition-colors"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6 marketplace-text-secondary" />
                ) : (
                  <Menu className="w-6 h-6 marketplace-text-secondary" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="md:hidden pb-4">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="ค้นหาร้านค้า, บริการ, หรือสถานที่..."
                className="w-full pl-10 pr-4 py-2.5 marketplace-search-bg marketplace-search-focus rounded-lg text-sm"
              />
            </form>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Mobile Side Menu */}
      <div
        className={`fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-white dark:bg-gray-900 shadow-xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Menu Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="text-xl font-bold marketplace-text-primary">
                Shop Queue
              </div>
              <span className="text-sm marketplace-text-muted">
                ตลาดร้านค้า
              </span>
            </div>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 marketplace-text-secondary" />
            </button>
          </div>

          {/* Menu Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              {/* Mobile Navigation */}
              <nav className="space-y-1 mb-6">
                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                  เมนูหลัก
                </div>
                {navigationLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center px-3 py-3 marketplace-text-primary hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors group"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="font-medium">{link.label}</span>
                  </Link>
                ))}
              </nav>

              {/* Mobile User Actions */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                {activeProfile ? (
                  <div className="space-y-3">
                    <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                      บัญชีผู้ใช้
                    </div>

                    {/* User Profile Card */}
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        {activeProfile.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium marketplace-text-primary truncate">
                          {activeProfile.name}
                        </p>
                        <p className="text-sm marketplace-text-muted truncate">
                          @{activeProfile.username}
                        </p>
                      </div>
                    </div>

                    {/* User Menu Items */}
                    <div className="space-y-1">
                      <Link
                        href="/switch-profile"
                        className="flex items-center px-3 py-3 marketplace-text-secondary hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <User className="w-5 h-5 mr-3" />
                        <span>สลับโปรไฟล์</span>
                      </Link>

                      <Link
                        href="/shop/customer/dashboard"
                        className="flex items-center px-3 py-3 marketplace-text-secondary hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <ShoppingBag className="w-5 h-5 mr-3" />
                        <span>แดชบอร์ดสำหรับลูกค้า</span>
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-3 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5 mr-3" />
                        <span>ออกจากระบบ</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                      เข้าสู่ระบบ
                    </div>

                    <button
                      onClick={() => {
                        saveAndRedirect(pathname, "/shop/login");
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center justify-center space-x-2 marketplace-button-secondary w-full px-4 py-3 rounded-lg transition-colors font-medium"
                    >
                      <LogIn className="w-5 h-5" />
                      <span>เข้าสู่ระบบ</span>
                    </button>

                    <Link
                      href="/shop/register"
                      className="flex items-center justify-center space-x-2 marketplace-button-primary w-full px-4 py-3 rounded-lg transition-colors font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <UserPlus className="w-5 h-5" />
                      <span>สมัครใช้งาน</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Menu Footer */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm marketplace-text-muted">เปลี่ยนธีม</span>
              <MarketplaceThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MarketplaceHeader;
