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
  getProfileSubscriptionsPaginated(page?: number, perPage?: number, profileId?: string): Promise<PaginatedProfileSubscriptionsDTO>;
  getProfileSubscriptionById(id: string): Promise<ProfileSubscriptionDTO>;
  createProfileSubscription(params: CreateProfileSubscriptionInputDTO): Promise<ProfileSubscriptionDTO>;
  updateProfileSubscription(params: UpdateProfileSubscriptionInputDTO): Promise<ProfileSubscriptionDTO>;
  deleteProfileSubscription(id: string): Promise<boolean>;

  // Subscription Usage - Mixed: some for internal use, some for business logic
  getCurrentUsageStats(profileId: string): Promise<CurrentUsageStatsDTO>;
  recordUsage(params: RecordUsageInputDTO): Promise<boolean>;
  canPerformAction(params: CanPerformActionInputDTO): Promise<boolean>;
  getSubscriptionUsagePaginated(page?: number, perPage?: number, profileId?: string, shopId?: string): Promise<PaginatedSubscriptionUsageDTO>;

  // Feature Access - Mixed: some for business logic, some for internal use
  grantFeatureAccess(params: GrantFeatureAccessInputDTO): Promise<FeatureAccessDTO>;
  hasFeatureAccess(params: HasFeatureAccessInputDTO): Promise<boolean>;
  revokeFeatureAccess(params: RevokeFeatureAccessInputDTO): Promise<boolean>;
  getFeatureAccessPaginated(page?: number, perPage?: number, profileId?: string, featureType?: string): Promise<PaginatedFeatureAccessDTO>;
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

