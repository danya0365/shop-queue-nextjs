/**
 * Pricing plan types
 */
export type PlanType = 'free' | 'pro' | 'enterprise';

/**
 * Feature limitation interface
 */
export interface PlanLimits {
  maxShops: number | null; // null means unlimited
  maxQueuesPerDay: number | null;
  dataRetentionMonths: number | null; // null means forever
  maxStaff: number | null;
  maxSmsPerMonth: number | null;
  maxPromotions: number | null;
  hasAdvancedReports: boolean;
  hasCustomQrCode: boolean;
  hasApiAccess: boolean;
  hasPrioritySupport: boolean;
  hasCustomBranding: boolean;
}

/**
 * Pricing plan DTO
 */
export interface PricingPlanDto {
  id: string;
  type: PlanType;
  name: string;
  nameEn: string;
  price: number; // in THB, 0 for free
  currency: string;
  billingPeriod: 'monthly' | 'yearly';
  description: string;
  descriptionEn: string;
  features: string[];
  featuresEn: string[];
  limits: PlanLimits;
  isPopular: boolean;
  isRecommended: boolean;
  buttonText: string;
  buttonTextEn: string;
}

/**
 * Pricing comparison DTO
 */
export interface PricingComparisonDto {
  plans: PricingPlanDto[];
  comparisonFeatures: {
    category: string;
    categoryEn: string;
    features: {
      name: string;
      nameEn: string;
      free: string | boolean;
      pro: string | boolean;
      enterprise: string | boolean;
    }[];
  }[];
}
