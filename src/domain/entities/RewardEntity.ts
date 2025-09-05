export type RewardType = 'discount' | 'free_item' | 'cashback' | 'special_privilege';

export interface RewardEntity {
  id: string;
  shopId: string;
  name: string;
  description: string | null;
  type: RewardType;
  pointsRequired: number;
  value: number;
  isAvailable: boolean;
  expiryDays: number | null;
  usageLimit: number | null;
  icon: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RewardStatsEntity {
  totalRewards: number;
  activeRewards: number;
  totalRedemptions: number;
  totalPointsRedeemed: number;
  averageRedemptionValue: number;
  popularRewardType: RewardType | null;
}

export interface RewardUsageEntity {
  id: string;
  rewardId: string;
  customerId: string;
  customerName: string;
  pointsUsed: number;
  rewardValue: number;
  usedAt: string;
  queueId: string | null;
  queueNumber: string | null;
}
