"use client";

import { useCallback, useEffect, useState } from "react";
import { ShopMarketplaceViewModel } from "./ShopMarketplacePresenter";
import { ShopMarketplacePresenter } from "./ShopMarketplacePresenter";
import { ClientShopMarketplacePresenterFactory } from "./ShopMarketplacePresenter";

// Define filters interface
export interface ShopMarketplaceFilters {
  search?: string;
  category?: string;
  location?: string;
  priceRange?: [number, number];
  rating?: number;
}

// Define state interface following the pattern
export interface ShopMarketplacePresenterState {
  viewModel: ShopMarketplaceViewModel | null;
  loading: boolean;
  error: string | null;
  isCreateModalOpen: boolean;
  isEditModalOpen: boolean;
  isDeleteModalOpen: boolean;
  selectedItemId: string | null;
  filters: ShopMarketplaceFilters;
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
  setFilters: (filters: ShopMarketplaceFilters) => void;
  setCurrentPage: (page: number) => void;
  reset: () => void;
  setError: (error: string | null) => void;
  // Additional marketplace-specific actions
  loadData: () => Promise<void>;
  searchShops: (query: string, filters?: {
    category?: string;
    location?: string;
    priceRange?: [number, number];
    rating?: number;
  }) => Promise<void>;
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
  const [viewModel, setViewModel] = useState<ShopMarketplaceViewModel | null>(
    initialViewModel || null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [presenter, setPresenter] = useState<ShopMarketplacePresenter | null>(null);

  // Standard modal states following the pattern
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  // Filter and pagination states
  const [filters, setFilters] = useState<ShopMarketplaceFilters>({});
  const [currentPage, setCurrentPage] = useState(1);

  // Initialize presenter
  useEffect(() => {
    const initializePresenter = async () => {
      try {
        setLoading(true);
        const marketplacePresenter = await ClientShopMarketplacePresenterFactory.create();
        setPresenter(marketplacePresenter);

        if (!initialViewModel) {
          const initialData = await marketplacePresenter.getViewModel();
          setViewModel(initialData);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to initialize presenter";
        setError(errorMessage);
        console.error("Error initializing ShopMarketplacePresenter:", err);
      } finally {
        setLoading(false);
      }
    };

    initializePresenter();
  }, [initialViewModel]);

  // Load data
  const loadData = useCallback(async () => {
    if (!presenter) return;

    setLoading(true);
    setError(null);

    try {
      const data = await presenter.getViewModel();
      setViewModel(data);
      console.log("ShopMarketplacePresenter: Data loaded successfully");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load data";
      setError(errorMessage);
      console.error("Error loading ShopMarketplace data:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [presenter]);

  // Refresh data
  const refreshData = useCallback(async () => {
    await loadData();
  }, [loadData]);

  /**
   * Create a shop (placeholder for marketplace functionality)
   */
  const createShop = useCallback(async (shopData: unknown) => {
    setLoading(true);
    setError(null);

    try {
      // Placeholder - marketplace typically doesn't create shops
      // This would be implemented if marketplace allows shop creation
      console.log("ShopMarketplacePresenter: Shop creation attempted", { shopData });
      setIsCreateModalOpen(false);
      await loadData(); // Refresh data after creation
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      console.error("Error creating shop:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadData]);

  /**
   * Update a shop (placeholder for marketplace functionality)
   */
  const updateShop = useCallback(async (id: string, shopData: unknown) => {
    setLoading(true);
    setError(null);

    try {
      // Placeholder - marketplace typically doesn't update shops
      // This would be implemented if marketplace allows shop editing
      console.log("ShopMarketplacePresenter: Shop update attempted", { id, shopData });
      setIsEditModalOpen(false);
      setSelectedItemId(null);
      await loadData(); // Refresh data after update
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      console.error("Error updating shop:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadData]);

  /**
   * Delete a shop (placeholder for marketplace functionality)
   */
  const deleteShop = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      // Placeholder - marketplace typically doesn't delete shops
      // This would be implemented if marketplace allows shop deletion
      console.log("ShopMarketplacePresenter: Shop deletion attempted", { id });
      setIsDeleteModalOpen(false);
      setSelectedItemId(null);
      await loadData(); // Refresh data after deletion
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      console.error("Error deleting shop:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadData]);

  // Search shops
  const searchShops = useCallback(async (
    query: string,
    searchFilters?: {
      category?: string;
      location?: string;
      priceRange?: [number, number];
      rating?: number;
    }
  ) => {
    if (!presenter) return;

    setLoading(true);
    setError(null);

    try {
      const result = await presenter.searchShops(query, searchFilters);
      setViewModel(result);
      console.log("ShopMarketplacePresenter: Shops searched successfully", { query, filters: searchFilters });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to search shops";
      setError(errorMessage);
      console.error("Error searching shops:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [presenter]);

  // Filter by category
  const filterByCategory = useCallback(async (categoryId: string) => {
    if (!presenter) return;

    setLoading(true);
    setError(null);

    try {
      const result = await presenter.getShopsByCategory(categoryId);
      setViewModel(result);
      console.log("ShopMarketplacePresenter: Shops filtered by category successfully", { categoryId });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to filter by category";
      setError(errorMessage);
      console.error("Error filtering by category:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [presenter]);

  // Filter by location
  const filterByLocation = useCallback(async (locationId: string) => {
    if (!presenter) return;

    setLoading(true);
    setError(null);

    try {
      const result = await presenter.getShopsByLocation(locationId);
      setViewModel(result);
      console.log("ShopMarketplacePresenter: Shops filtered by location successfully", { locationId });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to filter by location";
      setError(errorMessage);
      console.error("Error filtering by location:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [presenter]);

  // Go to page
  const goToPage = useCallback(async (page: number) => {
    if (!presenter || !viewModel) return;

    setLoading(true);
    setError(null);

    try {
      // Use current search query and filters
      const result = await presenter.searchShops(
        viewModel.searchQuery,
        {
          category: viewModel.selectedCategory || undefined,
          location: viewModel.selectedLocation || undefined,
          priceRange: viewModel.priceRange || undefined,
          rating: viewModel.ratingFilter || undefined,
          page,
          limit: 12
        }
      );
      setViewModel(result);
      console.log("ShopMarketplacePresenter: Page changed successfully", { page });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load page";
      setError(errorMessage);
      console.error("Error loading page:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [presenter, viewModel]);

  // Clear filters
  const clearFilters = useCallback(async () => {
    if (!presenter) return;

    setLoading(true);
    setError(null);

    try {
      const result = await presenter.getViewModel();
      setViewModel(result);
      console.log("ShopMarketplacePresenter: Filters cleared successfully");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to clear filters";
      setError(errorMessage);
      console.error("Error clearing filters:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [presenter]);

  // Standard modal actions following the pattern
  const openCreateModal = useCallback(() => {
    setIsCreateModalOpen(true);
    setError(null);
    console.log("ShopMarketplacePresenter: Create modal opened");
  }, []);

  const closeCreateModal = useCallback(() => {
    setIsCreateModalOpen(false);
    setError(null);
    console.log("ShopMarketplacePresenter: Create modal closed");
  }, []);

  const openEditModal = useCallback((itemId: string) => {
    setSelectedItemId(itemId);
    setIsEditModalOpen(true);
    setError(null);
    console.log("ShopMarketplacePresenter: Edit modal opened", { itemId });
  }, []);

  const closeEditModal = useCallback(() => {
    setIsEditModalOpen(false);
    setSelectedItemId(null);
    setError(null);
    console.log("ShopMarketplacePresenter: Edit modal closed");
  }, []);

  const openDeleteModal = useCallback((itemId: string) => {
    setSelectedItemId(itemId);
    setIsDeleteModalOpen(true);
    setError(null);
    console.log("ShopMarketplacePresenter: Delete modal opened", { itemId });
  }, []);

  const closeDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(false);
    setSelectedItemId(null);
    setError(null);
    console.log("ShopMarketplacePresenter: Delete modal closed");
  }, []);

  // Filter and pagination handlers
  const handleSetFilters = useCallback((newFilters: ShopMarketplaceFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
    console.log("ShopMarketplacePresenter: Filters updated", { filters: newFilters });
  }, []);

  const handleSetCurrentPage = useCallback((page: number) => {
    setCurrentPage(page);
    console.log("ShopMarketplacePresenter: Page changed", { page });
  }, []);

  // Reset function
  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedItemId(null);
    setFilters({});
    setCurrentPage(1);
    console.log("ShopMarketplacePresenter: Reset");
  }, []);

  // Legacy modal actions for backward compatibility
  const openShopDetail = useCallback((shopId: string) => {
    setSelectedItemId(shopId);
    setIsEditModalOpen(true); // Use edit modal for shop details
    setError(null);
    console.log("ShopMarketplacePresenter: Shop detail opened", { shopId });
  }, []);

  const closeShopDetail = useCallback(() => {
    setIsEditModalOpen(false);
    setSelectedItemId(null);
    setError(null);
    console.log("ShopMarketplacePresenter: Shop detail closed");
  }, []);

  const openFilterModal = useCallback(() => {
    // For marketplace, we can use create modal for filters
    setIsCreateModalOpen(true);
    setError(null);
    console.log("ShopMarketplacePresenter: Filter modal opened");
  }, []);

  const closeFilterModal = useCallback(() => {
    setIsCreateModalOpen(false);
    setError(null);
    console.log("ShopMarketplacePresenter: Filter modal closed");
  }, []);

  // Apply filters from modal
  const applyFilters = useCallback(async (modalFilters: {
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
    if (!presenter) return;

    setLoading(true);
    setError(null);

    try {
      // Convert modal filters to presenter filters format
      const presenterFilters: ShopMarketplaceFilters = {
        search: modalFilters.searchQuery,
        category: modalFilters.categoryId,
        location: modalFilters.locationId,
        rating: modalFilters.minRating, // Use min rating as the rating filter
      };

      // Update internal filters state
      setFilters(presenterFilters);
      setCurrentPage(1); // Reset to first page

      // Search shops with the new filters
      const result = await presenter.searchShops(
        modalFilters.searchQuery || "",
        {
          category: modalFilters.categoryId,
          location: modalFilters.locationId,
          rating: modalFilters.minRating,
        }
      );
      
      setViewModel(result);
      console.log("ShopMarketplacePresenter: Filters applied successfully", { filters: modalFilters });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to apply filters";
      setError(errorMessage);
      console.error("Error applying filters:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [presenter]);

  // State object following the pattern
  const state: ShopMarketplacePresenterState = {
    viewModel,
    loading,
    error,
    isCreateModalOpen,
    isEditModalOpen,
    isDeleteModalOpen,
    selectedItemId,
    filters,
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
    setFilters: handleSetFilters,
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
