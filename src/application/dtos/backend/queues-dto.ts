import {
  QueuePriority,
  QueueStatus,
} from "@/src/domain/entities/backend/backend-queue.entity";
import { PaginatedResult } from "@/src/domain/interfaces/pagination-types";

export interface QueueDTO {
  id: string;
  customerId: string;
  customerName: string; // joined from customers table
  customerPhone: string; // joined from customers table
  shopId: string;
  shopName: string; // joined from shops table
  queueServices: QueueServiceDTO[];
  queueNumber: string;
  status: QueueStatus;
  priority: QueuePriority;
  estimatedWaitTime: number; // in minutes
  actualWaitTime?: number; // in minutes
  notes?: string;
  createdAt: string;
  updatedAt: string;
  calledAt?: string;
  completedAt?: string;
}

/**
 * Input DTO for CreateQueueUseCase
 */
export interface CreateQueueInput {
  customerId: string;
  shopId: string;
  queueNumber: number;
  status: QueueStatus;
  priority: QueuePriority;
  estimatedWaitTime: number;
  notes?: string;
  queueServices: {
    serviceId: string;
    quantity: number;
    price: number;
  }[];
}

/**
 * Input DTO for UpdateQueueUseCase
 */
export interface UpdateQueueInput {
  id: string;
  status?: QueueStatus;
  priority?: QueuePriority;
  estimatedWaitTime?: number;
  notes?: string;
  calledAt?: string | null;
  completedAt?: string | null;
  queueServices?: {
    serviceId: string;
    quantity: number;
    price: number;
  }[];
}

export interface QueueServiceDTO {
  serviceId: string;
  serviceName: string;
  quantity: number;
  price: number;
  total: number;
}

export interface QueueStatsDTO {
  // Today's statistics
  totalQueueToday: number;
  waitingQueueToday: number;
  confirmedQueueToday: number;
  servingQueueToday: number;
  inProgressQueueToday: number;
  totalCompletedToday: number;
  totalCancelledToday: number;

  // All-time statistics
  allQueueTotal: number;
  allWaitingQueue: number;
  allConfirmedQueue: number;
  allServingQueue: number;
  allInProgressQueue: number;
  allCompletedTotal: number;
  allCancelledTotal: number;

  // Performance metrics
  avgWaitTimeMinutes: number;

  // Shop-specific data (optional)
  shopId?: string;
}

export interface QueuesDataDTO {
  queues: QueueDTO[];
  stats: QueueStatsDTO;
  totalCount: number;
  currentPage: number;
  perPage: number;
}

export type PaginatedQueuesDTO = PaginatedResult<QueueDTO>;
