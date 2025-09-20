"use client";

import { getPaginationConfig } from "@/src/infrastructure/config/PaginationConfig";
import { useState, useEffect, useCallback } from 'react';
import { ClientCustomerRewardsPresenterFactory } from './CustomerRewardsPresenter';
import type { 
  CustomerRewardsViewModel,
  RewardsFilters, 
  RewardsFilterType, 
  Pagination 
} from './CustomerRewardsPresenter';

// Define filter type
export type {
  RewardsFilterType,
  RewardsFilters,
}

// Re-export pagination interface
export type { Pagination };

export function useCustomerRewardsPresenter(
  shopId: string,
  initialViewModel?: CustomerRewardsViewModel
) {
  const [viewModel, setViewModel] = useState<CustomerRewardsViewModel | null>(
    initialViewModel || null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // State for pagination and filters
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(getPaginationConfig().REWARDS_PER_PAGE || 10);
  const [filters, setFilters] = useState<RewardsFilters>({
    type: "all",
    category: "all",
    status: "all",
    dateRange: "all",
    startDate: undefined,
    endDate: undefined,
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

      const presenter = await ClientCustomerRewardsPresenterFactory.create();

      const newViewModel = await presenter.getViewModel(
        shopId,
        currentPage,
        perPage,
        filters
      );

      setViewModel(newViewModel);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load rewards data');
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

  // Load data when filters change
  useEffect(() => {
    if (initialViewModel) {
      setCurrentPage(1); // Reset to first page when filters change
      loadData();
    }
  }, [filters, initialViewModel, loadData]);

  // Pagination handlers
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handlePerPageChange = useCallback((newPerPage: number) => {
    setPerPage(newPerPage);
    setCurrentPage(1); // Reset to first page when per page changes
  }, []);

  // Individual pagination handlers for each data type
  const handleAvailableRewardsPageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleRedeemedRewardsPageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleRewardTransactionsPageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  // Filter handlers
  const handleTypeFilterChange = useCallback((type: RewardsFilterType) => {
    setFilters(prev => ({ ...prev, type }));
  }, []);

  const handleCategoryFilterChange = useCallback((category: string) => {
    setFilters(prev => ({ ...prev, category }));
  }, []);

  const handleStatusFilterChange = useCallback((status: string) => {
    setFilters(prev => ({ ...prev, status }));
  }, []);

  const handleDateRangeChange = useCallback((dateRange: 'all' | 'month' | 'quarter' | 'year' | 'custom') => {
    setFilters(prev => ({
      ...prev,
      dateRange,
      startDate: dateRange === 'custom' ? prev.startDate : undefined,
      endDate: dateRange === 'custom' ? prev.endDate : undefined,
    }));
  }, []);

  const handleCustomDateRangeChange = useCallback((startDate: string, endDate: string) => {
    setFilters(prev => ({ 
      ...prev, 
      startDate, 
      endDate,
      dateRange: "custom"
    }));
  }, []);

  // Action handlers
  const handleRedeemReward = useCallback(async (rewardId: string) => {
    if (!shopId) return;
    
    setActionLoading(true);
    setError(null);
    
    try {
      const presenter = await ClientCustomerRewardsPresenterFactory.create();
      await presenter.redeemReward(shopId, rewardId);
      // Refresh data after redemption
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to redeem reward');
    } finally {
      setActionLoading(false);
    }
  }, [shopId, loadData, setActionLoading]);

  const handleViewRewardDetails = useCallback(async (rewardId: string) => {
    if (!shopId) return null;
    
    try {
      const presenter = await ClientCustomerRewardsPresenterFactory.create();
      return await presenter.getRewardDetails(shopId, rewardId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get reward details');
      return null;
    }
  }, [shopId]);

  const refreshData = useCallback(async () => {
    await loadData();
  }, [loadData]);

  // Get pagination info from view model for each data type
  const availableRewardsPagination = viewModel?.availableRewards?.pagination || {
    currentPage,
    perPage,
    totalCount: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  };

  const redeemedRewardsPagination = viewModel?.redeemedRewards?.pagination || {
    currentPage,
    perPage,
    totalCount: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  };

  const rewardTransactionsPagination = viewModel?.rewardTransactions?.pagination || {
    currentPage,
    perPage,
    totalCount: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  };

  // Default pagination for backward compatibility
  const pagination = availableRewardsPagination;

  return {
    // Data
    viewModel,
    loading,
    actionLoading,
    error,
    
    // Pagination
    currentPage,
    perPage,
    pagination,
    availableRewardsPagination,
    redeemedRewardsPagination,
    rewardTransactionsPagination,
    
    // Filters
    filters,
    
    // Actions
    handlePageChange,
    handlePerPageChange,
    handleAvailableRewardsPageChange,
    handleRedeemedRewardsPageChange,
    handleRewardTransactionsPageChange,
    handleTypeFilterChange,
    handleCategoryFilterChange,
    handleStatusFilterChange,
    handleDateRangeChange,
    handleCustomDateRangeChange,
    handleRedeemReward,
    handleViewRewardDetails,
    refreshData,
  };
}
