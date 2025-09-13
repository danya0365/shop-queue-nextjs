"use client";

import {
  ClientServicesPresenterFactory,
  ServicesViewModel,
} from "@/src/presentation/presenters/shop/backend/ServicesPresenter";
import type { ServiceDTO } from "@/src/application/dtos/shop/backend/services-dto";
import { useCallback, useEffect, useState } from "react";
import { getPaginationConfig } from "@/src/infrastructure/config/PaginationConfig";

interface CreateServiceDTO {
  name: string;
  description: string | null;
  category: string;
  price: number;
  estimatedDuration: number | null;
  icon: string | null;
  isAvailable: boolean;
}

interface UpdateServiceDTO {
  id: string;
  name: string;
  description: string | null;
  category: string;
  price: number;
  estimatedDuration: number | null;
  icon: string | null;
  isAvailable: boolean;
}

interface UseServicesPresenterReturn {
  viewModel: ServicesViewModel | null;
  loading: boolean;
  error: string | null;
  currentPage: number;
  perPage: number;
  filters: {
    searchQuery: string;
    categoryFilter: string;
    availabilityFilter: string;
  };
  handlePageChange: (page: number) => void;
  handleNextPage: () => void;
  handlePrevPage: () => void;
  handlePerPageChange: (perPage: number) => void;
  handleSearchChange: (value: string) => void;
  handleCategoryChange: (value: string) => void;
  handleAvailabilityChange: (value: string) => void;
  resetFilters: () => void;
  refreshData: () => void;
  createService: (data: CreateServiceDTO) => Promise<void>;
  handleCreateService: (event: React.FormEvent) => Promise<void>;
  updateService: (data: UpdateServiceDTO) => Promise<void>;
  handleUpdateService: (event: React.FormEvent) => Promise<void>;
  getServiceById: (id: string) => Promise<ServiceDTO | null>;
  deleteService: (id: string) => Promise<void>;
  handleDeleteService: (id: string) => Promise<void>;
  actionLoading: {
    create: boolean;
    update: boolean;
    delete: boolean;
    toggle: boolean;
  };
  toggleServiceAvailability: (id: string, isAvailable: boolean) => Promise<void>;
  handleToggleServiceAvailability: (id: string, isAvailable: boolean) => Promise<void>;
}

