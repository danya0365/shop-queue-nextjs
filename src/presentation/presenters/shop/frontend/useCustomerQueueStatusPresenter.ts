"use client";

import { useCustomerStore } from "@/src/presentation/stores/customer-store";
import { useProfileStore } from "@/src/presentation/stores/profile-store";
import { useCallback, useEffect, useState } from "react";
import { ClientCustomerPresenterFactory } from "./CustomerPresenter";
import type {
  CustomerQueue,
  CustomerQueueStatusViewModel,
  QueueProgress,
} from "./CustomerQueueStatusPresenter";
import { ClientQueueStatusPresenterFactory } from "./CustomerQueueStatusPresenter";

const presenter = ClientQueueStatusPresenterFactory.create();
const customerPresenter = ClientCustomerPresenterFactory.create();

// Re-export types
export type { CustomerQueue, QueueProgress };

export function useCustomerQueueStatusPresenter(
  shopId: string,
  initialViewModel?: CustomerQueueStatusViewModel
) {
  const [viewModel, setViewModel] =
    useState<CustomerQueueStatusViewModel | null>(initialViewModel || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const { activeProfile } = useProfileStore();

  // Customer store for persisting customer ID
  const { customer: storedCustomer, setCustomer: setStoredCustomer } =
    useCustomerStore();

  // State for search form
  const [queueNumber, setQueueNumber] = useState("");
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

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

  // Initialize with initial view model if provided
  useEffect(() => {
    if (initialViewModel) {
      setViewModel(initialViewModel);
      setLoading(false);
    }
  }, [initialViewModel]);

  // Function to load data
  const loadData = useCallback(
    async (searchQueueNumber?: string) => {
      try {
        setLoading(true);
        setError(null);

        const newViewModel = await presenter.getViewModel(
          shopId,
          searchQueueNumber
        );

        setViewModel(newViewModel);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load queue status"
        );
        console.error("Error loading queue status:", err);
      } finally {
        setLoading(false);
      }
    },
    [shopId]
  );

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

  const resetData = useCallback(async () => {
    setQueueNumber("");
    await loadData();
  }, [loadData]);

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
    resetData,
    loadData,

    // Helper functions
    getStatusColor,
    getStatusText,
    getStatusIcon,
  };
}
