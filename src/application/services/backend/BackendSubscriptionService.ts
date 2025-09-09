import type { IUseCase } from '@/src/application/interfaces/use-case.interface';
import type { Logger } from '@/src/domain/interfaces/logger';
import type {
  BackendFeatureAccessRepository,
  BackendProfileSubscriptionRepository,
  BackendSubscriptionPlanRepository,
  BackendSubscriptionUsageRepository
} from '@/src/domain/repositories/backend/backend-subscription-repository';

// Subscription Plan Use Cases
import { CreateSubscriptionPlanUseCase } from '@/src/application/usecases/backend/subscription-plans/CreateSubscriptionPlanUseCase';
import { DeleteSubscriptionPlanUseCase } from '@/src/application/usecases/backend/subscription-plans/DeleteSubscriptionPlanUseCase';
import { GetSubscriptionPlanByIdUseCase } from '@/src/application/usecases/backend/subscription-plans/GetSubscriptionPlanByIdUseCase';
import { GetSubscriptionPlansPaginatedUseCase } from '@/src/application/usecases/backend/subscription-plans/GetSubscriptionPlansPaginatedUseCase';
import { GetSubscriptionStatsUseCase } from '@/src/application/usecases/backend/subscription-plans/GetSubscriptionStatsUseCase';
import { UpdateSubscriptionPlanUseCase } from '@/src/application/usecases/backend/subscription-plans/UpdateSubscriptionPlanUseCase';

// Profile Subscription Use Cases
import { CreateProfileSubscriptionUseCase } from '@/src/application/usecases/backend/profile-subscriptions/CreateProfileSubscriptionUseCase';
import { DeleteProfileSubscriptionUseCase } from '@/src/application/usecases/backend/profile-subscriptions/DeleteProfileSubscriptionUseCase';
import { GetProfileSubscriptionByIdUseCase } from '@/src/application/usecases/backend/profile-subscriptions/GetProfileSubscriptionByIdUseCase';
import { GetProfileSubscriptionsPaginatedUseCase } from '@/src/application/usecases/backend/profile-subscriptions/GetProfileSubscriptionsPaginatedUseCase';
import { UpdateProfileSubscriptionUseCase } from '@/src/application/usecases/backend/profile-subscriptions/UpdateProfileSubscriptionUseCase';

// Subscription Usage Use Cases
import { CanPerformActionUseCase } from '@/src/application/usecases/backend/subscription-usage/CanPerformActionUseCase';
import { GetCurrentUsageStatsUseCase } from '@/src/application/usecases/backend/subscription-usage/GetCurrentUsageStatsUseCase';
import { GetSubscriptionUsagePaginatedUseCase } from '@/src/application/usecases/backend/subscription-usage/GetSubscriptionUsagePaginatedUseCase';
import { RecordUsageUseCase } from '@/src/application/usecases/backend/subscription-usage/RecordUsageUseCase';

// Feature Access Use Cases
import { GetFeatureAccessPaginatedUseCase } from '@/src/application/usecases/backend/feature-access/GetFeatureAccessPaginatedUseCase';
import { GrantFeatureAccessUseCase } from '@/src/application/usecases/backend/feature-access/GrantFeatureAccessUseCase';
import { HasFeatureAccessUseCase } from '@/src/application/usecases/backend/feature-access/HasFeatureAccessUseCase';
import { RevokeFeatureAccessUseCase } from '@/src/application/usecases/backend/feature-access/RevokeFeatureAccessUseCase';

import type {
  CanPerformActionInputDTO,
  // Profile Subscriptions
  CreateProfileSubscriptionInputDTO,
  // Subscription Plans
  CreateSubscriptionPlanInputDTO,
  CurrentUsageStatsDTO,
  FeatureAccessDTO,
  GetFeatureAccessPaginatedInputDTO,
  GetProfileSubscriptionsPaginatedInputDTO,
  GetSubscriptionPlansPaginatedInputDTO,
  // Subscription Usage
  GetSubscriptionUsagePaginatedInputDTO,
  // Feature Access
  GrantFeatureAccessInputDTO,
  HasFeatureAccessInputDTO,
  PaginatedFeatureAccessDTO,
  PaginatedProfileSubscriptionsDTO,
  PaginatedSubscriptionPlansDTO,
  PaginatedSubscriptionUsageDTO,
  ProfileSubscriptionDTO,
  RecordUsageInputDTO,
  RevokeFeatureAccessInputDTO,
  SubscriptionPlanDTO,
  SubscriptionStatsDTO,
  UpdateProfileSubscriptionInputDTO,
  UpdateSubscriptionPlanInputDTO
} from '@/src/application/dtos/backend/subscription-dto';

// Import legacy DTOs for compatibility
import type {
  SubscriptionLimits,
  SubscriptionTier,
  SubscriptionUpgradeDto,
  UsageStatsDto,
  UserSubscriptionDto
} from '@/src/application/dtos/subscription-dto';

/**
 * Interface for Backend Subscription Service
 * Following Clean Architecture and SOLID principles
 */
export interface ISubscriptionBackendSubscriptionService {
  // Subscription Plans
  getSubscriptionPlansPaginated(page?: number, perPage?: number): Promise<PaginatedSubscriptionPlansDTO>;
  getSubscriptionStats(): Promise<SubscriptionStatsDTO>;
  getSubscriptionPlanById(id: string): Promise<SubscriptionPlanDTO>;
  createSubscriptionPlan(params: CreateSubscriptionPlanInputDTO): Promise<SubscriptionPlanDTO>;
  updateSubscriptionPlan(params: UpdateSubscriptionPlanInputDTO): Promise<SubscriptionPlanDTO>;
  deleteSubscriptionPlan(id: string): Promise<boolean>;

