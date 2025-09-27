"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { 
  Search, 
  Menu, 
  X, 
  User, 
  ShoppingBag, 
  Heart, 
  Bell,
  Sun,
  Moon,
  LogIn,
  UserPlus
} from "lucide-react";
import { useAuthStore } from "@/src/presentation/stores/auth-store";
import { useProfileStore } from "@/src/presentation/stores/profile-store";
import { useTheme } from "next-themes";

interface MarketplaceHeaderProps {
  onSearch?: (query: string) => void;
  searchQuery?: string;
}

const MarketplaceHeader: React.FC<MarketplaceHeaderProps> = ({
  onSearch,
  searchQuery = ""
}) => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(searchQuery);
  const { authAccount, signOut } = useAuthStore();
  const { activeProfile } = useProfileStore();
  const { theme, setTheme } = useTheme();

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

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const navigationLinks = [
    { href: "/", label: "หน้าแรก" },
    { href: "/shop/(marketplace)", label: "ตลาดร้านค้า" },
    { href: "/categories", label: "หมวดหมู่" },
    { href: "/about", label: "เกี่ยวกับเรา" },
    { href: "/contact", label: "ติดต่อเรา" },
  ];

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
              <button
                onClick={toggleTheme}
                className="p-2 marketplace-header-hover rounded-lg transition-colors"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 marketplace-text-secondary" />
                ) : (
                  <Moon className="w-5 h-5 marketplace-text-secondary" />
                )}
              </button>

              {/* User Actions - Desktop */}
              <div className="hidden md:flex items-center space-x-3">
                {activeProfile ? (
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
                            href="/account"
                            className="flex items-center px-4 py-2 text-sm marketplace-text-secondary hover:bg-slate-50 dark:hover:bg-slate-700"
                          >
                            <User className="w-4 h-4 mr-3" />
                            จัดการโปรไฟล์
                          </Link>
                          <Link
                            href="/orders"
                            className="flex items-center px-4 py-2 text-sm marketplace-text-secondary hover:bg-slate-50 dark:hover:bg-slate-700"
                          >
                            <ShoppingBag className="w-4 h-4 mr-3" />
                            ประวัติการใช้งาน
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
                    <Link
                      href="/auth/login"
                      className="flex items-center space-x-2 marketplace-button-secondary px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>เข้าสู่ระบบ</span>
                    </Link>
                    <Link
                      href="/auth/register"
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

      {/* Mobile Menu */}
      {isMenuOpen && (
        <>
          <div 
            className="marketplace-mobile-menu-overlay"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="marketplace-mobile-menu">
            <div className="p-4">
              {/* Mobile Navigation */}
              <nav className="space-y-2 mb-6">
                {navigationLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block px-4 py-3 marketplace-text-primary hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              {/* Mobile User Actions */}
              <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                {activeProfile ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3 p-4 marketplace-card rounded-lg">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        {activeProfile.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium marketplace-text-primary">{activeProfile.name}</p>
                        <p className="text-sm marketplace-text-muted">@{activeProfile.username}</p>
                      </div>
                    </div>
                    
                    <Link
                      href="/account"
                      className="flex items-center px-4 py-3 marketplace-text-secondary hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="w-5 h-5 mr-3" />
                      จัดการโปรไฟล์
                    </Link>
                    
                    <Link
                      href="/orders"
                      className="flex items-center px-4 py-3 marketplace-text-secondary hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <ShoppingBag className="w-5 h-5 mr-3" />
                      ประวัติการใช้งาน
                    </Link>
                    
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5 mr-3" />
                      ออกจากระบบ
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Link
                      href="/auth/login"
                      className="flex items-center justify-center space-x-2 marketplace-button-secondary w-full px-4 py-3 rounded-lg transition-colors font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <LogIn className="w-5 h-5" />
                      <span>เข้าสู่ระบบ</span>
                    </Link>
                    <Link
                      href="/auth/register"
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
        </>
      )}
    </>
  );
};

export default MarketplaceHeader;
