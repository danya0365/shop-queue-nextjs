import { getClientService } from "@/src/di/client-container";
import { Logger } from "@/src/domain/interfaces/logger";
import { useCallback, useEffect, useState } from "react";
import { RewardsViewModel } from "./RewardsPresenter";

const logger = getClientService<Logger>("Logger");

// Define form/action data interfaces
export interface CreateRewardFormData {
  name: string;
  description?: string;
  type: 'discount' | 'free_item' | 'cashback' | 'special_privilege';
  pointsRequired: number;
  value: number;
  expiryDays?: number;
  usageLimit?: number;
  icon?: string;
  shopId: string;
}

export interface UpdateRewardFormData {
  id: string;
  name?: string;
  description?: string;
  type?: 'discount' | 'free_item' | 'cashback' | 'special_privilege';
  pointsRequired?: number;
  value?: number;
  isAvailable?: boolean;
  expiryDays?: number;
  usageLimit?: number;
  icon?: string;
  shopId?: string;
}

export interface RewardFilters {
  search?: string;
  type?: 'discount' | 'free_item' | 'cashback' | 'special_privilege' | 'all';
  isAvailable?: boolean;
}

// Define state interface
export interface RewardsPresenterState {
  viewModel: RewardsViewModel | null;
  loading: boolean;
  error: string | null;
  isCreateModalOpen: boolean;
  isEditModalOpen: boolean;
  isDeleteModalOpen: boolean;
  selectedRewardId: string | null;
  filters: RewardFilters;
  searchTerm: string;
  selectedType: string;
}

// Define actions interface
export interface RewardsPresenterActions {
  refreshData: () => void;
  createReward: (data: CreateRewardFormData) => Promise<boolean>;
  updateReward: (data: UpdateRewardFormData) => Promise<boolean>;
  deleteReward: (id: string) => Promise<boolean>;
  toggleRewardAvailability: (id: string) => Promise<boolean>;
  openCreateModal: () => void;
  closeCreateModal: () => void;
  openEditModal: (rewardId: string) => void;
  closeEditModal: () => void;
  openDeleteModal: (rewardId: string) => void;
  closeDeleteModal: () => void;
  setFilters: (filters: RewardFilters) => void;
  setSearchTerm: (term: string) => void;
  setSelectedType: (type: string) => void;
  reset: () => void;
  setError: (error: string | null) => void;
}

// Hook type
export type RewardsPresenterHook = [
  RewardsPresenterState,
  RewardsPresenterActions
];

