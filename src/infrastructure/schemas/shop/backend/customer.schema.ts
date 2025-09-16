/**
 * Database schema types for customers
 * These types match the actual database structure
 */

/**
 * Customer database schema
 */
export interface CustomerSchema {
  shop_id: string;
  profile_id: string | null;
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  date_of_birth: string | null;
  gender: "male" | "female" | "other" | null;
  address: string | null;
  total_queues?: number; // Joined data
  total_points?: number; // Joined data
  membership_tier?: "regular" | "bronze" | "silver" | "gold" | "platinum"; // Joined data
  last_visit?: string | null; // Joined data
  notes: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Customer stats database schema
 */
export interface CustomerStatsSchema {
  total_customers: number;
  total_registered_customers: number;
  new_customers_this_month: number;
  active_customers_today: number;
  gold_members: number;
  silver_members: number;
  bronze_members: number;
  regular_members: number;
}
