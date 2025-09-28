"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  ClientShopMarketplacePresenterFactory,
  ShopMarketplaceViewModel,
} from "./ShopMarketplacePresenter";

const marketplacePresenter = ClientShopMarketplacePresenterFactory.create();

// Define state interface following the pattern
export interface ShopMarketplacePresenterState {
  viewModel: ShopMarketplaceViewModel | null;
  loading: boolean;
  error: string | null;
  isCreateModalOpen: boolean;
  isEditModalOpen: boolean;
  isDeleteModalOpen: boolean;
  selectedItemId: string | null;
  currentPage: number;
}

// Define actions interface following the pattern
export interface ShopMarketplacePresenterActions {
  refreshData: () => Promise<void>;
  createShop: (shopData: unknown) => Promise<void>;
  updateShop: (id: string, shopData: unknown) => Promise<void>;
  deleteShop: (id: string) => Promise<void>;
  openCreateModal: () => void;
  closeCreateModal: () => void;
  openEditModal: (itemId: string) => void;
  closeEditModal: () => void;
  openDeleteModal: (itemId: string) => void;
  closeDeleteModal: () => void;
  setCurrentPage: (page: number) => void;
  reset: () => void;
  setError: (error: string | null) => void;
  // Additional marketplace-specific actions
  loadData: () => Promise<void>;
  searchShops: (
    query: string,
    filters?: {
      category?: string;
      location?: string;
      priceRange?: [number, number];
      rating?: number;
    }
  ) => Promise<void>;
  filterByCategory: (categoryId: string) => Promise<void>;
  filterByLocation: (locationId: string) => Promise<void>;
  goToPage: (page: number) => Promise<void>;
  clearFilters: () => Promise<void>;
  // Legacy modal actions for backward compatibility
  openShopDetail: (shopId: string) => void;
  closeShopDetail: () => void;
  openFilterModal: () => void;
  closeFilterModal: () => void;
  applyFilters: (filters: {
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
  }) => Promise<void>;
}

// Define view props interface
export interface ShopMarketplaceViewProps {
  initialViewModel?: ShopMarketplaceViewModel | null;
}

/**
 * Custom hook for Shop Marketplace presenter
 * Provides state management and actions for Shop Marketplace operations
 */
