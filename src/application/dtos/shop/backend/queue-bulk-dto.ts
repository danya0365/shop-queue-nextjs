/**
 * DTOs for bulk queue operations
 * Following Clean Architecture principles
 */

import { QueuePriority } from "@/src/domain/entities/shop/backend/backend-queue.entity";

/**
 * Input DTO for bulk updating queues
 */
export interface BulkUpdateQueuesInput {
  queueIds: string[];
  updates: {
    status?: 'waiting' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
    priority?: QueuePriority;
    estimatedWaitTime?: number;
    notes?: string;
    calledAt?: string | null;
    completedAt?: string | null;
    servedByEmployeeId?: string | null;
    queueServices?: Array<{
      serviceId: string;
      quantity: number;
      price: number;
    }>;
  };
}

/**
 * Result DTO for bulk updating queues
 */
export interface BulkUpdateQueuesResult {
  success: boolean;
  updatedCount: number;
  failedCount: number;
  errors?: string[];
  updatedQueues: string[];
}

/**
 * Input DTO for bulk deleting queues
 */
export interface BulkDeleteQueuesInput {
  shopId: string;
  queueIds: string[];
  force?: boolean; // Allow deletion of in-progress/completed queues
}

/**
 * Result DTO for bulk deleting queues
 */
export interface BulkDeleteQueuesResult {
  success: boolean;
  totalQueues: number;
  deletedCount: number;
  failedCount: number;
  deletedQueues: string[];
  failedQueues: string[];
  summary?: {
    successRate: number;
    averageProcessingTime: number;
  };
  errors?: string[];
}

/**
 * Input DTO for bulk reassigning queues
 */
export interface BulkReassignQueuesInput {
  queueIds: string[];
  targetEmployeeId: string;
  reason?: string;
  preservePriority?: boolean;
}

/**
 * Result DTO for bulk reassigning queues
 */
export interface BulkReassignQueuesResult {
  success: boolean;
  totalQueues: number;
  reassignedQueues: string[];
  failedQueues: string[];
  summary?: {
    totalReassigned: number;
    totalFailed: number;
    successRate: number;
    averageProcessingTime: number;
  };
  errors?: string[];
}
