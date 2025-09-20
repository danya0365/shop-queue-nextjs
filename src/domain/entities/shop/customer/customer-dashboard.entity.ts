export interface QueueStatusStatsEntity {
  currentNumber: string;
  totalWaiting: number;
  estimatedWaitTime: number;
  averageServiceTime: number;
}

export interface PopularServiceEntity {
  id: string;
  name: string;
  price: number;
  description: string;
  estimatedTime: number;
  icon: string;
}

export interface PromotionEntity {
  id: string;
  title: string;
  description: string;
  discount: number;
  validUntil: string;
  icon: string;
}

export interface CustomerDashboardEntity {
  queueStatus: QueueStatusStatsEntity;
  popularServices: PopularServiceEntity[];
  promotions: PromotionEntity[];
  canJoinQueue: boolean;
  announcement: string | null;
}
