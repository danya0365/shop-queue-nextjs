/**
 * Domain entities for customer rewards functionality
 * Following Clean Architecture principles with proper separation of concerns
 */

/**
 * Customer reward entity representing a reward that a customer can redeem
 */
export interface CustomerRewardEntity {
  id: string;
  name: string;
  description: string;
  type: "discount" | "free_item" | "cashback" | "points";
  value: number;
  pointsCost: number;
  category: string;
  imageUrl?: string;
  expiryDate?: string;
  termsAndConditions: string[];
  isAvailable: boolean;
  isRedeemed: boolean;
  redeemedAt?: string;
  shopId: string;
  customerId?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Customer points entity representing a customer's points information
 */
export interface CustomerPointsEntity {
  id: string;
  customerId: string;
  shopId: string;
  currentPoints: number;
  totalEarned: number;
  totalRedeemed: number;
  pointsExpiring: number;
  expiryDate?: string;
  tier: "Bronze" | "Silver" | "Gold" | "Platinum";
  nextTierPoints: number;
  tierBenefits: string[];
  lastUpdated: string;
}

/**
 * Reward transaction entity representing points transactions
 */
export interface RewardTransactionEntity {
  id: string;
  customerId: string;
  shopId: string;
  type: "earned" | "redeemed" | "expired";
  points: number;
  description: string;
  date: string;
  relatedOrderId?: string;
  relatedRewardId?: string;
  balanceBefore: number;
  balanceAfter: number;
  createdAt: string;
}

/**
 * Available reward entity representing rewards that can be redeemed
 */
export interface AvailableRewardEntity {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  category: string;
  imageUrl?: string;
  isAvailable: boolean;
  stock?: number;
  shopId: string;
  type: "discount" | "free_item" | "cashback" | "points";
  value?: number;
  termsAndConditions?: string[];
  expiryDate?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Customer reward statistics entity
 */
export interface CustomerRewardStatsEntity {
  customerId: string;
  shopId: string;
  totalRewardsAvailable: number;
  totalRewardsRedeemed: number;
  totalPointsEarned: number;
  totalPointsRedeemed: number;
  averagePointsPerTransaction: number;
  mostRedeemedCategory: string;
  redemptionRate: number;
  lastRedemptionDate?: string;
  lastEarnDate?: string;
}
