'use client';

import { useState, useEffect, useCallback } from 'react';
import type { BackendDashboardViewModel } from './DashboardPresenter';

export function useBackendDashboardPresenter(shopId: string, initialViewModel?: BackendDashboardViewModel) {
  const [viewModel, setViewModel] = useState<BackendDashboardViewModel | null>(initialViewModel || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Action loading states
  const [actionLoading, setActionLoading] = useState({
    refresh: false,
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
      
      const { ClientBackendDashboardPresenterFactory } = await import('./DashboardPresenter');
      const presenter = await ClientBackendDashboardPresenterFactory.create();
      
      const newViewModel = await presenter.getViewModel(shopId);
      
      setViewModel(newViewModel);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      console.error('Error loading dashboard data:', err);
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

  return {
    viewModel,
    loading,
    error,
    actionLoading,
    refreshData,
  };
}
