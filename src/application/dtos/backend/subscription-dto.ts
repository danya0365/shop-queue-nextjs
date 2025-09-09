import { PaginationMeta } from "@/src/domain/interfaces/pagination-types";

/**
 * Subscription Plan DTOs
 */
export interface SubscriptionPlanDTO {
  id: string;
  tier: 'free' | 'pro' | 'enterprise';
  name: string;
  nameEn: string;
  description: string | null;
  descriptionEn: string | null;
  
  // Pricing
  monthlyPrice: number | null;
  yearlyPrice: number | null;
  lifetimePrice: number | null;
  currency: string;
  
  // Limits
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

export interface CreateSubscriptionPlanInputDTO {
  tier: 'free' | 'pro' | 'enterprise';
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

export interface UpdateSubscriptionPlanInputDTO {
  id: string;
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

export interface GetSubscriptionPlansPaginatedInputDTO {
  page?: number;
  limit?: number;
}

export interface PaginatedSubscriptionPlansDTO {
  data: SubscriptionPlanDTO[];
  pagination: PaginationMeta;
}

export interface SubscriptionStatsDTO {
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
 * Profile Subscription DTOs
 */
export interface ProfileSubscriptionDTO {
  id: string;
  profileId: string;
  planId: string;
  
  // Subscription details
  status: 'active' | 'cancelled' | 'expired' | 'pending' | 'suspended';
  billingPeriod: 'monthly' | 'yearly' | 'lifetime';
  
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
  plan?: SubscriptionPlanDTO;
  profileName?: string;
  
  createdAt: string;
  updatedAt: string;
}

export interface CreateProfileSubscriptionInputDTO {
  profileId: string;
  planId: string;
  billingPeriod: 'monthly' | 'yearly' | 'lifetime';
  pricePerPeriod: number;
  status?: 'active' | 'cancelled' | 'expired' | 'pending' | 'suspended';
  startDate?: string;
  endDate?: string;
  trialEndDate?: string;
  currency?: string;
  autoRenew?: boolean;
  paymentProvider?: string;
  externalSubscriptionId?: string;
  metadata?: Record<string, unknown>;
}

export interface UpdateProfileSubscriptionInputDTO {
  id: string;
  planId?: string;
  status?: 'active' | 'cancelled' | 'expired' | 'pending' | 'suspended';
  billingPeriod?: 'monthly' | 'yearly' | 'lifetime';
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

export interface GetProfileSubscriptionsPaginatedInputDTO {
  page?: number;
  limit?: number;
  profileId?: string;
}

export interface PaginatedProfileSubscriptionsDTO {
  data: ProfileSubscriptionDTO[];
  pagination: PaginationMeta;
}

/**
 * Subscription Usage DTOs
 */
export interface SubscriptionUsageDTO {
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

export interface GetSubscriptionUsagePaginatedInputDTO {
  page?: number;
  limit?: number;
  profileId?: string;
  shopId?: string;
}

export interface PaginatedSubscriptionUsageDTO {
  data: SubscriptionUsageDTO[];
  pagination: PaginationMeta;
}

export interface CurrentUsageStatsDTO {
  profileId: string;
  shopId?: string;
  todayQueues: number;
  currentShops: number;
  currentStaff: number;
  monthlySmsSent: number;
  activePromotions: number;
}

export interface RecordUsageInputDTO {
  profileId: string;
  shopId?: string;
  usageType: string;
  count: number;
}

export interface CanPerformActionInputDTO {
  profileId: string;
  action: string;
  shopId?: string;
}

/**
 * Feature Access DTOs
 */
export interface FeatureAccessDTO {
  id: string;
  profileId: string;
  
  // Feature details
  featureType: 'poster_design' | 'api_access' | 'custom_branding' | 'priority_support';
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

export interface GrantFeatureAccessInputDTO {
  profileId: string;
  featureType: 'poster_design' | 'api_access' | 'custom_branding' | 'priority_support';
  featureId: string;
  price?: number;
  expiresAt?: string;
  paymentProvider?: string;
  externalPaymentId?: string;
  metadata?: Record<string, unknown>;
}

export interface HasFeatureAccessInputDTO {
  profileId: string;
  featureType: 'poster_design' | 'api_access' | 'custom_branding' | 'priority_support';
  featureId: string;
}

export interface RevokeFeatureAccessInputDTO {
  profileId: string;
  featureType: 'poster_design' | 'api_access' | 'custom_branding' | 'priority_support';
  featureId: string;
}

export interface GetFeatureAccessPaginatedInputDTO {
  page?: number;
  limit?: number;
  profileId?: string;
  featureType?: 'poster_design' | 'api_access' | 'custom_branding' | 'priority_support';
}

export interface PaginatedFeatureAccessDTO {
  data: FeatureAccessDTO[];
  pagination: PaginationMeta;
}
