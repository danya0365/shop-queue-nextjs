import { PaginatedResult } from "@/src/domain/interfaces/pagination-types";
import { PaymentEntity } from "./backend-payment.entity";

/**
 * Queue entity representing a customer queue in the system
 * Following Clean Architecture principles - domain entity
 */
export interface QueueEntity {
  id: string;
  customerId: string;
  customerName: string; // Joined data
  customerPhone: string; // Joined data
  shopId: string;
  shopName: string; // Joined data
  queueServices: QueueServiceEntity[];
  queueNumber: string;
  status: QueueStatus;
  priority: QueuePriority;
  estimatedWaitTime: number; // in minutes
  actualWaitTime?: number; // in minutes
  servedByEmployeeId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  calledAt?: string;
  completedAt?: string;
  payments?: PaymentEntity[];
}

/**
 * Input DTO for CreateQueueUseCase
 */
export interface CreateQueueEntity {
  customerId?: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  shopId: string;
  status: QueueStatus;
  priority: QueuePriority;
  estimatedWaitTime: number;
  notes?: string;
  queueServices: {
    serviceId: string;
    quantity: number;
    price?: number;
  }[];
}

/**
 * Input DTO for UpdateQueueUseCase
 */
export interface UpdateQueueEntity {
  status?: QueueStatus;
  priority?: QueuePriority;
  estimatedWaitTime?: number;
  actualWaitTime?: number;
  servedByEmployeeId?: string;
  calledAt?: string;
  completedAt?: string;
  notes?: string;
  queueServices?: {
    serviceId: string;
    quantity: number;
    price?: number;
  }[];
}

/**
 * Queue service entity representing a service in a queue
 */
export interface QueueServiceEntity {
  serviceId: string;
  serviceName: string;
  quantity: number;
  price: number;
  total: number;
}

/**
 * Queue status enum
 */
export enum QueueStatus {
  WAITING = "waiting",
  CONFIRMED = "confirmed",
  SERVING = "serving",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
  NO_SHOW = "no_show",
}

/**
 * Queue priority enum
 */
export enum QueuePriority {
  NORMAL = "normal",
  HIGH = "high",
  URGENT = "urgent",
}

/**
 * Queue statistics entity
 * Contains comprehensive queue statistics for a shop
 */
export interface QueueStatsEntity {
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

/**
 * Paginated queues result
 */
export type PaginatedQueuesEntity = PaginatedResult<QueueEntity>;
