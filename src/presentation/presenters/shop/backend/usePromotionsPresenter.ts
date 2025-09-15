import { getClientService } from '@/src/di/client-container';
import { Logger } from '@/src/domain/interfaces/logger';
import { PromotionsViewModel } from './PromotionsPresenter';
import { useCallback, useEffect, useState } from 'react';

// Define form/action data interfaces
export interface CreatePromotionData {
  name: string;
  description?: string;
  type: 'percentage' | 'fixed_amount' | 'buy_x_get_y' | 'free_shipping';
  value: number;
  minPurchaseAmount?: number;
  maxDiscountAmount?: number;
  usageLimit?: number;
  startAt: string;
  endAt: string;
  conditions?: Record<string, any>;
}

export interface UpdatePromotionData {
  id: string;
  name?: string;
  description?: string;
  type?: 'percentage' | 'fixed_amount' | 'buy_x_get_y' | 'free_shipping';
  status?: 'active' | 'inactive' | 'expired' | 'scheduled';
  value?: number;
  minPurchaseAmount?: number;
  maxDiscountAmount?: number;
  usageLimit?: number;
  startAt?: string;
  endAt?: string;
  conditions?: Record<string, any>;
}

// Define state interface
export interface PromotionsPresenterState {
  viewModel: PromotionsViewModel | null;
  isLoading: boolean;
  error: string | null;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  selectedPromotion: any | null;
  showCreateModal: boolean;
  showEditModal: boolean;
  showDeleteModal: boolean;
  searchTerm: string;
  statusFilter: string;
}

// Define actions interface
export interface PromotionsPresenterActions {
  createPromotion: (data: CreatePromotionData) => Promise<boolean>;
  updatePromotion: (data: UpdatePromotionData) => Promise<boolean>;
  deletePromotion: (id: string) => Promise<boolean>;
  setSelectedPromotion: (promotion: any | null) => void;
  openCreateModal: () => void;
  closeCreateModal: () => void;
  openEditModal: (promotion: any) => void;
  closeEditModal: () => void;
  openDeleteModal: (promotion: any) => void;
  closeDeleteModal: () => void;
  setSearchTerm: (term: string) => void;
  setStatusFilter: (status: string) => void;
  refreshData: () => Promise<void>;
  setError: (error: string | null) => void;
}

// Hook type
export type PromotionsPresenterHook = [
  PromotionsPresenterState,
  PromotionsPresenterActions
];

