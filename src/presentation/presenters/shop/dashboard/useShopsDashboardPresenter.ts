"use client";

import { useCallback, useEffect, useState } from "react";
import { ShopsDashboardViewModel } from "./ShopsDashboardPresenter";
import { ShopsDashboardPresenter } from "./ShopsDashboardPresenter";
import { ClientShopsDashboardPresenterFactory } from "./ShopsDashboardPresenter";

export interface ShopsDashboardPresenterHook {
  // State
  viewModel: ShopsDashboardViewModel | null;
  loading: boolean;
  error: string | null;

  // Modal states
  isCreateModalOpen: boolean;
  isEditModalOpen: boolean;
  isDeleteModalOpen: boolean;
  selectedItemId: string | null;

  // Actions
  loadData: () => Promise<void>;
  refreshData: () => Promise<void>;
  goToPage: (page: number) => Promise<void>;
  searchShops: (query: string) => Promise<void>;

  // Modal actions
  openCreateModal: () => void;
  closeCreateModal: () => void;
  openEditModal: (shopId: string) => void;
  closeEditModal: () => void;
  openDeleteModal: (shopId: string) => void;
  closeDeleteModal: () => void;
}

// Define view props interface
export interface ShopsDashboardViewProps {
  initialViewModel?: ShopsDashboardViewModel | null;
}

/**
 * Custom hook for ShopsDashboard presenter
 * Provides state management and actions for ShopsDashboard operations
 */
export function useShopsDashboardPresenter(
  initialViewModel: ShopsDashboardViewModel | null = null
): ShopsDashboardPresenterHook {
  const [viewModel, setViewModel] = useState<ShopsDashboardViewModel | null>(
    initialViewModel || null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [presenter, setPresenter] = useState<ShopsDashboardPresenter | null>(null);

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  // Initialize presenter
  useEffect(() => {
    const initializePresenter = async () => {
      try {
        const presenterInstance = await ClientShopsDashboardPresenterFactory.create();
        setPresenter(presenterInstance);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        console.error("Error initializing presenter:", err);
        setLoading(false);
      }
    };

    initializePresenter();
  }, []);

  /**
   * Load data from presenter
   */
  const loadData = useCallback(async () => {
    if (!presenter) return;
    
    setLoading(true);
    setError(null);

    try {
      const newViewModel = await presenter.getViewModel(1, 10);
      setViewModel(newViewModel);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      console.error("Error loading shops dashboard data:", err);
    } finally {
      setLoading(false);
    }
  }, [presenter]);

  /**
   * Refresh data
   */
  const refreshData = useCallback(async () => {
    await loadData();
  }, [loadData]);

  /**
   * Go to specific page
   */
  const goToPage = useCallback(async (page: number) => {
    if (!presenter) return;
    
    setLoading(true);
    setError(null);

    try {
      const newViewModel = await presenter.getViewModel(page, 10);
      setViewModel(newViewModel);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      console.error("Error loading shops dashboard data:", err);
    } finally {
      setLoading(false);
    }
  }, [presenter]);

  /**
   * Search shops
   */
  const searchShops = useCallback(async (query: string) => {
    if (!presenter) return;
    
    setLoading(true);
    setError(null);

    try {
      const newViewModel = await presenter.getViewModel(1, 10, query);
      setViewModel(newViewModel);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      console.error("Error searching shops:", err);
    } finally {
      setLoading(false);
    }
  }, [presenter]);

  // Modal actions
  const openCreateModal = useCallback(() => {
    setIsCreateModalOpen(true);
  }, []);

  const closeCreateModal = useCallback(() => {
    setIsCreateModalOpen(false);
  }, []);

  const openEditModal = useCallback((shopId: string) => {
    setSelectedItemId(shopId);
    setIsEditModalOpen(true);
  }, []);

  const closeEditModal = useCallback(() => {
    setIsEditModalOpen(false);
    setSelectedItemId(null);
  }, []);

  const openDeleteModal = useCallback((shopId: string) => {
    setSelectedItemId(shopId);
    setIsDeleteModalOpen(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(false);
    setSelectedItemId(null);
  }, []);

  // Load initial data
  useEffect(() => {
    if (presenter && !initialViewModel) {
      loadData();
    } else if (initialViewModel) {
      setViewModel(initialViewModel);
      setLoading(false);
    }
  }, [presenter, initialViewModel, loadData]);

  return {
    // State
    viewModel,
    loading,
    error,

    // Modal states
    isCreateModalOpen,
    isEditModalOpen,
    isDeleteModalOpen,
    selectedItemId,

    // Actions
    loadData,
    refreshData,
    goToPage,
    searchShops,

    // Modal actions
    openCreateModal,
    closeCreateModal,
    openEditModal,
    closeEditModal,
    openDeleteModal,
    closeDeleteModal,
  };
}
