"use client";

import { useState, useCallback, useEffect } from "react";
import { 
  ShopCategoriesPresenter, 
  ClientShopCategoriesPresenterFactory,
  ShopCategory,
  ShopCategoriesViewModel 
} from "./ShopCategoriesPresenter";

export interface ShopCategoriesPresenterActions {
  refreshData: () => Promise<void>;
  searchCategories: (query: string) => Promise<void>;
  getCategoryById: (id: string) => Promise<ShopCategory | null>;
  setError: (error: string | null) => void;
}

export interface ShopCategoriesPresenterState {
  viewModel: ShopCategoriesViewModel | null;
  loading: boolean;
  error: string | null;
  searchQuery: string;
  filteredCategories: ShopCategory[];
}

/**
 * Custom hook for Shop Categories presenter
 * Provides state management and actions for categories operations
 */
export function useShopCategoriesPresenter(
  initialViewModel: ShopCategoriesViewModel | null = null
): [ShopCategoriesPresenterState, ShopCategoriesPresenterActions] {
  const [viewModel, setViewModel] = useState<ShopCategoriesViewModel | null>(
    initialViewModel || null
  );
  const [loading, setLoading] = useState(!initialViewModel);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCategories, setFilteredCategories] = useState<ShopCategory[]>(
    initialViewModel?.categories || []
  );
  const [presenter, setPresenter] = useState<ShopCategoriesPresenter | null>(null);

  // Initialize presenter
  useEffect(() => {
    const initPresenter = async () => {
      try {
        const presenterInstance = await ClientShopCategoriesPresenterFactory.create();
        setPresenter(presenterInstance);
      } catch (err) {
        console.error("Error initializing presenter:", err);
        setError("ไม่สามารถเริ่มต้นระบบได้");
      }
    };

    initPresenter();
  }, []);

  // Update filtered categories when viewModel or searchQuery changes
  useEffect(() => {
    if (viewModel) {
      if (!searchQuery.trim()) {
        setFilteredCategories(viewModel.categories);
      } else {
        const filtered = viewModel.categories.filter(category =>
          category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          category.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredCategories(filtered);
      }
    }
  }, [viewModel, searchQuery]);

  // Load initial data if not provided
  useEffect(() => {
    if (!initialViewModel && presenter) {
      refreshData();
    }
  }, [presenter, initialViewModel]);

  /**
   * Refresh data from presenter
   */
  const refreshData = useCallback(async () => {
    if (!presenter) return;

    setLoading(true);
    setError(null);

    try {
      const newViewModel = await presenter.getViewModel();
      setViewModel(newViewModel);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ";
      setError(errorMessage);
      console.error("Error loading categories data:", err);
    } finally {
      setLoading(false);
    }
  }, [presenter]);

  /**
   * Search categories
   */
  const searchCategories = useCallback(async (query: string) => {
    if (!presenter) return;

    setSearchQuery(query);
    setError(null);

    try {
      if (!query.trim()) {
        // Reset to all categories
        if (viewModel) {
          setFilteredCategories(viewModel.categories);
        }
        return;
      }

      const searchResults = await presenter.searchCategories(query);
      setFilteredCategories(searchResults);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการค้นหา";
      setError(errorMessage);
      console.error("Error searching categories:", err);
    }
  }, [presenter, viewModel]);

  /**
   * Get category by ID
   */
  const getCategoryById = useCallback(async (id: string): Promise<ShopCategory | null> => {
    if (!presenter) return null;

    try {
      const category = await presenter.getCategoryById(id);
      return category;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการดึงข้อมูลหมวดหมู่";
      setError(errorMessage);
      console.error("Error getting category by id:", err);
      return null;
    }
  }, [presenter]);

  /**
   * Set error state
   */
  const handleSetError = useCallback((newError: string | null) => {
    setError(newError);
  }, []);

  const state: ShopCategoriesPresenterState = {
    viewModel,
    loading,
    error,
    searchQuery,
    filteredCategories
  };

  const actions: ShopCategoriesPresenterActions = {
    refreshData,
    searchCategories,
    getCategoryById,
    setError: handleSetError
  };

  return [state, actions];
}
