'use client';

import { useState, useEffect, useCallback } from 'react';
import { QueueManagementPresenter, type QueueManagementViewModel } from './QueueManagementPresenter';

export function useQueueManagementPresenter(shopId: string, initialViewModel?: QueueManagementViewModel) {
  const [viewModel, setViewModel] = useState<QueueManagementViewModel | null>(initialViewModel || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for pagination and filters
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  const [filters, setFilters] = useState({
    status: 'all' as string,
    priority: 'all' as string,
    search: '' as string,
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
      
      const { ClientQueueManagementPresenterFactory } = await import('./QueueManagementPresenter');
      const presenter = await ClientQueueManagementPresenterFactory.create();
      
      const newViewModel = await presenter.getViewModel(
        shopId,
        currentPage,
        perPage,
        filters
      );
      
      setViewModel(newViewModel);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load queue data');
      console.error('Error loading queue data:', err);
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
    if (viewModel?.queues.pagination.hasNext) {
      setCurrentPage(prev => prev + 1);
    }
  }, [viewModel?.queues.pagination.hasNext]);

  const handlePrevPage = useCallback(() => {
    if (viewModel?.queues.pagination.hasPrev) {
      setCurrentPage(prev => prev - 1);
    }
  }, [viewModel?.queues.pagination.hasPrev]);

  // Filter handlers
  const handleStatusFilter = useCallback((status: string) => {
    setFilters(prev => ({ ...prev, status }));
    setCurrentPage(1); // Reset to first page when filtering
  }, []);

  const handlePriorityFilter = useCallback((priority: string) => {
    setFilters(prev => ({ ...prev, priority }));
    setCurrentPage(1); // Reset to first page when filtering
  }, []);

  const handleSearch = useCallback((search: string) => {
    setFilters(prev => ({ ...prev, search }));
    setCurrentPage(1); // Reset to first page when searching
  }, []);

  // Reset filters
  const resetFilters = useCallback(() => {
    setFilters({
      status: 'all',
      priority: 'all',
      search: '',
    });
    setCurrentPage(1);
  }, []);

  // Refresh data
  const refreshData = useCallback(() => {
    loadData();
  }, [loadData]);

  return {
    // Data
    viewModel,
    loading,
    error,
    
    // Pagination state
    currentPage,
    perPage,
    
    // Filter state
    filters,
    
    // Pagination handlers
    handlePageChange,
    handleNextPage,
    handlePrevPage,
    
    // Filter handlers
    handleStatusFilter,
    handlePriorityFilter,
    handleSearch,
    resetFilters,
    
    // Utility
    refreshData,
  };
}