  // Profile Subscriptions - Internal use only, should not be exposed to business logic
  /** @deprecated Use getUserSubscription() instead for business logic */
  getProfileSubscriptionsPaginated(page?: number, perPage?: number, profileId?: string): Promise<PaginatedProfileSubscriptionsDTO>;
  /** @deprecated Internal use only - should not be used directly in business logic */
  getProfileSubscriptionById(id: string): Promise<ProfileSubscriptionDTO>;
  /** @deprecated Use upgradeSubscription() instead for business logic */
  createProfileSubscription(params: CreateProfileSubscriptionInputDTO): Promise<ProfileSubscriptionDTO>;
  /** @deprecated Internal use only - should not be used directly in business logic */
  updateProfileSubscription(params: UpdateProfileSubscriptionInputDTO): Promise<ProfileSubscriptionDTO>;
  /** @deprecated Internal use only - should not be used directly in business logic */
  deleteProfileSubscription(id: string): Promise<boolean>;

  // Subscription Usage - Mixed: some for internal use, some for business logic
  /** @deprecated Use getUsageStats() instead for business logic */
  getCurrentUsageStats(profileId: string): Promise<CurrentUsageStatsDTO>;
  /** @deprecated Should be handled automatically by system events */
  recordUsage(params: RecordUsageInputDTO): Promise<boolean>;
  /** @deprecated Use canPerformActionByLimits() instead for better API */
  canPerformAction(params: CanPerformActionInputDTO): Promise<boolean>;
  /** @deprecated Admin-only feature, should be in separate admin service */
  getSubscriptionUsagePaginated(page?: number, perPage?: number, profileId?: string, shopId?: string): Promise<PaginatedSubscriptionUsageDTO>;

  // Feature Access - Mixed: some for business logic, some for internal use
  /** @deprecated Use purchaseOneTimeAccess() or purchasePosterDesign() instead */
  grantFeatureAccess(params: GrantFeatureAccessInputDTO): Promise<FeatureAccessDTO>;
  hasFeatureAccess(params: HasFeatureAccessInputDTO): Promise<boolean>; // Keep - used in business logic
  /** @deprecated Should be handled by subscription expiry or admin actions */
  revokeFeatureAccess(params: RevokeFeatureAccessInputDTO): Promise<boolean>;
  /** @deprecated Admin-only feature, should be in separate admin service */
  getFeatureAccessPaginated(page?: number, perPage?: number, profileId?: string, featureType?: string): Promise<PaginatedFeatureAccessDTO>;

  // Legacy compatibility methods
  getTierByProfile(profileId: string): Promise<SubscriptionTier>;
  getLimitsByTier(tier: SubscriptionTier): Promise<SubscriptionLimits>;
  getUsageStats(profileId: string, shopId?: string): Promise<UsageStatsDto>;

  // Additional subscription management methods
  getUserSubscription(profileId: string): Promise<UserSubscriptionDto | null>;
  getUpgradeOptions(currentTier: SubscriptionTier): Promise<SubscriptionUpgradeDto[]>;
  canPerformActionByLimits(profileId: string, action: string, shopId?: string): Promise<boolean>;
  upgradeSubscription(profileId: string, tier: SubscriptionTier, billingPeriod: 'monthly' | 'yearly'): Promise<UserSubscriptionDto>;
  purchaseOneTimeAccess(profileId: string, feature: string, duration: number): Promise<boolean>;
  purchasePosterDesign(profileId: string, posterId: string): Promise<boolean>;
  isPosterAccessible(profileId: string, posterId: string): Promise<boolean>;
}

/**
 * Backend Subscription Service Implementation
 * Orchestrates subscription-related use cases following Clean Architecture
 */
export class SubscriptionBackendSubscriptionService implements ISubscriptionBackendSubscriptionService {
  constructor(
    // Subscription Plan Use Cases
    private readonly getSubscriptionPlansPaginatedUseCase: IUseCase<GetSubscriptionPlansPaginatedInputDTO, PaginatedSubscriptionPlansDTO>,
    private readonly getSubscriptionStatsUseCase: IUseCase<void, SubscriptionStatsDTO>,
    private readonly getSubscriptionPlanByIdUseCase: IUseCase<string, SubscriptionPlanDTO>,
    private readonly createSubscriptionPlanUseCase: IUseCase<CreateSubscriptionPlanInputDTO, SubscriptionPlanDTO>,
    private readonly updateSubscriptionPlanUseCase: IUseCase<UpdateSubscriptionPlanInputDTO, SubscriptionPlanDTO>,
    private readonly deleteSubscriptionPlanUseCase: IUseCase<string, boolean>,

    // Profile Subscription Use Cases
    private readonly getProfileSubscriptionsPaginatedUseCase: IUseCase<GetProfileSubscriptionsPaginatedInputDTO, PaginatedProfileSubscriptionsDTO>,
    private readonly getProfileSubscriptionByIdUseCase: IUseCase<string, ProfileSubscriptionDTO>,
    private readonly createProfileSubscriptionUseCase: IUseCase<CreateProfileSubscriptionInputDTO, ProfileSubscriptionDTO>,
    private readonly updateProfileSubscriptionUseCase: IUseCase<UpdateProfileSubscriptionInputDTO, ProfileSubscriptionDTO>,
    private readonly deleteProfileSubscriptionUseCase: IUseCase<string, boolean>,

    // Subscription Usage Use Cases
    private readonly getCurrentUsageStatsUseCase: IUseCase<string, CurrentUsageStatsDTO>,
    private readonly recordUsageUseCase: IUseCase<RecordUsageInputDTO, boolean>,
    private readonly canPerformActionUseCase: IUseCase<CanPerformActionInputDTO, boolean>,
    private readonly getSubscriptionUsagePaginatedUseCase: IUseCase<GetSubscriptionUsagePaginatedInputDTO, PaginatedSubscriptionUsageDTO>,

    // Feature Access Use Cases
    private readonly grantFeatureAccessUseCase: IUseCase<GrantFeatureAccessInputDTO, FeatureAccessDTO>,
    private readonly hasFeatureAccessUseCase: IUseCase<HasFeatureAccessInputDTO, boolean>,
    private readonly revokeFeatureAccessUseCase: IUseCase<RevokeFeatureAccessInputDTO, boolean>,
    private readonly getFeatureAccessPaginatedUseCase: IUseCase<GetFeatureAccessPaginatedInputDTO, PaginatedFeatureAccessDTO>,

    private readonly logger: Logger
  ) { }

