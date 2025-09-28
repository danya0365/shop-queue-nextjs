"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ClientShopCategoriesPresenterFactory,
  ShopCategoriesViewModel,
  ShopCategory,
} from "./ShopCategoriesPresenter";

const presenterInstance = ClientShopCategoriesPresenterFactory.create();

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

  // Update filtered categories when viewModel or searchQuery changes
  useEffect(() => {
    if (viewModel) {
      if (!searchQuery.trim()) {
        setFilteredCategories(viewModel.categories);
      } else {
        const filtered = viewModel.categories.filter(
          (category) =>
            category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            category.description
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
        );
        setFilteredCategories(filtered);
      }
    }
  }, [viewModel, searchQuery]);

  // Load initial data if not provided
  useEffect(() => {
    if (!initialViewModel) {
      refreshData();
    }
  }, [initialViewModel]);

  /**
   * Refresh data from presenter
   */
  const refreshData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const newViewModel = await presenterInstance.getViewModel();
      setViewModel(newViewModel);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ";
      setError(errorMessage);
      console.error("Error loading categories data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Search categories
   */
  const searchCategories = useCallback(
    async (query: string) => {
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

        const searchResults = await presenterInstance.searchCategories(query);
        setFilteredCategories(searchResults);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการค้นหา";
        setError(errorMessage);
        console.error("Error searching categories:", err);
      }
    },
    [viewModel]
  );

  /**
   * Get category by ID
   */
  const getCategoryById = useCallback(
    async (id: string): Promise<ShopCategory | null> => {
      try {
        const category = await presenterInstance.getCategoryById(id);
        return category;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "เกิดข้อผิดพลาดในการดึงข้อมูลหมวดหมู่";
        setError(errorMessage);
        console.error("Error getting category by id:", err);
        return null;
      }
    },
    []
  );

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
    filteredCategories,
  };

  const actions: ShopCategoriesPresenterActions = {
    refreshData,
    searchCategories,
    getCategoryById,
    setError: handleSetError,
  };

  return [state, actions];
}
