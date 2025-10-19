"use client";

import { ThemeToggle } from "@/src/presentation/components/ui/ThemeToggle";
import { useAuthorization } from "@/src/presentation/hooks/authorization";
import { useLoginRedirect } from "@/src/presentation/hooks/login-redirect";
import { useAuthStore } from "@/src/presentation/stores/auth-store";
import { useProfileStore } from "@/src/presentation/stores/profile-store";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ProfileMenu } from "./ProfileMenu";

export function FrontendHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { authAccount, signOut } = useAuthStore();
  const { activeProfile } = useProfileStore();
  const { hasBackendAccess } = useAuthorization();
  const { saveAndRedirect } = useLoginRedirect();
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    signOut();
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 header-bg header-backdrop border-b header-border shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo.png"
                alt="Shop Queue"
                width={40}
                height={40}
                className="h-10 w-auto"
              />
              <span className="ml-3 text-xl font-bold text-foreground">
                Shop Queue
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link href="/" className="nav-link">
              หน้าหลัก
            </Link>
            <Link href="/shop" className="nav-link">
              ตลาดร้านค้า
            </Link>
            {activeProfile && (
              <Link href="/dashboard/shops" className="nav-link">
                ร้านค้าของคุณ
              </Link>
            )}
            <Link href="/features" className="nav-link">
              ฟีเจอร์
            </Link>
            <Link href="/pricing" className="nav-link">
              ราคา
            </Link>
            <Link href="/contact" className="nav-link">
              ติดต่อเรา
            </Link>
          </nav>

          {/* Desktop Auth Buttons & Theme Toggle */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            {activeProfile ? (
              <ProfileMenu profile={activeProfile} onLogout={handleLogout} />
            ) : (
              <>
                <button
                  onClick={() => saveAndRedirect(pathname)}
                  className="btn-ghost-modern"
                >
                  เข้าสู่ระบบ
                </button>
                <Link href="/auth/register" className="btn-primary-modern">
                  สมัครใช้งาน
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-4">
            <ThemeToggle />
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-foreground hover:text-primary hover:bg-muted-light focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon when menu is closed */}
              <svg
                className={`${isMenuOpen ? "hidden" : "block"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/* Icon when menu is open */}
              <svg
                className={`${isMenuOpen ? "block" : "hidden"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`${isMenuOpen ? "block" : "hidden"} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 header-bg header-backdrop border-b header-border">
          <Link
            href="/"
            className="block px-3 py-2 rounded-md text-base font-medium nav-link"
            onClick={() => setIsMenuOpen(false)}
          >
            หน้าหลัก
          </Link>
          <Link
            href="/shop"
            className="block px-3 py-2 rounded-md text-base font-medium nav-link"
            onClick={() => setIsMenuOpen(false)}
          >
            ตลาดร้านค้า
          </Link>
          {activeProfile && (
            <Link
              href="/dashboard/shops"
              className="block px-3 py-2 rounded-md text-base font-medium nav-link"
              onClick={() => setIsMenuOpen(false)}
            >
              ร้านค้าของคุณ
            </Link>
          )}
          <Link
            href="/features"
            className="block px-3 py-2 rounded-md text-base font-medium nav-link"
            onClick={() => setIsMenuOpen(false)}
          >
            ฟีเจอร์
          </Link>
          <Link
            href="/pricing"
            className="block px-3 py-2 rounded-md text-base font-medium nav-link"
            onClick={() => setIsMenuOpen(false)}
          >
            ราคา
          </Link>
          <Link
            href="/contact"
            className="block px-3 py-2 rounded-md text-base font-medium nav-link"
            onClick={() => setIsMenuOpen(false)}
          >
            ติดต่อเรา
          </Link>
          <div className="pt-4 pb-3 border-t border-border">
            {authAccount && activeProfile ? (
              <>
                {/* Mobile Profile Info */}
                <div className="px-3 mb-4">
                  <div className="flex items-center space-x-3 p-3 bg-muted-light rounded-lg">
                    <div className="w-10 h-10 bg-primary-gradient rounded-full flex items-center justify-center text-white font-bold">
                      {activeProfile.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {activeProfile.name}
                      </p>
                      <p className="text-xs text-muted">
                        @{activeProfile.username}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Mobile Profile Menu Items */}
                <div className="px-3 space-y-1">
                  <Link
                    href="/switch-profile"
                    className="flex items-center px-3 py-2 text-sm text-foreground hover:bg-muted-light rounded-md transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <svg
                      className="w-4 h-4 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    สลับโปรไฟล์ไอดี
                  </Link>

                  <Link
                    href="/dashboard"
                    className="flex items-center px-3 py-2 text-sm text-foreground hover:bg-muted-light rounded-md transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <svg
                      className="w-4 h-4 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                    แดชบอร์ดร้านค้า
                  </Link>

                  <Link
                    href="/dashboard/customer"
                    className="flex items-center px-3 py-2 text-sm text-foreground hover:bg-muted-light rounded-md transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <svg
                      className="w-4 h-4 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                    แดชบอร์ดสำหรับลูกค้า
                  </Link>

                  {/* navigate to backend */}
                  {hasBackendAccess(activeProfile?.role) && (
                    <Link
                      href="/backend"
                      className="flex items-center px-3 py-2 text-sm text-foreground hover:bg-muted-light rounded-md transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <svg
                        className="w-4 h-4 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                      จัดการระบบ
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center w-full px-3 py-2 text-sm text-error hover:bg-error-light rounded-md transition-colors"
                  >
                    <svg
                      className="w-4 h-4 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    ออกจากระบบ
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center px-3">
                  <button
                    onClick={() => {
                      saveAndRedirect(pathname);
                      setIsMenuOpen(false);
                    }}
                    className="block w-full px-4 py-2 text-center btn-ghost-modern mb-2"
                  >
                    เข้าสู่ระบบ
                  </button>
                </div>
                <div className="flex items-center px-3">
                  <Link
                    href="/auth/register"
                    className="block w-full px-4 py-2 text-center btn-primary-modern"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    สมัครใช้งาน
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