  // ===== Subscription Plans =====

  /**
   * Get paginated subscription plans
   * Default page size can be configured via environment or database settings
   */
  async getSubscriptionPlansPaginated(page: number = 1, perPage: number = 20): Promise<PaginatedSubscriptionPlansDTO> {
    try {
      this.logger.info('Getting paginated subscription plans', { page, perPage });

      const result = await this.getSubscriptionPlansPaginatedUseCase.execute({ page, limit: perPage });
      return result;
    } catch (error) {
      this.logger.error('Error getting paginated subscription plans', { error, page, perPage });
      throw error;
    }
  }

  /**
   * Get subscription statistics
   */
  async getSubscriptionStats(): Promise<SubscriptionStatsDTO> {
    try {
      this.logger.info('Getting subscription statistics');

      const result = await this.getSubscriptionStatsUseCase.execute();
      return result;
    } catch (error) {
      this.logger.error('Error getting subscription statistics', { error });
      throw error;
    }
  }

  /**
   * Get subscription plan by ID
   */
  async getSubscriptionPlanById(id: string): Promise<SubscriptionPlanDTO> {
    try {
      this.logger.info('Getting subscription plan by ID', { id });

      const result = await this.getSubscriptionPlanByIdUseCase.execute(id);
      return result;
    } catch (error) {
      this.logger.error('Error getting subscription plan by ID', { error, id });
      throw error;
    }
  }

  /**
   * Create subscription plan
   */
  async createSubscriptionPlan(params: CreateSubscriptionPlanInputDTO): Promise<SubscriptionPlanDTO> {
    try {
      this.logger.info('Creating subscription plan', {
        params: {
          ...params,
          // Log key fields without sensitive data
          tier: params.tier,
          name: params.name,
          monthlyPrice: params.monthlyPrice,
          yearlyPrice: params.yearlyPrice
        }
      });

      const result = await this.createSubscriptionPlanUseCase.execute(params);
      return result;
    } catch (error) {
      this.logger.error('Error creating subscription plan', {
        error,
        params: {
          tier: params.tier,
          name: params.name
        }
      });
      throw error;
    }
  }

  /**
   * Update subscription plan
   */
  async updateSubscriptionPlan(params: UpdateSubscriptionPlanInputDTO): Promise<SubscriptionPlanDTO> {
    try {
      this.logger.info('Updating subscription plan', {
        params: {
          id: params.id,
          name: params.name,
          monthlyPrice: params.monthlyPrice,
          yearlyPrice: params.yearlyPrice
        }
      });

      const result = await this.updateSubscriptionPlanUseCase.execute(params);
      return result;
    } catch (error) {
      this.logger.error('Error updating subscription plan', {
        error,
        params: {
          id: params.id,
          name: params.name
        }
      });
      throw error;
    }
  }

  /**
   * Delete subscription plan
   */
  async deleteSubscriptionPlan(id: string): Promise<boolean> {
    try {
      this.logger.info('Deleting subscription plan', { id });

      const result = await this.deleteSubscriptionPlanUseCase.execute(id);
      return result;
    } catch (error) {
      this.logger.error('Error deleting subscription plan', { error, id });
      throw error;
    }
  }

  // ===== Profile Subscriptions =====

  /**
   * Get paginated profile subscriptions
   * @deprecated Use getUserSubscription() instead for business logic
   * This method exposes internal data structure and should only be used internally
   * Default page size can be configured via environment or database settings
   */
  async getProfileSubscriptionsPaginated(page: number = 1, perPage: number = 20, profileId?: string): Promise<PaginatedProfileSubscriptionsDTO> {
    try {
      this.logger.info('Getting paginated profile subscriptions', { page, perPage, profileId });

      const result = await this.getProfileSubscriptionsPaginatedUseCase.execute({ page, limit: perPage, profileId });
      return result;
    } catch (error) {
      this.logger.error('Error getting paginated profile subscriptions', { error, page, perPage, profileId });
      throw error;
    }
  }

