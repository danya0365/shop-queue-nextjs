import { PaginatedResult } from "@/src/domain/interfaces/pagination-types";

/**
 * Subscription Plan entity representing subscription tiers in the system
 * Following Clean Architecture principles - domain entity
 */
export interface SubscriptionPlanEntity {
  id: string;
  tier: SubscriptionTier;
  name: string;
  nameEn: string;
  description: string | null;
  descriptionEn: string | null;
  
  // Pricing
  monthlyPrice: number | null;
  yearlyPrice: number | null;
  lifetimePrice: number | null;
  currency: string;
  
  // Limits (null means unlimited)
  maxShops: number | null;
  maxQueuesPerDay: number | null;
  dataRetentionMonths: number | null;
  maxStaff: number | null;
  maxSmsPerMonth: number | null;
  maxPromotions: number | null;
  maxFreePosterDesigns: number;
  
  // Features
  hasAdvancedReports: boolean;
  hasCustomQrCode: boolean;
  hasApiAccess: boolean;
  hasPrioritySupport: boolean;
  hasCustomBranding: boolean;
  hasAnalytics: boolean;
  hasPromotionFeatures: boolean;
  
  // Metadata
  features: string[];
  featuresEn: string[];
  isActive: boolean;
  sortOrder: number;
  
  createdAt: string;
  updatedAt: string;
}

/**
 * Profile Subscription entity representing user's active subscription
 */
export interface ProfileSubscriptionEntity {
  id: string;
  profileId: string;
  planId: string;
  
  // Subscription details
  status: SubscriptionStatus;
  billingPeriod: BillingPeriod;
  
  // Dates
  startDate: string;
  endDate: string | null;
  trialEndDate: string | null;
  cancelledAt: string | null;
  
  // Payment
  pricePerPeriod: number;
  currency: string;
  autoRenew: boolean;
  
  // Metadata
  paymentProvider: string | null;
  externalSubscriptionId: string | null;
  metadata: Record<string, unknown>;
  
  // Joined data
  plan?: SubscriptionPlanEntity;
  profileName?: string;
  
  createdAt: string;
  updatedAt: string;
}

/**
 * Subscription Usage entity for tracking usage against limits
 */
export interface SubscriptionUsageEntity {
  id: string;
  profileId: string;
  shopId: string | null;
  
  // Usage period
  usageDate: string;
  usageMonth: string;
  
  // Usage counters
  shopsCount: number;
  queuesCount: number;
  staffCount: number;
  smsSentCount: number;
  promotionsCount: number;
  
  // Metadata
  metadata: Record<string, unknown>;
  
  createdAt: string;
  updatedAt: string;
}

/**
 * Feature Access entity for one-time purchases
 */
export interface FeatureAccessEntity {
  id: string;
  profileId: string;
  
  // Feature details
  featureType: FeatureType;
  featureId: string;
  
  // Access details
  purchasedAt: string;
  expiresAt: string | null;
  isActive: boolean;
  
  // Payment
  price: number | null;
  currency: string;
  
  // Metadata
  paymentProvider: string | null;
  externalPaymentId: string | null;
  metadata: Record<string, unknown>;
  
  createdAt: string;
  updatedAt: string;
}

/**
 * Create subscription plan entity
 */
export interface CreateSubscriptionPlanEntity {
  tier: SubscriptionTier;
  name: string;
  nameEn: string;
  description?: string;
  descriptionEn?: string;
  monthlyPrice?: number;
  yearlyPrice?: number;
  lifetimePrice?: number;
  currency?: string;
  maxShops?: number;
  maxQueuesPerDay?: number;
  dataRetentionMonths?: number;
  maxStaff?: number;
  maxSmsPerMonth?: number;
  maxPromotions?: number;
  maxFreePosterDesigns?: number;
  hasAdvancedReports?: boolean;
  hasCustomQrCode?: boolean;
  hasApiAccess?: boolean;
  hasPrioritySupport?: boolean;
  hasCustomBranding?: boolean;
  hasAnalytics?: boolean;
  hasPromotionFeatures?: boolean;
  features?: string[];
  featuresEn?: string[];
  isActive?: boolean;
  sortOrder?: number;
}

