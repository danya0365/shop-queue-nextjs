/**
 * Database schema types for shops
 * These types match the actual database structure
 */

import { ServiceSchema } from "./queue.schema";

/**
 * Shop database schema
 */
export interface ShopSchema {
  id: string;
  name: string;
  description: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  logo: string | null;
  qr_code_url: string | null;
  timezone: string;
  currency: string;
  language: string;
  status: string;
  owner_id: string;
  owner_name?: string; // Join from profiles table
  queue_count: number; // Join from shop_stats_view
  total_services: number; // Join from shop_stats_view
  rating: number; // Join from shop_stats_view
  total_reviews: number; // Join from shop_stats_view
  created_at: string;
  updated_at: string;
  // Joined data from shop_categories and categories tables
  categories?: ShopCategorySchema[];
  // Joined data from opening_hours table
  opening_hours?: OpeningHourSchema[];

  services?: ServiceSchema[];
}

export interface ShopCategorySchema {
  id: string;
  name: string;
}

export interface OpeningHourSchema {
  day_of_week: string;
  open_time: string;
  close_time: string;
  is_open: boolean;
  break_start: string;
  break_end: string;
}

/**
 * Shop stats database schema
 */
export interface ShopStatsSchema {
  total_shops: number;
  active_shops: number;
  pending_approval: number;
  new_this_month: number;
}
