// Queue Join Domain Entities following Clean Architecture principles
import {
  QueuePriority,
  QueueStatus,
} from "@/src/domain/entities/shop/backend/backend-queue.entity";

export interface ServiceOptionEntity {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedTime: number;
  category: string;
  available: boolean;
  icon: string;
}

export interface QueueServiceEntity {
  id: string;
  name: string;
  price: number;
  quantity: number;
  estimatedTime: number;
}

export interface ShopQueueInfoEntity {
  estimatedWaitTime: number;
  currentQueueLength: number;
  shopName: string;
  isAcceptingQueues: boolean;
  maxQueueLength: number;
}

export interface QueueJoinEntity {
  id?: string;
  shopId: string;
  customerName: string;
  customerPhone: string;
  customerId?: string;
  services: QueueServiceEntity[];
  specialRequests?: string;
  priority: QueuePriority;
  queueNumber?: string;
  status: QueueStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface JoinQueueResultEntity {
  success: boolean;
  queueNumber?: string;
  estimatedWaitTime?: number;
  message?: string;
  error?: string;
}
