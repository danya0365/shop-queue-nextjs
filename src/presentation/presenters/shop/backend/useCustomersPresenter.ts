"use client";

import type { CustomerDTO } from "@/src/application/dtos/shop/backend/customers-dto";
import type { CreateCustomerUseCaseInput } from "@/src/application/usecases/shop/backend/customers/CreateCustomerUseCase";
import type { UpdateCustomerUseCaseInput } from "@/src/application/usecases/shop/backend/customers/UpdateCustomerUseCase";
import { getPaginationConfig } from "@/src/infrastructure/config/PaginationConfig";
import { useCallback, useEffect, useState } from "react";
import type { CustomersViewModel } from "./CustomersPresenter";

interface UseCustomersPresenterReturn {
  viewModel: CustomersViewModel | null;
  loading: boolean;
  error: string | null;
  currentPage: number;
  perPage: number;
  filters: {
    searchQuery: string;
    membershipTierFilter: string;
    isActiveFilter: string;
    minTotalPoints: string;
    maxTotalPoints: string;
    minTotalQueues: string;
    maxTotalQueues: string;
  };
  searchQuery: string;
  membershipTierFilter: string;
  isActiveFilter: string;
  minTotalPoints: string;
  maxTotalPoints: string;
  minTotalQueues: string;
  maxTotalQueues: string;
  handlePageChange: (page: number) => void;
  handleNextPage: () => void;
  handlePrevPage: () => void;
  handlePerPageChange: (perPage: number) => void;
  handleSearchChange: (value: string) => void;
  handleMembershipTierChange: (value: string) => void;
  handleIsActiveChange: (value: string) => void;
  handleMinTotalPointsChange: (value: string) => void;
  handleMaxTotalPointsChange: (value: string) => void;
  handleMinTotalQueuesChange: (value: string) => void;
  handleMaxTotalQueuesChange: (value: string) => void;
  resetFilters: () => void;
  refreshData: () => void;
  createCustomer: (data: CreateCustomerUseCaseInput) => Promise<void>;
  handleCreateCustomer: (event: React.FormEvent) => Promise<void>;
  updateCustomer: (data: UpdateCustomerUseCaseInput) => Promise<void>;
  handleUpdateCustomer: (event: React.FormEvent) => Promise<void>;
  getCustomerById: (id: string) => Promise<CustomerDTO | null>;
  deleteCustomer: (id: string) => Promise<void>;
  handleDeleteCustomer: (id: string) => Promise<void>;
  actionLoading: {
    create: boolean;
    update: boolean;
    delete: boolean;
    refresh: boolean;
  };
  create: boolean;
  update: boolean;
  delete: boolean;
  refresh: boolean;
  toggleCustomerStatus: (id: string, isActive: boolean) => Promise<void>;
  handleToggleCustomerStatus: (id: string, isActive: boolean) => Promise<void>;
}

