import type { IUseCase } from '@/src/application/interfaces/use-case.interface';
import type { Logger } from '@/src/domain/interfaces/logger';
import type {
  // Subscription Plans
  CreateSubscriptionPlanInputDTO,
  UpdateSubscriptionPlanInputDTO,
  GetSubscriptionPlansPaginatedInputDTO,
  SubscriptionPlanDTO,
  PaginatedSubscriptionPlansDTO,
  SubscriptionStatsDTO,
  
  // Profile Subscriptions
  CreateProfileSubscriptionInputDTO,
  UpdateProfileSubscriptionInputDTO,
  GetProfileSubscriptionsPaginatedInputDTO,
  ProfileSubscriptionDTO,
  PaginatedProfileSubscriptionsDTO,
  
  // Subscription Usage
  GetSubscriptionUsagePaginatedInputDTO,
  PaginatedSubscriptionUsageDTO,
  CurrentUsageStatsDTO,
  RecordUsageInputDTO,
  CanPerformActionInputDTO,
  
  // Feature Access
  GrantFeatureAccessInputDTO,
  HasFeatureAccessInputDTO,
  RevokeFeatureAccessInputDTO,
  GetFeatureAccessPaginatedInputDTO,
  FeatureAccessDTO,
  PaginatedFeatureAccessDTO
} from '@/src/application/dtos/subscription/backend/subscription-dto';

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
  
  // Profile Subscriptions
  getProfileSubscriptionsPaginated(page?: number, perPage?: number, profileId?: string): Promise<PaginatedProfileSubscriptionsDTO>;
  getProfileSubscriptionById(id: string): Promise<ProfileSubscriptionDTO>;
  createProfileSubscription(params: CreateProfileSubscriptionInputDTO): Promise<ProfileSubscriptionDTO>;
  updateProfileSubscription(params: UpdateProfileSubscriptionInputDTO): Promise<ProfileSubscriptionDTO>;
  deleteProfileSubscription(id: string): Promise<boolean>;
  
  // Subscription Usage
  getCurrentUsageStats(profileId: string): Promise<CurrentUsageStatsDTO>;
  recordUsage(params: RecordUsageInputDTO): Promise<boolean>;
  canPerformAction(params: CanPerformActionInputDTO): Promise<boolean>;
  getSubscriptionUsagePaginated(page?: number, perPage?: number, profileId?: string, shopId?: string): Promise<PaginatedSubscriptionUsageDTO>;
  
  // Feature Access
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
   */
  async getSubscriptionPlansPaginated(page: number = 1, perPage: number = 10): Promise<PaginatedSubscriptionPlansDTO> {
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
   */
  async getProfileSubscriptionsPaginated(page: number = 1, perPage: number = 10, profileId?: string): Promise<PaginatedProfileSubscriptionsDTO> {
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
   */
  async getSubscriptionUsagePaginated(page: number = 1, perPage: number = 10, profileId?: string, shopId?: string): Promise<PaginatedSubscriptionUsageDTO> {
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
   */
  async getFeatureAccessPaginated(page: number = 1, perPage: number = 10, profileId?: string, featureType?: string): Promise<PaginatedFeatureAccessDTO> {
    try {
      this.logger.info('Getting paginated feature access', { page, perPage, profileId, featureType });

      const result = await this.getFeatureAccessPaginatedUseCase.execute({ 
        page, 
        limit: perPage, 
        profileId, 
        featureType: featureType as any 
      });
      return result;
    } catch (error) {
      this.logger.error('Error getting paginated feature access', { error, page, perPage, profileId, featureType });
      throw error;
    }
  }
}