/**
 * Update subscription plan entity
 */
export interface UpdateSubscriptionPlanEntity {
  name?: string;
  nameEn?: string;
  description?: string;
  descriptionEn?: string;
  monthlyPrice?: number;
  yearlyPrice?: number;
  lifetimePrice?: number;
  currency?: string;
  maxShops?: number;
  maxQueuesPerDay?: number;
  dataRetentionMonths?: number;
  maxStaff?: number;
  maxSmsPerMonth?: number;
  maxPromotions?: number;
  maxFreePosterDesigns?: number;
  hasAdvancedReports?: boolean;
  hasCustomQrCode?: boolean;
  hasApiAccess?: boolean;
  hasPrioritySupport?: boolean;
  hasCustomBranding?: boolean;
  hasAnalytics?: boolean;
  hasPromotionFeatures?: boolean;
  features?: string[];
  featuresEn?: string[];
  isActive?: boolean;
  sortOrder?: number;
}

/**
 * Create profile subscription entity
 */
export interface CreateProfileSubscriptionEntity {
  profileId: string;
  planId: string;
  status?: SubscriptionStatus;
  billingPeriod: BillingPeriod;
  startDate?: string;
  endDate?: string;
  trialEndDate?: string;
  pricePerPeriod: number;
  currency?: string;
  autoRenew?: boolean;
  paymentProvider?: string;
  externalSubscriptionId?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Update profile subscription entity
 */
export interface UpdateProfileSubscriptionEntity {
  planId?: string;
  status?: SubscriptionStatus;
  billingPeriod?: BillingPeriod;
  endDate?: string;
  trialEndDate?: string;
  cancelledAt?: string;
  pricePerPeriod?: number;
  currency?: string;
  autoRenew?: boolean;
  paymentProvider?: string;
  externalSubscriptionId?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Subscription tier enum
 */
export enum SubscriptionTier {
  FREE = 'free',
  PRO = 'pro',
  ENTERPRISE = 'enterprise'
}

/**
 * Subscription status enum
 */
export enum SubscriptionStatus {
  ACTIVE = 'active',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
  PENDING = 'pending',
  SUSPENDED = 'suspended'
}

/**
 * Billing period enum
 */
export enum BillingPeriod {
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
  LIFETIME = 'lifetime'
}

/**
 * Feature type enum
 */
export enum FeatureType {
  POSTER_DESIGN = 'poster_design',
  API_ACCESS = 'api_access',
  CUSTOM_BRANDING = 'custom_branding',
  PRIORITY_SUPPORT = 'priority_support'
}

/**
 * Subscription statistics entity
 */
export interface SubscriptionStatsEntity {
  totalPlans: number;
  activePlans: number;
  totalSubscriptions: number;
  activeSubscriptions: number;
  freeUsers: number;
  proUsers: number;
  enterpriseUsers: number;
  monthlyRevenue: number;
  yearlyRevenue: number;
  totalRevenue: number;
}

/**
 * Current usage statistics entity
 */
export interface CurrentUsageStatsEntity {
  profileId: string;
  shopId?: string;
  todayQueues: number;
  currentShops: number;
  currentStaff: number;
  monthlySmsSent: number;
  activePromotions: number;
}

/**
 * Paginated subscription plans result
 */
export type PaginatedSubscriptionPlansEntity = PaginatedResult<SubscriptionPlanEntity>;

/**
 * Paginated profile subscriptions result
 */
export type PaginatedProfileSubscriptionsEntity = PaginatedResult<ProfileSubscriptionEntity>;

/**
 * Paginated subscription usage result
 */
export type PaginatedSubscriptionUsageEntity = PaginatedResult<SubscriptionUsageEntity>;

/**
 * Paginated feature access result
 */
export type PaginatedFeatureAccessEntity = PaginatedResult<FeatureAccessEntity>;
