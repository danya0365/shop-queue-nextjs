"use client";

import { useCallback, useEffect, useState } from "react";
import type {
  QueueFormData,
  QueueJoinViewModel,
  ServiceOption,
  QueueService,
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
  
  // State for managing service quantities
  const [serviceQuantities, setServiceQuantities] = useState<Record<string, number>>({});

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

  // Helper function to convert selected service IDs to QueueService[]
  const getSelectedServicesAsQueueServices = useCallback(() => {
    if (!viewModel) return [];
    
    return viewModel.selectedServices
      .map(serviceId => {
        const service = viewModel.services.find(s => s.id === serviceId);
        if (!service) return null;
        
        return {
          id: service.id,
          name: service.name,
          price: service.price,
          quantity: serviceQuantities[serviceId] || 1,
          estimatedTime: service.estimatedTime
        };
      })
      .filter((service): service is QueueService => service !== null);
  }, [viewModel, serviceQuantities]);

  // Function to update service quantity
  const updateServiceQuantity = useCallback((serviceId: string, quantity: number) => {
    if (quantity < 0) quantity = 0; // Minimum quantity is 0
    if (quantity > 99) quantity = 99; // Maximum quantity is 99
    
    // If quantity becomes 0, remove from selected services
    if (quantity === 0 && viewModel) {
      const updatedViewModel = {
        ...viewModel,
        selectedServices: viewModel.selectedServices.filter((id) => id !== serviceId),
      };
      setViewModel(updatedViewModel);
      
      // Remove quantity from state
      setServiceQuantities(prev => {
        const newQuantities = { ...prev };
        delete newQuantities[serviceId];
        return newQuantities;
      });
    } else {
      // Update quantity normally
      setServiceQuantities(prev => ({
        ...prev,
        [serviceId]: quantity
      }));
    }
  }, [viewModel]);

  // Function to increase service quantity
  const increaseServiceQuantity = useCallback((serviceId: string) => {
    setServiceQuantities(prev => {
      const currentQuantity = prev[serviceId] || 1;
      const newQuantity = Math.min(currentQuantity + 1, 99);
      return {
        ...prev,
        [serviceId]: newQuantity
      };
    });
  }, []);

  // Function to decrease service quantity
  const decreaseServiceQuantity = useCallback((serviceId: string) => {
    setServiceQuantities(prev => {
      const currentQuantity = prev[serviceId] || 1;
      const newQuantity = Math.max(currentQuantity - 1, 0);
      
      // If quantity becomes 0, remove from selected services
      if (newQuantity === 0 && viewModel) {
        const updatedViewModel = {
          ...viewModel,
          selectedServices: viewModel.selectedServices.filter((id) => id !== serviceId),
        };
        setViewModel(updatedViewModel);
        
        // Remove quantity from state
        const newQuantities = { ...prev };
        delete newQuantities[serviceId];
        return newQuantities;
      }
      
      return {
        ...prev,
        [serviceId]: newQuantity
      };
    });
  }, [viewModel]);

  // Reset quantities when services are deselected
  const handleServiceToggle = useCallback(
    (serviceId: string) => {
      if (!viewModel) return;

      const isSelected = viewModel.selectedServices.includes(serviceId);
      
      const updatedViewModel = {
        ...viewModel,
        selectedServices: isSelected
          ? viewModel.selectedServices.filter((id) => id !== serviceId)
          : [...viewModel.selectedServices, serviceId],
      };

      setViewModel(updatedViewModel);
      
      // Remove quantity when service is deselected
      if (isSelected) {
        setServiceQuantities(prev => {
          const newQuantities = { ...prev };
          delete newQuantities[serviceId];
          return newQuantities;
        });
      }
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
    
    // Service quantities state
    serviceQuantities,
    
    // Actions
    handleServiceToggle,
    updateServiceQuantity,
    increaseServiceQuantity,
    decreaseServiceQuantity,
    handleSubmit,
    reset,
    loadData,
    
    // Helper function to get selected services as QueueService[]
    getSelectedServicesAsQueueServices,
  };
}
