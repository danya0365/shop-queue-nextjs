/**
 * Database schema types for shop settings
 * These types match the actual database structure
 */

/**
 * Shop settings database schema
 */
export interface ShopSettingsSchema {
  id: string;
  shop_id: string;
  accept_bank_transfer: boolean;
  accept_cash: boolean;
  accept_credit_card: boolean;
  accept_promptpay: boolean;
  allow_advance_booking: boolean;
  allow_data_export: boolean;
  allow_guest_booking: boolean;
  allow_registration: boolean | null;
  allow_walk_in: boolean;
  api_key: string;
  auto_confirm_booking: boolean;
  auto_confirm_queues: boolean | null;
  backup_frequency: string | null;
  booking_window_hours: number | null;
  cancellation_deadline: number | null;
  created_at: string | null;
  data_retention_days: number | null;
  date_format: string;
  email_enabled: boolean;
  enable_analytics: boolean;
  enable_data_backup: boolean;
  enable_reviews: boolean;
  enable_session_timeout: boolean;
  enable_two_factor: boolean;
  enable_webhooks: boolean;
  estimated_service_time: number | null;
  line_notify_enabled: boolean;
  log_level: string | null;
  maintenance_mode: boolean | null;
  max_advance_booking_days: number;
  max_queue_per_service: number;
  max_queue_size: number | null;
  minimum_points_to_redeem: number;
  notify_before_minutes: number;
  points_enabled: boolean;
  points_expiry_months: number;
  points_per_baht: number;
  promptpay_id: string | null;
  queue_timeout_minutes: number;
  require_customer_phone: boolean;
  require_email_verification: boolean;
  session_timeout: number | null;
  show_prices_public: boolean;
  sms_enabled: boolean;
  theme: string;
  time_format: string;
  updated_at: string | null;
  // Joined data from shops table
  shops?: {
    name?: string;
    description?: string;
    address?: string;
    phone?: string;
    email?: string;
    website?: string;
    logo?: string;
    qr_code_url?: string;
    timezone?: string;
    currency?: string;
    language?: string;
    status?: string;
    owner_id?: string;
  };
}

/**
 * Shop settings stats database schema
 */
export interface ShopSettingsStatsSchema {
  total_shops: number;
  active_shops: number;
  shops_with_analytics: number;
  shops_with_reviews: number;
  shops_with_points: number;
  shops_with_webhooks: number;
  average_settings_per_shop: number;
}
