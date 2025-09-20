export interface CustomerQueueHistoryEntity {
  id: string;
  queueNumber: string;
  shopName: string;
  services: CustomerQueueServiceEntity[];
  totalAmount: number;
  status: "completed" | "cancelled" | "no_show";
  queueDate: string;
  queueTime: string;
  completedAt?: string;
  waitTime?: number;
  serviceTime?: number;
  rating?: number;
  feedback?: string;
  employeeName?: string;
  paymentMethod?: "cash" | "card" | "qr" | "transfer";
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
