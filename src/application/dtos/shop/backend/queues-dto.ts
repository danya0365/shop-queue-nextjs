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
  status: "waiting" | "in_progress" | "completed" | "cancelled" | "no_show";
  priority: "normal" | "high" | "urgent";
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
  customerId?: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  shopId: string;
  queueNumber: number;
  status: "waiting" | "in_progress" | "completed" | "cancelled" | "no_show";
  priority: "normal" | "high" | "urgent";
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
export interface UpdateQueueInput {
  id: string;
  status?: "waiting" | "in_progress" | "completed" | "cancelled" | "no_show";
  priority?: "normal" | "high" | "urgent";
  estimatedWaitTime?: number;
  notes?: string;
  calledAt?: string | null;
  completedAt?: string | null;
  queueServices?: {
    serviceId: string;
    quantity: number;
    price?: number;
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
  totalQueues: number;
  waitingQueues: number;
  inProgressQueues: number;
  completedToday: number;
  cancelledToday: number;
  averageWaitTime: number;
}

export interface QueuesDataDTO {
  queues: QueueDTO[];
  stats: QueueStatsDTO;
  totalCount: number;
  currentPage: number;
  perPage: number;
}

export type PaginatedQueuesDTO = PaginatedResult<QueueDTO>;
