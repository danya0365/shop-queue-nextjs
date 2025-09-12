"use client";

import { useState, useEffect, useCallback } from "react";
import { ServicesViewModel } from "@/src/presentation/presenters/shop/backend/ServicesPresenter";

interface UseServicesPresenterReturn {
  viewModel: ServicesViewModel | null;
  loading: boolean;
  error: string | null;
  currentPage: number;
  perPage: number;
  filters: {
    searchQuery: string;
    categoryFilter: string;
    availabilityFilter: string;
  };
  handlePageChange: (page: number) => void;
  handleNextPage: () => void;
  handlePrevPage: () => void;
  handleSearchChange: (value: string) => void;
  handleCategoryChange: (value: string) => void;
  handleAvailabilityChange: (value: string) => void;
  resetFilters: () => void;
  refreshData: () => void;
}

export function useServicesPresenter(shopId: string, initialViewModel?: ServicesViewModel): UseServicesPresenterReturn {
  const [viewModel, setViewModel] = useState<ServicesViewModel | null>(initialViewModel || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for pagination and filters
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  const [filters, setFilters] = useState({
    searchQuery: "",
    categoryFilter: "all",
    availabilityFilter: "all",
  });

  // Initialize with initial view model if provided
  useEffect(() => {
    if (initialViewModel) {
      setViewModel(initialViewModel);
      setLoading(false);
    }
  }, [initialViewModel]);

  // Function to load data
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { ClientServicesPresenterFactory } = await import("@/src/presentation/presenters/shop/backend/ServicesPresenter");
      const presenter = await ClientServicesPresenterFactory.create();
      
      const newViewModel = await presenter.getViewModel(
        shopId,
        currentPage,
        perPage,
        {
          searchQuery: filters.searchQuery || undefined,
          categoryFilter: filters.categoryFilter !== "all" ? filters.categoryFilter : undefined,
          availabilityFilter: filters.availabilityFilter !== "all" ? filters.availabilityFilter : undefined,
        }
      );
      
      setViewModel(newViewModel);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load services data");
      console.error("Error loading services data:", err);
    } finally {
      setLoading(false);
    }
  }, [shopId, currentPage, perPage, filters]);

  // Load data when dependencies change, but not if we have initial view model
  useEffect(() => {
    if (!initialViewModel) {
      loadData();
    }
  }, [loadData, initialViewModel]);

  // Pagination handlers
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleNextPage = useCallback(() => {
    if (viewModel?.services.pagination.hasNext) {
      setCurrentPage(prev => prev + 1);
    }
  }, [viewModel?.services.pagination.hasNext]);

  const handlePrevPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  }, [currentPage]);

  // Filter handlers
  const handleSearchChange = useCallback((value: string) => {
    setFilters(prev => ({ ...prev, searchQuery: value }));
    setCurrentPage(1); // Reset to first page when filtering
  }, []);

  const handleCategoryChange = useCallback((value: string) => {
    setFilters(prev => ({ ...prev, categoryFilter: value }));
    setCurrentPage(1); // Reset to first page when filtering
  }, []);

  const handleAvailabilityChange = useCallback((value: string) => {
    setFilters(prev => ({ ...prev, availabilityFilter: value }));
    setCurrentPage(1); // Reset to first page when filtering
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      searchQuery: "",
      categoryFilter: "all",
      availabilityFilter: "all",
    });
    setCurrentPage(1);
  }, []);

  const refreshData = useCallback(() => {
    loadData();
  }, [loadData]);

  return {
    viewModel,
    loading,
    error,
    currentPage,
    perPage,
    filters,
    handlePageChange,
    handleNextPage,
    handlePrevPage,
    handleSearchChange,
    handleCategoryChange,
    handleAvailabilityChange,
    resetFilters,
    refreshData,
  };
}
