"use client";

import { QueuePriority } from "@/src/domain/entities/shop/backend/backend-queue.entity";
import { useCustomerStore } from "@/src/presentation/stores/customer-store";
import { useProfileStore } from "@/src/presentation/stores/profile-store";
import { useCallback, useEffect, useState } from "react";
import { ClientCustomerPresenterFactory } from "./CustomerPresenter";
import {
  ClientCustomerQueueJoinPresenterFactory,
  type CustomerQueueJoinViewModel,
  type QueueFormData,
  type QueueService,
  type ServiceOption,
} from "./CustomerQueueJoinPresenter";

const presenter = ClientCustomerQueueJoinPresenterFactory.create();
const customerPresenter = ClientCustomerPresenterFactory.create();

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
  const { activeProfile } = useProfileStore();

  // Customer store for persisting customer ID
  const { getCustomer, setCustomer: setStoredCustomer } = useCustomerStore();
  const storedCustomer = getCustomer(shopId);

  // State for form data
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [priority, setPriority] = useState<QueuePriority>(QueuePriority.NORMAL);
  const [selectedCategory, setSelectedCategory] = useState("ทั้งหมด");
  const [isShowFinalOrderSummary, setIsShowFinalOrderSummary] = useState(false);

  // State for managing service quantities
  const [serviceQuantities, setServiceQuantities] = useState<
    Record<string, number>
  >({});

  // State for controlling if priority can be set
  const [isAllowSetPriority, setIsAllowSetPriority] = useState(false);

  // Initialize with initial view model if provided
  useEffect(() => {
    if (initialViewModel) {
      setViewModel(initialViewModel);
      setLoading(false);
    }
  }, [initialViewModel]);

  // Update isAllowSetPriority when storedCustomer changes
  useEffect(() => {
    // Allow setting priority if user has a stored customer (is registered)
    setIsAllowSetPriority(!!storedCustomer && !!activeProfile);
  }, [storedCustomer, activeProfile]);

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
            // Pre-fill form with customer data from profile
            setCustomerName(profileCustomer.name);
            setCustomerPhone(profileCustomer.phone);
            // Store customer data for future use
            setStoredCustomer(shopId, {
              id: profileCustomer.id,
              name: profileCustomer.name,
              phone: profileCustomer.phone,
              shopId: profileCustomer.shopId,
              joinedDate: profileCustomer.createdAt,
            });
          } else {
            if (activeProfile) {
              console.log("Using active profile data as fallback");
              setCustomerName(
                activeProfile.fullName || activeProfile.name || ""
              );
              // Note: ProfileDto doesn't have phone field, so phone field will be empty
              setCustomerPhone("");
            }
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

          // Pre-fill form with customer data
          setCustomerName(currentCustomer.name);
          setCustomerPhone(currentCustomer.phone);

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

  // Function to load data
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

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
          const registerResult = await customerPresenter.registerCustomer(
            shopId,
            formData.customerName.trim(),
            formData.customerPhone.trim()
          );

          // Store the customer ID in Zustand
          setStoredCustomer(shopId, {
            id: registerResult.customerId,
            name: formData.customerName.trim(),
            phone: formData.customerPhone.trim(),
            shopId: shopId,
            joinedDate: new Date().toISOString(),
          });

          finalFormData.customerId = registerResult.customerId;

          if (activeProfile?.id) {
            console.log("Customer is not linked to profile");
            await customerPresenter.linkCustomerToProfile(
              registerResult.customerId,
              formData.customerPhone.trim()
            );
          }
        } else {
          finalFormData.customerId = storedCustomer.id;
          // We have a stored customer, update their information if needed
          const currentCustomer = await customerPresenter.getCustomerById(
            storedCustomer.id
          );

          if (activeProfile?.id && currentCustomer.profileId === null) {
            console.log("Customer is not linked to profile");
            await customerPresenter.linkCustomerToProfile(
              currentCustomer.id,
              currentCustomer.phone
            );
          }

          // If name or phone has changed, update the customer
          if (
            currentCustomer.name !== formData.customerName.trim() ||
            currentCustomer.phone !== formData.customerPhone.trim()
          ) {
            const updateResult = await customerPresenter.registerCustomer(
              shopId,
              formData.customerName.trim(),
              formData.customerPhone.trim()
            );

            // Update stored customer with new information
            setStoredCustomer(shopId, {
              id: updateResult.customerId,
              name: formData.customerName.trim(),
              phone: formData.customerPhone.trim(),
              shopId: shopId,
              joinedDate: new Date().toISOString(),
            });
          }
        }

        // Call real API service
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
    [viewModel, shopId, storedCustomer, setStoredCustomer, activeProfile?.id]
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
    setIsShowFinalOrderSummary(false);
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
    isShowFinalOrderSummary,
    setIsShowFinalOrderSummary,

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

    // Priority control
    isAllowSetPriority,

    // Customer data
    storedCustomer,
  };
}