export function useShopMarketplacePresenter(
  initialViewModel: ShopMarketplaceViewModel | null = null
): [ShopMarketplacePresenterState, ShopMarketplacePresenterActions] {
  const searchParams = useSearchParams();
  const [viewModel, setViewModel] = useState<ShopMarketplaceViewModel | null>(
    initialViewModel || null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Standard modal states following the pattern
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  // Pagination state with default values from URL
  const [currentPage, setCurrentPage] = useState(() => {
    const pageFromUrl = searchParams.get("page")
      ? parseInt(searchParams.get("page")!)
      : 1;
    return pageFromUrl;
  });

  // Initialize presenter
  useEffect(() => {
    const initializePresenter = async () => {
      try {
        setLoading(true);

        if (!initialViewModel) {
          const initialData = await marketplacePresenter.getViewModel({
            searchQuery: searchParams.get("q") || undefined,
            category: searchParams.get("category") || undefined,
            location: searchParams.get("location") || undefined,
            page: searchParams.get("page")
              ? parseInt(searchParams.get("page")!)
              : 1,
          });
          setViewModel(initialData);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to initialize presenter";
        setError(errorMessage);
        console.error("Error initializing ShopMarketplacePresenter:", err);
      } finally {
        setLoading(false);
      }
    };

    initializePresenter();
  }, [initialViewModel, searchParams]);

  // Load data
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await marketplacePresenter.getViewModel({
        searchQuery: searchParams.get("q") || undefined,
        category: searchParams.get("category") || undefined,
        location: searchParams.get("location") || undefined,
        page: currentPage,
      });
      setViewModel(data);
      console.log("ShopMarketplacePresenter: Data loaded successfully");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load data";
      console.error("Error loading ShopMarketplace data:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [searchParams, currentPage]);

  // Refresh data
  const refreshData = useCallback(async () => {
    await loadData();
  }, [loadData]);

  /**
   * Create a shop (placeholder for marketplace functionality)
   */
  const createShop = useCallback(
    async (shopData: unknown) => {
      setLoading(true);
      setError(null);

      try {
        // Placeholder - marketplace typically doesn't create shops
        // This would be implemented if marketplace allows shop creation
        console.log("ShopMarketplacePresenter: Shop creation attempted", {
          shopData,
        });
        setIsCreateModalOpen(false);
        await loadData(); // Refresh data after creation
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        console.error("Error creating shop:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [loadData]
  );

  /**
   * Update a shop (placeholder for marketplace functionality)
   */
  const updateShop = useCallback(
    async (id: string, shopData: unknown) => {
      setLoading(true);
      setError(null);

      try {
        // Placeholder - marketplace typically doesn't update shops
        // This would be implemented if marketplace allows shop editing
        console.log("ShopMarketplacePresenter: Shop update attempted", {
          id,
          shopData,
        });
        setIsEditModalOpen(false);
        setSelectedItemId(null);
        await loadData(); // Refresh data after update
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        console.error("Error updating shop:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [loadData]
  );

  /**
   * Delete a shop (placeholder for marketplace functionality)
   */
  const deleteShop = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);

      try {
        // Placeholder - marketplace typically doesn't delete shops
        // This would be implemented if marketplace allows shop deletion
        console.log("ShopMarketplacePresenter: Shop deletion attempted", {
          id,
        });
        setIsDeleteModalOpen(false);
        setSelectedItemId(null);
        await loadData(); // Refresh data after deletion
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        console.error("Error deleting shop:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [loadData]
  );

  // Search shops
  const searchShops = useCallback(
    async (
      query: string,
      searchFilters?: {
        category?: string;
        location?: string;
        priceRange?: [number, number];
        rating?: number;
      }
    ) => {
      setLoading(true);
      setError(null);

      try {
        const result = await marketplacePresenter.searchShops(
          query,
          searchFilters
        );
        setViewModel(result);
        console.log("ShopMarketplacePresenter: Shops searched successfully", {
          query,
          filters: searchFilters,
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to search shops";
        setError(errorMessage);
        console.error("Error searching shops:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Filter by category
  const filterByCategory = useCallback(async (categoryId: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await marketplacePresenter.getShopsByCategory(categoryId);
      setViewModel(result);
      console.log(
        "ShopMarketplacePresenter: Shops filtered by category successfully",
        { categoryId }
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to filter by category";
      setError(errorMessage);
      console.error("Error filtering by category:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Filter by location
  const filterByLocation = useCallback(async (locationId: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await marketplacePresenter.getShopsByLocation(locationId);
      setViewModel(result);
      console.log(
        "ShopMarketplacePresenter: Shops filtered by location successfully",
        { locationId }
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to filter by location";
      setError(errorMessage);
      console.error("Error filtering by location:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Go to page
  const goToPage = useCallback(
    async (page: number) => {
      setLoading(true);
      setError(null);

      try {
        const result = await marketplacePresenter.getViewModel({
          searchQuery: searchParams.get("q") || undefined,
          category: searchParams.get("category") || undefined,
          location: searchParams.get("location") || undefined,
          page,
        });
        setViewModel(result);
        setCurrentPage(page);
        console.log("ShopMarketplacePresenter: Page changed successfully", {
          page,
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load page";
        setError(errorMessage);
        console.error("Error loading page:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [searchParams]
  );

  // Clear filters
  const clearFilters = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await marketplacePresenter.getViewModel({
        page: 1,
      });
      setViewModel(result);
      setCurrentPage(1);
      console.log("ShopMarketplacePresenter: Filters cleared successfully");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to clear filters";
      setError(errorMessage);
      console.error("Error clearing filters:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Modal handlers
  const openCreateModal = useCallback(() => {
    setIsCreateModalOpen(true);
  }, []);

  const closeCreateModal = useCallback(() => {
    setIsCreateModalOpen(false);
  }, []);

  const openEditModal = useCallback((itemId: string) => {
    setSelectedItemId(itemId);
    setIsEditModalOpen(true);
  }, []);

  const closeEditModal = useCallback(() => {
    setIsEditModalOpen(false);
    setSelectedItemId(null);
  }, []);

  const openDeleteModal = useCallback((itemId: string) => {
    setSelectedItemId(itemId);
    setIsDeleteModalOpen(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(false);
    setSelectedItemId(null);
  }, []);

  // Pagination handler
  const handleSetCurrentPage = useCallback((page: number) => {
    setCurrentPage(page);
    console.log("ShopMarketplacePresenter: Page changed", { page });
  }, []);

  // Reset function
  const reset = useCallback(() => {
    setViewModel(null);
    setError(null);
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedItemId(null);
    setCurrentPage(1);
  }, []);

  // Legacy modal actions for backward compatibility
  const openShopDetail = useCallback((shopId: string) => {
    console.log("ShopMarketplacePresenter: Opening shop detail", { shopId });
    // Placeholder implementation
  }, []);

  const closeShopDetail = useCallback(() => {
    console.log("ShopMarketplacePresenter: Closing shop detail");
    // Placeholder implementation
  }, []);

  const openFilterModal = useCallback(() => {
    console.log("ShopMarketplacePresenter: Opening filter modal");
    // Placeholder implementation
  }, []);

  const closeFilterModal = useCallback(() => {
    console.log("ShopMarketplacePresenter: Closing filter modal");
    // Placeholder implementation
  }, []);

  // Apply filters function
  const applyFilters = useCallback(
    async (filters: {
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
    }) => {
      setLoading(true);
      setError(null);

      try {
        const result = await marketplacePresenter.getViewModel({
          searchQuery: filters.searchQuery,
          category: filters.categoryId,
          location: filters.locationId,
          page: 1,
        });
        setViewModel(result);
        setCurrentPage(1);
        console.log("ShopMarketplacePresenter: Filters applied successfully", {
          filters,
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to apply filters";
        setError(errorMessage);
        console.error("Error applying filters:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // State object following the pattern
  const state: ShopMarketplacePresenterState = {
    viewModel,
    loading,
    error,
    isCreateModalOpen,
    isEditModalOpen,
    isDeleteModalOpen,
    selectedItemId,
    currentPage,
  };

  // Actions object following the pattern
  const actions: ShopMarketplacePresenterActions = {
    refreshData,
    createShop,
    updateShop,
    deleteShop,
    openCreateModal,
    closeCreateModal,
    openEditModal,
    closeEditModal,
    openDeleteModal,
    closeDeleteModal,
    setCurrentPage: handleSetCurrentPage,
    reset,
    setError,
    // Additional marketplace-specific actions
    loadData,
    searchShops,
    filterByCategory,
    filterByLocation,
    goToPage,
    clearFilters,
    // Legacy modal actions for backward compatibility
    openShopDetail,
    closeShopDetail,
    openFilterModal,
    closeFilterModal,
    applyFilters,
  };

  return [state, actions];
}
