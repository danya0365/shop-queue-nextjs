import type { 
  CreateSubscriptionPlanEntity, 
  PaginatedSubscriptionPlansEntity, 
  SubscriptionPlanEntity, 
  SubscriptionStatsEntity, 
  UpdateSubscriptionPlanEntity,
  ProfileSubscriptionEntity,
  CreateProfileSubscriptionEntity,
  UpdateProfileSubscriptionEntity,
  PaginatedProfileSubscriptionsEntity,
  SubscriptionUsageEntity,
  PaginatedSubscriptionUsageEntity,
  FeatureAccessEntity,
  PaginatedFeatureAccessEntity,
  CurrentUsageStatsEntity,
  SubscriptionTier,
  FeatureType
} from '@/src/domain/entities/subscription/backend/backend-subscription.entity';
import type { PaginationParams } from '@/src/domain/interfaces/pagination-types';

/**
 * Subscription repository error types
 */
export enum BackendSubscriptionErrorType {
  NOT_FOUND = 'not_found',
  OPERATION_FAILED = 'operation_failed',
  VALIDATION_ERROR = 'validation_error',
  UNAUTHORIZED = 'unauthorized',
  DUPLICATE_SUBSCRIPTION = 'duplicate_subscription',
  INVALID_TIER = 'invalid_tier',
  UNKNOWN = 'unknown',
}

/**
 * Custom error class for subscription repository operations
 * Following Clean Architecture principles for error handling
 */
export class BackendSubscriptionError extends Error {
  constructor(
    public readonly type: BackendSubscriptionErrorType,
    message: string,
    public readonly operation?: string,
    public readonly context?: Record<string, unknown>,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = 'BackendSubscriptionError';
  }
}

/**
 * Subscription Plans repository interface
 * Following Clean Architecture principles and Interface Segregation Principle
 */
export interface BackendSubscriptionPlanRepository {
  /**
   * Get paginated subscription plans
   * @param params Pagination parameters
   * @returns Paginated subscription plans data
   * @throws BackendSubscriptionError if the operation fails
   */
  getPaginatedPlans(params: PaginationParams): Promise<PaginatedSubscriptionPlansEntity>;

  /**
   * Get subscription statistics
   * @returns Subscription statistics data
   * @throws BackendSubscriptionError if the operation fails
   */
  getSubscriptionStats(): Promise<SubscriptionStatsEntity>;

  /**
   * Get subscription plan by ID
   * @param id Plan ID
   * @returns Subscription plan entity or null if not found
   * @throws BackendSubscriptionError if the operation fails
   */
  getPlanById(id: string): Promise<SubscriptionPlanEntity | null>;

  /**
   * Get subscription plan by tier
   * @param tier Subscription tier
   * @returns Subscription plan entity or null if not found
   * @throws BackendSubscriptionError if the operation fails
   */
  getPlanByTier(tier: SubscriptionTier): Promise<SubscriptionPlanEntity | null>;

  /**
   * Get all active subscription plans
   * @returns Array of active subscription plans
   * @throws BackendSubscriptionError if the operation fails
   */
  getActivePlans(): Promise<SubscriptionPlanEntity[]>;

  /**
   * Create a new subscription plan
   * @param plan Plan data to create
   * @returns Created subscription plan entity
   * @throws BackendSubscriptionError if the operation fails
   */
  createPlan(plan: Omit<CreateSubscriptionPlanEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<SubscriptionPlanEntity>;

  /**
   * Update an existing subscription plan
   * @param id Plan ID
   * @param plan Plan data to update
   * @returns Updated subscription plan entity
   * @throws BackendSubscriptionError if the operation fails
   */
  updatePlan(id: string, plan: Partial<Omit<UpdateSubscriptionPlanEntity, 'id' | 'createdAt' | 'updatedAt'>>): Promise<SubscriptionPlanEntity>;

  /**
   * Delete a subscription plan
   * @param id Plan ID
   * @returns true if deleted successfully
   * @throws BackendSubscriptionError if the operation fails
   */
  deletePlan(id: string): Promise<boolean>;
}

/**
 * Profile Subscriptions repository interface
 */
export interface BackendProfileSubscriptionRepository {
  /**
   * Get paginated profile subscriptions
   * @param params Pagination parameters
   * @returns Paginated profile subscriptions data
   * @throws BackendSubscriptionError if the operation fails
   */
  getPaginatedSubscriptions(params: PaginationParams): Promise<PaginatedProfileSubscriptionsEntity>;

  /**
   * Get profile subscription by ID
   * @param id Subscription ID
   * @returns Profile subscription entity or null if not found
   * @throws BackendSubscriptionError if the operation fails
   */
  getSubscriptionById(id: string): Promise<ProfileSubscriptionEntity | null>;

  /**
   * Get active subscription for a profile
   * @param profileId Profile ID
   * @returns Active profile subscription entity or null if not found
   * @throws BackendSubscriptionError if the operation fails
   */
  getActiveSubscriptionByProfileId(profileId: string): Promise<ProfileSubscriptionEntity | null>;

