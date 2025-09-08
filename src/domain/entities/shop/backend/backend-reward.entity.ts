import { PaginatedResult } from "@/src/domain/interfaces/pagination-types";

/**
 * Reward type enum
 */
export enum RewardType {
  DISCOUNT = 'discount',
  FREE_ITEM = 'free_item',
  CASHBACK = 'cashback',
  SPECIAL_PRIVILEGE = 'special_privilege'
}

/**
 * Reward entity representing a loyalty reward in the system
 * Following Clean Architecture principles - domain entity
 */
export interface RewardEntity {
  id: string;
  shopId: string;
  shopName?: string; // Joined data
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

export interface CreateRewardEntity {
  shopId: string;
  name: string;
  description?: string;
  type: RewardType;
  pointsRequired: number;
  value: number;
  isAvailable?: boolean;
  expiryDays?: number;
  usageLimit?: number;
  icon?: string;
}

export interface UpdateRewardEntity {
  name?: string;
  description?: string;
  type?: RewardType;
  pointsRequired?: number;
  value?: number;
  isAvailable?: boolean;
  expiryDays?: number;
  usageLimit?: number;
  icon?: string;
}

/**
 * Reward usage entity representing a reward redemption
 */
export interface RewardUsageEntity {
  id: string;
  rewardId: string;
  rewardName: string;
  rewardIcon: string;
  customerId: string;
  customerName: string;
  pointsUsed: number;
  rewardValue: number;
  usedAt: string;
  queueId: string | null;
  queueNumber: string | null;
}

/**
 * Reward statistics entity
 */
export interface RewardStatsEntity {
  totalRewards: number;
  activeRewards: number;
  totalRedemptions: number;
  totalPointsRedeemed: number;
  averageRedemptionValue: number;
  popularRewardType: RewardType | null;
}

/**
 * Reward type statistics entity
 */
export interface RewardTypeStatsEntity {
  discount: {
    count: number;
    percentage: number;
    totalValue: number;
  };
  free_item: {
    count: number;
    percentage: number;
    totalValue: number;
  };
  cashback: {
    count: number;
    percentage: number;
    totalValue: number;
  };
  special_privilege: {
    count: number;
    percentage: number;
    totalValue: number;
  };
  totalRewards: number;
}

/**
 * Paginated rewards result
 */
export type PaginatedRewardsEntity = PaginatedResult<RewardEntity>;
