"use client";

import { ShopCategoriesViewModel } from "@/src/presentation/presenters/shop/categories/ShopCategoriesPresenter";
import { useShopCategoriesPresenter } from "@/src/presentation/presenters/shop/categories/useShopCategoriesPresenter";
import { ArrowRight, Search, Store, TrendingUp, Users } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface ShopCategoriesViewProps {
  initialViewModel?: ShopCategoriesViewModel | null;
}

export function ShopCategoriesView({
  initialViewModel,
}: ShopCategoriesViewProps) {
  const [state, actions] = useShopCategoriesPresenter(initialViewModel);
  const [searchTerm, setSearchTerm] = useState("");
  const { viewModel, loading, error, filteredCategories } = state;

  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchTerm(query);
    actions.searchCategories(query);
  };

  // Handle category click
  const handleCategoryClick = (categoryId: string) => {
    // Navigate to marketplace with category filter
    window.location.href = `/shop?category=${categoryId}`;
  };

  // Show loading state
  if (loading && !viewModel) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 marketplace-loading-spinner mx-auto mb-4"></div>
          <p className="marketplace-text-secondary">
            กำลังโหลดข้อมูลหมวดหมู่...
          </p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error && !viewModel) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold marketplace-text-primary mb-2">
            เกิดข้อผิดพลาด
          </h1>
          <p className="marketplace-text-secondary mb-4">{error}</p>
          <button
            onClick={actions.refreshData}
            className="marketplace-button-primary px-4 py-2 rounded-lg transition-colors"
          >
            ลองใหม่อีกครั้ง
          </button>
        </div>
      </div>
    );
  }

  // Show empty state
  if (!viewModel) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold marketplace-text-primary mb-2">
            ไม่พบข้อมูล
          </h1>
          <p className="marketplace-text-secondary">
            ไม่สามารถโหลดข้อมูลหมวดหมู่ร้านค้าได้
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold marketplace-text-primary mb-4">
          หมวดหมู่ร้านค้า
        </h1>
        <p className="text-lg marketplace-text-secondary max-w-2xl mx-auto">
          เลือกดูร้านค้าตามหมวดหมู่ที่คุณสนใจ พบกับร้านค้าคุณภาพจากทุกหมวดหมู่
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-md mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 marketplace-input-icon h-5 w-5" />
          <input
            type="text"
            placeholder="ค้นหาหมวดหมู่..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-3 marketplace-search-bg marketplace-search-focus rounded-lg marketplace-input"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="marketplace-card p-6 text-center">
          <div className="marketplace-stat-icon-orange w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
            <Store className="h-6 w-6" />
          </div>
          <p className="text-2xl font-bold marketplace-text-primary mb-1">
            {viewModel.stats.totalCategories}
          </p>
          <p className="text-sm marketplace-text-secondary">หมวดหมู่ทั้งหมด</p>
        </div>

        <div className="marketplace-card p-6 text-center">
          <div className="marketplace-stat-icon-green w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
            <TrendingUp className="h-6 w-6" />
          </div>
          <p className="text-2xl font-bold marketplace-text-primary mb-1">
            {viewModel.stats.activeCategories}
          </p>
          <p className="text-sm marketplace-text-secondary">
            หมวดหมู่ที่เปิดใช้งาน
          </p>
        </div>

        <div className="marketplace-card p-6 text-center">
          <div className="marketplace-stat-icon-purple w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
            <Users className="h-6 w-6" />
          </div>
          <p className="text-2xl font-bold marketplace-text-primary mb-1">
            {viewModel.stats.totalShopsInCategories}
          </p>
          <p className="text-sm marketplace-text-secondary">ร้านค้าทั้งหมด</p>
        </div>

        <div className="marketplace-card p-6 text-center">
          <div className="marketplace-stat-icon-orange w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
            <Store className="h-6 w-6" />
          </div>
          <p className="text-2xl font-bold marketplace-text-primary mb-1">
            {Math.round(
              viewModel.stats.totalShopsInCategories /
                viewModel.stats.activeCategories
            )}
          </p>
          <p className="text-sm marketplace-text-secondary">
            ร้านค้าเฉลี่ย/หมวดหมู่
          </p>
        </div>
      </div>

      {/* Categories Grid */}
      {filteredCategories.length === 0 ? (
        <div className="marketplace-card p-12 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-medium marketplace-text-primary mb-2">
            ไม่พบหมวดหมู่ที่ค้นหา
          </h3>
          <p className="marketplace-text-secondary">
            ลองใช้คำค้นหาอื่น หรือดูหมวดหมู่ทั้งหมด
          </p>
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm("");
                actions.searchCategories("");
              }}
              className="mt-4 marketplace-button-secondary px-4 py-2 rounded-lg transition-colors"
            >
              แสดงหมวดหมู่ทั้งหมด
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className="marketplace-card marketplace-card-hover p-6 text-center group transition-all duration-200 hover:scale-105"
            >
              <div className="text-4xl mb-4">{category.icon}</div>
              <h3 className="text-lg font-semibold marketplace-text-primary mb-2 marketplace-category-hover transition-colors">
                {category.name}
              </h3>
              <p className="marketplace-text-secondary text-sm mb-4 line-clamp-2">
                {category.description}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm marketplace-text-muted">
                  <Store className="h-4 w-4 mr-1" />
                  <span>{category.shopCount} ร้าน</span>
                </div>
                <ArrowRight className="h-4 w-4 marketplace-text-muted marketplace-category-hover transition-colors" />
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Popular Categories Section */}
      {!searchTerm && (
        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold marketplace-text-primary mb-2">
              หมวดหมู่ยอดนิยม
            </h2>
            <p className="marketplace-text-secondary">
              หมวดหมู่ที่มีร้านค้ามากที่สุด
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories
              .sort((a, b) => b.shopCount - a.shopCount)
              .slice(0, 6)
              .map((category) => (
                <Link
                  key={category.id}
                  href={`/shop?category=${category.id}`}
                  className="marketplace-card marketplace-card-hover p-6 flex items-center space-x-4 group"
                >
                  <div className="text-3xl">{category.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold marketplace-text-primary marketplace-category-hover transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm marketplace-text-secondary">
                      {category.shopCount} ร้านค้า
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 marketplace-text-muted marketplace-category-hover transition-colors" />
                </Link>
              ))}
          </div>
        </section>
      )}

      {/* Call to Action */}
      <div className="marketplace-card p-8 text-center marketplace-cta-bg">
        <h2 className="text-2xl font-bold marketplace-text-primary mb-4">
          ไม่พบหมวดหมู่ที่ต้องการ?
        </h2>
        <p className="marketplace-text-secondary mb-6">
          เรียกดูร้านค้าทั้งหมดในตลาดของเรา หรือติดต่อเราเพื่อเสนอหมวดหมู่ใหม่
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/shop"
            className="marketplace-button-primary px-6 py-3 rounded-lg transition-colors inline-flex items-center justify-center"
          >
            <Store className="h-5 w-5 mr-2" />
            ดูร้านค้าทั้งหมด
          </Link>
          <Link
            href="/shop/contact"
            className="marketplace-button-secondary px-6 py-3 rounded-lg transition-colors inline-flex items-center justify-center"
          >
            ติดต่อเรา
          </Link>
        </div>
      </div>
    </div>
  );
}
