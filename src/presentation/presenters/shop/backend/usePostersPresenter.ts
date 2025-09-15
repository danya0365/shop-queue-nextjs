import { getClientService } from '@/src/di/client-container';
import { Logger } from '@/src/domain/interfaces/logger';
import { PosterTemplate, PosterCustomization, PostersViewModel } from './PostersPresenter';
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
  selectedTemplate: PosterTemplate | null;
  showPreview: boolean;
  showPaymentModal: boolean;
  customization: Partial<PosterCustomization>;
}

// Define actions interface
export interface PostersPresenterActions {
  createPoster: (data: CreatePosterData) => Promise<boolean>;
  refreshData: () => Promise<void>;
  setError: (error: string | null) => void;
  setSelectedTemplate: (template: PosterTemplate | null) => void;
  setShowPreview: (show: boolean) => void;
  setShowPaymentModal: (show: boolean) => void;
  updateCustomization: (customization: Partial<PosterCustomization>) => void;
  handleTemplateSelect: (template: PosterTemplate) => void;
  handleCreatePoster: () => Promise<boolean>;
  handlePrint: () => void;
  handlePreview: () => void;
  getCategoryIcon: (category: string) => string;
  getCategoryName: (category: string) => string;
  resetCustomization: () => void;
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
  const [selectedTemplate, setSelectedTemplate] = useState<PosterTemplate | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [customization, setCustomization] = useState<Partial<PosterCustomization>>({
    showServices: true,
    showOpeningHours: true,
    showPhone: true,
    showAddress: true,
    qrCodeSize: 'medium',
    customText: '',
  });

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

  // Helper functions
  const getCategoryIcon = (category: string): string => {
    switch (category) {
      case 'minimal':
        return '✨';
      case 'colorful':
        return '🎨';
      case 'professional':
        return '💼';
      case 'creative':
        return '🎭';
      default:
        return '📄';
    }
  };

  const getCategoryName = (category: string): string => {
    switch (category) {
      case 'minimal':
        return 'เรียบง่าย';
      case 'colorful':
        return 'สีสันสดใส';
      case 'professional':
        return 'มืออาชีพ';
      case 'creative':
        return 'สร้างสรรค์';
      default:
        return category;
    }
  };

  const resetCustomization = () => {
    setCustomization({
      showServices: true,
      showOpeningHours: true,
      showPhone: true,
      showAddress: true,
      qrCodeSize: 'medium',
      customText: '',
    });
  };

  // Event handlers
  const handleTemplateSelect = (template: PosterTemplate) => {
    if (viewModel && template.isPremium && !viewModel.userSubscription.isPremium) {
      alert('โปสเตอร์นี้ต้องสมัครแพ็คเกจ Premium เท่านั้น');
      return;
    }
    setSelectedTemplate(template);
  };

  const handleCreatePoster = async (): Promise<boolean> => {
    if (!selectedTemplate) return false;

    const success = await createPoster({
      templateId: selectedTemplate.id,
      customization: {
        customText: customization.customText || '',
        showServices: customization.showServices || false,
        showOpeningHours: customization.showOpeningHours || false,
        showPhone: customization.showPhone || false,
        showAddress: customization.showAddress || false,
        qrCodeSize: customization.qrCodeSize || 'medium',
      },
    });

    if (success) {
      setShowPreview(false);
      setSelectedTemplate(null);
      resetCustomization();
    }

    return success;
  };

  const handlePrint = () => {
    handleCreatePoster();
  };

  const handlePreview = () => {
    if (!selectedTemplate) return;
    setShowPreview(true);
  };

  const updateCustomization = (newCustomization: Partial<PosterCustomization>) => {
    setCustomization(prev => ({ ...prev, ...newCustomization }));
  };

  const actions: PostersPresenterActions = {
    createPoster,
    refreshData,
    setError,
    setSelectedTemplate,
    setShowPreview,
    setShowPaymentModal,
    updateCustomization,
    handleTemplateSelect,
    handleCreatePoster,
    handlePrint,
    handlePreview,
    getCategoryIcon,
    getCategoryName,
    resetCustomization,
  };

  const state: PostersPresenterState = {
    viewModel,
    isLoading,
    error,
    isCreating,
    selectedTemplate,
    showPreview,
    showPaymentModal,
    customization,
  };

  return [state, actions];
};
