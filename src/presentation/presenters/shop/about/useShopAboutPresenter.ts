"use client";

import { useState, useCallback, useEffect } from "react";
import { 
  ShopAboutPresenter, 
  ClientShopAboutPresenterFactory,
  ShopAboutViewModel,
  CompanyStats,
  TeamMember
} from "./ShopAboutPresenter";

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
  const [presenter, setPresenter] = useState<ShopAboutPresenter | null>(null);

  // Initialize presenter
  useEffect(() => {
    const initPresenter = async () => {
      try {
        const presenterInstance = await ClientShopAboutPresenterFactory.create();
        setPresenter(presenterInstance);
      } catch (err) {
        console.error("Error initializing presenter:", err);
        setError("ไม่สามารถเริ่มต้นระบบได้");
      }
    };

    initPresenter();
  }, []);

  // Load initial data if not provided
  useEffect(() => {
    if (!initialViewModel && presenter) {
      refreshData();
    }
  }, [presenter, initialViewModel]);

  /**
   * Refresh data from presenter
   */
  const refreshData = useCallback(async () => {
    if (!presenter) return;

    setLoading(true);
    setError(null);

    try {
      const newViewModel = await presenter.getViewModel();
      setViewModel(newViewModel);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ";
      setError(errorMessage);
      console.error("Error loading about data:", err);
    } finally {
      setLoading(false);
    }
  }, [presenter]);

  /**
   * Get company statistics
   */
  const getCompanyStats = useCallback(async (): Promise<CompanyStats> => {
    if (!presenter) {
      return {
        totalShops: 0,
        totalCustomers: 0,
        totalQueues: 0,
        yearsOfService: 1
      };
    }

    try {
      const stats = await presenter.getCompanyStats();
      return stats;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการดึงข้อมูลสถิติ";
      setError(errorMessage);
      console.error("Error getting company stats:", err);
      return {
        totalShops: 0,
        totalCustomers: 0,
        totalQueues: 0,
        yearsOfService: 1
      };
    }
  }, [presenter]);

  /**
   * Get team members
   */
  const getTeamMembers = useCallback(async (): Promise<TeamMember[]> => {
    if (!presenter) return [];

    try {
      const teamMembers = await presenter.getTeamMembers();
      return teamMembers;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการดึงข้อมูลทีมงาน";
      setError(errorMessage);
      console.error("Error getting team members:", err);
      return [];
    }
  }, [presenter]);

  /**
   * Set error state
   */
  const handleSetError = useCallback((newError: string | null) => {
    setError(newError);
  }, []);

  const state: ShopAboutPresenterState = {
    viewModel,
    loading,
    error
  };

  const actions: ShopAboutPresenterActions = {
    refreshData,
    getCompanyStats,
    getTeamMembers,
    setError: handleSetError
  };

  return [state, actions];
}
