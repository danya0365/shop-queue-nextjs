"use client";

import { QueuePriority } from "@/src/domain/entities/shop/backend/backend-queue.entity";
import { supabase } from "@/src/infrastructure/config/supabase-browser-client";
import { useCustomerStore } from "@/src/presentation/stores/customer-store";
import { useCallback, useEffect, useState } from "react";
import {
  ClientCustomerQueueJoinPresenterFactory,
  type CustomerQueueJoinViewModel,
  type QueueFormData,
  type QueueService,
  type ServiceOption,
} from "./CustomerQueueJoinPresenter";

// Re-export types
export type { QueueFormData, ServiceOption };

export function useCustomerQueueJoinPresenter(
  shopId: string,
  initialViewModel?: CustomerQueueJoinViewModel
) {
  const [viewModel, setViewModel] = useState<CustomerQueueJoinViewModel | null>(
    initialViewModel || null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Customer store for persisting customer ID
  const { customer: storedCustomer, setCustomer: setStoredCustomer } =
    useCustomerStore();

  // State for form data
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [priority, setPriority] = useState<QueuePriority>(QueuePriority.NORMAL);
  const [selectedCategory, setSelectedCategory] = useState("ทั้งหมด");

  // State for managing service quantities
  const [serviceQuantities, setServiceQuantities] = useState<
    Record<string, number>
  >({});

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
      if (storedCustomer && storedCustomer.shopId === shopId) {
        try {
          // Call RPC to get customer details (security check will be applied)
          const { data, error } = await supabase.rpc("get_customer_by_id", {
            p_customer_id: storedCustomer.id,
          });

          if (error) {
            console.error("Error loading customer data:", error);
            // Clear stored customer if error occurs (might be linked to authenticated user)
            setStoredCustomer(null);
            return;
          }

          if (data && data.length > 0) {
            const customerData = data[0];
            // Pre-fill form with customer data
            setCustomerName(customerData.name);
            setCustomerPhone(customerData.phone);

            // TODO: check if profile id is null and user is authenticated
            // if so, link customer to profile
            if (customerData.profile_id === null) {
              console.log("Customer is not linked to profile");
            }
          } else {
            // No customer data returned, clear stored customer
            setStoredCustomer(null);
          }
        } catch (error) {
          console.error("Error loading customer data:", error);
          setStoredCustomer(null);
        }
      }
    };

    loadCustomerData();
  }, [storedCustomer, shopId, setStoredCustomer]);

  // Function to load data
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const presenter = await ClientCustomerQueueJoinPresenterFactory.create();
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
      .map((serviceId) => {
        const service = viewModel.services.find((s) => s.id === serviceId);
        if (!service) return null;

        return {
          id: service.id,
          name: service.name,
          price: service.price,
          quantity: serviceQuantities[serviceId] || 1,
          estimatedTime: service.estimatedTime,
        };
      })
      .filter((service): service is QueueService => service !== null);
  }, [viewModel, serviceQuantities]);

  // Function to update service quantity
  const updateServiceQuantity = useCallback(
    (serviceId: string, quantity: number) => {
      if (quantity < 0) quantity = 0; // Minimum quantity is 0
      if (quantity > 99) quantity = 99; // Maximum quantity is 99

      // If quantity becomes 0, remove from selected services
      if (quantity === 0 && viewModel) {
        const updatedViewModel = {
          ...viewModel,
          selectedServices: viewModel.selectedServices.filter(
            (id) => id !== serviceId
          ),
        };
        setViewModel(updatedViewModel);

        // Remove quantity from state
        setServiceQuantities((prev) => {
          const newQuantities = { ...prev };
          delete newQuantities[serviceId];
          return newQuantities;
        });
      } else {
        // Update quantity normally
        setServiceQuantities((prev) => ({
          ...prev,
          [serviceId]: quantity,
        }));
      }
    },
    [viewModel]
  );

  // Function to increase service quantity
  const increaseServiceQuantity = useCallback((serviceId: string) => {
    setServiceQuantities((prev) => {
      const currentQuantity = prev[serviceId] || 1;
      const newQuantity = Math.min(currentQuantity + 1, 99);
      return {
        ...prev,
        [serviceId]: newQuantity,
      };
    });
  }, []);

  // Function to decrease service quantity
  const decreaseServiceQuantity = useCallback(
    (serviceId: string) => {
      setServiceQuantities((prev) => {
        const currentQuantity = prev[serviceId] || 1;
        const newQuantity = Math.max(currentQuantity - 1, 0);

        // If quantity becomes 0, remove from selected services
        if (newQuantity === 0 && viewModel) {
          const updatedViewModel = {
            ...viewModel,
            selectedServices: viewModel.selectedServices.filter(
              (id) => id !== serviceId
            ),
          };
          setViewModel(updatedViewModel);

          // Remove quantity from state
          const newQuantities = { ...prev };
          delete newQuantities[serviceId];
          return newQuantities;
        }

        return {
          ...prev,
          [serviceId]: newQuantity,
        };
      });
    },
    [viewModel]
  );

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
        setServiceQuantities((prev) => {
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

        const finalFormData = formData;

        // Check if we have a stored customer for this shop
        if (!storedCustomer || storedCustomer.shopId !== shopId) {
          // No stored customer or different shop, register new customer
          const { data: customerId, error: registerError } = await supabase.rpc(
            "register_customer_with_phone",
            {
              p_shop_id: shopId,
              p_name: formData.customerName.trim(),
              p_phone: formData.customerPhone.trim(),
            }
          );

          if (registerError) {
            throw new Error(
              `Failed to register customer: ${registerError.message}`
            );
          }

          if (customerId) {
            // Store the customer ID in Zustand
            setStoredCustomer({
              id: customerId,
              name: formData.customerName.trim(),
              phone: formData.customerPhone.trim(),
              shopId: shopId,
            });

            finalFormData.customerId = customerId;
          }
        } else {
          finalFormData.customerId = storedCustomer.id;
          // We have a stored customer, update their information if needed
          const { data: customerData, error: getError } = await supabase.rpc(
            "get_customer_by_id",
            { p_customer_id: storedCustomer.id }
          );

          if (getError) {
            throw new Error(`Failed to get customer data: ${getError.message}`);
          }

          if (customerData && customerData.length > 0) {
            const currentCustomer = customerData[0];

            // If name or phone has changed, update the customer
            if (
              currentCustomer.name !== formData.customerName.trim() ||
              currentCustomer.phone !== formData.customerPhone.trim()
            ) {
              const { data: updatedCustomerId, error: updateError } =
                await supabase.rpc("register_customer_with_phone", {
                  p_shop_id: shopId,
                  p_name: formData.customerName.trim(),
                  p_phone: formData.customerPhone.trim(),
                });

              if (updateError) {
                throw new Error(
                  `Failed to update customer: ${updateError.message}`
                );
              }

              if (updatedCustomerId) {
                // Update stored customer with new information
                setStoredCustomer({
                  id: updatedCustomerId,
                  name: formData.customerName.trim(),
                  phone: formData.customerPhone.trim(),
                  shopId: shopId,
                });
              }
            }
          }
        }

        // Call real API service
        const { ClientCustomerQueueJoinPresenterFactory } = await import(
          "./CustomerQueueJoinPresenter"
        );
        const presenter =
          await ClientCustomerQueueJoinPresenterFactory.create();
        const result = await presenter.joinQueue(finalFormData, shopId);

        if (result.success) {
          const updatedViewModel = {
            ...viewModel,
            queueNumber: result.queueNumber || null,
            isSuccess: true,
          };

          setViewModel(updatedViewModel);
          return true;
        } else {
          throw new Error(result.error || "Failed to join queue");
        }
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
    [viewModel, shopId, storedCustomer, setStoredCustomer]
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
    setSpecialRequests("");
    setPriority(QueuePriority.NORMAL);
    setSelectedCategory("ทั้งหมด");
    setError(null);

    // Reload customer data from store if available
    if (storedCustomer && storedCustomer.shopId === shopId) {
      setCustomerName(storedCustomer.name);
      setCustomerPhone(storedCustomer.phone);
    } else {
      setCustomerName("");
      setCustomerPhone("");
    }
  }, [viewModel, storedCustomer, shopId]);

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
