'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode, useState } from 'react';

interface FrontendLayoutProps {
  children: ReactNode;
  shopId: string;
}

export default function FrontendLayout({ children, shopId }: FrontendLayoutProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { href: `/shop/${shopId}`, label: 'หน้าหลัก', icon: '🏠' },
    { href: `/shop/${shopId}/queue`, label: 'เข้าคิว', icon: '📝' },
    { href: `/shop/${shopId}/status`, label: 'สถานะคิว', icon: '⏰' },
    { href: `/shop/${shopId}/history`, label: 'ประวัติ', icon: '📚' },
    { href: `/shop/${shopId}/rewards`, label: 'แต้มสะสม', icon: '🎁' },
  ];

  const isActive = (href: string) => {
    if (href === `/shop/${shopId}`) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Shop Name */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link href="/" className="text-xl sm:text-2xl font-bold text-purple-600">
                Shop Queue
              </Link>
              <span className="hidden sm:inline text-gray-400">|</span>
              <span className="hidden sm:inline text-sm sm:text-lg font-medium text-gray-700">
                ร้านกาแฟดีใจ
              </span>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center space-x-4 xl:space-x-6">
                {navigationItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-2 px-2 xl:px-3 py-2 rounded-lg transition-colors text-sm xl:text-base ${
                      isActive(item.href)
                        ? 'bg-purple-100 text-purple-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ))}
              </div>
              
              {/* Login Button */}
              <button className="bg-purple-500 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors text-sm sm:text-base">
                <span className="hidden sm:inline">เข้าสู่ระบบ</span>
                <span className="sm:hidden">เข้าสู่ระบบ</span>
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg">
            <div className="px-4 py-2 space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive(item.href)
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Tablet Navigation (md screens) */}
      <nav className="hidden md:block lg:hidden bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex overflow-x-auto py-2 space-x-4">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  isActive(item.href)
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span>{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-md border-t mt-8 sm:mt-12 lg:mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="text-center text-gray-600">
            <p className="mb-2 text-sm sm:text-base">© 2024 Shop Queue - ระบบจัดการคิวอัจฉริยะ</p>
            <p className="text-xs sm:text-sm">พัฒนาด้วย ❤️ เพื่อประสบการณ์ที่ดีขึ้น</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
