"use client";

import { useCallback, useEffect, useState } from "react";
import type {
  CustomerQueue,
  QueueProgress,
  QueueStatusViewModel,
} from "./QueueStatusPresenter";
import { ClientQueueStatusPresenterFactory } from "./QueueStatusPresenter";

// Re-export types
export type { CustomerQueue, QueueProgress };

export function useQueueStatusPresenter(
  shopId: string,
  initialViewModel?: QueueStatusViewModel
) {
  const [viewModel, setViewModel] = useState<QueueStatusViewModel | null>(
    initialViewModel || null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // State for search form
  const [queueNumber, setQueueNumber] = useState("");
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  // Initialize with initial view model if provided
  useEffect(() => {
    if (initialViewModel) {
      setViewModel(initialViewModel);
      setLoading(false);
    }
  }, [initialViewModel]);

  // Function to load data
  const loadData = useCallback(async (searchQueueNumber?: string) => {
    try {
      setLoading(true);
      setError(null);

      const presenter = await ClientQueueStatusPresenterFactory.create();
      const newViewModel = await presenter.getViewModel(shopId, searchQueueNumber);

      setViewModel(newViewModel);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load queue status"
      );
      console.error("Error loading queue status:", err);
    } finally {
      setLoading(false);
    }
  }, [shopId]);

  // Load data when dependencies change, but not if we have initial view model
  useEffect(() => {
    if (!initialViewModel) {
      loadData();
    }
  }, [loadData, initialViewModel]);

  // Function to search for a specific queue
  const handleSearch = useCallback(async () => {
    if (queueNumber.trim()) {
      await loadData(queueNumber.trim());
    }
  }, [queueNumber, loadData]);

  // Function to cancel a queue
  const handleCancel = useCallback(async () => {
    if (!viewModel?.customerQueue) return;

    setActionLoading(true);
    setError(null);

    try {
      // Mock API call - replace with actual service
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock success response
      setShowCancelConfirm(false);
      
      // Redirect to shop page after successful cancellation
      window.location.href = `/shop/${shopId}`;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to cancel queue";
      setError(errorMessage);
    } finally {
      setActionLoading(false);
    }
  }, [viewModel, shopId]);

  // Function to refresh data
  const refreshData = useCallback(async () => {
    if (viewModel?.customerQueue) {
      await loadData(viewModel.customerQueue.queueNumber);
    } else {
      await loadData();
    }
  }, [loadData, viewModel]);

  // Helper functions for status display
  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case "waiting":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "serving":
        return "bg-green-100 text-green-800 border-green-200";
      case "completed":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  }, []);

  const getStatusText = useCallback((status: string) => {
    switch (status) {
      case "waiting":
        return "รอการยืนยัน";
      case "confirmed":
        return "ยืนยันแล้ว";
      case "serving":
        return "กำลังให้บริการ";
      case "completed":
        return "เสร็จสิ้น";
      case "cancelled":
        return "ยกเลิกแล้ว";
      default:
        return status;
    }
  }, []);

  const getStatusIcon = useCallback((status: string) => {
    switch (status) {
      case "waiting":
        return "⏳";
      case "confirmed":
        return "✅";
      case "serving":
        return "🛎️";
      case "completed":
        return "🎉";
      case "cancelled":
        return "❌";
      default:
        return "❓";
    }
  }, []);

  return {
    viewModel,
    loading,
    error,
    actionLoading,
    
    // Form state
    queueNumber,
    setQueueNumber,
    showCancelConfirm,
    setShowCancelConfirm,
    
    // Actions
    handleSearch,
    handleCancel,
    refreshData,
    loadData,
    
    // Helper functions
    getStatusColor,
    getStatusText,
    getStatusIcon,
  };
}