export function useCustomersPresenter(
  shopId: string,
  initialViewModel?: CustomersViewModel
): UseCustomersPresenterReturn {
  const [viewModel, setViewModel] = useState<CustomersViewModel | null>(
    initialViewModel || null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState({
    create: false,
    update: false,
    delete: false,
    refresh: false,
  });

  // State for pagination and filters
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(
    getPaginationConfig().CUSTOMERS_PER_PAGE
  );
  const [filters, setFilters] = useState({
    searchQuery: "",
    membershipTierFilter: "all",
    isActiveFilter: "all",
    minTotalPoints: "",
    maxTotalPoints: "",
    minTotalQueues: "",
    maxTotalQueues: "",
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

      const { ClientCustomersPresenterFactory } = await import(
        "./CustomersPresenter"
      );
      const presenter = await ClientCustomersPresenterFactory.create();

      const newViewModel = await presenter.getViewModel(
        shopId,
        currentPage,
        perPage,
        {
          searchQuery: filters.searchQuery || undefined,
          membershipTierFilter:
            filters.membershipTierFilter !== "all"
              ? filters.membershipTierFilter
              : undefined,
          isActiveFilter:
            filters.isActiveFilter !== "all"
              ? filters.isActiveFilter === "true"
              : undefined,
          minTotalPoints: filters.minTotalPoints
            ? parseInt(filters.minTotalPoints)
            : undefined,
          maxTotalPoints: filters.maxTotalPoints
            ? parseInt(filters.maxTotalPoints)
            : undefined,
          minTotalQueues: filters.minTotalQueues
            ? parseInt(filters.minTotalQueues)
            : undefined,
          maxTotalQueues: filters.maxTotalQueues
            ? parseInt(filters.maxTotalQueues)
            : undefined,
        }
      );

      setViewModel(newViewModel);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load customers data"
      );
      console.error("Error loading customers data:", err);
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
    if (viewModel?.customers.pagination.hasNext) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [viewModel?.customers.pagination.hasNext]);

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

  const handleMembershipTierChange = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, membershipTierFilter: value }));
    setCurrentPage(1); // Reset to first page when filtering
    setError(null); // Clear error when filtering
  }, []);

  const handleIsActiveChange = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, isActiveFilter: value }));
    setCurrentPage(1); // Reset to first page when filtering
    setError(null); // Clear error when filtering
  }, []);

  const handleMinTotalPointsChange = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, minTotalPoints: value }));
    setCurrentPage(1); // Reset to first page when filtering
    setError(null); // Clear error when filtering
  }, []);

  const handleMaxTotalPointsChange = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, maxTotalPoints: value }));
    setCurrentPage(1); // Reset to first page when filtering
    setError(null); // Clear error when filtering
  }, []);

  const handleMinTotalQueuesChange = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, minTotalQueues: value }));
    setCurrentPage(1); // Reset to first page when filtering
    setError(null); // Clear error when filtering
  }, []);

  const handleMaxTotalQueuesChange = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, maxTotalQueues: value }));
    setCurrentPage(1); // Reset to first page when filtering
    setError(null); // Clear error when filtering
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      searchQuery: "",
      membershipTierFilter: "all",
      isActiveFilter: "all",
      minTotalPoints: "",
      maxTotalPoints: "",
      minTotalQueues: "",
      maxTotalQueues: "",
    });
    setCurrentPage(1);
    setError(null); // Clear error when resetting filters
  }, []);

  const refreshData = useCallback(() => {
    setError(null); // Clear error when refreshing
    loadData();
  }, [loadData]);

  // Create customer function
  const createCustomer = useCallback(
    async (data: CreateCustomerUseCaseInput) => {
      try {
        setActionLoading((prev) => ({ ...prev, create: true }));
        setError(null); // Clear previous errors

        const { ClientCustomersPresenterFactory } = await import(
          "./CustomersPresenter"
        );
        const presenter = await ClientCustomersPresenterFactory.create();

        await presenter.createCustomer(shopId, data);

        // Refresh data after creating customer
        await loadData();
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to create customer";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setActionLoading((prev) => ({ ...prev, create: false }));
      }
    },
    [shopId, loadData]
  );

  // Get customer by ID function
  const getCustomerById = useCallback(
    async (id: string): Promise<CustomerDTO | null> => {
      try {
        const { ClientCustomersPresenterFactory } = await import(
          "./CustomersPresenter"
        );
        const presenter = await ClientCustomersPresenterFactory.create();
        const customer = await presenter.getCustomerById(id);
        return customer;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to get customer";
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    []
  );

  // Update customer function
  const updateCustomer = useCallback(
    async (data: UpdateCustomerUseCaseInput) => {
      try {
        setActionLoading((prev) => ({ ...prev, update: true }));
        setError(null); // Clear previous errors

        const { ClientCustomersPresenterFactory } = await import(
          "./CustomersPresenter"
        );
        const presenter = await ClientCustomersPresenterFactory.create();

        await presenter.updateCustomer(data.id, {
          name: data.name,
          phone: data.phone,
          email: data.email,
          dateOfBirth: data.dateOfBirth,
          gender: data.gender,
          address: data.address,
          notes: data.notes,
          isActive: data.isActive,
        });

        // Refresh data after updating customer
        await loadData();
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update customer";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setActionLoading((prev) => ({ ...prev, update: false }));
      }
    },
    [loadData]
  );

  // Handle create customer form submission
  const handleCreateCustomer = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();

      // Get form data from the form element
      const form = event.target as HTMLFormElement;
      const formData = new FormData(form);

      // Extract form values
      const name = formData.get("name") as string;
      const phone = formData.get("phone") as string;
      const email = formData.get("email") as string;
      const dateOfBirth = formData.get("dateOfBirth") as string;
      const gender = formData.get("gender") as string;
      const address = formData.get("address") as string;
      const notes = formData.get("notes") as string;

      // Validate form data
      const errors: Record<string, string> = {};

      if (!name || name.trim().length < 2) {
        errors.name = "ชื่อลูกค้าต้องมีอย่างน้อย 2 ตัวอักษร";
      }

      if (phone && !/^0[0-9]{9}$/.test(phone.replace(/[-\s]/g, ""))) {
        errors.phone = "เบอร์โทรศัพท์ไม่ถูกต้อง";
      }

      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email = "อีเมลไม่ถูกต้อง";
      }

      // If there are validation errors, throw an error with the validation messages
      if (Object.keys(errors).length > 0) {
        throw new Error(Object.values(errors).join(", "));
      }

      // Create customer data
      const createCustomerData = {
        profileId: null,
        shopId,
        name: name.trim(),
        phone: phone.trim() || undefined,
        email: email.trim() || undefined,
        dateOfBirth: dateOfBirth
          ? new Date(dateOfBirth).toISOString()
          : undefined,
        gender: (gender as "male" | "female" | "other") || undefined,
        address: address.trim() || undefined,
        notes: notes.trim() || undefined,
        isActive: true,
      };

      // Call createCustomer
      await createCustomer(createCustomerData);
    },
    [createCustomer, shopId]
  );

  // Handle update customer form submission
  const handleUpdateCustomer = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();

      // Get form data from the form element
      const form = event.target as HTMLFormElement;
      const formData = new FormData(form);

      // Extract form values
      const id = formData.get("id") as string;
      const name = formData.get("name") as string;
      const phone = formData.get("phone") as string;
      const email = formData.get("email") as string;
      const dateOfBirth = formData.get("dateOfBirth") as string;
      const gender = formData.get("gender") as string;
      const address = formData.get("address") as string;
      const notes = formData.get("notes") as string;
      const isActive = formData.get("isActive") as string;

      // Validate form data
      const errors: Record<string, string> = {};

      if (!id) {
        errors.id = "ไม่พบ ID ของลูกค้า";
      }

      if (!name || name.trim().length < 2) {
        errors.name = "ชื่อลูกค้าต้องมีอย่างน้อย 2 ตัวอักษร";
      }

      if (phone && !/^0[0-9]{9}$/.test(phone.replace(/[-\s]/g, ""))) {
        errors.phone = "เบอร์โทรศัพท์ไม่ถูกต้อง";
      }

      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email = "อีเมลไม่ถูกต้อง";
      }

      // If there are validation errors, throw an error with the validation messages
      if (Object.keys(errors).length > 0) {
        throw new Error(Object.values(errors).join(", "));
      }

      // Create update customer data
      const updateCustomerData = {
        id,
        name: name.trim(),
        phone: phone.trim() || undefined,
        email: email.trim() || undefined,
        dateOfBirth: dateOfBirth
          ? new Date(dateOfBirth).toISOString()
          : undefined,
        gender: (gender as "male" | "female" | "other") || undefined,
        address: address.trim() || undefined,
        notes: notes.trim() || undefined,
        isActive: isActive === "true",
      };

      // Call updateCustomer
      await updateCustomer(updateCustomerData);
    },
    [updateCustomer]
  );

  // Delete customer function
  const deleteCustomer = useCallback(
    async (id: string) => {
      try {
        setActionLoading((prev) => ({ ...prev, delete: true }));
        setError(null); // Clear previous errors

        const { ClientCustomersPresenterFactory } = await import(
          "./CustomersPresenter"
        );
        const presenter = await ClientCustomersPresenterFactory.create();

        await presenter.deleteCustomer(id);

        // Refresh data after successful deletion
        await loadData();
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "ไม่สามารถลบลูกค้าได้";
        setError(errorMessage);
        throw err;
      } finally {
        setActionLoading((prev) => ({ ...prev, delete: false }));
      }
    },
    [loadData]
  );

  // Handle delete customer function
  const handleDeleteCustomer = useCallback(
    async (id: string) => {
      try {
        await deleteCustomer(id);
      } catch (err) {
        // Error is already handled in deleteCustomer
        throw err;
      }
    },
    [deleteCustomer]
  );

  // Toggle customer status function
  const toggleCustomerStatus = useCallback(
    async (id: string, isActive: boolean) => {
      try {
        setActionLoading((prev) => ({ ...prev, delete: true }));
        setError(null); // Clear previous errors

        const { ClientCustomersPresenterFactory } = await import(
          "@/src/presentation/presenters/shop/backend/CustomersPresenter"
        );
        const presenter = await ClientCustomersPresenterFactory.create();

        // Get current customer data
        const customer = await presenter.getCustomerById(id);
        if (!customer) {
          throw new Error("ไม่พบลูกค้าที่ต้องการอัปเดต");
        }

        // Update customer with toggled active status
        const updateData = {
          name: customer.name,
          email: customer.email || undefined,
          phone: customer.phone || undefined,
          membershipTier: customer.membershipTier || undefined,
          totalPoints: customer.totalPoints || undefined,
          totalQueues: customer.totalQueues || undefined,
          lastVisit: customer.lastVisit || undefined,
          notes: customer.notes || undefined,
          isActive: !isActive, // Toggle the active status
        };

        await presenter.updateCustomer(id, updateData);

        // Refresh data after successful toggle
        await loadData();
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "ไม่สามารถอัปเดตสถานะลูกค้าได้";
        setError(errorMessage);
        throw err;
      } finally {
        setActionLoading((prev) => ({ ...prev, delete: false }));
      }
    },
    [loadData]
  );

  // Handle toggle customer status function
  const handleToggleCustomerStatus = useCallback(
    async (id: string, isActive: boolean) => {
      try {
        await toggleCustomerStatus(id, isActive);
      } catch (err) {
        // Error is already handled in toggleCustomerStatus
        throw err;
      }
    },
    [toggleCustomerStatus]
  );

  return {
    viewModel,
    loading,
    error,
    currentPage,
    perPage,
    filters,
    searchQuery: filters.searchQuery,
    membershipTierFilter: filters.membershipTierFilter,
    isActiveFilter: filters.isActiveFilter,
    minTotalPoints: filters.minTotalPoints,
    maxTotalPoints: filters.maxTotalPoints,
    minTotalQueues: filters.minTotalQueues,
    maxTotalQueues: filters.maxTotalQueues,
    handlePageChange,
    handleNextPage,
    handlePrevPage,
    handlePerPageChange,
    handleSearchChange,
    handleMembershipTierChange,
    handleIsActiveChange,
    handleMinTotalPointsChange,
    handleMaxTotalPointsChange,
    handleMinTotalQueuesChange,
    handleMaxTotalQueuesChange,
    resetFilters,
    refreshData,
    createCustomer,
    handleCreateCustomer,
    updateCustomer,
    handleUpdateCustomer,
    getCustomerById,
    deleteCustomer,
    handleDeleteCustomer,
    toggleCustomerStatus,
    handleToggleCustomerStatus,
    actionLoading,
    create: actionLoading.create,
    update: actionLoading.update,
    delete: actionLoading.delete,
    refresh: actionLoading.refresh,
  };
}
