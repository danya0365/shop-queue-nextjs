/**
 * DTOs for customer rewards functionality
 * Following Clean Architecture principles with proper data transfer objects
 */

/**
 * Customer reward DTO representing a reward that a customer has redeemed
 */
export interface CustomerRewardDTO {
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
}

/**
 * Customer points DTO representing a customer's points information
 */
export interface CustomerPointsDTO {
  currentPoints: number;
  totalEarned: number;
  totalRedeemed: number;
  pointsExpiring: number;
  expiryDate?: string;
  tier: "Bronze" | "Silver" | "Gold" | "Platinum";
  nextTierPoints: number;
  tierBenefits: string[];
}

/**
 * Reward transaction DTO representing points transactions
 */
export interface RewardTransactionDTO {
  id: string;
  type: "earned" | "redeemed" | "expired";
  points: number;
  description: string;
  date: string;
  relatedOrderId?: string;
}

/**
 * Available reward DTO representing rewards that can be redeemed
 */
export interface AvailableRewardDTO {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  category: string;
  imageUrl?: string;
  isAvailable: boolean;
  stock?: number;
}

/**
 * Customer reward statistics DTO
 */
export interface CustomerRewardStatsDTO {
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

/**
 * Customer information DTO
 */
export interface CustomerInfoDTO {
  customerName: string;
  memberSince: string;
}

/**
 * Pagination DTO
 */
export interface PaginationDTO {
  currentPage: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/**
 * Paginated data DTO wrapper
 */
export interface PaginatedDataDTO<T> {
  data: T[];
  pagination: PaginationDTO;
}

/**
 * Customer rewards data DTO combining all reward-related data
 */
export interface CustomerRewardsDataDTO {
  customerPoints: CustomerPointsDTO;
  customerInfo: CustomerInfoDTO;
  availableRewards: PaginatedDataDTO<AvailableRewardDTO>;
  redeemedRewards: PaginatedDataDTO<CustomerRewardDTO>;
  rewardTransactions: PaginatedDataDTO<RewardTransactionDTO>;
  customerStats?: CustomerRewardStatsDTO;
}

/**
 * Filter DTOs for customer rewards
 */
export interface AvailableRewardsFiltersDTO {
  category?: string;
  type?: "discount" | "free_item" | "cashback" | "points";
  isAvailable?: boolean;
  minPointsCost?: number;
  maxPointsCost?: number;
}

export interface RedeemedRewardsFiltersDTO {
  category?: string;
  type?: "discount" | "free_item" | "cashback" | "points";
  dateRange?: "all" | "month" | "quarter" | "year" | "custom";
  startDate?: string;
  endDate?: string;
}

export interface RewardTransactionsFiltersDTO {
  type?: "earned" | "redeemed" | "expired";
  dateRange?: "all" | "month" | "quarter" | "year" | "custom";
  startDate?: string;
  endDate?: string;
}

/**
 * Input DTOs for use cases
 */
export interface GetCustomerPointsInputDTO {
  shopId: string;
  customerId: string;
}

export interface GetAvailableRewardsInputDTO {
  shopId: string;
  customerId?: string;
  currentPage?: number;
  perPage?: number;
  filters?: AvailableRewardsFiltersDTO;
}

export interface GetRedeemedRewardsInputDTO {
  shopId: string;
  customerId: string;
  currentPage?: number;
  perPage?: number;
  filters?: RedeemedRewardsFiltersDTO;
}

export interface GetRewardTransactionsInputDTO {
  shopId: string;
  customerId: string;
  currentPage?: number;
  perPage?: number;
  filters?: RewardTransactionsFiltersDTO;
}

export interface GetRewardDetailsInputDTO {
  shopId: string;
  rewardId: string;
  customerId?: string;
}

export interface RedeemRewardInputDTO {
  shopId: string;
  customerId: string;
  rewardId: string;
}

export interface GetCustomerRewardStatsInputDTO {
  shopId: string;
  customerId: string;
}

export interface GetCustomerInfoInputDTO {
  shopId: string;
  customerId: string;
}
