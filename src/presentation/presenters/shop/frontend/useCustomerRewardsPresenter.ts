"use client";

import { getPaginationConfig } from "@/src/infrastructure/config/PaginationConfig";
import { useCustomerStore } from "@/src/presentation/stores/customer-store";
import { useProfileStore } from "@/src/presentation/stores/profile-store";
import { useCallback, useEffect, useState } from "react";
import { ClientCustomerPresenterFactory } from "./CustomerPresenter";
import type {
  CustomerRewardsViewModel,
  Pagination,
  RewardsFilters,
  RewardsFilterType,
} from "./CustomerRewardsPresenter";
import { ClientCustomerRewardsPresenterFactory } from "./CustomerRewardsPresenter";

const presenter = ClientCustomerRewardsPresenterFactory.create();
const customerPresenter = ClientCustomerPresenterFactory.create();

// Define filter type
export type { RewardsFilters, RewardsFilterType };

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
  const { activeProfile } = useProfileStore();

  // Customer store for persisting customer ID
  const { getCustomer, setCustomer: setStoredCustomer } = useCustomerStore();
  const storedCustomer = getCustomer(shopId);

  // State for pagination and filters
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(
    getPaginationConfig().REWARDS_PER_PAGE || 10
  );
  const [filters, setFilters] = useState<RewardsFilters>({
    type: "all",
    category: "all",
    status: "all",
    dateRange: "all",
    startDate: undefined,
    endDate: undefined,
  });

  // Load customer data from store and pre-fill form if available
  useEffect(() => {
    const loadCustomerData = async () => {
      // Case 1: User has active profile but no stored customer (first time in this shop)
      if (activeProfile?.id && !storedCustomer) {
        try {
          console.log(
            "Loading customer data by profile ID for authenticated user"
          );

          const profileCustomer =
            await customerPresenter.getCustomerByProfileId(
              activeProfile.id,
              shopId
            );

          if (profileCustomer) {
            // Store customer data for future use
            setStoredCustomer(shopId, {
              id: profileCustomer.id,
              name: profileCustomer.name,
              phone: profileCustomer.phone,
              shopId: profileCustomer.shopId,
              joinedDate: profileCustomer.createdAt,
            });
          }
        } catch (error) {
          console.error("Error loading customer by profile ID:", error);
        }
      }

      // Case 2: User has stored customer data (existing logic)
      if (storedCustomer && storedCustomer.shopId === shopId) {
        try {
          const currentCustomer = await customerPresenter.getCustomerById(
            storedCustomer.id
          );

          // TODO: check if profile id is null and user is authenticated
          // if so, link customer to profile
          if (currentCustomer.profileId === null && activeProfile?.id) {
            console.log("Customer is not linked to profile");
            await customerPresenter.linkCustomerToProfile(
              currentCustomer.id,
              currentCustomer.phone
            );
          }
        } catch (error) {
          console.error("Error loading customer data:", error);
          setStoredCustomer(shopId, null);
        }
      }
    };

    loadCustomerData();
  }, [
    storedCustomer,
    shopId,
    setStoredCustomer,
    activeProfile?.id,
    activeProfile,
  ]);

  // Initialize with initial view model if provided
  useEffect(() => {
    if (initialViewModel) {
      setViewModel(initialViewModel);
      setLoading(false);
    }
  }, [initialViewModel]);

  // Function to load data
  const loadData = useCallback(async () => {
    if (!storedCustomer?.id) return;
    try {
      setLoading(true);
      setError(null);

      const newViewModel = await presenter.getViewModel(
        shopId,
        storedCustomer.id,
        currentPage,
        perPage,
        filters
      );

      setViewModel(newViewModel);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load rewards data"
      );
    } finally {
      setLoading(false);
    }
  }, [shopId, currentPage, perPage, filters, storedCustomer?.id]);

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
    setFilters((prev) => ({ ...prev, type }));
  }, []);

  const handleCategoryFilterChange = useCallback((category: string) => {
    setFilters((prev) => ({ ...prev, category }));
  }, []);

  const handleStatusFilterChange = useCallback((status: string) => {
    setFilters((prev) => ({ ...prev, status }));
  }, []);

  const handleDateRangeChange = useCallback(
    (dateRange: "all" | "month" | "quarter" | "year" | "custom") => {
      setFilters((prev) => ({
        ...prev,
        dateRange,
        startDate: dateRange === "custom" ? prev.startDate : undefined,
        endDate: dateRange === "custom" ? prev.endDate : undefined,
      }));
    },
    []
  );

  const handleCustomDateRangeChange = useCallback(
    (startDate: string, endDate: string) => {
      setFilters((prev) => ({
        ...prev,
        startDate,
        endDate,
        dateRange: "custom",
      }));
    },
    []
  );

  // Action handlers
  const handleRedeemReward = useCallback(
    async (rewardId: string) => {
      if (!shopId || !storedCustomer?.id) return;

      setActionLoading(true);
      setError(null);

      try {
        await presenter.redeemReward(shopId, storedCustomer.id, rewardId);
        // Refresh data after redemption
        await loadData();
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to redeem reward"
        );
      } finally {
        setActionLoading(false);
      }
    },
    [shopId, loadData, setActionLoading, storedCustomer?.id]
  );

  const handleViewRewardDetails = useCallback(
    async (rewardId: string) => {
      if (!shopId || !storedCustomer?.id) return null;

      try {
        return await presenter.getRewardDetails(
          shopId,
          storedCustomer.id,
          rewardId
        );
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to get reward details"
        );
        return null;
      }
    },
    [shopId, storedCustomer?.id]
  );

  const refreshData = useCallback(async () => {
    await loadData();
  }, [loadData]);

  // Get pagination info from view model for each data type
  const availableRewardsPagination = viewModel?.availableRewards
    ?.pagination || {
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

  const rewardTransactionsPagination = viewModel?.rewardTransactions
    ?.pagination || {
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
