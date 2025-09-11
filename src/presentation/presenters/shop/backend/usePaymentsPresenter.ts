import { getClientService } from '@/src/di/client-container';
import { Logger } from '@/src/domain/interfaces/logger';
import { useState } from 'react';
import { CreatePaymentParams, UpdatePaymentParams, PaymentMethod, PaymentStatus } from '@/src/application/dtos/shop/backend/payments-dto';

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
  isLoading: boolean;
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
export const usePaymentsPresenter = (): PaymentsPresenterHook => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);
  const [filters, setFilters] = useState<PaymentFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const logger = getClientService<Logger>('Logger');

  const createPayment = async (data: CreatePaymentData): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // Validation logic
      if (!data.queueId || !data.customerName || !data.totalAmount) {
        throw new Error('กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน');
      }

      if (data.totalAmount <= 0) {
        throw new Error('จำนวนเงินต้องมากกว่า 0');
      }

      if (data.paidAmount && data.paidAmount < 0) {
        throw new Error('จำนวนเงินที่ชำระต้องไม่น้อยกว่า 0');
      }

      if (data.paidAmount && data.paidAmount > data.totalAmount) {
        throw new Error('จำนวนเงินที่ชำระต้องไม่เกินจำนวนเงินทั้งหมด');
      }

      // API call would go here
      // const result = await paymentsService.createPayment(data);
      
      logger.info('PaymentsPresenter: Payment created successfully', { data });
      setIsCreateModalOpen(false);
      return true;
    } catch (error) {
      logger.error('PaymentsPresenter: Error creating payment', error);
      const errorMessage = error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการสร้างการชำระเงิน';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updatePayment = async (data: UpdatePaymentData): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // Validation logic
      if (!data.id) {
        throw new Error('ไม่พบรหัสการชำระเงิน');
      }

      if (data.totalAmount !== undefined && data.totalAmount <= 0) {
        throw new Error('จำนวนเงินต้องมากกว่า 0');
      }

      if (data.paidAmount !== undefined && data.paidAmount < 0) {
        throw new Error('จำนวนเงินที่ชำระต้องไม่น้อยกว่า 0');
      }

      if (data.totalAmount && data.paidAmount && data.paidAmount > data.totalAmount) {
        throw new Error('จำนวนเงินที่ชำระต้องไม่เกินจำนวนเงินทั้งหมด');
      }

      // API call would go here
      // const result = await paymentsService.updatePayment(data.id, data);
      
      logger.info('PaymentsPresenter: Payment updated successfully', { data });
      setIsEditModalOpen(false);
      setSelectedPaymentId(null);
      return true;
    } catch (error) {
      logger.error('PaymentsPresenter: Error updating payment', error);
      const errorMessage = error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการอัปเดตการชำระเงิน';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deletePayment = async (id: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // Validation logic
      if (!id) {
        throw new Error('ไม่พบรหัสการชำระเงิน');
      }

      // API call would go here
      // const result = await paymentsService.deletePayment(id);
      
      logger.info('PaymentsPresenter: Payment deleted successfully', { id });
      setIsDeleteModalOpen(false);
      setSelectedPaymentId(null);
      return true;
    } catch (error) {
      logger.error('PaymentsPresenter: Error deleting payment', error);
      const errorMessage = error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการลบการชำระเงิน';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const openCreateModal = () => {
    setIsCreateModalOpen(true);
    setError(null);
    logger.info('PaymentsPresenter: Create modal opened');
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    setError(null);
    logger.info('PaymentsPresenter: Create modal closed');
  };

  const openEditModal = (paymentId: string) => {
    setSelectedPaymentId(paymentId);
    setIsEditModalOpen(true);
    setError(null);
    logger.info('PaymentsPresenter: Edit modal opened', { paymentId });
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedPaymentId(null);
    setError(null);
    logger.info('PaymentsPresenter: Edit modal closed');
  };

  const openDeleteModal = (paymentId: string) => {
    setSelectedPaymentId(paymentId);
    setIsDeleteModalOpen(true);
    setError(null);
    logger.info('PaymentsPresenter: Delete modal opened', { paymentId });
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedPaymentId(null);
    setError(null);
    logger.info('PaymentsPresenter: Delete modal closed');
  };

  const handleSetFilters = (newFilters: PaymentFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
    logger.info('PaymentsPresenter: Filters updated', { filters: newFilters });
  };

  const handleSetCurrentPage = (page: number) => {
    setCurrentPage(page);
    logger.info('PaymentsPresenter: Page changed', { page });
  };

  const reset = () => {
    setIsLoading(false);
    setError(null);
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedPaymentId(null);
    setFilters({});
    setCurrentPage(1);
    logger.info('PaymentsPresenter: Reset');
  };

  return [
    { 
      isLoading, 
      error, 
      isCreateModalOpen, 
      isEditModalOpen, 
      isDeleteModalOpen, 
      selectedPaymentId, 
      filters, 
      currentPage 
    },
    { 
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
      setError 
    },
  ];
};
