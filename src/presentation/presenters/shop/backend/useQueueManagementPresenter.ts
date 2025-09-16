"use client";

import { QueueStatus } from "@/src/domain/entities/backend/backend-queue.entity";
import { getPaginationConfig } from "@/src/infrastructure/config/PaginationConfig";
import { useCallback, useEffect, useState } from "react";
import type {
  QueueItem,
  QueueManagementViewModel,
} from "./QueueManagementPresenter";
export type PriorityFilter = QueueItem["priority"] | "all";
export type StatusFilter = QueueItem["status"] | "all";

export function useQueueManagementPresenter(
  shopId: string,
  initialViewModel?: QueueManagementViewModel
) {
  const [viewModel, setViewModel] = useState<QueueManagementViewModel | null>(
    initialViewModel || null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for pagination and filters
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(getPaginationConfig().QUEUES_PER_PAGE);
  const [filters, setFilters] = useState<{
    status: StatusFilter;
    priority: PriorityFilter;
    search: string;
  }>({
    status: "all",
    priority: "all",
    search: "",
  });

  // Action loading states
  const [actionLoading, setActionLoading] = useState({
    updateStatus: false,
    updateQueue: false,
    deleteQueue: false,
    createQueue: false,
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

      const { ClientQueueManagementPresenterFactory } = await import(
        "./QueueManagementPresenter"
      );
      const presenter = await ClientQueueManagementPresenterFactory.create();

      const newViewModel = await presenter.getViewModel(
        shopId,
        currentPage,
        perPage,
        filters
      );

      setViewModel(newViewModel);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load queue data"
      );
      console.error("Error loading queue data:", err);
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
      loadData();
    }
  }, [shopId, currentPage, perPage, filters, initialViewModel, loadData]);

  // Pagination handlers
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleNextPage = useCallback(() => {
    if (viewModel?.queues.pagination.hasNext) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [viewModel?.queues.pagination.hasNext]);

  const handlePrevPage = useCallback(() => {
    if (viewModel?.queues.pagination.hasPrev) {
      setCurrentPage((prev) => prev - 1);
    }
  }, [viewModel?.queues.pagination.hasPrev]);

  const handlePerPageChange = useCallback((newPerPage: number) => {
    setPerPage(newPerPage);
    setCurrentPage(1); // Reset to first page when changing per page
  }, []);

  // Filter handlers
  const handleStatusFilter = useCallback((status: StatusFilter) => {
    setFilters((prev) => ({ ...prev, status }));
    setCurrentPage(1); // Reset to first page when filtering
    setError(null); // Clear error when filtering
  }, []);

  const handlePriorityFilter = useCallback((priority: PriorityFilter) => {
    setFilters((prev) => ({ ...prev, priority }));
    setCurrentPage(1); // Reset to first page when filtering
    setError(null); // Clear error when filtering
  }, []);

  const handleSearch = useCallback((search: string) => {
    setFilters((prev) => ({ ...prev, search }));
    setCurrentPage(1); // Reset to first page when searching
    setError(null); // Clear error when searching
  }, []);

  // Reset filters
  const resetFilters = useCallback(() => {
    setFilters({
      status: "all",
      priority: "all",
      search: "",
    });
    setCurrentPage(1);
  }, []);

  // Refresh data
  const refreshData = useCallback(() => {
    loadData();
  }, [loadData]);

  // Update queue status (quick actions)
  const updateQueueStatus = useCallback(
    async (queueId: string, newStatus: QueueStatus) => {
      try {
        setActionLoading((prev) => ({ ...prev, updateStatus: true }));
        setError(null);

        const { ClientQueueManagementPresenterFactory } = await import(
          "./QueueManagementPresenter"
        );
        const presenter = await ClientQueueManagementPresenterFactory.create();

        await presenter.updateQueueStatus(shopId, queueId, newStatus);

        // Refresh data after update
        await loadData();
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update queue status";
        setError(errorMessage);
        console.error("Error updating queue status:", err);
        throw err; // Re-throw to let UI handle it
      } finally {
        setActionLoading((prev) => ({ ...prev, updateStatus: false }));
      }
    },
    [shopId, loadData]
  );

  // Update queue (edit services, priority, notes)
  const updateQueue = useCallback(
    async (
      queueId: string,
      data: {
        services?: {
          serviceId: string;
          quantity: number;
          price?: number;
        }[];
        priority?: QueueItem["priority"];
        notes?: string;
      }
    ) => {
      try {
        setActionLoading((prev) => ({ ...prev, updateQueue: true }));
        setError(null);

        const { ClientQueueManagementPresenterFactory } = await import(
          "./QueueManagementPresenter"
        );
        const presenter = await ClientQueueManagementPresenterFactory.create();

        await presenter.updateQueue(
          shopId,
          queueId,
          data as {
            services: {
              serviceId: string;
              quantity: number;
              price?: number;
            }[];
            priority: QueueItem["priority"];
            notes?: string;
          }
        );

        // Refresh data after update
        await loadData();
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update queue";
        setError(errorMessage);
        console.error("Error updating queue:", err);
        throw err; // Re-throw to let UI handle it
      } finally {
        setActionLoading((prev) => ({ ...prev, updateQueue: false }));
      }
    },
    [shopId, loadData]
  );

  // Delete queue (only waiting status)
  const deleteQueue = useCallback(
    async (queueId: string) => {
      try {
        setActionLoading((prev) => ({ ...prev, deleteQueue: true }));
        setError(null);

        const { ClientQueueManagementPresenterFactory } = await import(
          "./QueueManagementPresenter"
        );
        const presenter = await ClientQueueManagementPresenterFactory.create();

        await presenter.deleteQueue(queueId);

        // Refresh data after delete
        await loadData();
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to delete queue";
        setError(errorMessage);
        console.error("Error deleting queue:", err);
        throw err; // Re-throw to let UI handle it
      } finally {
        setActionLoading((prev) => ({ ...prev, deleteQueue: false }));
      }
    },
    [loadData]
  );

  // Create new queue (with inline customer creation)
  const createQueue = useCallback(
    async (data: {
      customerName: string;
      customerPhone: string;
      priority: QueueItem["priority"];
      notes?: string;
      services: {
        serviceId: string;
        price?: number;
        quantity: number;
      }[];
    }) => {
      try {
        setActionLoading((prev) => ({ ...prev, createQueue: true }));
        setError(null);

        const { ClientQueueManagementPresenterFactory } = await import(
          "./QueueManagementPresenter"
        );
        const presenter = await ClientQueueManagementPresenterFactory.create();

        await presenter.createQueue(shopId, data);

        // Refresh data after creation
        await loadData();
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to create queue";
        setError(errorMessage);
        console.error("Error creating queue:", err);
        throw err; // Re-throw to let UI handle it
      } finally {
        setActionLoading((prev) => ({ ...prev, createQueue: false }));
      }
    },
    [shopId, loadData]
  );

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

    // Pagination handlers
    handlePageChange,
    handleNextPage,
    handlePrevPage,
    handlePerPageChange,

    // Filter handlers
    handleStatusFilter,
    handlePriorityFilter,
    handleSearch,
    resetFilters,

    // CRUD actions
    updateQueueStatus,
    updateQueue,
    deleteQueue,
    createQueue,
    actionLoading,

    // Utility
    refreshData,
  };
}
