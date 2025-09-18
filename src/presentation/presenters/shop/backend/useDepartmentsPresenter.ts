'use client';

import { useState, useEffect, useCallback } from 'react';
import type { DepartmentsViewModel, Department } from './DepartmentsPresenter';
import type { CreateDepartmentDTO, UpdateDepartmentDTO } from '@/src/application/dtos/shop/backend/department-dto';

export function useDepartmentsPresenter(shopId: string, initialViewModel?: DepartmentsViewModel) {
  const [viewModel, setViewModel] = useState<DepartmentsViewModel | null>(initialViewModel || null);
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
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
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
      console.error('Error loading departments data:', err);
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

  const openEditModal = useCallback((department: Department) => {
    setSelectedDepartment(department);
    setShowEditModal(true);
  }, []);

  const closeEditModal = useCallback(() => {
    setShowEditModal(false);
    setSelectedDepartment(null);
  }, []);

  const openDeleteModal = useCallback((department: Department) => {
    setSelectedDepartment(department);
    setShowDeleteModal(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setShowDeleteModal(false);
    setSelectedDepartment(null);
  }, []);

  const openViewModal = useCallback((department: Department) => {
    setSelectedDepartment(department);
    setShowViewModal(true);
  }, []);

  const closeViewModal = useCallback(() => {
    setShowViewModal(false);
    setSelectedDepartment(null);
  }, []);

  // CRUD operations
  const createDepartment = useCallback(async (departmentData: CreateDepartmentDTO) => {
    try {
      setActionLoading(prev => ({ ...prev, create: true }));
      const { ClientDepartmentsPresenterFactory } = await import('./DepartmentsPresenter');
      const presenter = await ClientDepartmentsPresenterFactory.create();
      await presenter.createDepartment(departmentData);
      await loadData(); // Refresh data after creation
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create department');
      throw err;
    } finally {
      setActionLoading(prev => ({ ...prev, create: false }));
    }
  }, [loadData]);

  const updateDepartment = useCallback(async (departmentId: string, departmentData: Omit<UpdateDepartmentDTO, 'id'>) => {
    try {
      setActionLoading(prev => ({ ...prev, update: true }));
      const { ClientDepartmentsPresenterFactory } = await import('./DepartmentsPresenter');
      const presenter = await ClientDepartmentsPresenterFactory.create();
      await presenter.updateDepartment(departmentId, departmentData);
      await loadData(); // Refresh data after update
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update department');
      throw err;
    } finally {
      setActionLoading(prev => ({ ...prev, update: false }));
    }
  }, [loadData]);

  const deleteDepartment = useCallback(async (departmentId: string) => {
    try {
      setActionLoading(prev => ({ ...prev, delete: true }));
      const { ClientDepartmentsPresenterFactory } = await import('./DepartmentsPresenter');
      const presenter = await ClientDepartmentsPresenterFactory.create();
      await presenter.deleteDepartment(departmentId);
      await loadData(); // Refresh data after deletion
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete department');
      throw err;
    } finally {
      setActionLoading(prev => ({ ...prev, delete: false }));
    }
  }, [loadData]);

  return {
    viewModel,
    loading,
    error,
    actionLoading,
    refreshData,
    // Modal states
    showCreateModal,
    showDetailsModal,
    showEditModal,
    showDeleteModal,
    showViewModal,
    selectedDepartment,
    // Filter states
    filters,
    // Event handlers
    handleDepartmentClick,
    handleSearchChange,
    openCreateModal,
    closeCreateModal,
    closeDetailsModal,
    openEditModal,
    closeEditModal,
    openDeleteModal,
    closeDeleteModal,
    openViewModal,
    closeViewModal,
    // CRUD operations
    createDepartment,
    updateDepartment,
    deleteDepartment,
    // Computed data
    filteredDepartments,
  };
}
