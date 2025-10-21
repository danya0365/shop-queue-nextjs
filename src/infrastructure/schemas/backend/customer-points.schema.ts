import type { Json } from "@/src/domain/types/supabase";
import type { Database } from "@/src/domain/types/supabase";

export type MembershipTierEnum = Database["public"]["Enums"]["membership_tier"];
export type TransactionTypeEnum = Database["public"]["Enums"]["transaction_type"];

export interface CustomerPointsSchema {
  id: string;
  shop_id: string;
  customer_id: string;
  current_points: number | null;
  total_earned: number | null;
  total_redeemed: number | null;
  total_expired: number | null;
  membership_tier: MembershipTierEnum | null;
  tier_benefits: string[] | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface CustomerPointsWithCustomerSchema extends CustomerPointsSchema {
  customers?: {
    name: string | null;
    phone: string | null;
    email: string | null;
    updated_at: string | null;
  } | null;
  last_transaction_at?: string | null;
}

export interface CustomerPointsStatsSchema {
  total_points_issued: number;
  total_points_redeemed: number;
  total_points_expired: number;
  total_customers: number;
  average_points_per_customer: number;
}

export interface CustomerPointTransactionSchema {
  id: string;
  customer_point_id: string;
  points: number;
  type: TransactionTypeEnum;
  description: string | null;
  related_queue_id: string | null;
  metadata: Json | null;
  transaction_date: string | null;
  created_at: string | null;
}

export interface CustomerPointTransactionWithCustomerSchema
  extends CustomerPointTransactionSchema {
  customer_points?: {
    customer_id: string;
    shop_id: string;
  } | null;
}

export interface CustomerPointExpirySchema {
  id: string;
  customer_point_transaction_id: string;
  points: number;
  expiry_date: string;
  created_at: string | null;
}
