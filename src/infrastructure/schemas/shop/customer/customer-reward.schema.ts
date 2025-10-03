import { Database } from "@/src/domain/types/supabase";

/**
 * Database schema types for customer rewards
 * These types match the actual database structure
 */

/**
 * Customer points database schema
 */
export type GetCustomerPointsSchema =
  Database["public"]["Functions"]["get_customer_points"]["Returns"][0];

export type GetAvailableRewardsSchema =
  Database["public"]["Functions"]["get_available_rewards"]["Returns"][0];

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
  data: CustomerRewardSchema;
}

export interface RedeemRewardResultSchema {
  data: CustomerRewardSchema;
}
