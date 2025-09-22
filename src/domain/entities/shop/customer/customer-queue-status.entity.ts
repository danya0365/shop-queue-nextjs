/**
 * Domain entities for customer queue status functionality
 * Following Clean Architecture principles
 */

import { QueueStatus } from "../backend/backend-queue.entity";

/**
 * Customer queue entity representing a customer's queue status
 */
export interface CustomerQueueStatusEntity {
  id: string;
  queueNumber: string;
  status: QueueStatus;
  customerName: string;
  customerPhone: string;
  services: string[];
  totalPrice: number;
  estimatedWaitTime: number;
  position: number;
  specialRequests?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Queue progress entity representing real-time queue progress information
 */
export interface QueueProgressEntity {
  currentNumber: string;
  totalAhead: number;
  averageServiceTime: number;
  estimatedCallTime: Date;
}

/**
 * Queue service entity for services within a queue
 */
export interface QueueServiceEntity {
  id: string;
  name: string;
  price: number;
  duration: number;
  category?: string;
}
