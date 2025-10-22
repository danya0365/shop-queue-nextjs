import {
  PaymentMethod,
  PaymentStatus,
} from "@/src/application/dtos/shop/backend/payments-dto";
import { useCallback, useEffect, useState } from "react";
import {
  ClientPaymentsPresenterFactory,
  PaymentsViewModel,
} from "./PaymentsPresenter";

const presenter = ClientPaymentsPresenterFactory.create();

// Define form/action data interfaces
export interface CreatePaymentData {
  queueId: string;
  queueNumber: string;
  customerName: string;
  totalAmount: number;
  paidAmount?: number;
  paymentMethod?: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentDate?: string;
  processedByEmployeeId?: string;
  shopId: string;
}

export interface UpdatePaymentData {
  id: string;
  queueId?: string;
  queueNumber?: string;
  customerName?: string;
  totalAmount?: number;
  paidAmount?: number;
  paymentMethod?: PaymentMethod;
  paymentStatus?: PaymentStatus;
  paymentDate?: string;
  processedByEmployeeId?: string;
  shopId?: string;
}

export interface PaymentFilters {
  paymentStatus?: PaymentStatus;
  paymentMethod?: PaymentMethod;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

// Define state interface
export interface PaymentsPresenterState {
  viewModel: PaymentsViewModel | null;
  loading: boolean;
  error: string | null;
  isCreateModalOpen: boolean;
  isEditModalOpen: boolean;
  isDeleteModalOpen: boolean;
  selectedPaymentId: string | null;
  filters: PaymentFilters;
  currentPage: number;
}

// Define actions interface
export interface PaymentsPresenterActions {
  refreshData: () => void;
  createPayment: (data: CreatePaymentData) => Promise<boolean>;
  updatePayment: (data: UpdatePaymentData) => Promise<boolean>;
  deletePayment: (id: string) => Promise<boolean>;
  openCreateModal: () => void;
  closeCreateModal: () => void;
  openEditModal: (paymentId: string) => void;
  closeEditModal: () => void;
  openDeleteModal: (paymentId: string) => void;
  closeDeleteModal: () => void;
  setFilters: (filters: PaymentFilters) => void;
  setCurrentPage: (page: number) => void;
  reset: () => void;
  setError: (error: string | null) => void;
}

// Hook type
export type PaymentsPresenterHook = [
  PaymentsPresenterState,
  PaymentsPresenterActions
];

// Custom hook implementation
export const usePaymentsPresenter = (
  shopId: string,
  initialViewModel?: PaymentsViewModel
): PaymentsPresenterHook => {
  const [viewModel, setViewModel] = useState<PaymentsViewModel | null>(
    initialViewModel || null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(
    null
  );
  const [filters, setFilters] = useState<PaymentFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  // Action loading states
  const [actionLoading, setActionLoading] = useState({
    updateStatus: false,
    updateQueue: false,
    deleteQueue: false,
    createQueue: false,
  });

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

      const newViewModel = await presenter.getViewModel(shopId);

      setViewModel(newViewModel);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load payments data"
      );
      console.error("Error loading payments data:", err);
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
    try {
      setActionLoading((prev) => ({ ...prev, refresh: true }));
      await loadData();
    } finally {
      setActionLoading((prev) => ({ ...prev, refresh: false }));
    }
  }, [loadData]);

  const createPayment = async (data: CreatePaymentData): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      // Validation logic
      if (!data.queueId || !data.customerName || !data.totalAmount) {
        throw new Error("กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน");
      }

      if (data.totalAmount <= 0) {
        throw new Error("จำนวนเงินต้องมากกว่า 0");
      }

      if (data.paidAmount && data.paidAmount < 0) {
        throw new Error("จำนวนเงินที่ชำระต้องไม่น้อยกว่า 0");
      }

      if (data.paidAmount && data.paidAmount > data.totalAmount) {
        throw new Error("จำนวนเงินที่ชำระต้องไม่เกินจำนวนเงินทั้งหมด");
      }

      // API call would go here
      // const result = await paymentsService.createPayment(data);

      setIsCreateModalOpen(false);
      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "เกิดข้อผิดพลาดในการสร้างการชำระเงิน";
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updatePayment = async (data: UpdatePaymentData): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      // Validation logic
      if (!data.id) {
        throw new Error("ไม่พบรหัสการชำระเงิน");
      }

      if (data.totalAmount !== undefined && data.totalAmount <= 0) {
        throw new Error("จำนวนเงินต้องมากกว่า 0");
      }

      if (data.paidAmount !== undefined && data.paidAmount < 0) {
        throw new Error("จำนวนเงินที่ชำระต้องไม่น้อยกว่า 0");
      }

      if (
        data.totalAmount &&
        data.paidAmount &&
        data.paidAmount > data.totalAmount
      ) {
        throw new Error("จำนวนเงินที่ชำระต้องไม่เกินจำนวนเงินทั้งหมด");
      }

      // API call would go here
      // const result = await paymentsService.updatePayment(data.id, data);

      setIsEditModalOpen(false);
      setSelectedPaymentId(null);
      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "เกิดข้อผิดพลาดในการอัปเดตการชำระเงิน";
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deletePayment = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      // Validation logic
      if (!id) {
        throw new Error("ไม่พบรหัสการชำระเงิน");
      }

      // API call would go here
      // const result = await paymentsService.deletePayment(id);

      setIsDeleteModalOpen(false);
      setSelectedPaymentId(null);
      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "เกิดข้อผิดพลาดในการลบการชำระเงิน";
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setIsCreateModalOpen(true);
    setError(null);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    setError(null);
  };

  const openEditModal = (paymentId: string) => {
    setSelectedPaymentId(paymentId);
    setIsEditModalOpen(true);
    setError(null);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedPaymentId(null);
    setError(null);
  };

  const openDeleteModal = (paymentId: string) => {
    setSelectedPaymentId(paymentId);
    setIsDeleteModalOpen(true);
    setError(null);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedPaymentId(null);
    setError(null);
  };

  const handleSetFilters = (newFilters: PaymentFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleSetCurrentPage = (page: number) => {
    setCurrentPage(page);
  };

  const reset = () => {
    setLoading(false);
    setError(null);
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedPaymentId(null);
    setFilters({});
    setCurrentPage(1);
  };

  return [
    {
      viewModel,
      loading,
      error,
      isCreateModalOpen,
      isEditModalOpen,
      isDeleteModalOpen,
      selectedPaymentId,
      filters,
      currentPage,
    },
    {
      refreshData,
      createPayment,
      updatePayment,
      deletePayment,
      openCreateModal,
      closeCreateModal,
      openEditModal,
      closeEditModal,
      openDeleteModal,
      closeDeleteModal,
      setFilters: handleSetFilters,
      setCurrentPage: handleSetCurrentPage,
      reset,
      setError,
    },
  ];
};
