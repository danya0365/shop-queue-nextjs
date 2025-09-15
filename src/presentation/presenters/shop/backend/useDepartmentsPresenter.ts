'use client';

import { useState, useEffect, useCallback } from 'react';
import type { DepartmentsViewModel, Department } from './DepartmentsPresenter';

export function useDepartmentsPresenter(shopId: string, initialViewModel?: DepartmentsViewModel) {
  const [viewModel, setViewModel] = useState<DepartmentsViewModel | null>(initialViewModel || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Action loading states
  const [actionLoading, setActionLoading] = useState({
    refresh: false,
  });

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);

  // Filter states
  const [filters, setFilters] = useState({
    search: "",
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
      
      const { ClientDepartmentsPresenterFactory } = await import('./DepartmentsPresenter');
      const presenter = await ClientDepartmentsPresenterFactory.create();
      
      const newViewModel = await presenter.getViewModel(shopId);
      
      setViewModel(newViewModel);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load departments data');
    } finally {
      setLoading(false);
    }
  }, [shopId]);

  // Load data on mount if no initial view model
  useEffect(() => {
    if (!initialViewModel) {
      loadData();
    }
  }, [loadData, initialViewModel]);

  // Refresh data
  const refreshData = useCallback(async () => {
    try {
      setActionLoading(prev => ({ ...prev, refresh: true }));
      await loadData();
    } finally {
      setActionLoading(prev => ({ ...prev, refresh: false }));
    }
  }, [loadData]);

  // Filter departments based on search
  const filteredDepartments = viewModel?.departments.filter(
    (department) =>
      filters.search === "" ||
      department.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      (department.description &&
        department.description.toLowerCase().includes(filters.search.toLowerCase()))
  ) || [];

  // Event handlers
  const handleDepartmentClick = useCallback((department: Department) => {
    setSelectedDepartment(department);
    setShowDetailsModal(true);
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setFilters(prev => ({ ...prev, search: value }));
  }, []);

  const openCreateModal = useCallback(() => {
    setShowCreateModal(true);
  }, []);

  const closeCreateModal = useCallback(() => {
    setShowCreateModal(false);
  }, []);

  const closeDetailsModal = useCallback(() => {
    setShowDetailsModal(false);
    setSelectedDepartment(null);
  }, []);

  return {
    viewModel,
    loading,
    error,
    actionLoading,
    refreshData,
    // Modal states
    showCreateModal,
    showDetailsModal,
    selectedDepartment,
    // Filter states
    filters,
    // Event handlers
    handleDepartmentClick,
    handleSearchChange,
    openCreateModal,
    closeCreateModal,
    closeDetailsModal,
    // Computed data
    filteredDepartments,
  };
}
