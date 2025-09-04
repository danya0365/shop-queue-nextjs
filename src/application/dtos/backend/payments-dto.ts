import { PaginatedResult } from "@/src/domain/interfaces/pagination-types";

export interface PaymentDTO {
  id: string;
  queueId: string;
  queueNumber: string;
  customerName: string;
  totalAmount: number;
  paidAmount: number | null;
  paymentMethod: 'cash' | 'card' | 'qr' | 'transfer' | null;
  paymentStatus: 'unpaid' | 'partial' | 'paid';
  paymentDate: string | null;
  processedByEmployeeId: string | null;
  processedByEmployeeName: string | null;
  shopId: string;
  shopName: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface CreatePaymentParams {
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

export interface UpdatePaymentParams {
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

/**
 * Payment method enum
 */
export enum PaymentMethod {
  CASH = 'cash',
  CARD = 'card',
  QR = 'qr',
  TRANSFER = 'transfer'
}

/**
 * Payment status enum
 */
export enum PaymentStatus {
  UNPAID = 'unpaid',
  PARTIAL = 'partial',
  PAID = 'paid'
}

export interface PaymentStatsDTO {
  totalPayments: number;
  totalRevenue: number;
  paidPayments: number;
  unpaidPayments: number;
  partialPayments: number;
  todayRevenue: number;
  averagePaymentAmount: number;
  mostUsedPaymentMethod: string;
}

export interface PaymentMethodStatsDTO {
  cash: {
    count: number;
    percentage: number;
    totalAmount: number;
  };
  card: {
    count: number;
    percentage: number;
    totalAmount: number;
  };
  qr: {
    count: number;
    percentage: number;
    totalAmount: number;
  };
  transfer: {
    count: number;
    percentage: number;
    totalAmount: number;
  };
  totalTransactions: number;
}

export interface PaymentsDataDTO {
  payments: PaymentDTO[];
  stats: PaymentStatsDTO;
  totalCount: number;
  currentPage: number;
  perPage: number;
}

/**
 * Input DTO for GetPaymentsPaginatedUseCase
 */
export interface GetPaymentsPaginatedInput {
  page: number;
  limit: number;
}

export type PaginatedPaymentsDTO = PaginatedResult<PaymentDTO>;
