/**
 * Database schema types for shops
 * These types match the actual database structure
 */

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
  logo_url: string | null;
  qr_code_url: string | null;
  timezone: string;
  currency: string;
  language: string;
  status: string;
  owner_id: string;
  owner_name?: string; // Joined data
  created_at: string;
  updated_at: string;
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
