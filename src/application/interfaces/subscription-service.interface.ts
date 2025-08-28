import { ProfileRoleDto } from '../dtos/profile-dto';
import type { ShopTierDto, SubscriptionLimits, SubscriptionTier, SubscriptionUpgradeDto, UsageStatsDto, UserSubscriptionDto } from '../dtos/subscription-dto';

/**
 * Subscription service interface
 */
export interface ISubscriptionService {
  /**
   * Get subscription tier based on profile role
   */
  getTierByRole(role: ProfileRoleDto): SubscriptionTier;

  /**
   * Get subscription limits for a tier
   */
  getLimitsByTier(tier: SubscriptionTier): Promise<SubscriptionLimits>;

  /**
   * Get user's current subscription
   */
  getUserSubscription(profileId: string): Promise<UserSubscriptionDto | null>;

  /**
   * Get shop tier assignment
   */
  getShopTier(shopId: string): Promise<ShopTierDto | null>;

  /**
   * Get usage statistics for a profile/shop
   */
  getUsageStats(profileId: string, shopId?: string): Promise<UsageStatsDto>;

  /**
   * Get available upgrade options
   */
  getUpgradeOptions(currentTier: SubscriptionTier): Promise<SubscriptionUpgradeDto[]>;

  /**
   * Check if user can perform action based on limits
   */
  canPerformAction(profileId: string, action: string, shopId?: string): Promise<boolean>;

  /**
   * Upgrade subscription
   */
  upgradeSubscription(profileId: string, tier: SubscriptionTier, billingPeriod: 'monthly' | 'yearly'): Promise<UserSubscriptionDto>;

  /**
   * Purchase one-time access
   */
  purchaseOneTimeAccess(profileId: string, feature: string, duration: number): Promise<boolean>;

  /**
   * Purchase poster design
   */
  purchasePosterDesign(profileId: string, posterId: string): Promise<boolean>;

  /**
   * Check if poster is accessible
   */
  isPosterAccessible(profileId: string, posterId: string): Promise<boolean>;
}
