"use client";

import { useState, useCallback, useEffect } from "react";
import { 
  ShopContactPresenter, 
  ClientShopContactPresenterFactory,
  ShopContactViewModel,
  ContactFormData,
  FAQ
} from "./ShopContactPresenter";

export interface ShopContactPresenterActions {
  refreshData: () => Promise<void>;
  submitContactForm: (formData: ContactFormData) => Promise<{ success: boolean; message: string }>;
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
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null);
  const [presenter, setPresenter] = useState<ShopContactPresenter | null>(null);

  // Initialize presenter
  useEffect(() => {
    const initPresenter = async () => {
      try {
        const presenterInstance = await ClientShopContactPresenterFactory.create();
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
      console.error("Error loading contact data:", err);
    } finally {
      setLoading(false);
    }
  }, [presenter]);

  /**
   * Submit contact form
   */
  const submitContactForm = useCallback(async (formData: ContactFormData): Promise<{ success: boolean; message: string }> => {
    if (!presenter) {
      return {
        success: false,
        message: "ระบบยังไม่พร้อม กรุณาลองใหม่อีกครั้ง"
      };
    }

    setSubmitting(true);
    setError(null);
    setSubmitResult(null);

    try {
      const result = await presenter.submitContactForm(formData);
      setSubmitResult(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการส่งข้อความ";
      setError(errorMessage);
      const failResult = {
        success: false,
        message: errorMessage
      };
      setSubmitResult(failResult);
      console.error("Error submitting contact form:", err);
      return failResult;
    } finally {
      setSubmitting(false);
    }
  }, [presenter]);

  /**
   * Get FAQs by category
   */
  const getFAQsByCategory = useCallback(async (category?: string): Promise<FAQ[]> => {
    if (!presenter) return [];

    try {
      const faqs = await presenter.getFAQsByCategory(category);
      return faqs;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการดึงข้อมูล FAQ";
      setError(errorMessage);
      console.error("Error getting FAQs by category:", err);
      return [];
    }
  }, [presenter]);

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
    submitResult
  };

  const actions: ShopContactPresenterActions = {
    refreshData,
    submitContactForm,
    getFAQsByCategory,
    setError: handleSetError
  };

  return [state, actions];
}
