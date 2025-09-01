export interface QueueDTO {
  id: string;
  customerId: string;
  customerName: string; // joined from customers table
  customerPhone: string; // joined from customers table
  shopId: string;
  shopName: string; // joined from shops table
  queueServices: QueueServiceDTO[];
  queueNumber: number;
  status: 'waiting' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  priority: 'normal' | 'high' | 'urgent';
  estimatedWaitTime: number; // in minutes
  actualWaitTime?: number; // in minutes
  notes?: string;
  createdAt: string;
  updatedAt: string;
  calledAt?: string;
  completedAt?: string;
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