  /**
   * Get profile subscription by ID
   * @deprecated Internal use only - should not be used directly in business logic
   * Use getUserSubscription() for business needs
   */
  async getProfileSubscriptionById(id: string): Promise<ProfileSubscriptionDTO> {
    try {
      this.logger.info('Getting profile subscription by ID', { id });

      const result = await this.getProfileSubscriptionByIdUseCase.execute(id);
      return result;
    } catch (error) {
      this.logger.error('Error getting profile subscription by ID', { error, id });
      throw error;
    }
  }

  /**
   * Create profile subscription
   * @deprecated Use upgradeSubscription() instead for business logic
   * This method is too low-level and doesn't handle business rules
   */
  async createProfileSubscription(params: CreateProfileSubscriptionInputDTO): Promise<ProfileSubscriptionDTO> {
    try {
      this.logger.info('Creating profile subscription', {
        params: {
          profileId: params.profileId,
          planId: params.planId,
          billingPeriod: params.billingPeriod,
          pricePerPeriod: params.pricePerPeriod
        }
      });

      const result = await this.createProfileSubscriptionUseCase.execute(params);
      return result;
    } catch (error) {
      this.logger.error('Error creating profile subscription', {
        error,
        params: {
          profileId: params.profileId,
          planId: params.planId,
          billingPeriod: params.billingPeriod
        }
      });
      throw error;
    }
  }

  /**
   * Update profile subscription
   * @deprecated Internal use only - should not be used directly in business logic
   * Subscription updates should go through proper business logic methods
   */
  async updateProfileSubscription(params: UpdateProfileSubscriptionInputDTO): Promise<ProfileSubscriptionDTO> {
    try {
      this.logger.info('Updating profile subscription', {
        params: {
          id: params.id,
          planId: params.planId,
          status: params.status,
          billingPeriod: params.billingPeriod
        }
      });

      const result = await this.updateProfileSubscriptionUseCase.execute(params);
      return result;
    } catch (error) {
      this.logger.error('Error updating profile subscription', {
        error,
        params: {
          id: params.id,
          status: params.status
        }
      });
      throw error;
    }
  }

  /**
   * Delete profile subscription
   * @deprecated Internal use only - should not be used directly in business logic
   * Subscription cancellation should go through proper business logic
   */
  async deleteProfileSubscription(id: string): Promise<boolean> {
    try {
      this.logger.info('Deleting profile subscription', { id });

      const result = await this.deleteProfileSubscriptionUseCase.execute(id);
      return result;
    } catch (error) {
      this.logger.error('Error deleting profile subscription', { error, id });
      throw error;
    }
  }

  // ===== Subscription Usage =====

  /**
   * Get current usage statistics for a profile
   * @deprecated Use getUsageStats() instead for business logic
   * This method returns internal DTO format, not business-friendly format
   */
  async getCurrentUsageStats(profileId: string): Promise<CurrentUsageStatsDTO> {
    try {
      this.logger.info('Getting current usage stats', { profileId });

      const result = await this.getCurrentUsageStatsUseCase.execute(profileId);
      return result;
    } catch (error) {
      this.logger.error('Error getting current usage stats', { error, profileId });
      throw error;
    }
  }

  /**
   * Record usage for a profile
   * @deprecated Should be handled automatically by system events
   * Manual usage recording can lead to inconsistencies
   */
  async recordUsage(params: RecordUsageInputDTO): Promise<boolean> {
    try {
      this.logger.info('Recording usage', {
        params: {
          profileId: params.profileId,
          usageType: params.usageType,
          count: params.count,
          shopId: params.shopId
        }
      });

      const result = await this.recordUsageUseCase.execute(params);
      return result;
    } catch (error) {
      this.logger.error('Error recording usage', { error, params });
      throw error;
    }
  }

  /**
   * Check if profile can perform an action
   * @deprecated Use canPerformActionByLimits() instead for better API
   * This method uses complex DTO input, the new method has simpler parameters
   */
  async canPerformAction(params: CanPerformActionInputDTO): Promise<boolean> {
    try {
      this.logger.info('Checking if action can be performed', {
        params: {
          profileId: params.profileId,
          action: params.action,
          shopId: params.shopId
        }
      });

      const result = await this.canPerformActionUseCase.execute(params);
      return result;
    } catch (error) {
      this.logger.error('Error checking if action can be performed', { error, params });
      throw error;
    }
  }

  /**
   * Get paginated subscription usage
   * @deprecated Admin-only feature, should be in separate admin service
   * This creates unnecessary coupling in business service
   * Default page size can be configured via environment or database settings
   */
  async getSubscriptionUsagePaginated(page: number = 1, perPage: number = 20, profileId?: string, shopId?: string): Promise<PaginatedSubscriptionUsageDTO> {
    try {
      this.logger.info('Getting paginated subscription usage', { page, perPage, profileId, shopId });

      const result = await this.getSubscriptionUsagePaginatedUseCase.execute({ page, limit: perPage, profileId, shopId });
      return result;
    } catch (error) {
      this.logger.error('Error getting paginated subscription usage', { error, page, perPage, profileId, shopId });
      throw error;
    }
  }

  // ===== Feature Access =====