export function useServicesPresenter(
  shopId: string,
  initialViewModel?: ServicesViewModel
): UseServicesPresenterReturn {
  const [viewModel, setViewModel] = useState<ServicesViewModel | null>(
    initialViewModel || null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState({
    create: false,
    update: false,
    delete: false,
    toggle: false
  });

  // State for pagination and filters
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(getPaginationConfig().SERVICES_PER_PAGE);
  const [filters, setFilters] = useState({
    searchQuery: "",
    categoryFilter: "all",
    availabilityFilter: "all",
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

      const { ClientServicesPresenterFactory } = await import(
        "@/src/presentation/presenters/shop/backend/ServicesPresenter"
      );
      const presenter = await ClientServicesPresenterFactory.create();

      const newViewModel = await presenter.getViewModel(
        shopId,
        currentPage,
        perPage,
        {
          searchQuery: filters.searchQuery || undefined,
          categoryFilter:
            filters.categoryFilter !== "all"
              ? filters.categoryFilter
              : undefined,
          availabilityFilter:
            filters.availabilityFilter !== "all"
              ? filters.availabilityFilter
              : undefined,
        }
      );

      setViewModel(newViewModel);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load services data"
      );
      console.error("Error loading services data:", err);
    } finally {
      setLoading(false);
    }
  }, [shopId, currentPage, perPage, filters]);

  // Load data when dependencies change, but not if we have initial view model
  useEffect(() => {
    if (!initialViewModel) {
      loadData();
    }
  }, [shopId, currentPage, perPage, filters, initialViewModel, loadData]); // Add loadData back

  // Load data when filters change
  useEffect(() => {
    if (initialViewModel) {
      loadData();
    }
  }, [shopId, currentPage, perPage, filters, initialViewModel, loadData]); // Add loadData back

  // Pagination handlers
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleNextPage = useCallback(() => {
    if (viewModel?.services.pagination.hasNext) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [viewModel?.services.pagination.hasNext]);

  const handlePrevPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  }, [currentPage]);

  // Per page handler
  const handlePerPageChange = useCallback((newPerPage: number) => {
    setPerPage(newPerPage);
    setCurrentPage(1); // Reset to first page when changing per page
  }, []);

  // Filter handlers
  const handleSearchChange = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: value }));
    setCurrentPage(1); // Reset to first page when filtering
    setError(null); // Clear error when searching
  }, []);

  const handleCategoryChange = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, categoryFilter: value }));
    setCurrentPage(1); // Reset to first page when filtering
    setError(null); // Clear error when filtering
  }, []);

  const handleAvailabilityChange = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, availabilityFilter: value }));
    setCurrentPage(1); // Reset to first page when filtering
    setError(null); // Clear error when filtering
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      searchQuery: "",
      categoryFilter: "all",
      availabilityFilter: "all",
    });
    setCurrentPage(1);
    setError(null); // Clear error when resetting filters
  }, []);

  const refreshData = useCallback(() => {
    setError(null); // Clear error when refreshing
    loadData();
  }, [loadData]);

  // Create service function
  const createService = useCallback(
    async (data: CreateServiceDTO) => {
      try {
        setActionLoading(prev => ({ ...prev, create: true }));
        setError(null); // Clear previous errors

        const presenter = await ClientServicesPresenterFactory.create();

        await presenter.createService(shopId, data);

        // Refresh data after creating service
        await loadData();
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to create service";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setActionLoading(prev => ({ ...prev, create: false }));
      }
    },
    [shopId, loadData]
  );

  // Get service by ID function
  const getServiceById = useCallback(
    async (id: string): Promise<ServiceDTO | null> => {
      try {
        const presenter = await ClientServicesPresenterFactory.create();
        const service = await presenter.getServiceById(id);
        return service;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to get service";
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    []
  );

  // Update service function
  const updateService = useCallback(
    async (data: UpdateServiceDTO) => {
      try {
        setActionLoading(prev => ({ ...prev, update: true }));
        setError(null); // Clear previous errors

        const presenter = await ClientServicesPresenterFactory.create();

        await presenter.updateService(data.id, {
          name: data.name,
          description: data.description,
          category: data.category,
          price: data.price,
          estimatedDuration: data.estimatedDuration,
          icon: data.icon,
          isAvailable: data.isAvailable,
        });

        // Refresh data after updating service
        await loadData();
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update service";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setActionLoading(prev => ({ ...prev, update: false }));
      }
    },
    [loadData]
  );

  const handleCreateService = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();

      // Get form data from the form element
      const form = event.target as HTMLFormElement;
      const formData = new FormData(form);

      // Extract form values
      const name = formData.get("name") as string;
      const description = formData.get("description") as string;
      const category = formData.get("category") as string;
      const price = parseFloat(formData.get("price") as string);
      const estimatedDuration = formData.get("estimatedDuration")
        ? parseInt(formData.get("estimatedDuration") as string)
        : null;
      const icon = formData.get("icon") as string;
      const isAvailable = formData.get("isAvailable") === "on";

      // Validate form data
      const errors: Record<string, string> = {};

      if (!name || name.trim().length < 2) {
        errors.name = "ชื่อบริการต้องมีอย่างน้อย 2 ตัวอักษร";
      }

      if (!category) {
        errors.category = "กรุณาเลือกหมวดหมู่";
      }

      if (price <= 0) {
        errors.price = "ราคาต้องมากกว่า 0";
      } else if (price > 999999) {
        errors.price = "ราคาต้องไม่เกิน 999,999 บาท";
      }

      // If there are validation errors, throw an error with the validation messages
      if (Object.keys(errors).length > 0) {
        throw new Error(Object.values(errors).join(", "));
      }

      // Create service data
      const createServiceData = {
        name: name.trim(),
        description: description.trim() || null,
        category,
        price,
        estimatedDuration,
        icon: icon.trim() || null,
        isAvailable,
      };

      // Call createService
      await createService(createServiceData);
    },
    [createService]
  );

  // Handle update service form submission
  const handleUpdateService = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();

      // Get form data from the form element
      const form = event.target as HTMLFormElement;
      const formData = new FormData(form);

      // Extract form values
      const id = formData.get("id") as string;
      const name = formData.get("name") as string;
      const description = formData.get("description") as string;
      const category = formData.get("category") as string;
      const price = parseFloat(formData.get("price") as string);
      const estimatedDuration = formData.get("estimatedDuration")
        ? parseInt(formData.get("estimatedDuration") as string)
        : null;
      const icon = formData.get("icon") as string;
      const isAvailable = formData.get("isAvailable") === "on";

      // Validate form data
      const errors: Record<string, string> = {};

      if (!id) {
        errors.id = "ไม่พบ ID ของบริการ";
      }

      if (!name || name.trim().length < 2) {
        errors.name = "ชื่อบริการต้องมีอย่างน้อย 2 ตัวอักษร";
      }

      if (!category) {
        errors.category = "กรุณาเลือกหมวดหมู่";
      }

      if (price <= 0) {
        errors.price = "ราคาต้องมากกว่า 0";
      } else if (price > 999999) {
        errors.price = "ราคาต้องไม่เกิน 999,999 บาท";
      }

      // If there are validation errors, throw an error with the validation messages
      if (Object.keys(errors).length > 0) {
        throw new Error(Object.values(errors).join(", "));
      }

      // Create update service data
      const updateServiceData = {
        id,
        name: name.trim(),
        description: description.trim() || null,
        category,
        price,
        estimatedDuration,
        icon: icon.trim() || null,
        isAvailable,
      };

      // Call updateService
      await updateService(updateServiceData);
    },
    [updateService]
  );

  // Delete service function
  const deleteService = useCallback(
    async (id: string) => {
      try {
        setActionLoading(prev => ({ ...prev, delete: true }));
        setError(null); // Clear previous errors

        const { ClientServicesPresenterFactory } = await import(
          "@/src/presentation/presenters/shop/backend/ServicesPresenter"
        );
        const presenter = await ClientServicesPresenterFactory.create();

        await presenter.deleteService(id);
        
        // Refresh data after successful deletion
        await loadData();
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "ไม่สามารถลบบริการได้";
        setError(errorMessage);
        throw err;
      } finally {
        setActionLoading(prev => ({ ...prev, delete: false }));
      }
    },
    [loadData]
  );

  // Handle delete service function
  const handleDeleteService = useCallback(
    async (id: string) => {
      try {
        await deleteService(id);
      } catch (err) {
        // Error is already handled in deleteService
        throw err;
      }
    },
    [deleteService]
  );

  // Toggle service availability function
  const toggleServiceAvailability = useCallback(
    async (id: string, isAvailable: boolean) => {
      try {
        setActionLoading(prev => ({ ...prev, toggle: true }));
        setError(null); // Clear previous errors

        const { ClientServicesPresenterFactory } = await import(
          "@/src/presentation/presenters/shop/backend/ServicesPresenter"
        );
        const presenter = await ClientServicesPresenterFactory.create();

        // Get current service data
        const service = await presenter.getServiceById(id);
        if (!service) {
          throw new Error("ไม่พบบริการที่ต้องการอัปเดต");
        }

        // Update service with toggled availability
        const updateData = {
          name: service.name,
          description: service.description || null,
          category: service.category || "",
          price: service.price,
          estimatedDuration: service.estimatedDuration || null,
          icon: service.icon || null,
          isAvailable: !isAvailable // Toggle the availability
        };

        await presenter.updateService(id, updateData);
        
        // Refresh data after successful toggle
        await loadData();
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "ไม่สามารถอัปเดตสถานะบริการได้";
        setError(errorMessage);
        throw err;
      } finally {
        setActionLoading(prev => ({ ...prev, toggle: false }));
      }
    },
    [loadData]
  );

  // Handle toggle service availability function
  const handleToggleServiceAvailability = useCallback(
    async (id: string, isAvailable: boolean) => {
      try {
        await toggleServiceAvailability(id, isAvailable);
      } catch (err) {
        // Error is already handled in toggleServiceAvailability
        throw err;
      }
    },
    [toggleServiceAvailability]
  );

  return {
    viewModel,
    loading,
    error,
    currentPage,
    perPage,
    filters,
    handlePageChange,
    handleNextPage,
    handlePrevPage,
    handlePerPageChange,
    handleSearchChange,
    handleCategoryChange,
    handleAvailabilityChange,
    resetFilters,
    refreshData,
    createService,
    handleCreateService,
    updateService,
    handleUpdateService,
    getServiceById,
    deleteService,
    handleDeleteService,
    toggleServiceAvailability,
    handleToggleServiceAvailability,
    actionLoading,
  };
}
