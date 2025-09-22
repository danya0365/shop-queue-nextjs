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
 * Public shop info database schema (from RPC function)
 */
export interface PublicShopInfoSchema {
  // Shop columns
  shop_id: string;
  shop_name: string;
  shop_description: string | null;
  shop_address: string | null;
  shop_phone: string | null;
  shop_email: string | null;
  shop_website: string | null;
  shop_logo: string | null;
  shop_qr_code_url: string | null;
  shop_currency: string;
  shop_language: string;
  shop_timezone: string;
  shop_status: string;
  shop_created_at: string;
  shop_updated_at: string;
  
  // Shop Settings columns
  settings_id: string;
  settings_shop_id: string;
  settings_estimated_service_time: number;
  settings_maintenance_mode: boolean;
  settings_allow_registration: boolean;
  settings_session_timeout: number;
  settings_backup_frequency: string;
  settings_log_level: string;
  settings_data_retention_days: number;
  settings_is_accepting_queues: boolean;
  settings_auto_confirm_queues: boolean;
  settings_max_queue_size: number;
  settings_max_queue_per_service: number;
  settings_queue_timeout_minutes: number;
  settings_allow_walk_in: boolean;
  settings_allow_advance_booking: boolean;
  settings_max_advance_booking_days: number;
  settings_booking_window_hours: number;
  settings_cancellation_deadline: number;
  settings_points_enabled: boolean;
  settings_points_per_baht: number;
  settings_points_expiry_months: number;
  settings_minimum_points_to_redeem: number;
  settings_sms_enabled: boolean;
  settings_email_enabled: boolean;
  settings_line_notify_enabled: boolean;
  settings_notify_before_minutes: number;
  settings_accept_cash: boolean;
  settings_accept_credit_card: boolean;
  settings_accept_bank_transfer: boolean;
  settings_accept_promptpay: boolean;
  settings_promptpay_id: string | null;
  settings_theme: string;
  settings_date_format: string;
  settings_time_format: string;
  settings_auto_confirm_booking: boolean;
  settings_require_customer_phone: boolean;
  settings_allow_guest_booking: boolean;
  settings_show_prices_public: boolean;
  settings_enable_reviews: boolean;
  settings_enable_two_factor: boolean;
  settings_require_email_verification: boolean;
  settings_enable_session_timeout: boolean;
  settings_enable_analytics: boolean;
  settings_enable_data_backup: boolean;
  settings_allow_data_export: boolean;
  settings_api_key: string;
  settings_enable_webhooks: boolean;
  settings_created_at: string;
  settings_updated_at: string;
}

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
 * Queue comprehensive stats RPC function schema (from get_public_queue_comprehensive_stats)
 */
export type QueueComprehensiveStatsRpcSchema = Database["public"]["Functions"]["get_public_queue_comprehensive_stats"]["Returns"][0];

/**
 * Public queue info database schema (from get_public_queue_info_by_id RPC function)
 */
export type PublicQueueInfoSchema = Database["public"]["Functions"]["get_public_queue_info_by_id"]["Returns"][0];

/**
 * Public queue info by customer ID database schema (from get_public_queue_info_by_customer_id RPC function)
 */
export type PublicQueueInfoByCustomerIdSchema = Database["public"]["Functions"]["get_public_queue_info_by_customer_id"]["Returns"][0];

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
