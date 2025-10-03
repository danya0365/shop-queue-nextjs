/**
 * DTOs for customer queue status data transfer
 * Following Clean Architecture principles
 */

import { QueueStatus } from "@/src/domain/entities/shop/backend/backend-queue.entity";

/**
 * Customer queue DTO for data transfer between layers
 */
export interface CustomerQueueStatusDTO {
  id: string;
  queueNumber: string;
  status: QueueStatus;
  customerName: string;
  customerPhone: string;
  services: string[];
  totalPrice: number;
  estimatedWaitTime: number;
  position: number;
  totalAhead: number;
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Queue progress DTO for real-time queue information
 */
export interface QueueProgressDTO {
  currentNumber: string;
  totalAhead: number;
  averageServiceTime: number;
  estimatedCallTime: string;
}

/**
 * Customer queue status view model DTO for presenter
 */
export interface CustomerQueueStatusViewModelDTO {
  customerQueue: CustomerQueueStatusDTO | null;
  queueProgress: QueueProgressDTO;
  shopName: string;
  isFound: boolean;
  canCancel: boolean;
}

/**
 * Input DTO for getting customer queue status
 */
export interface GetCustomerQueueStatusInputDTO {
  shopId: string;
  queueNumber?: string;
}

/**
 * Input DTO for getting queue progress
 */
export interface GetQueueProgressInputDTO {
  shopId: string;
}

/**
 * Input DTO for cancelling customer queue
 */
export interface CancelCustomerQueueInputDTO {
  shopId: string;
  queueNumber: string;
}
