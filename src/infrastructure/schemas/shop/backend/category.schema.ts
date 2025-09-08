/**
 * Database schema types for categories
 * These types match the actual database structure
 */

/**
 * Category database schema
 */
export interface CategorySchema {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  // These fields are joined from other tables
  shops_count?: number;
  services_count?: number;
}

/**
 * Category stats database schema
 */
export interface CategoryStatsSchema {
  total_categories: number;
  active_categories: number;
  total_shops: number;
  total_services: number;
  most_popular_category: string;
  least_popular_category: string;
}
