// Customer History DTOs following Clean Architecture principles

export interface CustomerQueueHistoryDTO {
  id: string;
  queueNumber: string;
  shopName: string;
  services: HistoryServiceDTO[];
  totalAmount: number;
  status: "completed" | "cancelled" | "no_show";
  queueDate: string;
  queueTime: string;
  completedAt?: string;
  waitTime?: number; // in minutes
  serviceTime?: number; // in minutes
  rating?: number;
  feedback?: string;
  employeeName?: string;
  paymentMethod?: "cash" | "card" | "qr" | "transfer";
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

export type HistoryFilterType = "all" | "completed" | "cancelled" | "no_show";

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
  pagination?: PaginationDTO;
}

// Input DTOs for use cases
export interface GetCustomerHistoryInputDTO {
  shopId: string;
  customerId?: string;
  currentPage?: number;
  perPage?: number;
  filters?: HistoryFiltersDTO;
}

export interface GetCustomerStatsInputDTO {
  shopId: string;
  customerId?: string;
}
