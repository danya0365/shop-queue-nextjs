/**
 * Database schema types for customer dashboard
 * These types represent the structure of data from the database
 */
import type { Json } from "../../../../domain/types/supabase";

/**
 * Schema for queue data from the database
 */
export interface QueueSchema {
  id: string;
  shop_id: string;
  customer_id?: string;
  queue_number: string;
  status: "waiting" | "serving" | "completed" | "cancelled" | "no_show";
  created_at: string;
  updated_at: string;
  service_id?: string;
  estimated_time?: number;
}

/**
 * Schema for service data from the database
 */
export interface ServiceSchema {
  id: string;
  shop_id: string;
  name: string;
  description?: string;
  price?: number;
  estimated_time?: number;
  icon?: string;
  is_available: boolean;
  popularity_score?: number;
  queue_count?: number;
  created_at: string;
  updated_at: string;
}

/**
 * Schema for promotion data from the database
 */
export interface PromotionSchema {
  id: string;
  shop_id: string;
  name: string;
  description: string | null;
  value: number;
  type: string;
  status: string | null;
  start_at: string;
  end_at: string;
  usage_limit: number | null;
  conditions: Json | null;
  created_at: string | null;
  updated_at: string | null;
}

/**
 * Schema for shop data from the database
 */
export interface ShopSchema {
  id: string;
  name: string;
  status: "active" | "inactive" | "maintenance";
  announcement?: string | null;
  created_at: string;
  updated_at: string;
}
