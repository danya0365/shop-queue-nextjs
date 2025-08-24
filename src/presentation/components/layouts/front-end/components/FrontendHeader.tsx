"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/src/presentation/components/ui/ThemeToggle";

export function FrontendHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              <span className="ml-3 text-xl font-bold text-foreground">Shop Queue</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-foreground hover:text-primary transition-colors">
              หน้าหลัก
            </Link>
            <Link href="/features" className="text-foreground hover:text-primary transition-colors">
              ฟีเจอร์
            </Link>
            <Link href="/pricing" className="text-foreground hover:text-primary transition-colors">
              ราคา
            </Link>
            <Link href="/contact" className="text-foreground hover:text-primary transition-colors">
              ติดต่อเรา
            </Link>
          </nav>

          {/* Desktop Auth Buttons & Theme Toggle */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            <Link 
              href="/auth/login" 
              className="px-4 py-2 text-foreground hover:text-primary transition-colors"
            >
              เข้าสู่ระบบ
            </Link>
            <Link 
              href="/auth/register" 
              className="px-4 py-2 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors"
            >
              สมัครใช้งาน
            </Link>
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
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
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
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
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
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-background border-b border-border">
          <Link 
            href="/" 
            className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-muted-light hover:text-primary"
            onClick={() => setIsMenuOpen(false)}
          >
            หน้าหลัก
          </Link>
          <Link 
            href="/features" 
            className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-muted-light hover:text-primary"
            onClick={() => setIsMenuOpen(false)}
          >
            ฟีเจอร์
          </Link>
          <Link 
            href="/pricing" 
            className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-muted-light hover:text-primary"
            onClick={() => setIsMenuOpen(false)}
          >
            ราคา
          </Link>
          <Link 
            href="/contact" 
            className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-muted-light hover:text-primary"
            onClick={() => setIsMenuOpen(false)}
          >
            ติดต่อเรา
          </Link>
          <div className="pt-4 pb-3 border-t border-border">
            <div className="flex items-center px-3">
              <Link 
                href="/auth/login" 
                className="block w-full px-4 py-2 text-center text-foreground border border-border rounded-md hover:bg-muted-light hover:text-primary mb-2"
                onClick={() => setIsMenuOpen(false)}
              >
                เข้าสู่ระบบ
              </Link>
            </div>
            <div className="flex items-center px-3">
              <Link 
                href="/auth/register" 
                className="block w-full px-4 py-2 text-center bg-primary text-white rounded-md hover:bg-primary-dark"
                onClick={() => setIsMenuOpen(false)}
              >
                สมัครใช้งาน
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
