import type { Database } from "@/src/domain/types/supabase";

/**
 * Database schema types for queue join
 * These types are based on Supabase database types for consistency
 */

/**
 * Service option database schema (based on services table)
 */
export type ServiceOptionSchema = Database["public"]["Tables"]["services"]["Row"];

/**
 * Shop database schema (based on shops table)
 */
export type ShopSchema = Database["public"]["Tables"]["shops"]["Row"];

/**
 * Shop settings database schema (based on shop_settings table)
 */
export type ShopSettingsSchema = Database["public"]["Tables"]["shop_settings"]["Row"];

/**
 * Shop queue info database schema (combines shops and shop_settings tables)
 */
export interface ShopQueueInfoSchema {
  shop_id: string;
  shop_name: string;
  is_accepting_queues: boolean;
  max_queue_length: number;
  current_queue_length: number;
  estimated_wait_time: number;
}

/**
 * Queue join database schema (based on queues table)
 */
export type QueueJoinSchema = Omit<Database["public"]["Tables"]["queues"]["Insert"], "id"> & {
  id?: string;
};

/**
 * Queue service database schema (based on queue_services table)
 */
export type QueueServiceSchema = Database["public"]["Tables"]["queue_services"]["Row"];

/**
 * Join queue result database schema
 */
export interface JoinQueueResultSchema {
  success: boolean;
  queue_number?: string;
  estimated_wait_time?: number;
  message?: string;
  error?: string;
}
