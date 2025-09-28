"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ClientShopContactPresenterFactory,
  ContactFormData,
  FAQ,
  ShopContactViewModel,
} from "./ShopContactPresenter";

const presenterInstance = ClientShopContactPresenterFactory.create();

export interface ShopContactPresenterActions {
  refreshData: () => Promise<void>;
  submitContactForm: (
    formData: ContactFormData
  ) => Promise<{ success: boolean; message: string }>;
  getFAQsByCategory: (category?: string) => Promise<FAQ[]>;
  setError: (error: string | null) => void;
}

export interface ShopContactPresenterState {
  viewModel: ShopContactViewModel | null;
  loading: boolean;
  error: string | null;
  submitting: boolean;
  submitResult: { success: boolean; message: string } | null;
}

/**
 * Custom hook for Shop Contact presenter
 * Provides state management and actions for contact page operations
 */
export function useShopContactPresenter(
  initialViewModel: ShopContactViewModel | null = null
): [ShopContactPresenterState, ShopContactPresenterActions] {
  const [viewModel, setViewModel] = useState<ShopContactViewModel | null>(
    initialViewModel || null
  );
  const [loading, setLoading] = useState(!initialViewModel);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

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
      console.error("Error loading contact data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Submit contact form
   */
  const submitContactForm = useCallback(
    async (
      formData: ContactFormData
    ): Promise<{ success: boolean; message: string }> => {
      setSubmitting(true);
      setError(null);
      setSubmitResult(null);

      try {
        const result = await presenterInstance.submitContactForm(formData);
        setSubmitResult(result);
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการส่งข้อความ";
        setError(errorMessage);
        const failResult = {
          success: false,
          message: errorMessage,
        };
        setSubmitResult(failResult);
        console.error("Error submitting contact form:", err);
        return failResult;
      } finally {
        setSubmitting(false);
      }
    },
    []
  );

  /**
   * Get FAQs by category
   */
  const getFAQsByCategory = useCallback(
    async (category?: string): Promise<FAQ[]> => {
      try {
        const faqs = await presenterInstance.getFAQsByCategory(category);
        return faqs;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "เกิดข้อผิดพลาดในการดึงข้อมูล FAQ";
        setError(errorMessage);
        console.error("Error getting FAQs by category:", err);
        return [];
      }
    },
    []
  );

  /**
   * Set error state
   */
  const handleSetError = useCallback((newError: string | null) => {
    setError(newError);
  }, []);

  const state: ShopContactPresenterState = {
    viewModel,
    loading,
    error,
    submitting,
    submitResult,
  };

  const actions: ShopContactPresenterActions = {
    refreshData,
    submitContactForm,
    getFAQsByCategory,
    setError: handleSetError,
  };

  return [state, actions];
}