  /**
   * Grant feature access to a profile
   * @deprecated Use purchaseOneTimeAccess() or purchasePosterDesign() instead
   * This method is too low-level and doesn't handle payment logic
   */
  async grantFeatureAccess(params: GrantFeatureAccessInputDTO): Promise<FeatureAccessDTO> {
    try {
      this.logger.info('Granting feature access', {
        params: {
          profileId: params.profileId,
          featureType: params.featureType,
          featureId: params.featureId,
          price: params.price
        }
      });

      const result = await this.grantFeatureAccessUseCase.execute(params);
      return result;
    } catch (error) {
      this.logger.error('Error granting feature access', { error, params });
      throw error;
    }
  }

  /**
   * Check if profile has feature access
   */
  async hasFeatureAccess(params: HasFeatureAccessInputDTO): Promise<boolean> {
    try {
      this.logger.info('Checking feature access', {
        params: {
          profileId: params.profileId,
          featureType: params.featureType,
          featureId: params.featureId
        }
      });

      const result = await this.hasFeatureAccessUseCase.execute(params);
      return result;
    } catch (error) {
      this.logger.error('Error checking feature access', { error, params });
      throw error;
    }
  }

  /**
   * Revoke feature access from a profile
   * @deprecated Should be handled by subscription expiry or admin actions
   * Manual revocation can lead to business logic inconsistencies
   */
  async revokeFeatureAccess(params: RevokeFeatureAccessInputDTO): Promise<boolean> {
    try {
      this.logger.info('Revoking feature access', {
        params: {
          profileId: params.profileId,
          featureType: params.featureType,
          featureId: params.featureId
        }
      });

      const result = await this.revokeFeatureAccessUseCase.execute(params);
      return result;
    } catch (error) {
      this.logger.error('Error revoking feature access', { error, params });
      throw error;
    }
  }

  /**
   * Get paginated feature access
   * @deprecated Admin-only feature, should be in separate admin service
   * This creates unnecessary coupling in business service
   * Default page size can be configured via environment or database settings
   */
  async getFeatureAccessPaginated(page: number = 1, perPage: number = 20, profileId?: string, featureType?: string): Promise<PaginatedFeatureAccessDTO> {
    try {
      this.logger.info('Getting paginated feature access', { page, perPage, profileId, featureType });

      const result = await this.getFeatureAccessPaginatedUseCase.execute({
        page,
        limit: perPage,
        profileId,
        featureType: featureType as 'poster_design' | 'api_access' | 'custom_branding' | 'priority_support' | undefined
      });
      return result;
    } catch (error) {
      this.logger.error('Error getting paginated feature access', { error, page, perPage, profileId, featureType });
      throw error;
    }
  }

  // ===== Legacy Compatibility Methods =====

  /**
   * Get subscription tier based on profile
   * This replaces the role-based tier assignment with actual profile subscription data
   */
  async getTierByProfile(profileId: string): Promise<SubscriptionTier> {
    try {
      this.logger.info('Getting tier by profile', { profileId });

      // Get active subscription for the profile
      const subscriptions = await this.getProfileSubscriptionsPaginated(1, 1, profileId);

      if (subscriptions.data.length > 0) {
        const activeSubscription = subscriptions.data.find(sub => sub.status === 'active');
        if (activeSubscription) {
          // Get the plan details to determine tier
          const plan = await this.getSubscriptionPlanById(activeSubscription.planId);
          return plan.tier as SubscriptionTier;
        }
      }

      // Default to free tier if no active subscription
      return 'free';
    } catch (error) {
      this.logger.error('Error getting tier by profile', { error, profileId });
      // Return free tier as fallback
      return 'free';
    }
  }

  /**
   * Get subscription limits for a tier
   * Now retrieves data from database instead of hardcoded values
   */
  async getLimitsByTier(tier: SubscriptionTier): Promise<SubscriptionLimits> {
    try {
      this.logger.info('Getting limits by tier from database', { tier });

      // Get subscription plans with the specified tier
      const plans = await this.getSubscriptionPlansPaginated(1, 1);
      const plan = plans.data.find(p => p.tier === tier);

      if (!plan) {
        this.logger.warn('No subscription plan found for tier, using fallback', { tier });
        // Fallback to free tier limits if plan not found
        return {
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
        };
      }

      // Map database fields to SubscriptionLimits interface
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
    } catch (error) {
      this.logger.error('Error getting limits by tier from database', { error, tier });
      throw error;
    }
  }

  /**
   * Get usage statistics for a profile
   * Now retrieves data retention from user's subscription plan
   */
  async getUsageStats(profileId: string, shopId?: string): Promise<UsageStatsDto> {
    try {
      this.logger.info('Getting usage stats', { profileId, shopId });

      // Get current usage stats from the backend
      const currentUsage = await this.getCurrentUsageStats(profileId);

      // Get user's tier to determine data retention period
      const tier = await this.getTierByProfile(profileId);
      const limits = await this.getLimitsByTier(tier);

      // Map to legacy DTO format
      return {
        profileId: profileId,
        shopId,
        currentShops: currentUsage.currentShops,
        todayQueues: currentUsage.todayQueues,
        currentStaff: currentUsage.currentStaff,
        monthlySmsSent: currentUsage.monthlySmsSent,
        activePromotions: currentUsage.activePromotions,
        usedPosterDesigns: 0, // Not available in CurrentUsageStatsDTO
        paidPosterDesigns: 0, // Not available in CurrentUsageStatsDTO
        totalPosters: 0, // Not available in CurrentUsageStatsDTO
        dataRetentionMonths: limits.dataRetentionMonths || 1, // Get from subscription plan
      };
    } catch (error) {
      this.logger.error('Error getting usage stats', { error, profileId, shopId });

      // Return fallback data with minimal retention period
      return {
        profileId: profileId,
        shopId,
        currentShops: 0,
        todayQueues: 0,
        currentStaff: 0,
        monthlySmsSent: 0,
        activePromotions: 0,
        usedPosterDesigns: 0,
        paidPosterDesigns: 0,
        totalPosters: 0,
        dataRetentionMonths: 1, // Minimal fallback
      };
    }
  }

