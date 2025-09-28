"use client";

import { ShopDTO } from "@/src/application/dtos/backend/shops-dto";
import { ShopSearchViewModel } from "@/src/presentation/presenters/shop/search/ShopSearchPresenter";
import { useShopSearchPresenter } from "@/src/presentation/presenters/shop/search/useShopSearchPresenter";
import {
  Clock,
  Filter,
  Grid,
  Heart,
  List,
  MapPin,
  Phone,
  Search,
  Share2,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ShopMarketplaceFilterModal, ShopMarketplaceFilters } from "../marketplace/modals";

interface ShopSearchViewProps {
  initialViewModel?: ShopSearchViewModel | null;
}

// Component to handle image loading with beautiful fallback
function ShopImageFallback({
  shop,
  className,
  isCircular = false,
}: {
  shop: ShopDTO;
  className: string;
  isCircular?: boolean;
}) {
  const [imageError, setImageError] = useState(false);

  // Generate gradient colors based on shop name
  const getGradientColors = (name: string) => {
    const colors = [
      "from-blue-400 to-blue-600",
      "from-purple-400 to-purple-600",
      "from-green-400 to-green-600",
      "from-red-400 to-red-600",
      "from-yellow-400 to-yellow-600",
      "from-indigo-400 to-indigo-600",
      "from-pink-400 to-pink-600",
      "from-teal-400 to-teal-600",
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  // Get 2 characters from shop name
  const getDisplayText = (name: string) => {
    // Split by spaces and get first character of first two words
    const words = name.trim().split(/\s+/);
    if (words.length >= 2) {
      // Get first character of first two words
      return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
    } else if (name.length >= 2) {
      // If single word but has at least 2 characters, get first two characters
      return name.substring(0, 2).toUpperCase();
    } else {
      // Fallback to first character if name is too short
      return name.charAt(0).toUpperCase();
    }
  };

  const displayText = getDisplayText(shop.name);
  const gradientClass = getGradientColors(shop.name);

  if (!shop.logo || imageError) {
    return (
      <div
        className={`${className} bg-gradient-to-br ${gradientClass} flex items-center justify-center ${
          isCircular ? "rounded-full" : ""
        }`}
      >
        <span className="text-white font-bold text-2xl md:text-3xl">
          {displayText}
        </span>
      </div>
    );
  }

  return (
    <Image
      src={shop.logo}
      alt={shop.name}
      className={className}
      onError={() => setImageError(true)}
      width={isCircular ? 64 : 400}
      height={isCircular ? 64 : 192}
      style={{
        objectFit: "cover",
        width: isCircular ? "100%" : "100%",
        height: isCircular ? "100%" : "100%",
      }}
    />
  );
}

export function ShopSearchView({
  initialViewModel,
}: ShopSearchViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [state, actions] = useShopSearchPresenter(initialViewModel);
  const { viewModel, loading, error } = state;
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || initialViewModel?.searchQuery || "");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "inactive":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "suspended":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "draft":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "เปิดทำการ";
      case "inactive":
        return "ปิดทำการ";
      case "suspended":
        return "ระงับการใช้งาน";
      case "draft":
        return "ฉบับร่าง";
      default:
        return status;
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update URL with search query
    const params = new URLSearchParams(searchParams.toString());
    if (searchTerm.trim()) {
      params.set('q', searchTerm.trim());
    } else {
      params.delete('q');
    }
    
    // Reset to page 1 when searching
    params.delete('page');
    
    router.push(`/shop/search?${params.toString()}`);
    
    // Also trigger the search action
    await actions.searchShops(searchTerm);
  };

  const handleCategoryClick = async (categoryId: string) => {
    await actions.filterByCategory(categoryId);
  };

  const handleLocationClick = async (locationId: string) => {
    await actions.filterByLocation(locationId);
  };

  const handleOpenFilterModal = () => {
    setIsFilterModalOpen(true);
  };

  const handleCloseFilterModal = () => {
    setIsFilterModalOpen(false);
  };

  const handleApplyFilters = async (filters: ShopMarketplaceFilters) => {
    await actions.applyFilters(filters);
  };

  if (loading && !viewModel) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            กำลังค้นหาร้านค้า...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            เกิดข้อผิดพลาด
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={actions.refreshData}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            ลองใหม่อีกครั้ง
          </button>
        </div>
      </div>
    );
  }

  if (!viewModel) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            ไม่พบข้อมูล
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            ไม่สามารถโหลดข้อมูลการค้นหาได้
          </p>
        </div>
      </div>
    );
  }

  const { searchResults, searchStats, popularCategories, popularLocations, suggestedSearches } =
    viewModel;

  return (
    <div className="space-y-8">
      {/* Search Header */}
      <div className="marketplace-card p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold marketplace-text-primary mb-2">
              ค้นหาร้านค้า
            </h1>
            <p className="marketplace-text-secondary">
              ค้นหาและกรองร้านค้าที่คุณต้องการ
            </p>
          </div>
          
          {/* Search Form */}
          <div className="flex-1 max-w-2xl">
            <form onSubmit={handleSearch} className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="ค้นหาร้านค้า, บริการ, หรือสถานที่..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md transition-colors text-sm font-medium"
                >
                  ค้นหา
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Search Stats */}
        {searchStats.hasResults && (
          <div className="mt-4 flex items-center gap-4 text-sm marketplace-text-secondary">
            <span>
              พบ {searchStats.totalResults.toLocaleString()} ร้านค้า
            </span>
            <span>•</span>
            <span>
              ใช้เวลา {searchStats.searchTime} มิลลิวินาที
            </span>
          </div>
        )}
      </div>

      {/* Suggested Searches */}
      {!viewModel.searchQuery && suggestedSearches.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold marketplace-text-primary mb-4">
            คำค้นหายอดนิยม
          </h2>
          <div className="flex flex-wrap gap-2">
            {suggestedSearches.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => {
                  setSearchTerm(suggestion);
                  actions.searchShops(suggestion);
                }}
                className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-full text-sm font-medium transition-colors dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800"
              >
                <TrendingUp className="inline h-4 w-4 mr-1" />
                {suggestion}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Popular Categories */}
      {!viewModel.searchQuery && popularCategories.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold marketplace-text-primary mb-4">
            หมวดหมู่ยอดนิยม
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {popularCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className="marketplace-card marketplace-card-hover p-4 text-center"
              >
                <div className="text-2xl mb-2">{category.icon}</div>
                <h3 className="font-medium marketplace-text-primary mb-1">
                  {category.name}
                </h3>
                <p className="text-sm marketplace-text-secondary">
                  {category.shopCount} ร้าน
                </p>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Search Results */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold marketplace-text-primary">
            {viewModel.searchQuery ? `ผลการค้นหา "${viewModel.searchQuery}"` : "ร้านค้าทั้งหมด"}
          </h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md ${
                  viewMode === "grid"
                    ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                    : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                }`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md ${
                  viewMode === "list"
                    ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                    : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                }`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
            <button
              onClick={handleOpenFilterModal}
              className="flex items-center space-x-2 marketplace-button-secondary px-4 py-2 rounded-lg transition-colors"
            >
              <Filter className="h-5 w-5" />
              <span>กรอง</span>
            </button>
          </div>
        </div>

        {/* Search Results Grid/List */}
        {searchResults.shops.length === 0 ? (
          <div className="marketplace-card p-8 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-medium marketplace-text-primary mb-2">
              {viewModel.searchQuery ? "ไม่พบผลการค้นหา" : "ยังไม่มีข้อมูลร้านค้า"}
            </h3>
            <p className="marketplace-text-secondary">
              {viewModel.searchQuery 
                ? `ไม่พบร้านค้าที่ตรงกับ "${viewModel.searchQuery}" ลองค้นหาด้วยคำอื่น`
                : "ข้อมูลร้านค้าจะแสดงที่นี่เมื่อมีการสร้างร้านค้า"
              }
            </p>
            {viewModel.searchQuery && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  actions.clearFilters();
                }}
                className="mt-4 marketplace-button-primary px-4 py-2 rounded-lg transition-colors"
              >
                ล้างการค้นหา
              </button>
            )}
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }
          >
            {searchResults.shops.map((shop: ShopDTO) => (
              <Link
                key={shop.id}
                href={`/shop/${shop.id}`}
                className={`marketplace-shop-card ${
                  viewMode === "grid"
                    ? "overflow-hidden"
                    : "flex items-center p-4"
                }`}
              >
                {viewMode === "grid" ? (
                  <>
                    <div className="relative">
                      <ShopImageFallback shop={shop} className="w-full h-48" />
                      <div className="absolute top-2 right-2">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                            shop.status
                          )}`}
                        >
                          {getStatusText(shop.status)}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        {shop.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                        {shop.description}
                      </p>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 mr-1" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {shop.rating}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="text-gray-400 hover:text-red-500">
                            <Heart className="h-4 w-4" />
                          </button>
                          <button className="text-gray-400 hover:text-blue-500">
                            <Share2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{shop.address}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-3">
                        <Phone className="h-4 w-4 mr-1" />
                        <span>{shop.phone}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {shop.queueCount}
                          </span>
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {shop.totalServices}
                          </span>
                        </div>
                        <span className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                          ดูรายละเอียด
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex-shrink-0 h-16 w-16">
                      <ShopImageFallback
                        shop={shop}
                        className="h-16 w-16"
                        isCircular={true}
                      />
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          {shop.name}
                        </h3>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                            shop.status
                          )}`}
                        >
                          {getStatusText(shop.status)}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                        {shop.description}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 mr-1" />
                          <span>{shop.rating}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{shop.address}</span>
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-1" />
                          <span>{shop.phone}</span>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4 flex items-center space-x-2">
                      <button className="text-gray-400 hover:text-red-500">
                        <Heart className="h-5 w-5" />
                      </button>
                      <button className="text-gray-400 hover:text-blue-500">
                        <Share2 className="h-5 w-5" />
                      </button>
                      <span className="text-blue-600 hover:text-blue-700 font-medium">
                        ดูรายละเอียด
                      </span>
                    </div>
                  </>
                )}
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {searchResults.totalCount > searchResults.perPage && (
          <div className="mt-8 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => actions.goToPage(searchResults.currentPage - 1)}
                disabled={searchResults.currentPage === 1}
                className={`px-3 py-2 rounded-md ${
                  searchResults.currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700"
                    : "bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                ก่อนหน้า
              </button>
              <div className="flex items-center space-x-1">
                {Array.from(
                  {
                    length: Math.ceil(searchResults.totalCount / searchResults.perPage),
                  },
                  (_, i) => i + 1
                ).map((page) => (
                  <button
                    key={page}
                    onClick={() => actions.goToPage(page)}
                    className={`px-3 py-2 rounded-md ${
                      page === searchResults.currentPage
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                onClick={() => actions.goToPage(searchResults.currentPage + 1)}
                disabled={
                  searchResults.currentPage ===
                  Math.ceil(searchResults.totalCount / searchResults.perPage)
                }
                className={`px-3 py-2 rounded-md ${
                  searchResults.currentPage ===
                  Math.ceil(searchResults.totalCount / searchResults.perPage)
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700"
                    : "bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                ถัดไป
              </button>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              หน้า {searchResults.currentPage} จาก{" "}
              {Math.ceil(searchResults.totalCount / searchResults.perPage)}
            </div>
          </div>
        )}
      </section>

      {/* Filter Modal */}
      <ShopMarketplaceFilterModal
        isOpen={isFilterModalOpen}
        onClose={handleCloseFilterModal}
        onApplyFilters={handleApplyFilters}
        categories={popularCategories}
        locations={popularLocations}
      />
    </div>
  );
}
