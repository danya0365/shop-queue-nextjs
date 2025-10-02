"use client";

import { getPaginationConfig } from "@/src/infrastructure/config/PaginationConfig";
import { useCustomerStore } from "@/src/presentation/stores/customer-store";
import { useProfileStore } from "@/src/presentation/stores/profile-store";
import { useCallback, useEffect, useState } from "react";
import type {
  CustomerHistoryViewModel,
  CustomerQueueHistory,
  HistoryFilters,
  HistoryFilterType,
} from "./CustomerHistoryPresenter";
import { ClientCustomerHistoryPresenterFactory } from "./CustomerHistoryPresenter";

const presenter = ClientCustomerHistoryPresenterFactory.create();

// Define filter type
export type { HistoryFilters, HistoryFilterType };

// Define pagination interface
export interface Pagination {
  currentPage: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export function useCustomerHistoryPresenter(
  shopId: string,
  initialViewModel?: CustomerHistoryViewModel
) {
  const [viewModel, setViewModel] = useState<CustomerHistoryViewModel | null>(
    initialViewModel || null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { activeProfile } = useProfileStore();

  // Customer store for persisting customer ID
  const { customer: storedCustomer, setCustomer: setStoredCustomer } =
    useCustomerStore();

  // State for pagination and filters
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(getPaginationConfig().QUEUES_PER_PAGE);
  const [filters, setFilters] = useState<HistoryFilters>({
    status: "all",
    dateRange: "all",
    shop: "all",
    startDate: undefined,
    endDate: undefined,
  });

  // Action loading states
  const [actionLoading, setActionLoading] = useState({
    viewDetails: false,
  });

  // Initialize with initial view model if provided
  useEffect(() => {
    if (initialViewModel) {
      setViewModel(initialViewModel);
      setLoading(false);
    }
  }, [initialViewModel]);

  // Load customer data from store and pre-fill form if available
  useEffect(() => {
    const loadCustomerData = async () => {
      // Case 1: User has active profile but no stored customer (first time in this shop)
      if (activeProfile?.id && !storedCustomer) {
        try {
          console.log(
            "Loading customer data by profile ID for authenticated user"
          );

          const profileCustomer = await presenter.getCustomerByProfileId(
            activeProfile.id,
            shopId
          );

          if (profileCustomer) {
            // Store customer data for future use
            setStoredCustomer({
              id: profileCustomer.id,
              name: profileCustomer.name,
              phone: profileCustomer.phone,
              shopId: profileCustomer.shopId,
            });
          }
        } catch (error) {
          console.error("Error loading customer by profile ID:", error);
        }
      }

      // Case 2: User has stored customer data (existing logic)
      if (storedCustomer && storedCustomer.shopId === shopId) {
        try {
          const currentCustomer = await presenter.getCustomerById(
            storedCustomer.id
          );

          // TODO: check if profile id is null and user is authenticated
          // if so, link customer to profile
          if (currentCustomer.profileId === null && activeProfile?.id) {
            console.log("Customer is not linked to profile");
            await presenter.linkCustomerToProfile(
              currentCustomer.id,
              currentCustomer.phone
            );
          }
        } catch (error) {
          console.error("Error loading customer data:", error);
          setStoredCustomer(null);
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

  // Function to load data
  const loadData = useCallback(async () => {
    if (!storedCustomer?.id) {
      return;
    }
    try {
      setLoading(true);
      setError(null);

      const newViewModel = await presenter.getViewModel(
        shopId,
        storedCustomer?.id,
        currentPage,
        perPage,
        filters
      );

      setViewModel(newViewModel);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load customer history data"
      );
      console.error("Error loading customer history data:", err);
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
      loadData();
    }
  }, [shopId, currentPage, perPage, filters, initialViewModel, loadData]);

  // Pagination handlers
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleNextPage = useCallback(() => {
    if (viewModel?.pagination?.hasNext) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [viewModel?.pagination?.hasNext]);

  const handlePrevPage = useCallback(() => {
    if (viewModel?.pagination?.hasPrev) {
      setCurrentPage((prev) => prev - 1);
    }
  }, [viewModel?.pagination?.hasPrev]);

  const handlePerPageChange = useCallback((newPerPage: number) => {
    setPerPage(newPerPage);
    setCurrentPage(1); // Reset to first page when changing per page
  }, []);

  // Filter handlers
  const handleStatusFilterChange = useCallback((status: HistoryFilterType) => {
    setFilters((prev) => ({ ...prev, status }));
    setCurrentPage(1); // Reset to first page when filtering
    setError(null); // Clear error when filtering
  }, []);

  const handleDateRangeFilterChange = useCallback(
    (dateRange: "all" | "month" | "quarter" | "year") => {
      setFilters((prev) => ({ ...prev, dateRange }));
      setCurrentPage(1); // Reset to first page when filtering
      setError(null); // Clear error when filtering
    },
    []
  );

  const handleShopFilterChange = useCallback((shop: string) => {
    setFilters((prev) => ({ ...prev, shop }));
    setCurrentPage(1); // Reset to first page when filtering
    setError(null); // Clear error when filtering
  }, []);

  const handleCustomDateRangeChange = useCallback(
    (startDate?: string, endDate?: string) => {
      setFilters((prev) => ({
        ...prev,
        startDate,
        endDate,
        dateRange: "all", // Reset date range when using custom dates
      }));
      setCurrentPage(1); // Reset to first page when filtering
      setError(null); // Clear error when filtering
    },
    []
  );

  // Reset filters
  const resetFilters = useCallback(() => {
    setFilters({
      status: "all",
      dateRange: "all",
      shop: "all",
      startDate: undefined,
      endDate: undefined,
    });
    setCurrentPage(1);
    setError(null); // Clear error when resetting filters
  }, []);

  // Action handlers
  const handleViewQueueDetails = useCallback((queue: CustomerQueueHistory) => {
    // This could open a modal or navigate to a details page
    console.log("View queue details:", queue);
    // Implementation depends on how you want to show details
  }, []);

  // Refresh data
  const refreshData = useCallback(() => {
    loadData();
  }, [loadData]);

  return {
    // Data
    viewModel,
    loading,
    error,

    // Pagination state
    currentPage,
    perPage,

    // Filter state
    filters,
    pagination: viewModel?.pagination,

    // Pagination handlers
    handlePageChange,
    handleNextPage,
    handlePrevPage,
    handlePerPageChange,

    // Filter handlers
    handleStatusFilterChange,
    handleDateRangeFilterChange,
    handleShopFilterChange,
    handleCustomDateRangeChange,
    resetFilters,

    // Action handlers
    handleViewQueueDetails,
    actionLoading,

    // Utility
    refreshData,
  };
}