// Custom hook implementation
export const useRewardsPresenter = (
  shopId: string,
  initialViewModel?: RewardsViewModel
): RewardsPresenterHook => {
  const [viewModel, setViewModel] = useState<RewardsViewModel | null>(
    initialViewModel || null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRewardId, setSelectedRewardId] = useState<string | null>(null);
  const [filters, setFilters] = useState<RewardFilters>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");

  // Initialize with initial view model if provided
  useEffect(() => {
    if (initialViewModel) {
      setViewModel(initialViewModel);
      setLoading(false);
    }
  }, [initialViewModel]);

  // Function to load data
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { ClientRewardsPresenterFactory } = await import(
        "./RewardsPresenter"
      );
      const presenter = await ClientRewardsPresenterFactory.create();

      const newViewModel = await presenter.getViewModel(shopId);

      setViewModel(newViewModel);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load rewards data"
      );
      console.error("Error loading rewards data:", err);
    } finally {
      setLoading(false);
    }
  }, [shopId]);

  // Load data when dependencies change, but not if we have initial view model
  useEffect(() => {
    if (!initialViewModel) {
      loadData();
    }
  }, [loadData, initialViewModel]);

  // Refresh data function
  const refreshData = useCallback(async () => {
    await loadData();
  }, [loadData]);

  const createReward = async (data: CreateRewardFormData): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      // Validation logic
      if (!data.name || !data.type || !data.pointsRequired || !data.value) {
        throw new Error("กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน");
      }

      if (data.pointsRequired <= 0) {
        throw new Error("แต้มที่ต้องใช้ต้องมากกว่า 0");
      }

      if (data.value <= 0) {
        throw new Error("มูลค่าต้องมากกว่า 0");
      }

      if (data.expiryDays && data.expiryDays <= 0) {
        throw new Error("จำนวนวันหมดอายุต้องมากกว่า 0");
      }

      if (data.usageLimit && data.usageLimit <= 0) {
        throw new Error("จำนวนครั้งที่ใช้ได้ต้องมากกว่า 0");
      }

      // API call would go here
      // const result = await rewardsService.createReward(data.shopId, data);

      logger.info("RewardsPresenter: Reward created successfully", { data });
      setIsCreateModalOpen(false);
      await loadData(); // Refresh data after creation
      return true;
    } catch (error) {
      logger.error("RewardsPresenter: Error creating reward", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "เกิดข้อผิดพลาดในการสร้างรางวัล";
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateReward = async (data: UpdateRewardFormData): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      // Validation logic
      if (!data.id) {
        throw new Error("ไม่พบรหัสรางวัล");
      }

      if (data.pointsRequired !== undefined && data.pointsRequired <= 0) {
        throw new Error("แต้มที่ต้องใช้ต้องมากกว่า 0");
      }

      if (data.value !== undefined && data.value <= 0) {
        throw new Error("มูลค่าต้องมากกว่า 0");
      }

      if (data.expiryDays !== undefined && data.expiryDays <= 0) {
        throw new Error("จำนวนวันหมดอายุต้องมากกว่า 0");
      }

      if (data.usageLimit !== undefined && data.usageLimit <= 0) {
        throw new Error("จำนวนครั้งที่ใช้ได้ต้องมากกว่า 0");
      }

      // API call would go here
      // const result = await rewardsService.updateReward(data.shopId || shopId, data.id, data);

      logger.info("RewardsPresenter: Reward updated successfully", { data });
      setIsEditModalOpen(false);
      setSelectedRewardId(null);
      await loadData(); // Refresh data after update
      return true;
    } catch (error) {
      logger.error("RewardsPresenter: Error updating reward", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "เกิดข้อผิดพลาดในการอัปเดตรางวัล";
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteReward = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      // Validation logic
      if (!id) {
        throw new Error("ไม่พบรหัสรางวัล");
      }

      // API call would go here
      // const result = await rewardsService.deleteReward(shopId, id);

      logger.info("RewardsPresenter: Reward deleted successfully", { id });
      setIsDeleteModalOpen(false);
      setSelectedRewardId(null);
      await loadData(); // Refresh data after deletion
      return true;
    } catch (error) {
      logger.error("RewardsPresenter: Error deleting reward", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "เกิดข้อผิดพลาดในการลบรางวัล";
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const toggleRewardAvailability = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      // Validation logic
      if (!id) {
        throw new Error("ไม่พบรหัสรางวัล");
      }

      // API call would go here
      // const result = await rewardsService.toggleRewardAvailability(shopId, id);

      logger.info("RewardsPresenter: Reward availability toggled successfully", { id });
      await loadData(); // Refresh data after toggle
      return true;
    } catch (error) {
      logger.error("RewardsPresenter: Error toggling reward availability", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "เกิดข้อผิดพลาดในการเปลี่ยนสถานะรางวัล";
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setIsCreateModalOpen(true);
    setError(null);
    logger.info("RewardsPresenter: Create modal opened");
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    setError(null);
    logger.info("RewardsPresenter: Create modal closed");
  };

  const openEditModal = (rewardId: string) => {
    setSelectedRewardId(rewardId);
    setIsEditModalOpen(true);
    setError(null);
    logger.info("RewardsPresenter: Edit modal opened", { rewardId });
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedRewardId(null);
    setError(null);
    logger.info("RewardsPresenter: Edit modal closed");
  };

  const openDeleteModal = (rewardId: string) => {
    setSelectedRewardId(rewardId);
    setIsDeleteModalOpen(true);
    setError(null);
    logger.info("RewardsPresenter: Delete modal opened", { rewardId });
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedRewardId(null);
    setError(null);
    logger.info("RewardsPresenter: Delete modal closed");
  };

  const handleSetFilters = (newFilters: RewardFilters) => {
    setFilters(newFilters);
    logger.info("RewardsPresenter: Filters updated", { filters: newFilters });
  };

  const handleSetSearchTerm = (term: string) => {
    setSearchTerm(term);
    logger.info("RewardsPresenter: Search term updated", { term });
  };

  const handleSetSelectedType = (type: string) => {
    setSelectedType(type);
    logger.info("RewardsPresenter: Selected type updated", { type });
  };

  const reset = () => {
    setLoading(false);
    setError(null);
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedRewardId(null);
    setFilters({});
    setSearchTerm("");
    setSelectedType("all");
    logger.info("RewardsPresenter: Reset");
  };

  return [
    {
      viewModel,
      loading,
      error,
      isCreateModalOpen,
      isEditModalOpen,
      isDeleteModalOpen,
      selectedRewardId,
      filters,
      searchTerm,
      selectedType,
    },
    {
      refreshData,
      createReward,
      updateReward,
      deleteReward,
      toggleRewardAvailability,
      openCreateModal,
      closeCreateModal,
      openEditModal,
      closeEditModal,
      openDeleteModal,
      closeDeleteModal,
      setFilters: handleSetFilters,
      setSearchTerm: handleSetSearchTerm,
      setSelectedType: handleSetSelectedType,
      reset,
      setError,
    },
  ];
};
