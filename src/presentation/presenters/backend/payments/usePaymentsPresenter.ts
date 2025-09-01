import { getClientService } from '@/src/di/client-container';
import { Logger } from '@/src/domain/interfaces/logger';
import { useState } from 'react';

// Define form/action data interfaces
export interface UpdatePaymentStatusData {
  paymentId: string;
  status: 'unpaid' | 'partial' | 'paid';
  paidAmount?: number;
  paymentMethod?: 'cash' | 'card' | 'qr' | 'transfer';
}

export interface ProcessPaymentData {
  paymentId: string;
  paidAmount: number;
  paymentMethod: 'cash' | 'card' | 'qr' | 'transfer';
}

// Define state interface
export interface PaymentsPresenterState {
  isLoading: boolean;
  error: string | null;
  selectedPayment: string | null;
  isProcessingPayment: boolean;
}

// Define actions interface
export interface PaymentsPresenterActions {
  updatePaymentStatus: (data: UpdatePaymentStatusData) => Promise<boolean>;
  processPayment: (data: ProcessPaymentData) => Promise<boolean>;
  selectPayment: (paymentId: string | null) => void;
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
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const logger = getClientService<Logger>('Logger');

  const updatePaymentStatus = async (data: UpdatePaymentStatusData): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // Validation logic
      if (!data.paymentId) {
        throw new Error('Payment ID is required');
      }

      if (!data.status) {
        throw new Error('Payment status is required');
      }

      // API call or business logic - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      logger.info('PaymentsPresenter: Payment status updated successfully', { paymentId: data.paymentId, status: data.status });
      return true;
    } catch (error) {
      logger.error('PaymentsPresenter: Error updating payment status', error);
      setError('ไม่สามารถอัปเดตสถานะการชำระเงินได้');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const processPayment = async (data: ProcessPaymentData): Promise<boolean> => {
    setIsProcessingPayment(true);
    setError(null);

    try {
      // Validation logic
      if (!data.paymentId) {
        throw new Error('Payment ID is required');
      }

      if (!data.paidAmount || data.paidAmount <= 0) {
        throw new Error('Paid amount must be greater than 0');
      }

      if (!data.paymentMethod) {
        throw new Error('Payment method is required');
      }

      // API call or business logic - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      
      logger.info('PaymentsPresenter: Payment processed successfully', { paymentId: data.paymentId, amount: data.paidAmount });
      return true;
    } catch (error) {
      logger.error('PaymentsPresenter: Error processing payment', error);
      setError('ไม่สามารถดำเนินการชำระเงินได้');
      return false;
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const selectPayment = (paymentId: string | null) => {
    setSelectedPayment(paymentId);
    logger.info('PaymentsPresenter: Payment selected', { paymentId });
  };

  const reset = () => {
    setIsLoading(false);
    setError(null);
    setSelectedPayment(null);
    setIsProcessingPayment(false);
    logger.info('PaymentsPresenter: Reset');
  };

  return [
    { 
      isLoading, 
      error, 
      selectedPayment, 
      isProcessingPayment 
    },
    { 
      updatePaymentStatus, 
      processPayment, 
      selectPayment, 
      reset, 
      setError 
    },
  ];
};
