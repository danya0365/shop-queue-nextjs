"use client";

import {
  ClientServicesPresenterFactory,
  ServicesViewModel,
} from "@/src/presentation/presenters/shop/backend/ServicesPresenter";
import { useCallback, useEffect, useState } from "react";

interface CreateServiceDTO {
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
  handleSearchChange: (value: string) => void;
  handleCategoryChange: (value: string) => void;
  handleAvailabilityChange: (value: string) => void;
  resetFilters: () => void;
  refreshData: () => void;
  createService: (data: CreateServiceDTO) => Promise<void>;
  handleCreateService: (event: React.FormEvent) => Promise<void>;
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

  // State for pagination and filters
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
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
  }, [loadData, initialViewModel]);

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

  // Filter handlers
  const handleSearchChange = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: value }));
    setCurrentPage(1); // Reset to first page when filtering
  }, []);

  const handleCategoryChange = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, categoryFilter: value }));
    setCurrentPage(1); // Reset to first page when filtering
  }, []);

  const handleAvailabilityChange = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, availabilityFilter: value }));
    setCurrentPage(1); // Reset to first page when filtering
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      searchQuery: "",
      categoryFilter: "all",
      availabilityFilter: "all",
    });
    setCurrentPage(1);
  }, []);

  const refreshData = useCallback(() => {
    loadData();
  }, [loadData]);

  // Create service function
  const createService = useCallback(
    async (data: CreateServiceDTO) => {
      try {
        const presenter = await ClientServicesPresenterFactory.create();

        await presenter.createService(shopId, data);

        // Refresh data after creating service
        await loadData();
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to create service";
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [shopId, loadData]
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
      const isAvailable = formData.get("isAvailable") === "true";

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
    handleSearchChange,
    handleCategoryChange,
    handleAvailabilityChange,
    resetFilters,
    refreshData,
    createService,
    handleCreateService,
  };
}