  // ===== Additional Subscription Management Methods =====

  /**
   * Get user's current subscription from database
   * Replaces mock implementation with real database query
   */
  async getUserSubscription(profileId: string): Promise<UserSubscriptionDto | null> {
    try {
      this.logger.info('Getting user subscription from database', { profileId });

      // Get active subscription for the profile
      const subscriptions = await this.getProfileSubscriptionsPaginated(1, 1, profileId);

      if (subscriptions.data.length === 0) {
        this.logger.info('No subscription found for profile', { profileId });
        return null;
      }

      const activeSubscription = subscriptions.data.find(sub => sub.status === 'active');
      if (!activeSubscription) {
        this.logger.info('No active subscription found for profile', { profileId });
        return null;
      }

      // Get the plan details
      const plan = await this.getSubscriptionPlanById(activeSubscription.planId);
      const limits = await this.getLimitsByTier(plan.tier as SubscriptionTier);

      // Map to UserSubscriptionDto format
      return {
        id: activeSubscription.id,
        profileId: activeSubscription.profileId,
        tier: plan.tier as SubscriptionTier,
        status: activeSubscription.status as 'active' | 'cancelled' | 'expired',
        billingPeriod: activeSubscription.billingPeriod as 'monthly' | 'yearly',
        startDate: activeSubscription.startDate,
        endDate: activeSubscription.endDate || '',
        autoRenew: activeSubscription.autoRenew || false,
        limits,
        pricePerMonth: activeSubscription.pricePerPeriod,
        currency: activeSubscription.currency || 'THB',
        createdAt: activeSubscription.createdAt || '',
        updatedAt: activeSubscription.updatedAt || ''
      };
    } catch (error) {
      this.logger.error('Error getting user subscription from database', { error, profileId });
      return null;
    }
  }

  /**
   * Get available upgrade options from database
   * Replaces hardcoded options with database-driven plans
   */
  async getUpgradeOptions(currentTier: SubscriptionTier): Promise<SubscriptionUpgradeDto[]> {
    try {
      this.logger.info('Getting upgrade options from database', { currentTier });

      // Get all active subscription plans
      const plans = await this.getSubscriptionPlansPaginated(1, 50);
      const activePlans = plans.data.filter(plan => plan.isActive);

      // Define tier order for comparison
      const tierOrder: SubscriptionTier[] = ['free', 'pro', 'enterprise'];
      const currentIndex = tierOrder.indexOf(currentTier);

      // Filter plans higher than current tier
      const upgradeOptions: SubscriptionUpgradeDto[] = [];

      for (const plan of activePlans) {
        const planTier = plan.tier as SubscriptionTier;
        const planIndex = tierOrder.indexOf(planTier);

        if (planIndex > currentIndex) {
          const limits = await this.getLimitsByTier(planTier);

          // Calculate discount percentage
          const monthlyPrice = plan.monthlyPrice || 0;
          const yearlyPrice = plan.yearlyPrice || 0;
          const discountPercentage = yearlyPrice > 0 && monthlyPrice > 0
            ? Math.round((1 - (yearlyPrice / 12) / monthlyPrice) * 100)
            : 0;

          upgradeOptions.push({
            tier: planTier,
            name: plan.name,
            nameEn: plan.nameEn,
            description: plan.description || '',
            descriptionEn: plan.descriptionEn || '',
            monthlyPrice: monthlyPrice,
            yearlyPrice: yearlyPrice,
            oneTimePrice: plan.lifetimePrice || 0,
            currency: plan.currency || 'THB',
            limits,
            features: Array.isArray(plan.features) ? plan.features as string[] : [],
            featuresEn: Array.isArray(plan.featuresEn) ? plan.featuresEn as string[] : [],
            isRecommended: planTier === 'pro', // Pro is typically recommended
            discountPercentage
          });
        }
      }

      // Sort by tier order
      upgradeOptions.sort((a, b) => {
        const aIndex = tierOrder.indexOf(a.tier);
        const bIndex = tierOrder.indexOf(b.tier);
        return aIndex - bIndex;
      });

      return upgradeOptions;
    } catch (error) {
      this.logger.error('Error getting upgrade options from database', { error, currentTier });
      return [];
    }
  }

