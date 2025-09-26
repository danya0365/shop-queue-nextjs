import type { Database } from "@/src/domain/types/supabase";

/**
 * Database schema types for marketplace queries
 * These types are based on Supabase database types for consistency
 */

/**
 * Shop database schema (based on shops table)
 */
export type ShopSchema = Database["public"]["Tables"]["shops"]["Row"];

/**
 * Category database schema (based on categories table)
 */
export type CategorySchema = Database["public"]["Tables"]["categories"]["Row"];

/**
 * Shop opening hours database schema (based on shop_opening_hours table)
 */
export type ShopOpeningHoursSchema =
  Database["public"]["Tables"]["shop_opening_hours"]["Row"];

/**
 * Shop marketplace database schema
 * This represents the shop data structure as returned from database queries for marketplace
 * Combines shops table with additional joined fields
 */
export interface ShopMarketplaceSchema extends Record<string, unknown> {
  // Shop columns
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
  created_at: string;
  updated_at: string;

  // Additional joined fields
  owner_name?: string; // Join from profiles table
  is_featured: boolean;
  queue_count: number; // Join from shop_stats_view
  total_services: number; // Join from shop_stats_view
  rating: number; // Join from shop_stats_view
  total_reviews: number; // Join from shop_stats_view

  // Joined data from shop_categories and categories tables
  categories?: ShopCategoryMarketplaceSchema[];

  // Joined data from opening_hours table
  opening_hours?: ShopOpeningHourMarketplaceSchema[];
}

/**
 * Shop category marketplace database schema
 * Based on categories table but simplified for marketplace context
 */
export interface ShopCategoryMarketplaceSchema {
  id: string;
  name: string;
  slug: string;
  description: string;
}

/**
 * Shop opening hour marketplace database schema
 * Based on shop_opening_hours table but without shop_id for marketplace context
 */
export interface ShopOpeningHourMarketplaceSchema {
  id: string;
  shop_id: string;
  day_of_week: string;
  open_time: string | null;
  close_time: string | null;
  is_open: boolean | null;
  break_start: string | null;
  break_end: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Category marketplace database schema
 * This represents the category data structure as returned from database queries for marketplace
 * Combines categories table with additional joined fields
 */
export interface CategoryMarketplaceSchema extends Record<string, unknown> {
  // Category columns
  id: string;
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean | null;
  icon: string | null;
  color: string | null;
  sort_order: number | null;
  created_at: string;
  updated_at: string;

  // Additional joined field
  shops_count: number; // Join from categories_stats_view
}

/**
 * Location marketplace database schema
 * This represents the location data structure as returned from database queries for marketplace
 * Note: locations table doesn't exist in Supabase types, this is likely from a view or custom query
 */
export interface LocationMarketplaceSchema extends Record<string, unknown> {
  id: string;
  name: string;
  province: string;
  district: string;
  is_active: boolean;
  shops_count: number; // Join from locations_stats_view
  created_at: string;
  updated_at: string;
}

/**
 * Marketplace stats database schema
 * This represents the marketplace statistics data structure as returned from database queries
 * Note: This is likely from a view like shop_stats_summary_view
 */
export interface MarketplaceStatsSchema {
  total_shops: number;
  active_shops: number;
  featured_shops: number;
  new_shops_this_month: number;
}

/**
 * Shop list result database schema
 * This represents the paginated shop list result structure from database queries
 */
export interface ShopListResultSchema {
  shops: ShopMarketplaceSchema[];
  total_count: number;
  per_page: number;
  current_page: number;
  total_pages: number;
}
