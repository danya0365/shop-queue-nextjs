export interface QueueStatusStatsDTO {
  currentNumber: string;
  totalWaiting: number;
  estimatedWaitTime: number;
  averageServiceTime: number;
}

export interface PopularServiceDTO {
  id: string;
  name: string;
  price: number;
  description: string;
  estimatedTime: number;
  icon: string;
}

export interface PromotionDTO {
  id: string;
  title: string;
  description: string;
  discount: number;
  validUntil: string;
  icon: string;
}

export interface CustomerDashboardDataDTO {
  queueStatus: QueueStatusStatsDTO;
  popularServices: PopularServiceDTO[];
  promotions: PromotionDTO[];
  canJoinQueue: boolean;
  announcement: string | null;
}
