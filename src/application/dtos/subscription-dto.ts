import { ProfileRoleDto } from "./profile-dto";

/**
 * Subscription tier types
 */
export type SubscriptionTier = 'free' | 'pro' | 'enterprise';

/**
 * Subscription status types
 */
export type SubscriptionStatus = 'active' | 'inactive' | 'expired' | 'cancelled';

/**
 * Billing period types
 */
export type BillingPeriod = 'monthly' | 'yearly' | 'one_time';

/**
 * Subscription limits interface
 */
export interface SubscriptionLimits {
  maxShops: number | null; // null means unlimited
  maxQueuesPerDay: number | null;
  dataRetentionMonths: number | null; // null means forever
  maxStaff: number | null;
  maxSmsPerMonth: number | null;
  maxPromotions: number | null;
  maxFreePosterDesigns: number;
  hasAdvancedReports: boolean;
  hasCustomQrCode: boolean;
  hasApiAccess: boolean;
  hasPrioritySupport: boolean;
  hasCustomBranding: boolean;
  hasAnalytics: boolean;
  hasPromotionFeatures: boolean;
}

/**
 * User subscription DTO
 */
export interface UserSubscriptionDto {
  id: string;
  profileId: string;
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  billingPeriod: BillingPeriod;
  startDate: string;
  endDate: string | null;
  autoRenew: boolean;
  limits: SubscriptionLimits;
  pricePerMonth: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Subscription upgrade options DTO
 */
export interface SubscriptionUpgradeDto {
  tier: SubscriptionTier;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  monthlyPrice: number;
  yearlyPrice: number;
  oneTimePrice: number;
  currency: string;
  limits: SubscriptionLimits;
  features: string[];
  featuresEn: string[];
  isRecommended: boolean;
  discountPercentage?: number;
}

/**
 * Shop tier assignment DTO
 */
export interface ShopTierDto {
  shopId: string;
  tier: SubscriptionTier;
  ownerId: string;
  ownerRole: ProfileRoleDto;
  limits: SubscriptionLimits;
  isActive: boolean;
  expiresAt: string | null;
}

/**
 * Usage statistics DTO
 */
export interface UsageStatsDto {
  profileId: string;
  shopId?: string;
  currentShops: number;
  todayQueues: number;
  currentStaff: number;
  monthlySmsSent: number;
  activePromotions: number;
  usedPosterDesigns: number;
  paidPosterDesigns: number;
  totalPosters: number;
  dataRetentionMonths: number;
}
