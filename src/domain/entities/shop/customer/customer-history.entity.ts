import { PaymentMethod } from "../backend/backend-payment.entity";
import { QueueStatus } from "../backend/backend-queue.entity";

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
