
import type { RewardType } from '@/src/application/dtos/reward-dto';
import { getClientService } from '@/src/di/client-container';
import { Logger } from '@/src/domain/interfaces/logger';
import { useState } from 'react';

export interface CreateRewardData {
  name: string;
  description?: string;
  type: RewardType;
  pointsRequired: number;
  value: number;
  isAvailable?: boolean;
  expiryDays?: number;
  usageLimit?: number;
  icon?: string;
}

export interface UpdateRewardData {
  id: string;
  name?: string;
  description?: string;
  type?: RewardType;
  pointsRequired?: number;
  value?: number;
  isAvailable?: boolean;
  expiryDays?: number;
  usageLimit?: number;
  icon?: string;
}

export interface ToggleAvailabilityData {
  rewardId: string;
  isAvailable: boolean;
}

export interface RewardsPresenterState {
  isLoading: boolean;
  isCreatingReward: boolean;
  isUpdatingReward: boolean;
  isDeletingReward: boolean;
  selectedRewardId: string | null;
  error: string | null;
}

export interface RewardsPresenterActions {
  createReward: (data: CreateRewardData) => Promise<boolean>;
  updateReward: (data: UpdateRewardData) => Promise<boolean>;
  deleteReward: (rewardId: string) => Promise<boolean>;
  toggleAvailability: (data: ToggleAvailabilityData) => Promise<boolean>;
  selectReward: (rewardId: string) => void;
  clearSelection: () => void;
  reset: () => void;
  setError: (error: string | null) => void;
}

export type RewardsPresenterHook = [
  RewardsPresenterState,
  RewardsPresenterActions
];

export const useRewardsPresenter = (): RewardsPresenterHook => {
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingReward, setIsCreatingReward] = useState(false);
  const [isUpdatingReward, setIsUpdatingReward] = useState(false);
  const [isDeletingReward, setIsDeletingReward] = useState(false);
  const [selectedRewardId, setSelectedRewardId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const logger = getClientService<Logger>('Logger');

  const createReward = async (data: CreateRewardData): Promise<boolean> => {
    setIsCreatingReward(true);
    setError(null);

    try {
      // Validation
      if (!data.name.trim()) {
        throw new Error('กรุณาระบุชื่อรางวัล');
      }
      if (data.pointsRequired <= 0) {
        throw new Error('จำนวนแต้มที่ต้องใช้ต้องมากกว่า 0');
      }
      if (data.value <= 0) {
        throw new Error('มูลค่ารางวัลต้องมากกว่า 0');
      }

      // Mock API call - in real implementation would call service
      await new Promise(resolve => setTimeout(resolve, 1000));

      logger.info('RewardsPresenter: Reward created successfully', { name: data.name });
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการสร้างรางวัล';
      logger.error('RewardsPresenter: Error creating reward', error);
      setError(errorMessage);
      return false;
    } finally {
      setIsCreatingReward(false);
    }
  };

  const updateReward = async (data: UpdateRewardData): Promise<boolean> => {
    setIsUpdatingReward(true);
    setError(null);

    try {
      // Validation
      if (data.name && !data.name.trim()) {
        throw new Error('กรุณาระบุชื่อรางวัล');
      }
      if (data.pointsRequired && data.pointsRequired <= 0) {
        throw new Error('จำนวนแต้มที่ต้องใช้ต้องมากกว่า 0');
      }
      if (data.value && data.value <= 0) {
        throw new Error('มูลค่ารางวัลต้องมากกว่า 0');
      }

      // Mock API call - in real implementation would call service
      await new Promise(resolve => setTimeout(resolve, 1000));

      logger.info('RewardsPresenter: Reward updated successfully', { id: data.id });
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการอัปเดตรางวัล';
      logger.error('RewardsPresenter: Error updating reward', error);
      setError(errorMessage);
      return false;
    } finally {
      setIsUpdatingReward(false);
    }
  };

  const deleteReward = async (rewardId: string): Promise<boolean> => {
    setIsDeletingReward(true);
    setError(null);

    try {
      // Mock API call - in real implementation would call service
      await new Promise(resolve => setTimeout(resolve, 1000));

      logger.info('RewardsPresenter: Reward deleted successfully', { id: rewardId });
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการลบรางวัล';
      logger.error('RewardsPresenter: Error deleting reward', error);
      setError(errorMessage);
      return false;
    } finally {
      setIsDeletingReward(false);
    }
  };

  const toggleAvailability = async (data: ToggleAvailabilityData): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // Mock API call - in real implementation would call service
      await new Promise(resolve => setTimeout(resolve, 500));

      logger.info('RewardsPresenter: Reward availability toggled successfully', {
        id: data.rewardId,
        isAvailable: data.isAvailable
      });
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการเปลี่ยนสถานะรางวัล';
      logger.error('RewardsPresenter: Error toggling reward availability', error);
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const selectReward = (rewardId: string) => {
    setSelectedRewardId(rewardId);
    logger.info('RewardsPresenter: Reward selected', { id: rewardId });
  };

  const clearSelection = () => {
    setSelectedRewardId(null);
    logger.info('RewardsPresenter: Selection cleared');
  };

  const reset = () => {
    setIsLoading(false);
    setIsCreatingReward(false);
    setIsUpdatingReward(false);
    setIsDeletingReward(false);
    setSelectedRewardId(null);
    setError(null);
    logger.info('RewardsPresenter: Reset');
  };

  return [
    {
      isLoading,
      isCreatingReward,
      isUpdatingReward,
      isDeletingReward,
      selectedRewardId,
      error
    },
    {
      createReward,
      updateReward,
      deleteReward,
      toggleAvailability,
      selectReward,
      clearSelection,
      reset,
      setError
    }
  ];
};
