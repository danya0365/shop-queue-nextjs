"use client";

import { ShopMarketplaceLayoutViewModel } from "@/src/presentation/presenters/shop/marketplace/ShopMarketplaceLayoutPresenter";
import { ThemeProvider } from "@/src/presentation/providers/ThemeProvider";
import { useRouter, useSearchParams } from "next/navigation";
import React, { ReactNode } from "react";
import MarketplaceFooter from "./components/MarketplaceFooter";
import MarketplaceHeader from "./components/MarketplaceHeader";

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

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col marketplace-bg">
        {/* Header */}
        <MarketplaceHeader
          navigationLinks={layoutData.navigationLinks}
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
                      className="w-full px-6 py-4 text-lg bg-white/95 backdrop-blur-sm border-0 rounded-2xl shadow-lg focus:ring-4 focus:ring-white/30 focus:outline-none placeholder-slate-500"
                    />
                    <button
                      type="submit"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-xl transition-colors font-medium"
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
                      className="px-4 py-2 bg-white/20 hover:bg-white/30 marketplace-hero-text rounded-full text-sm font-medium transition-colors backdrop-blur-sm"
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
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>

        {/* Footer */}
        <MarketplaceFooter />
      </div>
    </ThemeProvider>
  );
};

export default ShopMarketplaceLayout;
