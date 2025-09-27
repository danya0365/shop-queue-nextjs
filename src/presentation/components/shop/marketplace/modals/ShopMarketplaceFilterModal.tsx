"use client";

import { useState } from "react";
import {
  X,
  Filter,
  Star,
  Clock,
  Users,
} from "lucide-react";

interface ShopMarketplaceFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: ShopMarketplaceFilters) => void;
  initialFilters?: ShopMarketplaceFilters;
  categories: Array<{ id: string; name: string; icon: string; shopCount: number }>;
  locations: Array<{ id: string; name: string; shopCount: number }>;
}

export interface ShopMarketplaceFilters {
  searchQuery?: string;
  categoryId?: string;
  locationId?: string;
  minRating?: number;
  maxRating?: number;
  status?: "active" | "inactive" | "all";
  sortBy?: "name" | "rating" | "queueCount" | "totalServices" | "createdAt";
  sortOrder?: "asc" | "desc";
  minQueueCount?: number;
  maxQueueCount?: number;
  minServiceCount?: number;
  maxServiceCount?: number;
}

export function ShopMarketplaceFilterModal({
  isOpen,
  onClose,
  onApplyFilters,
  initialFilters,
  categories,
  locations,
}: ShopMarketplaceFilterModalProps) {
  const [filters, setFilters] = useState<ShopMarketplaceFilters>(
    initialFilters || {
      status: "all",
      sortBy: "name",
      sortOrder: "asc",
    }
  );
  const handleFilterChange = (key: keyof ShopMarketplaceFilters, value: string | number | undefined) => {
    setFilters((prev: ShopMarketplaceFilters) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleApplyFilters = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleResetFilters = () => {
    const resetFilters: ShopMarketplaceFilters = {
      status: "all",
      sortBy: "name",
      sortOrder: "asc",
    };
    setFilters(resetFilters);
    onApplyFilters(resetFilters);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Filter className="h-6 w-6 text-blue-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              ตัวกรองร้านค้า
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Filter Content */}
        <div className="p-6 space-y-6">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              ค้นหา
            </label>
            <input
              type="text"
              placeholder="ค้นหาชื่อร้านค้า..."
              value={filters.searchQuery || ""}
              onChange={(e) => handleFilterChange("searchQuery", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              หมวดหมู่
            </label>
            <select
              value={filters.categoryId || ""}
              onChange={(e) => handleFilterChange("categoryId", e.target.value || undefined)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
            >
              <option value="">ทุกหมวดหมู่</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name} ({category.shopCount} ร้าน)
                </option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              สถานที่
            </label>
            <select
              value={filters.locationId || ""}
              onChange={(e) => handleFilterChange("locationId", e.target.value || undefined)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
            >
              <option value="">ทุกสถานที่</option>
              {locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name} ({location.shopCount} ร้าน)
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              สถานะร้านค้า
            </label>
            <select
              value={filters.status || "all"}
              onChange={(e) => handleFilterChange("status", e.target.value === "all" ? undefined : e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
            >
              <option value="all">ทุกสถานะ</option>
              <option value="active">เปิดทำการ</option>
              <option value="inactive">ปิดทำการ</option>
            </select>
          </div>

          {/* Rating Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <div className="flex items-center">
                <Star className="h-4 w-4 mr-1" />
                คะแนนรีวิว
              </div>
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  type="number"
                  placeholder="ต่ำสุด"
                  min="0"
                  max="5"
                  step="0.1"
                  value={filters.minRating || ""}
                  onChange={(e) => handleFilterChange("minRating", e.target.value ? parseFloat(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                />
              </div>
              <div>
                <input
                  type="number"
                  placeholder="สูงสุด"
                  min="0"
                  max="5"
                  step="0.1"
                  value={filters.maxRating || ""}
                  onChange={(e) => handleFilterChange("maxRating", e.target.value ? parseFloat(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                />
              </div>
            </div>
          </div>

          {/* Queue Count Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                จำนวนคิว
              </div>
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  type="number"
                  placeholder="ต่ำสุด"
                  min="0"
                  value={filters.minQueueCount || ""}
                  onChange={(e) => handleFilterChange("minQueueCount", e.target.value ? parseInt(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                />
              </div>
              <div>
                <input
                  type="number"
                  placeholder="สูงสุด"
                  min="0"
                  value={filters.maxQueueCount || ""}
                  onChange={(e) => handleFilterChange("maxQueueCount", e.target.value ? parseInt(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                />
              </div>
            </div>
          </div>

          {/* Service Count Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                จำนวนบริการ
              </div>
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  type="number"
                  placeholder="ต่ำสุด"
                  min="0"
                  value={filters.minServiceCount || ""}
                  onChange={(e) => handleFilterChange("minServiceCount", e.target.value ? parseInt(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                />
              </div>
              <div>
                <input
                  type="number"
                  placeholder="สูงสุด"
                  min="0"
                  value={filters.maxServiceCount || ""}
                  onChange={(e) => handleFilterChange("maxServiceCount", e.target.value ? parseInt(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                />
              </div>
            </div>
          </div>

          {/* Sort Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              เรียงลำดับตาม
            </label>
            <div className="grid grid-cols-2 gap-4">
              <select
                value={filters.sortBy || "name"}
                onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
              >
                <option value="name">ชื่อร้านค้า</option>
                <option value="rating">คะแนนรีวิว</option>
                <option value="queueCount">จำนวนคิว</option>
                <option value="totalServices">จำนวนบริการ</option>
                <option value="createdAt">วันที่สร้าง</option>
              </select>
              <select
                value={filters.sortOrder || "asc"}
                onChange={(e) => handleFilterChange("sortOrder", e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
              >
                <option value="asc">น้อยไปมาก</option>
                <option value="desc">มากไปน้อย</option>
              </select>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          >
            รีเซ็ตตัวกรอง
          </button>
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              ยกเลิก
            </button>
            <button
              onClick={handleApplyFilters}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              ใช้ตัวกรอง
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
