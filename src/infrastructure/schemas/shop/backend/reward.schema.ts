/**
 * Database schema types for rewards
 * These types match the actual database structure
 */

/**
 * Reward database schema
 */
export interface RewardSchema {
  id: string;
  shop_id: string;
  shop_name?: string; // Joined data from shops table
  name: string;
  description: string | null;
  type: string; // 'discount' | 'free_item' | 'cashback' | 'special_privilege'
  points_required: number;
  value: number;
  is_available: boolean;
  expiry_days: number | null;
  usage_limit: number | null;
  icon: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Reward usage database schema
 */
export interface RewardUsageSchema {
  id: string;
  reward_id: string;
  reward_name: string; // Joined data from rewards table
  reward_icon: string; // Joined data from rewards table
  customer_id: string;
  customer_name: string; // Joined data from customers table
  points_used: number;
  reward_value: number;
  used_at: string;
  queue_id: string | null;
  queue_number: string | null; // Joined data from queues table
}

/**
 * Reward stats database schema
 */
export interface RewardStatsSchema {
  total_rewards: number;
  active_rewards: number;
  total_redemptions: number;
  total_points_redeemed: number;
  average_redemption_value: number;
  popular_reward_type: string | null;
}

/**
 * Reward type stats database schema
 */
export interface RewardTypeStatsSchema {
  discount_count: number;
  discount_percentage: number;
  discount_total_value: number;
  free_item_count: number;
  free_item_percentage: number;
  free_item_total_value: number;
  cashback_count: number;
  cashback_percentage: number;
  cashback_total_value: number;
  special_privilege_count: number;
  special_privilege_percentage: number;
  special_privilege_total_value: number;
  total_rewards: number;
}
