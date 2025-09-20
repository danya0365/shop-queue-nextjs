"use client";

import { useCallback, useEffect, useState } from "react";
import type {
  QueueFormData,
  QueueJoinViewModel,
  ServiceOption,
} from "./QueueJoinPresenter";
import { ClientQueueJoinPresenterFactory } from "./QueueJoinPresenter";

// Re-export types
export type { QueueFormData, ServiceOption };

export function useQueueJoinPresenter(
  shopId: string,
  initialViewModel?: QueueJoinViewModel
) {
  const [viewModel, setViewModel] = useState<QueueJoinViewModel | null>(
    initialViewModel || null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // State for form data
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [priority, setPriority] = useState<"normal" | "urgent">("normal");
  const [selectedCategory, setSelectedCategory] = useState("ทั้งหมด");

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

      const presenter = await ClientQueueJoinPresenterFactory.create();
      const newViewModel = await presenter.getViewModel(shopId);

      setViewModel(newViewModel);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load queue data"
      );
      console.error("Error loading queue data:", err);
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

  // Action handlers
  const handleServiceToggle = useCallback(
    (serviceId: string) => {
      if (!viewModel) return;

      const updatedViewModel = {
        ...viewModel,
        selectedServices: viewModel.selectedServices.includes(serviceId)
          ? viewModel.selectedServices.filter((id) => id !== serviceId)
          : [...viewModel.selectedServices, serviceId],
      };

      setViewModel(updatedViewModel);
    },
    [viewModel]
  );

  const handleSubmit = useCallback(
    async (formData: QueueFormData) => {
      if (!viewModel) return false;

      setActionLoading(true);
      setError(null);

      try {
        // Validation logic
        if (!formData.customerName.trim()) {
          throw new Error("กรุณากรอกชื่อ");
        }

        if (!formData.customerPhone.trim()) {
          throw new Error("กรุณากรอกเบอร์โทรศัพท์");
        }

        if (formData.services.length === 0) {
          throw new Error("กรุณาเลือกบริการอย่างน้อย 1 รายการ");
        }

        // Phone validation
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(formData.customerPhone.replace(/[-\s]/g, ""))) {
          throw new Error("รูปแบบเบอร์โทรไม่ถูกต้อง");
        }

        // Mock API call - replace with actual service
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Mock success response
        const mockQueueNumber =
          "A" + String(Math.floor(Math.random() * 900) + 100);

        const updatedViewModel = {
          ...viewModel,
          queueNumber: mockQueueNumber,
          isSuccess: true,
        };

        setViewModel(updatedViewModel);
        return true;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to join queue";
        setError(errorMessage);

        const updatedViewModel = {
          ...viewModel,
          error: errorMessage,
        };

        setViewModel(updatedViewModel);
        return false;
      } finally {
        setActionLoading(false);
      }
    },
    [viewModel]
  );

  const reset = useCallback(() => {
    if (!viewModel) return;

    const updatedViewModel = {
      ...viewModel,
      selectedServices: [],
      isSuccess: false,
      queueNumber: null,
      error: null,
    };

    setViewModel(updatedViewModel);
    setCustomerName("");
    setCustomerPhone("");
    setSpecialRequests("");
    setPriority("normal");
    setSelectedCategory("all");
    setError(null);
  }, [viewModel]);

  const refreshData = useCallback(async () => {
    await loadData();
  }, [loadData]);

  return {
    viewModel,
    loading,
    error,
    actionLoading,
    // Form state
    customerName,
    setCustomerName,
    customerPhone,
    setCustomerPhone,
    specialRequests,
    setSpecialRequests,
    priority,
    setPriority,
    selectedCategory,
    setSelectedCategory,
    // Actions
    handleServiceToggle,
    handleSubmit,
    reset,
    refreshData,
  };
}
