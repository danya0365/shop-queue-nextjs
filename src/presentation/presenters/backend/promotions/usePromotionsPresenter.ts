'use client';

import { getClientService } from '@/src/di/client-container';
import { Logger } from '@/src/domain/interfaces/logger';
import { useState } from 'react';

// Define form/action data interfaces
export interface CreatePromotionData {
  shopId: string;
  name: string;
  description?: string;
  type: 'percentage' | 'fixed_amount' | 'buy_x_get_y' | 'free_item';
  value: number;
  minPurchaseAmount?: number;
  maxDiscountAmount?: number;
  startAt: string;
  endAt: string;
  usageLimit?: number;
  status?: 'active' | 'inactive' | 'expired' | 'scheduled';
  conditions?: Record<string, string>[];
}

export interface UpdatePromotionData {
  id: string;
  shopId?: string;
  name?: string;
  description?: string;
  type?: 'percentage' | 'fixed_amount' | 'buy_x_get_y' | 'free_item';
  value?: number;
  minPurchaseAmount?: number;
  maxDiscountAmount?: number;
  startAt?: string;
  endAt?: string;
  usageLimit?: number;
  status?: 'active' | 'inactive' | 'expired' | 'scheduled';
  conditions?: Record<string, string>[];
}

// Define state interface
export interface PromotionsPresenterState {
  isLoading: boolean;
  error: string | null;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  selectedPromotionId: string | null;
}

// Define actions interface
export interface PromotionsPresenterActions {
  createPromotion: (data: CreatePromotionData) => Promise<boolean>;
  updatePromotion: (data: UpdatePromotionData) => Promise<boolean>;
  deletePromotion: (id: string) => Promise<boolean>;
  setSelectedPromotion: (id: string | null) => void;
  reset: () => void;
  setError: (error: string | null) => void;
}

// Hook type
export type PromotionsPresenterHook = [
  PromotionsPresenterState,
  PromotionsPresenterActions
];

// Custom hook implementation
export const usePromotionsPresenter = (): PromotionsPresenterHook => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedPromotionId, setSelectedPromotionId] = useState<string | null>(null);
  const logger = getClientService<Logger>('Logger');

  const createPromotion = async (data: CreatePromotionData): Promise<boolean> => {
    setIsCreating(true);
    setError(null);

    try {
      // Validation logic
      if (!data.name.trim()) {
        throw new Error('ชื่อโปรโมชั่นไม่สามารถเว้นว่างได้');
      }

      if (!data.shopId) {
        throw new Error('กรุณาเลือกร้านค้า');
      }

      if (data.value <= 0) {
        throw new Error('ค่าส่วนลดต้องมากกว่า 0');
      }

      if (new Date(data.startAt) >= new Date(data.endAt)) {
        throw new Error('วันที่เริ่มต้องต้องน้อยกว่าวันที่สิ้นสุด');
      }

      // Mock API call - in real implementation, this would call the backend service
      await new Promise(resolve => setTimeout(resolve, 1000));

      logger.info('PromotionsPresenter: Promotion created successfully', { data });
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
      if (data.name && !data.name.trim()) {
        throw new Error('ชื่อโปรโมชั่นไม่สามารถเว้นว่างได้');
      }

      if (data.value && data.value <= 0) {
        throw new Error('ค่าส่วนลดต้องมากกว่า 0');
      }

      if (data.startAt && data.endAt && new Date(data.startAt) >= new Date(data.endAt)) {
        throw new Error('วันที่เริ่มต้องต้องน้อยกว่าวันที่สิ้นสุด');
      }

      // Mock API call - in real implementation, this would call the backend service
      await new Promise(resolve => setTimeout(resolve, 1000));

      logger.info('PromotionsPresenter: Promotion updated successfully', { data });
      return true;
    } catch (error) {
      logger.error('PromotionsPresenter: Error updating promotion', error);
      setError(error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการอัปเดตโปรโมชั่น');
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  const deletePromotion = async (id: string): Promise<boolean> => {
    setIsDeleting(true);
    setError(null);

    try {
      if (!id) {
        throw new Error('ไม่พบรหัสโปรโมชั่น');
      }

      // Mock API call - in real implementation, this would call the backend service
      await new Promise(resolve => setTimeout(resolve, 1000));

      logger.info('PromotionsPresenter: Promotion deleted successfully', { id });
      return true;
    } catch (error) {
      logger.error('PromotionsPresenter: Error deleting promotion', error);
      setError(error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการลบโปรโมชั่น');
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  const setSelectedPromotion = (id: string | null) => {
    setSelectedPromotionId(id);
    logger.info('PromotionsPresenter: Selected promotion changed', { id });
  };

  const reset = () => {
    setIsLoading(false);
    setError(null);
    setIsCreating(false);
    setIsUpdating(false);
    setIsDeleting(false);
    setSelectedPromotionId(null);
    logger.info('PromotionsPresenter: Reset');
  };

  return [
    {
      isLoading,
      error,
      isCreating,
      isUpdating,
      isDeleting,
      selectedPromotionId
    },
    {
      createPromotion,
      updatePromotion,
      deletePromotion,
      setSelectedPromotion,
      reset,
      setError
    },
  ];
};
