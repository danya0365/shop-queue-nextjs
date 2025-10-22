import type { PromotionConditions } from "@/src/domain/value-objects/promotion/promotion-conditions";
import { useCallback, useEffect, useState } from "react";
import {
  type PromotionData,
  type PromotionsViewModel,
  ClientPromotionsPresenterFactory,
} from "./PromotionsPresenter";

const presenter = ClientPromotionsPresenterFactory.create();

// Define form/action data interfaces
export interface CreatePromotionData {
  name: string;
  description?: string;
  type:
    | "percentage"
    | "fixed_amount"
    | "buy_x_get_y"
    | "free_item"
    | "points_multiplier"
    | "bonus_points"
    | "points_cashback";
  value: number;
  minPurchaseAmount?: number;
  maxDiscountAmount?: number;
  usageLimit?: number;
  startAt: string;
  endAt: string;
  conditions?: PromotionConditions | null;
  status?: "active" | "inactive" | "expired" | "scheduled";
}

export interface UpdatePromotionData {
  id: string;
  name?: string;
  description?: string;
  type?:
    | "percentage"
    | "fixed_amount"
    | "buy_x_get_y"
    | "free_item"
    | "points_multiplier"
    | "bonus_points"
    | "points_cashback";
  status?: "active" | "inactive" | "expired" | "scheduled";
  value?: number;
  minPurchaseAmount?: number;
  maxDiscountAmount?: number;
  usageLimit?: number;
  startAt?: string;
  endAt?: string;
  conditions?: PromotionConditions | null;
}

// Define state interface
export interface PromotionsPresenterState {
  viewModel: PromotionsViewModel | null;
  isLoading: boolean;
  error: string | null;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  selectedPromotion: PromotionData | null;
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
  togglePromotionStatus: (id: string) => Promise<boolean>;
  setSelectedPromotion: (promotion: PromotionData | null) => void;
  openCreateModal: () => void;
  closeCreateModal: () => void;
  openEditModal: (promotion: PromotionData) => void;
  closeEditModal: () => void;
  openDeleteModal: (promotion: PromotionData) => void;
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
  const [viewModel, setViewModel] = useState<PromotionsViewModel | null>(
    initialViewModel || null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedPromotion, setSelectedPromotion] =
    useState<PromotionData | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

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

      const newViewModel = await presenter.getViewModel(shopId);
      setViewModel(newViewModel);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load promotions data"
      );
      console.error("Error loading promotions data:", err);
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

  const createPromotion = async (
    data: CreatePromotionData
  ): Promise<boolean> => {
    setIsCreating(true);
    setError(null);

    try {
      // Validation logic
      if (!data.name?.trim()) {
        throw new Error("ชื่อโปรโมชั่นจำเป็นต้องระบุ");
      }

      if (!data.type) {
        throw new Error("ประเภทโปรโมชั่นจำเป็นต้องระบุ");
      }

      if (data.value <= 0) {
        throw new Error("ค่าส่วนลดต้องมากกว่า 0");
      }

      if (!data.startAt) {
        throw new Error("วันที่เริ่มต้นจำเป็นต้องระบุ");
      }

      if (!data.endAt) {
        throw new Error("วันที่สิ้นสุดจำเป็นต้องระบุ");
      }

      const startDate = new Date(data.startAt);
      const endDate = new Date(data.endAt);

      if (endDate <= startDate) {
        throw new Error("วันที่สิ้นสุดต้องมากกว่าวันที่เริ่มต้น");
      }

      if (data.type === "percentage" && data.value > 100) {
        throw new Error("ส่วนลดเปอร์เซ็นต์ต้องไม่เกิน 100%");
      }

      await presenter.createPromotion(shopId, {
        name: data.name,
        description: data.description,
        type: data.type,
        value: data.value,
        minPurchaseAmount: data.minPurchaseAmount,
        maxDiscountAmount: data.maxDiscountAmount,
        usageLimit: data.usageLimit,
        startAt: data.startAt,
        endAt: data.endAt,
        status: data.status,
        conditions: data.conditions,
      });

      await loadData();
      setShowCreateModal(false);
      return true;
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "เกิดข้อผิดพลาดในการสร้างโปรโมชั่น"
      );
      return false;
    } finally {
      setIsCreating(false);
    }
  };

  const updatePromotion = async (
    data: UpdatePromotionData
  ): Promise<boolean> => {
    setIsUpdating(true);
    setError(null);

    try {
      // Validation logic
      if (data.name !== undefined && !data.name?.trim()) {
        throw new Error("ชื่อโปรโมชั่นจำเป็นต้องระบุ");
      }

      if (data.value !== undefined && data.value <= 0) {
        throw new Error("ค่าส่วนลดต้องมากกว่า 0");
      }

      if (data.startAt && data.endAt) {
        const startDate = new Date(data.startAt);
        const endDate = new Date(data.endAt);

        if (endDate <= startDate) {
          throw new Error("วันที่สิ้นสุดต้องมากกว่าวันที่เริ่มต้น");
        }
      }

      if (
        data.type === "percentage" &&
        data.value !== undefined &&
        data.value > 100
      ) {
        throw new Error("ส่วนลดเปอร์เซ็นต์ต้องไม่เกิน 100%");
      }

      if (!presenter) throw new Error("Presenter not initialized");
      await presenter.updatePromotion(shopId, data.id, {
        name: data.name,
        description: data.description,
        type: data.type,
        status: data.status,
        value: data.value,
        minPurchaseAmount: data.minPurchaseAmount,
        maxDiscountAmount: data.maxDiscountAmount,
        usageLimit: data.usageLimit,
        startAt: data.startAt,
        endAt: data.endAt,
        conditions: data.conditions,
      });
      await loadData();
      setShowEditModal(false);
      setSelectedPromotion(null);
      return true;
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "เกิดข้อผิดพลาดในการอัปเดตโปรโมชั่น"
      );
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
        throw new Error("Promotion ID is required");
      }

      if (!presenter) throw new Error("Presenter not initialized");
      await presenter.deletePromotion(shopId, promotionId);
      await loadData();
      setShowDeleteModal(false);
      setSelectedPromotion(null);
      return true;
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "เกิดข้อผิดพลาดในการลบโปรโมชั่น"
      );
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  const togglePromotionStatus = async (id: string): Promise<boolean> => {
    try {
      if (!presenter) throw new Error("Presenter not initialized");
      await presenter.togglePromotionStatus(shopId, id);
      await loadData();
      return true;
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "เกิดข้อผิดพลาดในการเปลี่ยนสถานะโปรโมชั่น"
      );
      return false;
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
      statusFilter,
    },
    {
      createPromotion,
      updatePromotion,
      deletePromotion,
      togglePromotionStatus,
      setSelectedPromotion,
      openCreateModal: () => setShowCreateModal(true),
      closeCreateModal: () => setShowCreateModal(false),
      openEditModal: (promotion: PromotionData) => {
        setSelectedPromotion(promotion);
        setShowEditModal(true);
      },
      closeEditModal: () => setShowEditModal(false),
      openDeleteModal: (promotion: PromotionData) => {
        setSelectedPromotion(promotion);
        setShowDeleteModal(true);
      },
      closeDeleteModal: () => setShowDeleteModal(false),
      setSearchTerm,
      setStatusFilter,
      refreshData: loadData,
      setError,
    },
  ] as const;
};