  /**
   * Check if user can perform action based on actual limits and usage
   * Replaces mock implementation with real database checks
   */
  async canPerformActionByLimits(profileId: string, action: string, shopId?: string): Promise<boolean> {
    try {
      this.logger.info('Checking action permission against limits', { profileId, action, shopId });

      // Get user's current tier and limits
      const tier = await this.getTierByProfile(profileId);
      const limits = await this.getLimitsByTier(tier);
      const usage = await this.getCurrentUsageStats(profileId);

      // Check specific action limits
      switch (action) {
        case 'create_shop':
          if (limits.maxShops === null) return true; // Unlimited
          return usage.currentShops < limits.maxShops;

        case 'create_queue':
          if (limits.maxQueuesPerDay === null) return true; // Unlimited
          return usage.todayQueues < limits.maxQueuesPerDay;

        case 'add_staff':
          if (limits.maxStaff === null) return true; // Unlimited
          return usage.currentStaff < limits.maxStaff;

        case 'send_sms':
          if (limits.maxSmsPerMonth === null) return true; // Unlimited
          return usage.monthlySmsSent < limits.maxSmsPerMonth;

        case 'create_promotion':
          if (limits.maxPromotions === null) return true; // Unlimited
          return usage.activePromotions < limits.maxPromotions;

        case 'access_advanced_reports':
          return limits.hasAdvancedReports;

        case 'access_analytics':
          return limits.hasAnalytics;

        case 'access_api':
          return limits.hasApiAccess;

        case 'custom_branding':
          return limits.hasCustomBranding;

        case 'custom_qr_code':
          return limits.hasCustomQrCode;

        case 'priority_support':
          return limits.hasPrioritySupport;

        case 'promotion_features':
          return limits.hasPromotionFeatures;

        default:
          this.logger.warn('Unknown action for permission check', { action });
          return true; // Allow unknown actions by default
      }
    } catch (error) {
      this.logger.error('Error checking action permission', { error, profileId, action, shopId });
      return false; // Deny on error for safety
    }
  }

  /**
   * Upgrade subscription - creates actual subscription in database
   * Replaces mock implementation with real database operations
   */
  async upgradeSubscription(profileId: string, tier: SubscriptionTier, billingPeriod: 'monthly' | 'yearly'): Promise<UserSubscriptionDto> {
    try {
      this.logger.info('Upgrading subscription in database', { profileId, tier, billingPeriod });

      // Get the subscription plan for the tier
      const plans = await this.getSubscriptionPlansPaginated(1, 50);
      const plan = plans.data.find(p => p.tier === tier && p.isActive);

      if (!plan) {
        throw new Error(`No active subscription plan found for tier: ${tier}`);
      }

      // Calculate price and dates
      const pricePerPeriod = billingPeriod === 'monthly'
        ? (plan.monthlyPrice || 0)
        : (plan.yearlyPrice || 0);

      const startDate = new Date().toISOString();
      const endDate = billingPeriod === 'monthly'
        ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();

      // Create profile subscription
      const subscription = await this.createProfileSubscription({
        profileId,
        planId: plan.id,
        billingPeriod: billingPeriod as 'monthly' | 'yearly',
        pricePerPeriod,
        startDate,
        endDate,
        currency: plan.currency || 'THB',
        autoRenew: true
      });

      // Get limits for the new tier
      const limits = await this.getLimitsByTier(tier);

      // Return UserSubscriptionDto format
      return {
        id: subscription.id,
        profileId: subscription.profileId,
        tier,
        status: 'active',
        billingPeriod,
        startDate: subscription.startDate,
        endDate: subscription.endDate || '',
        autoRenew: subscription.autoRenew || false,
        limits,
        pricePerMonth: subscription.pricePerPeriod,
        currency: subscription.currency || 'THB',
        createdAt: subscription.createdAt || '',
        updatedAt: subscription.updatedAt || ''
      };
    } catch (error) {
      this.logger.error('Error upgrading subscription', { error, profileId, tier, billingPeriod });
      throw error;
    }
  }

  /**
   * Purchase one-time access - creates feature access in database
   * Replaces mock implementation with real database operations
   */
  async purchaseOneTimeAccess(profileId: string, feature: string, duration: number): Promise<boolean> {
    try {
      this.logger.info('Purchasing one-time access', { profileId, feature, duration });

      // Map feature to feature type
      const featureTypeMap: Record<string, 'poster_design' | 'api_access' | 'custom_branding' | 'priority_support'> = {
        'poster_design': 'poster_design',
        'api_access': 'api_access',
        'custom_branding': 'custom_branding',
        'priority_support': 'priority_support'
      };

      const featureType = featureTypeMap[feature];
      if (!featureType) {
        throw new Error(`Unknown feature type: ${feature}`);
      }

      // Calculate expiry date
      const expiresAt = new Date(Date.now() + duration * 24 * 60 * 60 * 1000).toISOString();

      // Grant feature access
      await this.grantFeatureAccess({
        profileId,
        featureType,
        featureId: `${feature}_${Date.now()}`,
        price: 99, // Default price, should be configurable
        expiresAt
      });

      return true;
    } catch (error) {
      this.logger.error('Error purchasing one-time access', { error, profileId, feature, duration });
      return false;
    }
  }

  /**
   * Purchase poster design - creates feature access for specific poster
   * Replaces mock implementation with real database operations
   */
  async purchasePosterDesign(profileId: string, posterId: string): Promise<boolean> {
    try {
      this.logger.info('Purchasing poster design', { profileId, posterId });

      // Grant feature access for the specific poster
      await this.grantFeatureAccess({
        profileId,
        featureType: 'poster_design',
        featureId: posterId,
        price: 49 // Default poster price, should be configurable
      });

      return true;
    } catch (error) {
      this.logger.error('Error purchasing poster design', { error, profileId, posterId });
      return false;
    }
  }

