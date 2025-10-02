// Customer History DTOs following Clean Architecture principles

import { ALL_FILTER_VALUE } from "@/src/domain/constants/filter.constants";
import { PaymentMethod } from "@/src/domain/entities/backend/backend-payment.entity";
import { QueueStatus } from "@/src/domain/entities/shop/backend/backend-queue.entity";

export interface CustomerQueueHistoryDTO {
  id: string;
  queueNumber: string;
  shopName: string;
  services: HistoryServiceDTO[];
  totalAmount: number;
  status: QueueStatus;
  queueDateTime: string;
  completedAt?: string;
  waitTime?: number; // in minutes
  serviceTime?: number; // in minutes
  rating?: number;
  feedback?: string;
  employeeName?: string;
  paymentMethod?: PaymentMethod;
}

export interface HistoryServiceDTO {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface CustomerStatsDTO {
  totalQueues: number;
  completedQueues: number;
  cancelledQueues: number;
  totalSpent: number;
  averageRating: number;
  favoriteService: string;
  memberSince: string;
}

export interface HistoryFiltersDTO {
  status: HistoryFilterType;
  dateRange: "all" | "month" | "quarter" | "year";
  shop: string;
  startDate?: string;
  endDate?: string;
}

export type HistoryFilterType = typeof ALL_FILTER_VALUE | QueueStatus;

export interface PaginationDTO {
  currentPage: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface CustomerHistoryDataDTO {
  queueHistory: CustomerQueueHistoryDTO[];
  customerStats: CustomerStatsDTO;
  filters: HistoryFiltersDTO;
  customerName: string;
  customerInfo: CustomerInfoDTO;
  pagination?: PaginationDTO;
}

// Input DTOs for use cases
export interface GetCustomerHistoryInputDTO {
  shopId: string;
  customerId: string;
  currentPage?: number;
  perPage?: number;
  filters?: HistoryFiltersDTO;
}

export interface GetCustomerStatsInputDTO {
  shopId: string;
  customerId: string;
}

export interface GetCustomerInfoInputDTO {
  shopId: string;
  customerId: string;
}

export interface CustomerInfoDTO {
  customerName: string;
  memberSince: string;
}
