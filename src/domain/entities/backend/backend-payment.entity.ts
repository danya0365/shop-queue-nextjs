import { PaginatedResult } from "../../interfaces/pagination-types";

/**
 * Payment entity representing a payment transaction in the system
 * Following Clean Architecture principles - domain entity
 */
export interface PaymentEntity {
  id: string;
  queueId: string;
  queueNumber: string;
  customerName: string;
  totalAmount: number;
  paidAmount: number | null;
  paymentMethod: PaymentMethod | null;
  paymentStatus: PaymentStatus;
  paymentDate: string | null;
  processedByEmployeeId: string | null;
  processedByEmployeeName?: string; // Joined data
  shopId: string;
  shopName?: string; // Joined data
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaymentEntity {
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

export interface UpdatePaymentEntity {
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

/**
 * Payment statistics entity
 */
export interface PaymentStatsEntity {
  totalPayments: number;
  totalRevenue: number;
  paidPayments: number;
  unpaidPayments: number;
  partialPayments: number;
  todayRevenue: number;
  averagePaymentAmount: number;
  mostUsedPaymentMethod: string;
}

/**
 * Paginated payments result
 */
export type PaginatedPaymentsEntity = PaginatedResult<PaymentEntity>;