  /**
   * Get subscription history for a profile
   * @param profileId Profile ID
   * @param params Pagination parameters
   * @returns Paginated subscription history
   * @throws BackendSubscriptionError if the operation fails
   */
  getSubscriptionHistoryByProfileId(profileId: string, params: PaginationParams): Promise<PaginatedProfileSubscriptionsEntity>;

  /**
   * Create a new profile subscription
   * @param subscription Subscription data to create
   * @returns Created profile subscription entity
   * @throws BackendSubscriptionError if the operation fails
   */
  createSubscription(subscription: Omit<CreateProfileSubscriptionEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<ProfileSubscriptionEntity>;

  /**
   * Update an existing profile subscription
   * @param id Subscription ID
   * @param subscription Subscription data to update
   * @returns Updated profile subscription entity
   * @throws BackendSubscriptionError if the operation fails
   */
  updateSubscription(id: string, subscription: Partial<Omit<UpdateProfileSubscriptionEntity, 'id' | 'createdAt' | 'updatedAt'>>): Promise<ProfileSubscriptionEntity>;

  /**
   * Cancel a profile subscription
   * @param id Subscription ID
   * @returns Updated profile subscription entity
   * @throws BackendSubscriptionError if the operation fails
   */
  cancelSubscription(id: string): Promise<ProfileSubscriptionEntity>;

  /**
   * Delete a profile subscription
   * @param id Subscription ID
   * @returns true if deleted successfully
   * @throws BackendSubscriptionError if the operation fails
   */
  deleteSubscription(id: string): Promise<boolean>;
}

/**
 * Subscription Usage repository interface
 */
export interface BackendSubscriptionUsageRepository {
  /**
   * Get paginated subscription usage
   * @param params Pagination parameters
   * @returns Paginated subscription usage data
   * @throws BackendSubscriptionError if the operation fails
   */
  getPaginatedUsage(params: PaginationParams): Promise<PaginatedSubscriptionUsageEntity>;

  /**
   * Get usage by profile ID
   * @param profileId Profile ID
   * @param params Pagination parameters
   * @returns Paginated usage data for profile
   * @throws BackendSubscriptionError if the operation fails
   */
  getUsageByProfileId(profileId: string, params: PaginationParams): Promise<PaginatedSubscriptionUsageEntity>;

  /**
   * Get current usage statistics for a profile
   * @param profileId Profile ID
   * @param shopId Optional shop ID to filter usage
   * @returns Current usage statistics
   * @throws BackendSubscriptionError if the operation fails
   */
  getCurrentUsageStats(profileId: string, shopId?: string): Promise<CurrentUsageStatsEntity>;

  /**
   * Record usage for a profile
   * @param profileId Profile ID
   * @param shopId Optional shop ID
   * @param usageType Type of usage to record
   * @param count Number to increment
   * @returns Updated usage entity
   * @throws BackendSubscriptionError if the operation fails
   */
  recordUsage(profileId: string, shopId: string | null, usageType: string, count: number): Promise<SubscriptionUsageEntity>;

  /**
   * Check if profile can perform action based on limits
   * @param profileId Profile ID
   * @param action Action to check
   * @param shopId Optional shop ID
   * @returns true if action is allowed
   * @throws BackendSubscriptionError if the operation fails
   */
  canPerformAction(profileId: string, action: string, shopId?: string): Promise<boolean>;
}

/**
 * Feature Access repository interface
 */
export interface BackendFeatureAccessRepository {
  /**
   * Get paginated feature access
   * @param params Pagination parameters
   * @returns Paginated feature access data
   * @throws BackendSubscriptionError if the operation fails
   */
  getPaginatedFeatureAccess(params: PaginationParams): Promise<PaginatedFeatureAccessEntity>;

  /**
   * Get feature access by profile ID
   * @param profileId Profile ID
   * @param params Pagination parameters
   * @returns Paginated feature access for profile
   * @throws BackendSubscriptionError if the operation fails
   */
  getFeatureAccessByProfileId(profileId: string, params: PaginationParams): Promise<PaginatedFeatureAccessEntity>;

  /**
   * Check if profile has access to specific feature
   * @param profileId Profile ID
   * @param featureType Feature type
   * @param featureId Feature ID
   * @returns true if profile has access
   * @throws BackendSubscriptionError if the operation fails
   */
  hasFeatureAccess(profileId: string, featureType: FeatureType, featureId: string): Promise<boolean>;

  /**
   * Grant feature access to profile
   * @param profileId Profile ID
   * @param featureType Feature type
   * @param featureId Feature ID
   * @param price Optional price paid
   * @param expiresAt Optional expiration date
   * @returns Created feature access entity
   * @throws BackendSubscriptionError if the operation fails
   */
  grantFeatureAccess(
    profileId: string, 
    featureType: FeatureType, 
    featureId: string, 
    price?: number, 
    expiresAt?: string
  ): Promise<FeatureAccessEntity>;

  /**
   * Revoke feature access from profile
   * @param profileId Profile ID
   * @param featureType Feature type
   * @param featureId Feature ID
   * @returns true if revoked successfully
   * @throws BackendSubscriptionError if the operation fails
   */
  revokeFeatureAccess(profileId: string, featureType: FeatureType, featureId: string): Promise<boolean>;
}
