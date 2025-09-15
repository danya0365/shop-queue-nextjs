import { PaginatedResult } from "../../interfaces/pagination-types";

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
  notes?: string;
  createdAt: string;
  updatedAt: string;
  calledAt?: string;
  completedAt?: string;
}

/**
 * Input DTO for CreateQueueUseCase
 */
export interface CreateQueueEntity {
  customerId: string;
  shopId: string;
  queueNumber: number;
  status:
    | "waiting"
    | "confirmed"
    | "serving"
    | "completed"
    | "cancelled"
    | "no_show";
  priority: "normal" | "high" | "urgent";
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
export interface UpdateQueueEntity {
  queueNumber?: number;
  status?:
    | "waiting"
    | "confirmed"
    | "serving"
    | "completed"
    | "cancelled"
    | "no_show";
  priority?: "normal" | "high" | "urgent";
  estimatedWaitTime?: number;
  actualWaitTime?: number;
  notes?: string;
  queueServices?: {
    serviceId: string;
    quantity: number;
    price: number;
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
 * Matches the queue_stats_summary_view and queue_stats_by_shop_view
 */
export interface QueueStatsEntity {
  // Today's statistics
  totalQueueToday: number;
  waitingQueueToday: number;
  inProgressQueueToday: number;
  totalCompletedToday: number;
  totalCancelledToday: number;

  // All-time statistics
  allQueueTotal: number;
  allWaitingQueue: number;
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
