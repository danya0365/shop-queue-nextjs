import { PaymentMethod } from "../backend/backend-payment.entity";
import { QueueStatus } from "../backend/backend-queue.entity";
import { ALL_FILTER_VALUE } from "@/src/domain/constants/filter.constants";

export interface CustomerQueueHistoryEntity {
  id: string;
  queueNumber: string;
  shopName: string;
  services: CustomerQueueServiceEntity[];
  totalAmount: number;
  status: QueueStatus;
  queueDate: string;
  queueTime: string;
  completedAt?: string;
  waitTime?: number;
  serviceTime?: number;
  rating?: number;
  feedback?: string;
  employeeName?: string;
  paymentMethod?: PaymentMethod;
}

export interface CustomerQueueServiceEntity {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface CustomerStatsEntity {
  totalQueues: number;
  completedQueues: number;
  cancelledQueues: number;
  totalSpent: number;
  averageRating: number;
  favoriteService: string;
  memberSince: string;
}

export interface CustomerInfoEntity {
  customerName: string;
  memberSince: string;
}

// Domain types for customer history operations
export interface CustomerHistoryFilters {
  status?: typeof ALL_FILTER_VALUE | QueueStatus;
  dateRange?: "all" | "month" | "quarter" | "year";
  shop?: string;
  startDate?: string;
  endDate?: string;
}

export interface GetCustomerQueueHistoryParams {
  shopId: string;
  customerId: string;
  filters?: CustomerHistoryFilters;
}

export interface GetCustomerQueueHistoryWithPaginationParams {
  page: number;
  limit: number;
  shopId: string;
  customerId: string;
  filters?: CustomerHistoryFilters;
}

export interface CustomerHistoryPaginationMeta {
  currentPage: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface CustomerQueueHistoryResult {
  data: CustomerQueueHistoryEntity[];
  pagination: CustomerHistoryPaginationMeta;
}
