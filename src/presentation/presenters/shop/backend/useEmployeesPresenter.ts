"use client";

import { useCallback, useEffect, useState } from "react";
import type { Employee, EmployeesViewModel } from "./EmployeesPresenter";
import type { CreateEmployeeParams, UpdateEmployeeParams } from "@/src/application/dtos/shop/backend/employees-dto";

export function useEmployeesPresenter(
  shopId: string,
  initialViewModel?: EmployeesViewModel
) {
  const [viewModel, setViewModel] = useState<EmployeesViewModel | null>(
    initialViewModel || null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Action loading states
  const [actionLoading, setActionLoading] = useState({
    refresh: false,
    create: false,
    update: false,
    delete: false,
  });

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );

  // Filter states
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    department: "all",
    position: "all",
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

      const { ClientEmployeesPresenterFactory } = await import(
        "./EmployeesPresenter"
      );
      const presenter = await ClientEmployeesPresenterFactory.create();

      const newViewModel = await presenter.getViewModel(shopId);

      setViewModel(newViewModel);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load employees data"
      );
      console.error("Error loading employees data:", err);
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

  // Refresh data function
  const refreshData = useCallback(async () => {
    try {
      setActionLoading((prev) => ({ ...prev, refresh: true }));
      await loadData();
    } finally {
      setActionLoading((prev) => ({ ...prev, refresh: false }));
    }
  }, [loadData]);

  // Event handlers
  const handleEmployeeClick = useCallback((employee: Employee) => {
    setSelectedEmployee(employee);
    setShowDetailsModal(true);
  }, []);

  const handleFilterChange = useCallback(
    (filterType: keyof typeof filters, value: string) => {
      setFilters((prev) => ({ ...prev, [filterType]: value }));
    },
    []
  );

  const handleSearchChange = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, search: value }));
  }, []);

  const handleStatusChange = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, status: value }));
  }, []);

  const handleDepartmentChange = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, department: value }));
  }, []);

  const handlePositionChange = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, position: value }));
  }, []);

  const openAddModal = useCallback(() => {
    setShowAddModal(true);
  }, []);

  const closeAddModal = useCallback(() => {
    setShowAddModal(false);
  }, []);

  const closeDetailsModal = useCallback(() => {
    setShowDetailsModal(false);
    setSelectedEmployee(null);
  }, []);

  const openEditModal = useCallback((employee: Employee) => {
    setSelectedEmployee(employee);
    setShowEditModal(true);
  }, []);

  const closeEditModal = useCallback(() => {
    setShowEditModal(false);
    setSelectedEmployee(null);
  }, []);

  const openDeleteModal = useCallback((employee: Employee) => {
    setSelectedEmployee(employee);
    setShowDeleteModal(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setShowDeleteModal(false);
    setSelectedEmployee(null);
  }, []);

  const openViewModal = useCallback((employee: Employee) => {
    setSelectedEmployee(employee);
    setShowViewModal(true);
  }, []);

  const closeViewModal = useCallback(() => {
    setShowViewModal(false);
    setSelectedEmployee(null);
  }, []);

  // CRUD operations
  const createEmployee = useCallback(async (employeeData: CreateEmployeeParams) => {
    try {
      setActionLoading((prev) => ({ ...prev, create: true }));
      const { ClientEmployeesPresenterFactory } = await import(
        "./EmployeesPresenter"
      );
      const presenter = await ClientEmployeesPresenterFactory.create();
      await presenter.createEmployee(shopId, employeeData);
      await loadData(); // Refresh data after creation
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create employee"
      );
      throw err;
    } finally {
      setActionLoading((prev) => ({ ...prev, create: false }));
    }
  }, [shopId, loadData]);

  const updateEmployee = useCallback(async (employeeId: string, employeeData: Omit<UpdateEmployeeParams, "id">) => {
    try {
      setActionLoading((prev) => ({ ...prev, update: true }));
      const { ClientEmployeesPresenterFactory } = await import(
        "./EmployeesPresenter"
      );
      const presenter = await ClientEmployeesPresenterFactory.create();
      await presenter.updateEmployee(employeeId, employeeData);
      await loadData(); // Refresh data after update
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update employee"
      );
      throw err;
    } finally {
      setActionLoading((prev) => ({ ...prev, update: false }));
    }
  }, [loadData]);

  const deleteEmployee = useCallback(async (employeeId: string) => {
    try {
      setActionLoading((prev) => ({ ...prev, delete: true }));
      const { ClientEmployeesPresenterFactory } = await import(
        "./EmployeesPresenter"
      );
      const presenter = await ClientEmployeesPresenterFactory.create();
      await presenter.deleteEmployee(employeeId);
      await loadData(); // Refresh data after deletion
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete employee"
      );
      throw err;
    } finally {
      setActionLoading((prev) => ({ ...prev, delete: false }));
    }
  }, [loadData]);

  // Computed properties
  const employees = viewModel?.employees || [];
  
  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      filters.search === "" ||
      employee.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      employee.email.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesStatus =
      filters.status === "all" || employee.status === filters.status;
    
    const matchesDepartment =
      filters.department === "all" || employee.department === filters.department;
    
    const matchesPosition =
      filters.position === "all" || employee.position === filters.position;
    
    return matchesSearch && matchesStatus && matchesDepartment && matchesPosition;
  });

  const uniquePositions = [...new Set(employees.map((emp) => emp.position))];

  // Helper functions moved from EmployeesView
  const getStatusBadgeClasses = useCallback((status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "on_leave":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      default:
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    }
  }, []);

  const getStatusText = useCallback((status: string) => {
    switch (status) {
      case "active":
        return "ทำงาน";
      case "on_leave":
        return "ลา";
      default:
        return "ไม่ทำงาน";
    }
  }, []);

  const getEmptyStateMessage = useCallback(() => {
    const hasActiveFilters =
      filters.search ||
      filters.status !== "all" ||
      filters.department !== "all" ||
      filters.position !== "all";

    return {
      title: hasActiveFilters
        ? "ไม่พบพนักงานที่ตรงกับเงื่อนไขการค้นหา"
        : "ยังไม่มีพนักงานในระบบ",
      description: hasActiveFilters
        ? "ลองปรับเงื่อนไขการค้นหาหรือเพิ่มพนักงานใหม่"
        : "คลิกปุ่ม 'เพิ่มพนักงาน' เพื่อเริ่มเพิ่มพนักงานคนแรกของคุณ"
    };
  }, [filters]);

  const getPermissionName = useCallback((permissionId: string) => {
    return viewModel?.permissions.find((p) => p.id === permissionId)?.name || null;
  }, [viewModel?.permissions]);

  const formatRating = useCallback((rating: number | undefined) => {
    return rating && rating > 0 ? rating.toFixed(1) : "-";
  }, []);

  // Modal submission handlers with error handling
  const handleCreateEmployee = useCallback(async (employeeData: CreateEmployeeParams) => {
    try {
      await createEmployee(employeeData);
      closeAddModal();
      refreshData();
    } catch (error) {
      console.error("Error creating employee:", error);
      throw error;
    }
  }, [createEmployee, closeAddModal, refreshData]);

  const handleDeleteEmployee = useCallback(async (employeeId: string) => {
    try {
      await deleteEmployee(employeeId);
      closeDeleteModal();
      refreshData();
    } catch (error) {
      console.error("Error deleting employee:", error);
      throw error;
    }
  }, [deleteEmployee, closeDeleteModal, refreshData]);

  return {
    viewModel,
    loading,
    error,
    actionLoading,
    refreshData,
    // Modal states
    showAddModal,
    showDetailsModal,
    showEditModal,
    showDeleteModal,
    showViewModal,
    selectedEmployee,
    // Modal setters
    setSelectedEmployee,
    setShowAddModal,
    setShowDetailsModal,
    setShowEditModal,
    setShowDeleteModal,
    setShowViewModal,
    // Filter states
    filters,
    // Event handlers
    handleEmployeeClick,
    handleFilterChange,
    handleSearchChange,
    handleStatusChange,
    handleDepartmentChange,
    handlePositionChange,
    openAddModal,
    closeAddModal,
    closeDetailsModal,
    openEditModal,
    closeEditModal,
    openDeleteModal,
    closeDeleteModal,
    openViewModal,
    closeViewModal,
    // CRUD operations
    createEmployee,
    updateEmployee,
    deleteEmployee,
    // Computed properties
    employees,
    filteredEmployees,
    uniquePositions,
    // Helper functions
    getStatusBadgeClasses,
    getStatusText,
    getEmptyStateMessage,
    getPermissionName,
    formatRating,
    // Modal submission handlers
    handleCreateEmployee,
    handleDeleteEmployee,
  };
}
