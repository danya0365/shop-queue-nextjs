/**
 * Database schema types for promotions
 * These types match the actual database structure
 */

/**
 * Promotion database schema
 */
export interface PromotionSchema {
  id: string;
  shop_id: string;
  shop_name?: string; // Joined data
  name: string;
  description: string | null;
  type: string;
  value: number;
  min_purchase_amount: number | null;
  max_discount_amount: number | null;
  start_at: string;
  end_at: string;
  usage_limit: number | null;
  status: string;
  conditions: Record<string, unknown>[] | null;
  created_by: string;
  created_by_name?: string; // Joined data
  created_at: string;
  updated_at: string;
}

/**
 * Promotion stats database schema
 */
export interface PromotionStatsSchema {
  total_promotions: number;
  active_promotions: number;
  inactive_promotions: number;
  expired_promotions: number;
  scheduled_promotions: number;
  total_usage: number;
  total_discount_given: number;
  average_discount_amount: number;
  most_used_promotion_type: string;
}