  /**
   * Check if poster is accessible - checks feature access from database
   * Replaces mock implementation with real database checks
   */
  async isPosterAccessible(profileId: string, posterId: string): Promise<boolean> {
    try {
      this.logger.info('Checking poster accessibility', { profileId, posterId });

      // Check if user has feature access for this poster
      const hasAccess = await this.hasFeatureAccess({
        profileId,
        featureType: 'poster_design',
        featureId: posterId
      });

      if (hasAccess) {
        return true;
      }

      // Check if poster is in free tier (first 3 posters)
      const posterNumber = parseInt(posterId.replace(/\D/g, ''));
      if (posterNumber <= 3) {
        return true; // First 3 are free
      }

      // Check user's subscription tier limits
      const tier = await this.getTierByProfile(profileId);
      const limits = await this.getLimitsByTier(tier);

      // If user has unlimited poster designs (enterprise tier)
      if (limits.maxFreePosterDesigns === null) {
        return true;
      }

      // Check if within free poster limit
      return posterNumber <= (limits.maxFreePosterDesigns || 0);
    } catch (error) {
      this.logger.error('Error checking poster accessibility', { error, profileId, posterId });
      return false; // Deny access on error for safety
    }
  }
}


/**
 * Factory for creating Backend Subscription Service with all dependencies
 * Following Clean Architecture and SOLID principles
 */
export class SubscriptionBackendSubscriptionServiceFactory {
  /**
   * Create a fully configured Backend Subscription Service
   * @param subscriptionPlanRepository Repository for subscription plans
   * @param profileSubscriptionRepository Repository for profile subscriptions
   * @param subscriptionUsageRepository Repository for subscription usage
   * @param featureAccessRepository Repository for feature access
   * @param logger Logger instance
   * @returns Configured Backend Subscription Service
   */
  static create(
    subscriptionPlanRepository: BackendSubscriptionPlanRepository,
    profileSubscriptionRepository: BackendProfileSubscriptionRepository,
    subscriptionUsageRepository: BackendSubscriptionUsageRepository,
    featureAccessRepository: BackendFeatureAccessRepository,
    logger: Logger
  ): SubscriptionBackendSubscriptionService {

    // Create Subscription Plan Use Cases
    const getSubscriptionPlansPaginatedUseCase = new GetSubscriptionPlansPaginatedUseCase(subscriptionPlanRepository);
    const getSubscriptionStatsUseCase = new GetSubscriptionStatsUseCase(subscriptionPlanRepository);
    const getSubscriptionPlanByIdUseCase = new GetSubscriptionPlanByIdUseCase(subscriptionPlanRepository);
    const createSubscriptionPlanUseCase = new CreateSubscriptionPlanUseCase(subscriptionPlanRepository);
    const updateSubscriptionPlanUseCase = new UpdateSubscriptionPlanUseCase(subscriptionPlanRepository);
    const deleteSubscriptionPlanUseCase = new DeleteSubscriptionPlanUseCase(subscriptionPlanRepository);

    // Create Profile Subscription Use Cases
    const getProfileSubscriptionsPaginatedUseCase = new GetProfileSubscriptionsPaginatedUseCase(profileSubscriptionRepository);
    const getProfileSubscriptionByIdUseCase = new GetProfileSubscriptionByIdUseCase(profileSubscriptionRepository);
    const createProfileSubscriptionUseCase = new CreateProfileSubscriptionUseCase(profileSubscriptionRepository);
    const updateProfileSubscriptionUseCase = new UpdateProfileSubscriptionUseCase(profileSubscriptionRepository);
    const deleteProfileSubscriptionUseCase = new DeleteProfileSubscriptionUseCase(profileSubscriptionRepository);

    // Create Subscription Usage Use Cases
    const getCurrentUsageStatsUseCase = new GetCurrentUsageStatsUseCase(subscriptionUsageRepository);
    const recordUsageUseCase = new RecordUsageUseCase(subscriptionUsageRepository);
    const canPerformActionUseCase = new CanPerformActionUseCase(subscriptionUsageRepository);
    const getSubscriptionUsagePaginatedUseCase = new GetSubscriptionUsagePaginatedUseCase(subscriptionUsageRepository);

    // Create Feature Access Use Cases
    const grantFeatureAccessUseCase = new GrantFeatureAccessUseCase(featureAccessRepository);
    const hasFeatureAccessUseCase = new HasFeatureAccessUseCase(featureAccessRepository);
    const revokeFeatureAccessUseCase = new RevokeFeatureAccessUseCase(featureAccessRepository);
    const getFeatureAccessPaginatedUseCase = new GetFeatureAccessPaginatedUseCase(featureAccessRepository);

    // Create and return the service with all dependencies
    return new SubscriptionBackendSubscriptionService(
      // Subscription Plan Use Cases
      getSubscriptionPlansPaginatedUseCase,
      getSubscriptionStatsUseCase,
      getSubscriptionPlanByIdUseCase,
      createSubscriptionPlanUseCase,
      updateSubscriptionPlanUseCase,
      deleteSubscriptionPlanUseCase,

      // Profile Subscription Use Cases
      getProfileSubscriptionsPaginatedUseCase,
      getProfileSubscriptionByIdUseCase,
      createProfileSubscriptionUseCase,
      updateProfileSubscriptionUseCase,
      deleteProfileSubscriptionUseCase,

      // Subscription Usage Use Cases
      getCurrentUsageStatsUseCase,
      recordUsageUseCase,
      canPerformActionUseCase,
      getSubscriptionUsagePaginatedUseCase,

      // Feature Access Use Cases
      grantFeatureAccessUseCase,
      hasFeatureAccessUseCase,
      revokeFeatureAccessUseCase,
      getFeatureAccessPaginatedUseCase,

      // Logger
      logger
    );
  }
}

