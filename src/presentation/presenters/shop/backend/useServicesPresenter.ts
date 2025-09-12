"use client";

import { useState, useCallback } from "react";
import { ClientServicesPresenterFactory } from "@/src/presentation/presenters/shop/backend/ServicesPresenter";
import type { ServicesViewModel } from "@/src/presentation/presenters/shop/backend/ServicesPresenter";

interface UseServicesPresenterReturn {
  getServicesData: (
    shopId: string,
    page: number,
    perPage: number,
    filters?: {
      searchQuery?: string;
      categoryFilter?: string;
      availabilityFilter?: string;
    }
  ) => Promise<ServicesViewModel>;
  isLoading: boolean;
  error: string | null;
}

export function useServicesPresenter(): UseServicesPresenterReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getServicesData = useCallback(async (
    shopId: string,
    page: number,
    perPage: number,
    filters?: {
      searchQuery?: string;
      categoryFilter?: string;
      availabilityFilter?: string;
    }
  ): Promise<ServicesViewModel> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const presenter = await ClientServicesPresenterFactory.create();
      const viewModel = await presenter.getViewModel(
        shopId, 
        page, 
        perPage, 
        filters
      );
      
      return viewModel;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    getServicesData,
    isLoading,
    error
  };
}
