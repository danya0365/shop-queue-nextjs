import { AuthUserDto } from '@/src/application/dtos/auth-dto';
import { ProfileDto } from '@/src/application/dtos/profile-dto';
import { SubscriptionLimits, SubscriptionTier } from '@/src/application/dtos/subscription-dto';
import { SubscriptionPlanDTO } from '@/src/application/dtos/subscription/subscription-dto';
import { IAuthService } from '@/src/application/interfaces/auth-service.interface';
import { IProfileService } from '@/src/application/interfaces/profile-service.interface';
import { ISubscriptionService } from '@/src/application/services/subscription/SubscriptionService';
import type { Logger } from '@/src/domain/interfaces/logger';

/**
 * Base presenter class with common subscription-related functionality
 * Following SOLID principles and Clean Architecture
 */
export abstract class BaseSubscriptionPresenter {
  constructor(
    protected readonly logger: Logger,
    protected readonly authService: IAuthService,
    protected readonly profileService: IProfileService,
    protected readonly subscriptionService: ISubscriptionService
  ) { }

  /**
   * Get the current authenticated user
   */
  protected async getUser(): Promise<AuthUserDto | null> {
    try {
      return await this.authService.getCurrentUser();
    } catch (err) {
      this.logger.error("Error accessing authentication:", err as Error);
      return null;
    }
  }

  /**
   * Get the current active profile
   */
  protected async getActiveProfile(user: AuthUserDto): Promise<ProfileDto | null> {
    try {
      return await this.profileService.getActiveProfileByAuthId(user.id);
    } catch (err) {
      this.logger.error("Error accessing profile:", err as Error);
      return null;
    }
  }

  /**
   * Get subscription plan for a profile
   */
  protected async getSubscriptionPlan(profileId: string, role: string): Promise<SubscriptionPlanDTO> {
    try {
      return await this.subscriptionService.getSubscriptionByProfileId(profileId);
    } catch (error) {
      this.logger.warn("No active subscription found for profile, creating default plan based on role", { error, profileId });

      // Create a default subscription plan based on role
      const tier = this.getRoleBasedTier(role);
      const limits = await this.getDefaultLimitsForTier(tier);

      // Return a default subscription plan
      return {
        id: `default_${profileId}`,
        tier: tier,
        name: tier === 'free' ? 'ฟรี' : tier === 'pro' ? 'Pro' : 'Enterprise',
        nameEn: tier === 'free' ? 'Free' : tier === 'pro' ? 'Pro' : 'Enterprise',
        description: 'แผนการใช้งานตามสิทธิ์ของบทบาท',
        descriptionEn: 'Subscription plan based on role',
        monthlyPrice: tier === 'free' ? 0 : tier === 'pro' ? 299 : 999,
        yearlyPrice: tier === 'free' ? 0 : tier === 'pro' ? 2990 : 9990,
        lifetimePrice: null,
        currency: 'THB',
        maxShops: limits.maxShops,
        maxQueuesPerDay: limits.maxQueuesPerDay,
        dataRetentionMonths: limits.dataRetentionMonths,
        maxStaff: limits.maxStaff,
        maxSmsPerMonth: limits.maxSmsPerMonth,
        maxPromotions: limits.maxPromotions,
        maxFreePosterDesigns: limits.maxFreePosterDesigns,
        hasAdvancedReports: limits.hasAdvancedReports,
        hasCustomQrCode: limits.hasCustomQrCode,
        hasApiAccess: limits.hasApiAccess,
        hasPrioritySupport: limits.hasPrioritySupport,
        hasCustomBranding: limits.hasCustomBranding,
        hasAnalytics: limits.hasAnalytics,
        hasPromotionFeatures: limits.hasPromotionFeatures,
        features: [],
        featuresEn: [],
        isActive: true,
        sortOrder: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }
  }

  /**
   * Get tier based on role
   */
  protected getRoleBasedTier(role: string): SubscriptionTier {
    const roleToTierMap: Record<string, SubscriptionTier> = {
      'user': 'free',
      'moderator': 'pro',
      'admin': 'enterprise'
    };

    return roleToTierMap[role] || 'free';
  }

  /**
   * Get default limits for tier
   */
  protected async getDefaultLimitsForTier(tier: SubscriptionTier): Promise<SubscriptionLimits> {
    const limitsMap: Record<SubscriptionTier, SubscriptionLimits> = {
      free: {
        maxShops: 1,
        maxQueuesPerDay: 50,
        dataRetentionMonths: 1,
        maxStaff: 1,
        maxSmsPerMonth: 10,
        maxPromotions: 0,
        maxFreePosterDesigns: 3,
        hasAdvancedReports: false,
        hasCustomQrCode: false,
        hasApiAccess: false,
        hasPrioritySupport: false,
        hasCustomBranding: false,
        hasAnalytics: false,
        hasPromotionFeatures: false
      },
      pro: {
        maxShops: 3,
        maxQueuesPerDay: 200,
        dataRetentionMonths: 12,
        maxStaff: 5,
        maxSmsPerMonth: 100,
        maxPromotions: 10,
        maxFreePosterDesigns: 3,
        hasAdvancedReports: true,
        hasCustomQrCode: true,
        hasApiAccess: false,
        hasPrioritySupport: false,
        hasCustomBranding: false,
        hasAnalytics: true,
        hasPromotionFeatures: true
      },
      enterprise: {
        maxShops: null,
        maxQueuesPerDay: null,
        dataRetentionMonths: null,
        maxStaff: null,
        maxSmsPerMonth: null,
        maxPromotions: null,
        maxFreePosterDesigns: 3,
        hasAdvancedReports: true,
        hasCustomQrCode: true,
        hasApiAccess: true,
        hasPrioritySupport: true,
        hasCustomBranding: true,
        hasAnalytics: true,
        hasPromotionFeatures: true
      }
    };

    return limitsMap[tier];
  }

  /**
   * Map SubscriptionPlanDTO to SubscriptionLimits
   */
  protected mapSubscriptionPlanToLimits(plan: SubscriptionPlanDTO): SubscriptionLimits {
    return {
      maxShops: plan.maxShops,
      maxQueuesPerDay: plan.maxQueuesPerDay,
      dataRetentionMonths: plan.dataRetentionMonths,
      maxStaff: plan.maxStaff,
      maxSmsPerMonth: plan.maxSmsPerMonth,
      maxPromotions: plan.maxPromotions,
      maxFreePosterDesigns: plan.maxFreePosterDesigns,
      hasAdvancedReports: plan.hasAdvancedReports,
      hasCustomQrCode: plan.hasCustomQrCode,
      hasApiAccess: plan.hasApiAccess,
      hasPrioritySupport: plan.hasPrioritySupport,
      hasCustomBranding: plan.hasCustomBranding,
      hasAnalytics: plan.hasAnalytics,
      hasPromotionFeatures: plan.hasPromotionFeatures
    };
  }
}
