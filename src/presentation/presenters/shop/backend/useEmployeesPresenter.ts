'use client';

import { useState, useEffect, useCallback } from 'react';
import type { EmployeesViewModel, Employee } from './EmployeesPresenter';

export function useEmployeesPresenter(shopId: string, initialViewModel?: EmployeesViewModel) {
  const [viewModel, setViewModel] = useState<EmployeesViewModel | null>(initialViewModel || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Action loading states
  const [actionLoading, setActionLoading] = useState({
    refresh: false,
  });

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

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
      
      const { ClientEmployeesPresenterFactory } = await import('./EmployeesPresenter');
      const presenter = await ClientEmployeesPresenterFactory.create();
      
      const newViewModel = await presenter.getViewModel(shopId);
      
      setViewModel(newViewModel);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load employees data');
      console.error('Error loading employees data:', err);
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
      setActionLoading(prev => ({ ...prev, refresh: true }));
      await loadData();
    } finally {
      setActionLoading(prev => ({ ...prev, refresh: false }));
    }
  }, [loadData]);

  // Event handlers
  const handleEmployeeClick = useCallback((employee: Employee) => {
    setSelectedEmployee(employee);
    setShowDetailsModal(true);
  }, []);

  const handleFilterChange = useCallback((filterType: keyof typeof filters, value: string) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setFilters(prev => ({ ...prev, search: value }));
  }, []);

  const handleStatusChange = useCallback((value: string) => {
    setFilters(prev => ({ ...prev, status: value }));
  }, []);

  const handleDepartmentChange = useCallback((value: string) => {
    setFilters(prev => ({ ...prev, department: value }));
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

  // Business logic: Filter employees
  const filteredEmployees = viewModel?.employees.filter((employee) => {
    if (filters.status !== "all" && employee.status !== filters.status)
      return false;
    if (
      filters.department !== "all" &&
      employee.department !== filters.department
    )
      return false;
    if (filters.position !== "all" && employee.position !== filters.position)
      return false;
    if (
      filters.search &&
      !employee.name.toLowerCase().includes(filters.search.toLowerCase()) &&
      !employee.email.toLowerCase().includes(filters.search.toLowerCase())
    )
      return false;
    return true;
  }) || [];

  return {
    viewModel,
    loading,
    error,
    actionLoading,
    refreshData,
    // Modal states
    showAddModal,
    showDetailsModal,
    selectedEmployee,
    // Filter states
    filters,
    // Event handlers
    handleEmployeeClick,
    handleFilterChange,
    handleSearchChange,
    handleStatusChange,
    handleDepartmentChange,
    openAddModal,
    closeAddModal,
    closeDetailsModal,
    // Computed data
    filteredEmployees,
  };
}
