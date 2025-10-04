"use client";

import { ShopMarketplaceLayoutViewModel } from "@/src/presentation/presenters/shop/marketplace/ShopMarketplaceLayoutPresenter";
import { ThemeProvider } from "@/src/presentation/providers/ThemeProvider";
import { cn } from "@/src/utils/cn";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { ReactNode, useEffect, useState } from "react";
import MarketplaceFooter from "./components/MarketplaceFooter";
import MarketplaceHeader from "./components/MarketplaceHeader";

export interface NavigationLink {
  href: string;
  label: string;
  order: number;
  emoji: string;
  activePath: (pathname: string) => boolean;
}

const navigationLinks: NavigationLink[] = [
  {
    href: "/shop",
    label: "ตลาดร้านค้า",
    order: 1,
    emoji: "🏬",
    activePath: (pathname: string) => pathname === "/shop",
  },
  {
    href: "/shop/categories",
    label: "หมวดหมู่",
    order: 2,
    emoji: "🏷️",
    activePath: (pathname: string) => pathname.startsWith("/shop/categories"),
  },
  {
    href: "/shop/about",
    label: "เกี่ยวกับเรา",
    order: 3,
    emoji: "ℹ️",
    activePath: (pathname: string) => pathname.startsWith("/shop/about"),
  },
  {
    href: "/shop/contact",
    label: "ติดต่อเรา",
    order: 4,
    emoji: "✉️",
    activePath: (pathname: string) => pathname.startsWith("/shop/contact"),
  },
];

interface ShopMarketplaceLayoutProps {
  children: ReactNode;
  layoutData: ShopMarketplaceLayoutViewModel;
  searchQuery?: string;
  showHero?: boolean;
}

const ShopMarketplaceLayout: React.FC<ShopMarketplaceLayoutProps> = ({
  children,
  layoutData,
  searchQuery,
  showHero = false,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Detect mobile viewport (same condition style as FrontendLayout)
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 1024 : false
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const onSearch = (query: string) => {
    if (!query.trim()) {
      // If search is empty, remove search parameter but keep other filters
      const params = new URLSearchParams(searchParams.toString());
      params.delete("q");
      params.delete("page"); // Reset to first page
      router.push(`/shop/search?${params.toString()}`);
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.set("q", query.trim());
    params.delete("page"); // Reset to first page when searching
    router.push(`/shop/search?${params.toString()}`);
  };

  const onCategoryClick = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("category", category);
    params.delete("page"); // Reset to first page when filtering by category
    router.push(`/shop/search?${params.toString()}`);
  };

  const isActive = (item: NavigationLink) => {
    return item.activePath(pathname);
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col marketplace-bg">
        {/* Header */}
        <MarketplaceHeader
          navigationLinks={navigationLinks}
          onSearch={onSearch}
          searchQuery={searchQuery}
        />

        {/* Hero Section (Optional) */}
        {showHero && (
          <section className="marketplace-hero-bg py-16 sm:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold marketplace-hero-text mb-6">
                {layoutData.heroTitle}
              </h1>
              <p className="text-xl sm:text-2xl marketplace-hero-text-muted max-w-3xl mx-auto mb-8">
                {layoutData.heroDescription}
              </p>

              {/* Hero Search Bar */}
              <div className="max-w-2xl mx-auto">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const query = formData.get("search") as string;
                    if (onSearch && query) {
                      onSearch(query);
                    }
                  }}
                  className="relative"
                >
                  <div className="relative">
                    <input
                      type="text"
                      name="search"
                      defaultValue={searchQuery}
                      placeholder={layoutData.searchPlaceholder}
                      className="w-full px-6 py-4 text-lg bg-white/95 text-gray-900 backdrop-blur-sm border-0 rounded-2xl shadow-lg focus:ring-4 focus:ring-white/30 focus:outline-none placeholder-slate-500"
                    />
                    <button
                      type="submit"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 marketplace-button-primary px-6 py-2 rounded-xl font-medium"
                    >
                      ค้นหา
                    </button>
                  </div>
                </form>
              </div>

              {/* Popular Categories */}
              <div className="mt-8">
                <p className="marketplace-hero-text-muted mb-4">
                  หมวดหมู่ยอดนิยม:
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  {layoutData.categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => onCategoryClick?.(category.id)}
                      className="px-4 py-2 marketplace-hero-category-bg marketplace-hero-text rounded-full text-sm font-medium transition-colors backdrop-blur-sm"
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Main Content */}
        <main className="flex-1 relative">
          <div
            className={cn(
              "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8",
              isMobile ? "mb-24" : undefined
            )}
          >
            {children}
          </div>

          {/* Mobile Bottom Navigation (conditional like FrontendLayout) */}
          {isMobile && (
            <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-40">
              <div className="flex justify-around items-center h-16">
                {navigationLinks
                  .slice()
                  .sort((a, b) => a.order - b.order)
                  .map((link) => {
                    const active = isActive(link);
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                          "flex flex-col items-center justify-center flex-1 h-full",
                          "text-sm font-medium transition-colors",
                          active
                            ? "text-primary-600 dark:text-primary-400 border-t-2 border-orange-600 dark:border-orange-400"
                            : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        )}
                      >
                        <span className="text-lg mb-1">{link.emoji}</span>
                        <span className="text-xs">{link.label}</span>
                        {active && (
                          <span className="absolute bottom-0 w-1/2 h-1 bg-primary-600 dark:bg-primary-400 rounded-t-full" />
                        )}
                      </Link>
                    );
                  })}
              </div>
            </div>
          )}
        </main>

        {/* Footer - only show on desktop */}
        {!isMobile && <MarketplaceFooter />}
      </div>
    </ThemeProvider>
  );
};
export default ShopMarketplaceLayout;
