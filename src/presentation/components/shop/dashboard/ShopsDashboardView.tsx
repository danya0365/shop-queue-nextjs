"use client";

import { ShopDTO } from "@/src/application/dtos/backend/shops-dto";
import { ShopsDashboardViewModel } from "@/src/presentation/presenters/shop/dashboard/ShopsDashboardPresenter";
import { useShopsDashboardPresenter } from "@/src/presentation/presenters/shop/dashboard/useShopsDashboardPresenter";
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
} from "lucide-react";

interface ShopsDashboardViewProps {
  initialViewModel?: ShopsDashboardViewModel | null;
}

export function ShopsDashboardView({
  initialViewModel,
}: ShopsDashboardViewProps) {
  const state = useShopsDashboardPresenter(initialViewModel);
  const { viewModel, loading, error } = state;
  const [searchTerm, setSearchTerm] = useState("");

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
        return "เปิดให้บริการ";
      case "inactive":
        return "ปิดให้บริการ";
      case "suspended":
        return "ระงับการใช้งาน";
      case "draft":
        return "ฉบับร่าง";
      default:
        return "ไม่ทราบ";
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    await state.searchShops(searchTerm);
  };

  const handlePageChange = async (page: number) => {
    await state.goToPage(page);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            กำลังโหลดข้อมูลร้านค้า...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            เกิดข้อผิดพลาด
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={state.refreshData}
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">📋</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            ไม่พบข้อมูล
          </h1>
          <p className="text-gray-600 dark:text-gray-400">ไม่พบข้อมูลร้านค้า</p>
        </div>
      </div>
    );
  }

  const { shopsData } = viewModel;

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            รวมร้านค้า
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            ดูข้อมูลร้านค้าทั้งหมดและสถิติ
          </p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2">
            <Filter size={16} />
            <span>กรองข้อมูล</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {shopsData.stats.totalShops === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-12 border border-gray-200 dark:border-gray-700 text-center">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            ยังไม่มีข้อมูลสถิติร้านค้า
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            ข้อมูลสถิติร้านค้าจะแสดงเมื่อมีการสร้างร้านค้า
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Shops */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  ร้านค้าทั้งหมด
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {shopsData.stats.totalShops.toLocaleString()}
                </p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                <Store className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          {/* Active Shops */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  ร้านเปิดให้บริการ
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {shopsData.stats.activeShops.toLocaleString()}
                </p>
              </div>
              <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          {/* Pending Approval */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  รออนุมัติ
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {shopsData.stats.pendingApproval.toLocaleString()}
                </p>
              </div>
              <div className="bg-yellow-100 dark:bg-yellow-900 p-3 rounded-full">
                <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </div>

          {/* New This Month */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  ร้านใหม่เดือนนี้
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {shopsData.stats.newThisMonth.toLocaleString()}
                </p>
              </div>
              <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full">
                <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Shops Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              รายการร้านค้า
            </h2>
            <div className="flex items-center space-x-4">
              {/* Search Form */}
              <form
                onSubmit={handleSearch}
                className="flex items-center space-x-2"
              >
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="ค้นหาร้านค้า..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  ค้นหา
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  ร้านค้า
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  ข้อมูลติดต่อ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  สถานะ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  คิว/บริการ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  คะแนน
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  จัดการ
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {shopsData.shops.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="text-6xl mb-4">🏪</div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                      ยังไม่มีข้อมูลร้านค้า
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      ข้อมูลร้านค้าจะแสดงที่นี่เมื่อมีการสร้างร้านค้า
                    </p>
                  </td>
                </tr>
              ) : (
                shopsData.shops.map((shop: ShopDTO) => (
                  <tr
                    key={shop.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {shop.logo ? (
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={shop.logo}
                              alt={shop.name}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                              <Store className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {shop.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {shop.description || "ไม่มีคำอธิบาย"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-gray-100">
                        <div className="flex items-center mb-1">
                          <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                          {shop.address || "ไม่ระบุ"}
                        </div>
                        <div className="flex items-center mb-1">
                          <Phone className="h-4 w-4 mr-1 text-gray-400" />
                          {shop.phone || "ไม่ระบุ"}
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1 text-gray-400" />
                          {shop.ownerName}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          shop.status
                        )}`}
                      >
                        {getStatusText(shop.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      <div className="flex flex-col space-y-1">
                        <span>คิว: {shop.queueCount}</span>
                        <span>บริการ: {shop.totalServices}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                        <span className="text-sm text-gray-900 dark:text-gray-100">
                          {shop.rating.toFixed(1)}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                          ({shop.totalReviews})
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/shop/${shop.id}`}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <Eye size={16} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {viewModel.shopsData.totalCount > viewModel.shopsData.perPage && (
          <div className="flex justify-center px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(viewModel.shopsData.currentPage - 1)}
                disabled={viewModel.shopsData.currentPage === 1}
                className={`px-3 py-2 rounded-md ${
                  viewModel.shopsData.currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700"
                    : "bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                ก่อนหน้า
              </button>

              {Array.from(
                { length: Math.ceil(viewModel.shopsData.totalCount / viewModel.shopsData.perPage) },
                (_, i) => i + 1
              ).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-2 rounded-md ${
                    page === viewModel.shopsData.currentPage
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(viewModel.shopsData.currentPage + 1)}
                disabled={
                  viewModel.shopsData.currentPage ===
                  Math.ceil(viewModel.shopsData.totalCount / viewModel.shopsData.perPage)
                }
                className={`px-3 py-2 rounded-md ${
                  viewModel.shopsData.currentPage ===
                  Math.ceil(viewModel.shopsData.totalCount / viewModel.shopsData.perPage)
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700"
                    : "bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                ถัดไป
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}
