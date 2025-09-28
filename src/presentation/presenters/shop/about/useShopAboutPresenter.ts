"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ClientShopAboutPresenterFactory,
  CompanyStats,
  ShopAboutViewModel,
  TeamMember,
} from "./ShopAboutPresenter";

const presenterInstance = ClientShopAboutPresenterFactory.create();

export interface ShopAboutPresenterActions {
  refreshData: () => Promise<void>;
  getCompanyStats: () => Promise<CompanyStats>;
  getTeamMembers: () => Promise<TeamMember[]>;
  setError: (error: string | null) => void;
}

export interface ShopAboutPresenterState {
  viewModel: ShopAboutViewModel | null;
  loading: boolean;
  error: string | null;
}

/**
 * Custom hook for Shop About presenter
 * Provides state management and actions for about page operations
 */
export function useShopAboutPresenter(
  initialViewModel: ShopAboutViewModel | null = null
): [ShopAboutPresenterState, ShopAboutPresenterActions] {
  const [viewModel, setViewModel] = useState<ShopAboutViewModel | null>(
    initialViewModel || null
  );
  const [loading, setLoading] = useState(!initialViewModel);
  const [error, setError] = useState<string | null>(null);

  // Load initial data if not provided
  useEffect(() => {
    if (!initialViewModel) {
      refreshData();
    }
  }, [initialViewModel]);

  /**
   * Refresh data from presenter
   */
  const refreshData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const newViewModel = await presenterInstance.getViewModel();
      setViewModel(newViewModel);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ";
      setError(errorMessage);
      console.error("Error loading about data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get company statistics
   */
  const getCompanyStats = useCallback(async (): Promise<CompanyStats> => {
    try {
      const stats = await presenterInstance.getCompanyStats();
      return stats;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "เกิดข้อผิดพลาดในการดึงข้อมูลสถิติ";
      setError(errorMessage);
      console.error("Error getting company stats:", err);
      return {
        totalShops: 0,
        totalCustomers: 0,
        totalQueues: 0,
        yearsOfService: 1,
      };
    }
  }, []);

  /**
   * Get team members
   */
  const getTeamMembers = useCallback(async (): Promise<TeamMember[]> => {
    try {
      const teamMembers = await presenterInstance.getTeamMembers();
      return teamMembers;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "เกิดข้อผิดพลาดในการดึงข้อมูลทีมงาน";
      setError(errorMessage);
      console.error("Error getting team members:", err);
      return [];
    }
  }, []);

  /**
   * Set error state
   */
  const handleSetError = useCallback((newError: string | null) => {
    setError(newError);
  }, []);

  const state: ShopAboutPresenterState = {
    viewModel,
    loading,
    error,
  };

  const actions: ShopAboutPresenterActions = {
    refreshData,
    getCompanyStats,
    getTeamMembers,
    setError: handleSetError,
  };

  return [state, actions];
}
