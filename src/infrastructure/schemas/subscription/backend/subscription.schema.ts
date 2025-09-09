/**
 * Database schema types for subscription system
 * These types match the actual database structure
 */

/**
 * Subscription Plans database schema
 */
export interface SubscriptionPlanSchema {
  id: string;
  tier: 'free' | 'pro' | 'enterprise';
  name: string;
  name_en: string;
  description: string | null;
  description_en: string | null;
  
  // Pricing
  monthly_price: number | null;
  yearly_price: number | null;
  lifetime_price: number | null;
  currency: string;
  
  // Limits
  max_shops: number | null;
  max_queues_per_day: number | null;
  data_retention_months: number | null;
  max_staff: number | null;
  max_sms_per_month: number | null;
  max_promotions: number | null;
  max_free_poster_designs: number;
  
  // Features
  has_advanced_reports: boolean;
  has_custom_qr_code: boolean;
  has_api_access: boolean;
  has_priority_support: boolean;
  has_custom_branding: boolean;
  has_analytics: boolean;
  has_promotion_features: boolean;
  
  // Metadata
  features: string[];
  features_en: string[];
  is_active: boolean;
  sort_order: number;
  
  created_at: string;
  updated_at: string;
}

/**
 * Profile Subscriptions database schema
 */
export interface ProfileSubscriptionSchema {
  id: string;
  profile_id: string;
  plan_id: string;
  
  // Subscription details
  status: 'active' | 'cancelled' | 'expired' | 'pending' | 'suspended';
  billing_period: 'monthly' | 'yearly' | 'lifetime';
  
  // Dates
  start_date: string;
  end_date: string | null;
  trial_end_date: string | null;
  cancelled_at: string | null;
  
  // Payment
  price_per_period: number;
  currency: string;
  auto_renew: boolean;
  
  // Metadata
  payment_provider: string | null;
  external_subscription_id: string | null;
  metadata: Record<string, unknown>;
  
  created_at: string;
  updated_at: string;
  
  // Joined data from subscription_plans table
  plan?: SubscriptionPlanSchema;
  // Joined data from profiles table
  profile_name?: string;
}

/**
 * Subscription Usage database schema
 */
export interface SubscriptionUsageSchema {
  id: string;
  profile_id: string;
  shop_id: string | null;
  
  // Usage period
  usage_date: string;
  usage_month: string;
  
  // Usage counters
  shops_count: number;
  queues_count: number;
  staff_count: number;
  sms_sent_count: number;
  promotions_count: number;
  
  // Metadata
  metadata: Record<string, unknown>;
  
  created_at: string;
  updated_at: string;
}

/**
 * Feature Access database schema
 */
export interface FeatureAccessSchema {
  id: string;
  profile_id: string;
  
  // Feature details
  feature_type: 'poster_design' | 'api_access' | 'custom_branding' | 'priority_support';
  feature_id: string;
  
  // Access details
  purchased_at: string;
  expires_at: string | null;
  is_active: boolean;
  
  // Payment
  price: number | null;
  currency: string;
  
  // Metadata
  payment_provider: string | null;
  external_payment_id: string | null;
  metadata: Record<string, unknown>;
  
  created_at: string;
  updated_at: string;
}

/**
 * Subscription stats database schema
 */
export interface SubscriptionStatsSchema {
  total_plans: number;
  active_plans: number;
  total_subscriptions: number;
  active_subscriptions: number;
  free_users: number;
  pro_users: number;
  enterprise_users: number;
  monthly_revenue: number;
  yearly_revenue: number;
  total_revenue: number;
}

/**
 * Current usage stats database schema
 */
export interface CurrentUsageStatsSchema {
  profile_id: string;
  shop_id?: string;
  today_queues: number;
  current_shops: number;
  current_staff: number;
  monthly_sms_sent: number;
  active_promotions: number;
}
