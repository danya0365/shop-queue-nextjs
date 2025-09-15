import { getClientService } from '@/src/di/client-container';
import { Logger } from '@/src/domain/interfaces/logger';
import { PostersViewModel } from './PostersPresenter';
import { useCallback, useEffect, useState } from 'react';

// Define form/action data interfaces
export interface CreatePosterData {
  templateId: string;
  customization: {
    customText?: string;
    showServices: boolean;
    showOpeningHours: boolean;
    showPhone: boolean;
    showAddress: boolean;
    qrCodeSize: 'small' | 'medium' | 'large';
  };
}

// Define state interface
export interface PostersPresenterState {
  viewModel: PostersViewModel | null;
  isLoading: boolean;
  error: string | null;
  isCreating: boolean;
}

// Define actions interface
export interface PostersPresenterActions {
  createPoster: (data: CreatePosterData) => Promise<boolean>;
  refreshData: () => Promise<void>;
  setError: (error: string | null) => void;
}

// Hook type
export type PostersPresenterHook = [
  PostersPresenterState,
  PostersPresenterActions
];

// Custom hook implementation
export const usePostersPresenter = (
  shopId: string,
  initialViewModel?: PostersViewModel
): PostersPresenterHook => {
  const logger = getClientService<Logger>('Logger');
  
  const [viewModel, setViewModel] = useState<PostersViewModel | null>(
    initialViewModel || null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Initialize with initial view model if provided
  useEffect(() => {
    if (initialViewModel) {
      setViewModel(initialViewModel);
      setIsLoading(false);
    }
  }, [initialViewModel]);

  // Function to load data
  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { ClientPostersPresenterFactory } = await import(
        './PostersPresenter'
      );
      const presenter = await ClientPostersPresenterFactory.create();

      const newViewModel = await presenter.getViewModel(shopId);

      setViewModel(newViewModel);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load posters data'
      );
      console.error('Error loading posters data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [shopId]);

  // Load data when dependencies change, but not if we have initial view model
  useEffect(() => {
    if (!initialViewModel) {
      loadData();
    }
  }, [loadData, initialViewModel]);
  
  const createPoster = async (data: CreatePosterData): Promise<boolean> => {
    setIsCreating(true);
    setError(null);

    try {
      // Validation logic
      if (!data.templateId?.trim()) {
        throw new Error('กรุณาเลือกเทมเพลตโปสเตอร์');
      }

      if (!data.customization) {
        throw new Error('กรุณากำหนดการปรับแต่งโปสเตอร์');
      }

      // API call would go here
      // const result = await postersService.createPoster(data);
      
      logger.info('PostersPresenter: Poster created successfully');
      return true;
    } catch (error) {
      logger.error('PostersPresenter: Error creating poster', error);
      setError(error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการสร้างโปสเตอร์');
      return false;
    } finally {
      setIsCreating(false);
    }
  };

  const refreshData = async () => {
    await loadData();
  };

  const actions: PostersPresenterActions = {
    createPoster,
    refreshData,
    setError,
  };

  const state: PostersPresenterState = {
    viewModel,
    isLoading,
    error,
    isCreating,
  };

  return [state, actions];
};
