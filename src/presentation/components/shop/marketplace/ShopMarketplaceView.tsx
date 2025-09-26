"use client";

import { ShopDTO } from "@/src/application/dtos/backend/shops-dto";
import { ShopMarketplaceViewModel } from "@/src/presentation/presenters/shop/marketplace/ShopMarketplacePresenter";
import { useShopMarketplacePresenter } from "@/src/presentation/presenters/shop/marketplace/useShopMarketplacePresenter";
import Link from "next/link";
import { useState } from "react";
import {
  CheckCircle,
  Clock,
  Eye,
  Filter,
  MapPin,
  Phone,
  Search,
  Star,
  Store,
  TrendingUp,
  Users,
  Grid,
  List,
  Heart,
  Share2,
} from "lucide-react";

interface ShopMarketplaceViewProps {
  initialViewModel?: ShopMarketplaceViewModel | null;
}

export function ShopMarketplaceView({
  initialViewModel,
}: ShopMarketplaceViewProps) {
  const [state, actions] = useShopMarketplacePresenter(initialViewModel);
  const { viewModel, loading, error } = state;
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

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
    await actions.searchShops(searchTerm);
  };

  const handleCategoryClick = async (categoryId: string) => {
    await actions.filterByCategory(categoryId);
  };

  const handleLocationClick = async (locationId: string) => {
    await actions.filterByLocation(locationId);
  };

  if (loading && !viewModel) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">กำลังโหลดข้อมูลร้านค้า...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">เกิดข้อผิดพลาด</h1>
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">ไม่พบข้อมูล</h1>
          <p className="text-gray-600 dark:text-gray-400">ไม่สามารถโหลดข้อมูลร้านค้าได้</p>
        </div>
      </div>
    );
  }

  const { shopsData, featuredShops, popularCategories, popularLocations } = viewModel;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              ตลาดร้านค้า
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              ค้นพบร้านค้าที่น่าสนใจและบริการที่คุณต้องการ
            </p>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="ค้นหาร้านค้า, บริการ, หรือสถานที่..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-12 pr-4 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
              <button
                type="submit"
                className="absolute right-2 top-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                ค้นหา
              </button>
            </div>
          </form>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
              <div className="flex items-center">
                <Store className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    ร้านค้าทั้งหมด
                  </p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    {viewModel.totalShops}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">
                    ร้านเปิดทำการ
                  </p>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                    {viewModel.activeShops}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg">
              <div className="flex items-center">
                <Star className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-purple-600 dark:text-purple-400">
                    ร้านแนะนำ
                  </p>
                  <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                    {viewModel.featuredShopsCount}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-orange-600 dark:text-orange-400">
                    ร้านใหม่เดือนนี้
                  </p>
                  <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                    {viewModel.newShopsThisMonth}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Featured Shops */}
        {featuredShops.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                ร้านแนะนำ
              </h2>
              <button className="text-blue-600 hover:text-blue-700 font-medium">
                ดูทั้งหมด
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredShops.map((shop: ShopDTO) => (
                <div
                  key={shop.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
                >
                  <div className="relative">
                    {shop.logo ? (
                      <img
                        src={shop.logo}
                        alt={shop.name}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <Store className="h-16 w-16 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(shop.status)}`}>
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
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {shop.rating}
                        </span>
                      </div>
                      <button
                        onClick={() => actions.openShopDetail(shop.id)}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        ดูรายละเอียด
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Popular Categories */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            หมวดหมู่ยอดนิยม
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {popularCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center"
              >
                <div className="text-2xl mb-2">{category.icon}</div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {category.shopCount} ร้าน
                </p>
              </button>
            ))}
          </div>
        </section>

        {/* Popular Locations */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            สถานที่ยอดนิยม
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {popularLocations.map((location) => (
              <button
                key={location.id}
                onClick={() => handleLocationClick(location.id)}
                className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow text-left"
              >
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-blue-600 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">
                      {location.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {location.shopCount} ร้าน
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* All Shops */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              ร้านค้าทั้งหมด
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
                onClick={actions.openFilterModal}
                className="flex items-center space-x-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <Filter className="h-5 w-5" />
                <span>กรอง</span>
              </button>
            </div>
          </div>

          {/* Shops Grid/List */}
          {shopsData.shops.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 text-center">
              <div className="text-6xl mb-4">🏪</div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                ยังไม่มีข้อมูลร้านค้า
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                ข้อมูลร้านค้าจะแสดงที่นี่เมื่อมีการสร้างร้านค้า
              </p>
            </div>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-4"
              }
            >
              {shopsData.shops.map((shop: ShopDTO) => (
                <div
                  key={shop.id}
                  className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow ${
                    viewMode === "grid" ? "overflow-hidden" : "flex items-center p-4"
                  }`}
                >
                  {viewMode === "grid" ? (
                    <>
                      <div className="relative">
                        {shop.logo ? (
                          <img
                            src={shop.logo}
                            alt={shop.name}
                            className="w-full h-48 object-cover"
                          />
                        ) : (
                          <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                            <Store className="h-16 w-16 text-gray-400" />
                          </div>
                        )}
                        <div className="absolute top-2 right-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(shop.status)}`}>
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
                          <button
                            onClick={() => actions.openShopDetail(shop.id)}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                          >
                            ดูรายละเอียด
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex-shrink-0 h-16 w-16">
                        {shop.logo ? (
                          <img
                            src={shop.logo}
                            alt={shop.name}
                            className="h-16 w-16 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-16 w-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                            <Store className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            {shop.name}
                          </h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(shop.status)}`}>
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
                        <button
                          onClick={() => actions.openShopDetail(shop.id)}
                          className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                          ดูรายละเอียด
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {shopsData.totalCount > shopsData.perPage && (
            <div className="mt-8 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => actions.goToPage(shopsData.currentPage - 1)}
                  disabled={shopsData.currentPage === 1}
                  className={`px-3 py-2 rounded-md ${
                    shopsData.currentPage === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700"
                      : "bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  }`}
                >
                  ก่อนหน้า
                </button>
                <div className="flex items-center space-x-1">
                  {Array.from(
                    { length: Math.ceil(shopsData.totalCount / shopsData.perPage) },
                    (_, i) => i + 1
                  ).map((page) => (
                    <button
                      key={page}
                      onClick={() => actions.goToPage(page)}
                      className={`px-3 py-2 rounded-md ${
                        page === shopsData.currentPage
                          ? "bg-blue-600 text-white"
                          : "bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => actions.goToPage(shopsData.currentPage + 1)}
                  disabled={shopsData.currentPage === Math.ceil(shopsData.totalCount / shopsData.perPage)}
                  className={`px-3 py-2 rounded-md ${
                    shopsData.currentPage === Math.ceil(shopsData.totalCount / shopsData.perPage)
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700"
                      : "bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  }`}
                >
                  ถัดไป
                </button>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                หน้า {shopsData.currentPage} จาก {Math.ceil(shopsData.totalCount / shopsData.perPage)}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