// Custom hook implementation
export const usePromotionsPresenter = (
  shopId: string,
  initialViewModel?: PromotionsViewModel
): PromotionsPresenterHook => {
  const logger = getClientService<Logger>('Logger');
  
  const [viewModel, setViewModel] = useState<PromotionsViewModel | null>(
    initialViewModel || null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState<any | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

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

      const { ClientPromotionsPresenterFactory } = await import(
        './PromotionsPresenter'
      );
      const presenter = await ClientPromotionsPresenterFactory.create();

      const newViewModel = await presenter.getViewModel(shopId);

      setViewModel(newViewModel);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load promotions data'
      );
      console.error('Error loading promotions data:', err);
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
  
  const createPromotion = async (data: CreatePromotionData): Promise<boolean> => {
    setIsCreating(true);
    setError(null);

    try {
      // Validation logic
      if (!data.name?.trim()) {
        throw new Error('ชื่อโปรโมชั่นจำเป็นต้องระบุ');
      }

      if (!data.type) {
        throw new Error('ประเภทโปรโมชั่นจำเป็นต้องระบุ');
      }

      if (data.value <= 0) {
        throw new Error('ค่าส่วนลดต้องมากกว่า 0');
      }

      if (!data.startAt) {
        throw new Error('วันที่เริ่มต้นจำเป็นต้องระบุ');
      }

      if (!data.endAt) {
        throw new Error('วันที่สิ้นสุดจำเป็นต้องระบุ');
      }

      const startDate = new Date(data.startAt);
      const endDate = new Date(data.endAt);

      if (endDate <= startDate) {
        throw new Error('วันที่สิ้นสุดต้องมากกว่าวันที่เริ่มต้น');
      }

      if (data.type === 'percentage' && data.value > 100) {
        throw new Error('ส่วนลดเปอร์เซ็นต์ต้องไม่เกิน 100%');
      }

      // API call would go here
      // const result = await promotionsService.createPromotion(data);
      
      logger.info('PromotionsPresenter: Promotion created successfully');
      setShowCreateModal(false);
      return true;
    } catch (error) {
      logger.error('PromotionsPresenter: Error creating promotion', error);
      setError(error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการสร้างโปรโมชั่น');
      return false;
    } finally {
      setIsCreating(false);
    }
  };

  const updatePromotion = async (data: UpdatePromotionData): Promise<boolean> => {
    setIsUpdating(true);
    setError(null);

    try {
      // Validation logic
      if (data.name !== undefined && !data.name?.trim()) {
        throw new Error('ชื่อโปรโมชั่นจำเป็นต้องระบุ');
      }

      if (data.value !== undefined && data.value <= 0) {
        throw new Error('ค่าส่วนลดต้องมากกว่า 0');
      }

      if (data.startAt && data.endAt) {
        const startDate = new Date(data.startAt);
        const endDate = new Date(data.endAt);

        if (endDate <= startDate) {
          throw new Error('วันที่สิ้นสุดต้องมากกว่าวันที่เริ่มต้น');
        }
      }

      if (data.type === 'percentage' && data.value !== undefined && data.value > 100) {
        throw new Error('ส่วนลดเปอร์เซ็นต์ต้องไม่เกิน 100%');
      }

      // API call would go here
      // const result = await promotionsService.updatePromotion(data);
      
      logger.info('PromotionsPresenter: Promotion updated successfully');
      setShowEditModal(false);
      setSelectedPromotion(null);
      return true;
    } catch (error) {
      logger.error('PromotionsPresenter: Error updating promotion', error);
      setError(error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการอัปเดตโปรโมชั่น');
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  const deletePromotion = async (promotionId: string): Promise<boolean> => {
    setIsDeleting(true);
    setError(null);

    try {
      if (!promotionId) {
        throw new Error('Promotion ID is required');
      }

      // API call would go here
      // const result = await promotionsService.deletePromotion(promotionId);
      
      logger.info('PromotionsPresenter: Promotion deleted successfully');
      setShowDeleteModal(false);
      setSelectedPromotion(null);
      return true;
    } catch (error) {
      logger.error('PromotionsPresenter: Error deleting promotion', error);
      setError(error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการลบโปรโมชั่น');
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  const reset = () => {
    setIsLoading(false);
    setError(null);
    setIsCreating(false);
    setIsUpdating(false);
    setIsDeleting(false);
    setSelectedPromotion(null);
    setShowCreateModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    logger.info('PromotionsPresenter: Reset');
  };

  return [
    { 
      viewModel,
      isLoading, 
      error, 
      isCreating, 
      isUpdating, 
      isDeleting, 
      selectedPromotion,
      showCreateModal,
      showEditModal,
      showDeleteModal,
      searchTerm,
      statusFilter
    },
    { 
      createPromotion, 
      updatePromotion, 
      deletePromotion,
      setSelectedPromotion,
      openCreateModal: () => setShowCreateModal(true),
      closeCreateModal: () => setShowCreateModal(false),
      openEditModal: (promotion: any) => {
        setSelectedPromotion(promotion);
        setShowEditModal(true);
      },
      closeEditModal: () => setShowEditModal(false),
      openDeleteModal: (promotion: any) => {
        setSelectedPromotion(promotion);
        setShowDeleteModal(true);
      },
      closeDeleteModal: () => setShowDeleteModal(false),
      setSearchTerm,
      setStatusFilter,
      refreshData: loadData,
      setError 
    }
  ] as const;
};
