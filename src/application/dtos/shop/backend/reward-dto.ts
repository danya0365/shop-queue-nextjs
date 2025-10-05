import { RewardType } from "@/src/domain/entities/backend/backend-reward.entity";
import { PaginatedResult } from "@/src/domain/interfaces/pagination-types";

export interface RewardDTO {
  id: string;
  shopId: string;
  name: string;
  description: string | null;
  type: RewardType;
  pointsRequired: number;
  value: number;
  isAvailable: boolean;
  expiryDays: number;
  usageLimit: number;
  usageCount: number;
  remainingUsage: number;
  redeemCount: number;
  remainingRedemptions: number;
  icon: string;
  createdAt: string;
  updatedAt: string;
  isCanDelete?: boolean;
}

export interface RewardStatsDTO {
  totalRewards: number;
  activeRewards: number;
  totalRedemptions: number;
  totalPointsRedeemed: number;
  averageRedemptionValue: number;
  popularRewardType: RewardType | null;
}

export interface RewardUsageDTO {
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

export interface RewardsDataDTO {
  rewards: RewardDTO[];
  stats: RewardStatsDTO;
  typeStats: RewardTypeStatsDTO;
  recentUsage: RewardUsageDTO[];
  totalCount: number;
}

export interface GetRewardsDataInput {
  shopId: string;
  page?: number;
  limit?: number;
}

export interface CreateRewardDTO {
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

export interface UpdateRewardDTO {
  id: string;
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

export interface RewardTypeStatsDTO {
  discount: {
    count: number;
    percentage: number;
    totalValue: number;
  };
  freeItem: {
    count: number;
    percentage: number;
    totalValue: number;
  };
  cashback: {
    count: number;
    percentage: number;
    totalValue: number;
  };
  specialPrivilege: {
    count: number;
    percentage: number;
    totalValue: number;
  };
  totalRewards: number;
}

// Paginated rewards DTO using generic pagination meta from domain layer
export type PaginatedRewardsDTO = PaginatedResult<RewardDTO>;
