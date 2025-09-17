import { Database } from "@/src/domain/types/supabase";

/**
 * Database schema types for customers
 * These types match the actual database structure
 */

/**
 * Customer database schema
 */
export type CustomerSchema = Database["public"]["Tables"]["customers"]["Row"];
export type CustomerPointsSchema =
  Database["public"]["Tables"]["customer_points"]["Row"];
export type QueueSchema = Database["public"]["Tables"]["queues"]["Row"];

/**
 * Customer stats database schema
 */
export type CustomerStatsSchema =
  Database["public"]["Views"]["customer_stats_view"]["Row"];
