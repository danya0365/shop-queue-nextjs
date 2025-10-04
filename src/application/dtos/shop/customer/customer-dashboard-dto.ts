export interface QueueStatusStatsDTO {
  currentNumber: string;
  totalConfirmed: number;
  totalWaiting: number;
  estimatedWaitTime: number;
  averageServiceTime: number;
}

export interface PopularServiceDTO {
  id: string;
  name: string;
  price: number;
  revenue: number;
  description: string;
  estimatedTime: number;
  icon: string;
  category: string;
}

export interface PromotionDTO {
  id: string;
  title: string;
  description: string;
  discount: number;
  validUntil: string;
  icon?: string;
  imageUrl?: string;
}

export interface CustomerDashboardDataDTO {
  queueStatus: QueueStatusStatsDTO;
  popularServices: PopularServiceDTO[];
  promotions: PromotionDTO[];
  canJoinQueue: boolean;
  announcement: string | null;
}
