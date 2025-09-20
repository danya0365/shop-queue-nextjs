/**
 * Database schema types for customer rewards
 * These types match the actual database structure
 */

/**
 * Customer points database schema
 */
export interface CustomerPointsSchema {
  id: string;
  shop_id: string;
  customer_id: string;
  current_points: number;
  total_earned: number;
  total_redeemed: number;
  points_expiring: number;
  expiry_date: string | null;
  tier: "Bronze" | "Silver" | "Gold" | "Platinum";
  next_tier_points: number;
  tier_benefits: string[];
  created_at: string;
  updated_at: string;
}

/**
 * Customer reward database schema (redeemed rewards)
 */
export interface CustomerRewardSchema {
  id: string;
  shop_id: string;
  customer_id: string;
  reward_id: string;
  name: string;
  description: string;
  type: "discount" | "free_item" | "cashback" | "points";
  value: number;
  points_cost: number;
  category: string;
  image_url: string | null;
  expiry_date: string | null;
  terms_and_conditions: string[];
  is_available: boolean;
  is_redeemed: boolean;
  redeemed_at: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Reward transaction database schema
 */
export interface RewardTransactionSchema {
  id: string;
  shop_id: string;
  customer_id: string;
  type: "earned" | "redeemed" | "expired";
  points: number;
  description: string;
  date: string;
  related_order_id: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Available reward database schema
 */
export interface AvailableRewardSchema {
  id: string;
  shop_id: string;
  name: string;
  description: string;
  points_cost: number;
  category: string;
  image_url: string | null;
  is_available: boolean;
  stock: number | null;
  type: "discount" | "free_item" | "cashback" | "points";
  value: number;
  expiry_date: string | null;
  terms_and_conditions: string[];
  created_at: string;
  updated_at: string;
}

/**
 * Customer reward statistics database schema
 */
export interface CustomerRewardStatsSchema {
  id: string;
  shop_id: string;
  customer_id: string;
  total_rewards_available: number;
  total_rewards_redeemed: number;
  total_points_earned: number;
  total_points_redeemed: number;
  average_points_per_transaction: number;
  most_redeemed_category: string;
  redemption_rate: number;
  last_redemption_date: string | null;
  last_earn_date: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Customer info database schema (for rewards context)
 */
export interface CustomerInfoSchema {
  id: string;
  shop_id: string;
  customer_id: string;
  customer_name: string;
  member_since: string;
  created_at: string;
  updated_at: string;
}

/**
 * Pagination metadata schema
 */
export interface PaginationMetaSchema {
  currentPage: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/**
 * Paginated data schema wrapper
 */
export interface PaginatedDataSchema<T> {
  data: T[];
  pagination: PaginationMetaSchema;
}

/**
 * Filter schemas for database queries
 */
export interface AvailableRewardsFilterSchema {
  category?: string;
  type?: "discount" | "free_item" | "cashback" | "points";
  is_available?: boolean;
  min_points_cost?: number;
  max_points_cost?: number;
}

export interface RedeemedRewardsFilterSchema {
  category?: string;
  type?: "discount" | "free_item" | "cashback" | "points";
  date_range?: "all" | "month" | "quarter" | "year" | "custom";
  start_date?: string;
  end_date?: string;
}

export interface RewardTransactionsFilterSchema {
  type?: "earned" | "redeemed" | "expired";
  date_range?: "all" | "month" | "quarter" | "year" | "custom";
  start_date?: string;
  end_date?: string;
}

/**
 * Database query result schemas
 */
export interface CustomerPointsResultSchema {
  data: CustomerPointsSchema;
}

export interface AvailableRewardsResultSchema {
  data: AvailableRewardSchema[];
  pagination: PaginationMetaSchema;
}

export interface RedeemedRewardsResultSchema {
  data: CustomerRewardSchema[];
  pagination: PaginationMetaSchema;
}

export interface RewardTransactionsResultSchema {
  data: RewardTransactionSchema[];
  pagination: PaginationMetaSchema;
}

export interface CustomerRewardStatsResultSchema {
  data: CustomerRewardStatsSchema;
}

export interface CustomerInfoResultSchema {
  data: CustomerInfoSchema;
}

export interface RewardDetailsResultSchema {
  data: CustomerRewardSchema | AvailableRewardSchema;
}

export interface RedeemRewardResultSchema {
  data: CustomerRewardSchema;
}
