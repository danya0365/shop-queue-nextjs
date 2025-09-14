/**
 * Database schema types for opening hours
 * These types match the actual database structure
 */

/**
 * Opening hour database schema
 */
export interface OpeningHourSchema {
  id: string;
  shop_id: string;
  day_of_week: string;
  is_open: boolean;
  open_time: string | null;
  close_time: string | null;
  break_start: string | null;
  break_end: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Opening hour stats database schema
 */
export interface OpeningHourStatsSchema {
  total_opening_hours: number;
  open_days_count: number;
  average_opening_hours: number;
  most_common_opening_time: string;
  most_common_closing_time: string;
}
