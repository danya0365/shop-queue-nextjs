import {
  CreateSubscriptionPlanEntity,
  PaginatedSubscriptionPlansEntity,
  SubscriptionPlanEntity,
  SubscriptionStatsEntity,
  SubscriptionTier,
  UpdateSubscriptionPlanEntity
} from "@/src/domain/entities/backend/backend-subscription.entity";
import { DatabaseDataSource, FilterOperator, QueryOptions, SortDirection } from "@/src/domain/interfaces/datasources/database-datasource";
import { Logger } from "@/src/domain/interfaces/logger";
import { PaginationParams } from "@/src/domain/interfaces/pagination-types";
import {
  BackendSubscriptionError,
  BackendSubscriptionErrorType,
  BackendSubscriptionPlanRepository
} from "@/src/domain/repositories/backend/backend-subscription-repository";
import { SupabaseBackendSubscriptionMapper } from "@/src/infrastructure/mappers/backend/supabase-backend-subscription.mapper";
import { SubscriptionPlanSchema, SubscriptionStatsSchema } from "@/src/infrastructure/schemas/subscription/backend/subscription.schema";
import { StandardRepository } from "./base/standard-repository";

// Extended types for joined data
type SubscriptionPlanSchemaRecord = Record<string, unknown> & SubscriptionPlanSchema;
type SubscriptionStatsSchemaRecord = Record<string, unknown> & SubscriptionStatsSchema;

/**
 * Supabase implementation of the subscription plan repository
 * Following Clean Architecture principles for repository implementation
 */
export class SupabaseSubscriptionPlanRepository extends StandardRepository implements BackendSubscriptionPlanRepository {
  constructor(
    dataSource: DatabaseDataSource,
    logger: Logger
  ) {
    super(dataSource, logger, "SubscriptionPlan");
  }

  /**
   * Get paginated subscription plans from database
   * @param params Pagination parameters
   * @returns Paginated subscription plans data
   */
  async getPaginatedPlans(params: PaginationParams): Promise<PaginatedSubscriptionPlansEntity> {
    try {
      const { page, limit } = params;
      const offset = (page - 1) * limit;

      const queryOptions: QueryOptions = {
        select: ['*'],
        sort: [{ field: 'sort_order', direction: SortDirection.ASC }],
        pagination: {
          limit,
          offset
        }
      };

      const plans = await this.dataSource.getAdvanced<SubscriptionPlanSchemaRecord>(
        'subscription_plans',
        queryOptions
      );

      const totalItems = await this.dataSource.count('subscription_plans', queryOptions);

      // Map database results to domain entities
      const subscriptionPlans = plans.map((item: SubscriptionPlanSchema) =>
        SupabaseBackendSubscriptionMapper.subscriptionPlanSchemaToEntity(item)
      );

      // Create pagination metadata
      const pagination = SupabaseBackendSubscriptionMapper.createPaginationMeta(page, limit, totalItems);

      return {
        data: subscriptionPlans,
        pagination
      };
    } catch (error) {
      if (error instanceof BackendSubscriptionError) {
        throw error;
      }

      this.logger.error('Error in getPaginatedPlans', { error });
      throw new BackendSubscriptionError(
        BackendSubscriptionErrorType.UNKNOWN,
        'An unexpected error occurred while fetching subscription plans',
        'getPaginatedPlans',
        {},
        error
      );
    }
  }

  /**
   * Get subscription statistics from database
   * @returns Subscription statistics
   */
  async getSubscriptionStats(): Promise<SubscriptionStatsEntity> {
    try {
      // Use the database function to get comprehensive stats
      const statsData = await this.dataSource.callRpc<SubscriptionStatsSchemaRecord[]>(
        'get_subscription_stats',
        {}
      );

      if (!statsData || statsData.length === 0) {
        // Return default values if no stats found
        return {
          totalPlans: 0,
          activePlans: 0,
          totalSubscriptions: 0,
          activeSubscriptions: 0,
          freeUsers: 0,
          proUsers: 0,
          enterpriseUsers: 0,
          monthlyRevenue: 0,
          yearlyRevenue: 0,
          totalRevenue: 0,
        };
      }

      return SupabaseBackendSubscriptionMapper.statsToEntity(statsData[0]);
    } catch (error) {
      if (error instanceof BackendSubscriptionError) {
        throw error;
      }

      this.logger.error('Error in getSubscriptionStats', { error });
      throw new BackendSubscriptionError(
        BackendSubscriptionErrorType.UNKNOWN,
        'An unexpected error occurred while fetching subscription statistics',
        'getSubscriptionStats',
        {},
        error
      );
    }
  }

  /**
   * Get subscription plan by ID
   * @param id Plan ID
   * @returns Subscription plan entity or null if not found
   */
  async getPlanById(id: string): Promise<SubscriptionPlanEntity | null> {
    try {
      const plan = await this.dataSource.getById<SubscriptionPlanSchemaRecord>(
        'subscription_plans',
        id,
        {
          select: ['*']
        }
      );

      if (!plan) {
        return null;
      }

      return SupabaseBackendSubscriptionMapper.subscriptionPlanSchemaToEntity(plan);
    } catch (error) {
      if (error instanceof BackendSubscriptionError) {
        throw error;
      }

      this.logger.error('Error in getPlanById', { error, id });
      throw new BackendSubscriptionError(
        BackendSubscriptionErrorType.UNKNOWN,
        'An unexpected error occurred while fetching subscription plan',
        'getPlanById',
        { id },
        error
      );
    }
  }

  /**
   * Get subscription plan by tier
   * @param tier Subscription tier
   * @returns Subscription plan entity or null if not found
   */
  async getPlanByTier(tier: SubscriptionTier): Promise<SubscriptionPlanEntity | null> {
    try {
      const queryOptions: QueryOptions = {
        select: ['*'],
        filters: [
          { field: 'tier', operator: FilterOperator.EQ, value: tier },
          { field: 'is_active', operator: FilterOperator.EQ, value: true }
        ]
      };

      const plans = await this.dataSource.getAdvanced<SubscriptionPlanSchemaRecord>(
        'subscription_plans',
        queryOptions
      );

      if (!plans || plans.length === 0) {
        return null;
      }

      return SupabaseBackendSubscriptionMapper.subscriptionPlanSchemaToEntity(plans[0]);
    } catch (error) {
      if (error instanceof BackendSubscriptionError) {
        throw error;
      }

      this.logger.error('Error in getPlanByTier', { error, tier });
      throw new BackendSubscriptionError(
        BackendSubscriptionErrorType.UNKNOWN,
        'An unexpected error occurred while fetching subscription plan by tier',
        'getPlanByTier',
        { tier },
        error
      );
    }
  }

  /**
   * Get all active subscription plans
   * @returns Array of active subscription plans
   */
  async getActivePlans(): Promise<SubscriptionPlanEntity[]> {
    try {
      const queryOptions: QueryOptions = {
        select: ['*'],
        filters: [
          { field: 'is_active', operator: FilterOperator.EQ, value: true }
        ],
        sort: [{ field: 'sort_order', direction: SortDirection.ASC }]
      };

      const plans = await this.dataSource.getAdvanced<SubscriptionPlanSchemaRecord>(
        'subscription_plans',
        queryOptions
      );

      return plans.map(plan => SupabaseBackendSubscriptionMapper.subscriptionPlanSchemaToEntity(plan));
    } catch (error) {
      if (error instanceof BackendSubscriptionError) {
        throw error;
      }

      this.logger.error('Error in getActivePlans', { error });
      throw new BackendSubscriptionError(
        BackendSubscriptionErrorType.UNKNOWN,
        'An unexpected error occurred while fetching active subscription plans',
        'getActivePlans',
        {},
        error
      );
    }
  }

  /**
   * Create a new subscription plan
   * @param plan Plan data to create
   * @returns Created subscription plan entity
   */
  async createPlan(plan: Omit<CreateSubscriptionPlanEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<SubscriptionPlanEntity> {
    try {
      // Check if tier already exists
      const existingPlan = await this.getPlanByTier(plan.tier);
      if (existingPlan) {
        throw new BackendSubscriptionError(
          BackendSubscriptionErrorType.VALIDATION_ERROR,
          `Subscription plan with tier ${plan.tier} already exists`,
          'createPlan',
          { plan }
        );
      }

      // Convert domain entity to database schema
      const planSchema = {
        tier: plan.tier,
        name: plan.name,
        name_en: plan.nameEn,
        description: plan.description || null,
        description_en: plan.descriptionEn || null,
        monthly_price: plan.monthlyPrice || null,
        yearly_price: plan.yearlyPrice || null,
        lifetime_price: plan.lifetimePrice || null,
        currency: plan.currency || 'THB',
        max_shops: plan.maxShops || null,
        max_queues_per_day: plan.maxQueuesPerDay || null,
        data_retention_months: plan.dataRetentionMonths || null,
        max_staff: plan.maxStaff || null,
        max_sms_per_month: plan.maxSmsPerMonth || null,
        max_promotions: plan.maxPromotions || null,
        max_free_poster_designs: plan.maxFreePosterDesigns || 3,
        has_advanced_reports: plan.hasAdvancedReports || false,
        has_custom_qr_code: plan.hasCustomQrCode || false,
        has_api_access: plan.hasApiAccess || false,
        has_priority_support: plan.hasPrioritySupport || false,
        has_custom_branding: plan.hasCustomBranding || false,
        has_analytics: plan.hasAnalytics || false,
        has_promotion_features: plan.hasPromotionFeatures || false,
        features: plan.features || [],
        features_en: plan.featuresEn || [],
        is_active: plan.isActive !== undefined ? plan.isActive : true,
        sort_order: plan.sortOrder || 0,
      };

      const createdPlan = await this.dataSource.insert<SubscriptionPlanSchemaRecord>(
        'subscription_plans',
        planSchema
      );

      if (!createdPlan) {
        throw new BackendSubscriptionError(
          BackendSubscriptionErrorType.OPERATION_FAILED,
          'Failed to create subscription plan',
          'createPlan',
          { plan }
        );
      }

      return this.getPlanById(createdPlan.id) as Promise<SubscriptionPlanEntity>;
    } catch (error) {
      if (error instanceof BackendSubscriptionError) {
        throw error;
      }

      this.logger.error('Error in createPlan', { error, plan });
      throw new BackendSubscriptionError(
        BackendSubscriptionErrorType.UNKNOWN,
        'An unexpected error occurred while creating subscription plan',
        'createPlan',
        { plan },
        error
      );
    }
  }

  /**
   * Update an existing subscription plan
   * @param id Plan ID
   * @param plan Plan data to update
   * @returns Updated subscription plan entity
   */
  async updatePlan(id: string, plan: Partial<Omit<UpdateSubscriptionPlanEntity, 'id' | 'createdAt' | 'updatedAt'>>): Promise<SubscriptionPlanEntity> {
    try {
      // Check if plan exists
      const existingPlan = await this.getPlanById(id);
      if (!existingPlan) {
        throw new BackendSubscriptionError(
          BackendSubscriptionErrorType.NOT_FOUND,
          `Subscription plan with ID ${id} not found`,
          'updatePlan',
          { id, plan }
        );
      }

      // Convert domain entity to database schema
      const planSchema: Partial<SubscriptionPlanSchema> = {};

      if (plan.name !== undefined) planSchema.name = plan.name;
      if (plan.nameEn !== undefined) planSchema.name_en = plan.nameEn;
      if (plan.description !== undefined) planSchema.description = plan.description;
      if (plan.descriptionEn !== undefined) planSchema.description_en = plan.descriptionEn;
      if (plan.monthlyPrice !== undefined) planSchema.monthly_price = plan.monthlyPrice;
      if (plan.yearlyPrice !== undefined) planSchema.yearly_price = plan.yearlyPrice;
      if (plan.lifetimePrice !== undefined) planSchema.lifetime_price = plan.lifetimePrice;
      if (plan.currency !== undefined) planSchema.currency = plan.currency;
      if (plan.maxShops !== undefined) planSchema.max_shops = plan.maxShops;
      if (plan.maxQueuesPerDay !== undefined) planSchema.max_queues_per_day = plan.maxQueuesPerDay;
      if (plan.dataRetentionMonths !== undefined) planSchema.data_retention_months = plan.dataRetentionMonths;
      if (plan.maxStaff !== undefined) planSchema.max_staff = plan.maxStaff;
      if (plan.maxSmsPerMonth !== undefined) planSchema.max_sms_per_month = plan.maxSmsPerMonth;
      if (plan.maxPromotions !== undefined) planSchema.max_promotions = plan.maxPromotions;
      if (plan.maxFreePosterDesigns !== undefined) planSchema.max_free_poster_designs = plan.maxFreePosterDesigns;
      if (plan.hasAdvancedReports !== undefined) planSchema.has_advanced_reports = plan.hasAdvancedReports;
      if (plan.hasCustomQrCode !== undefined) planSchema.has_custom_qr_code = plan.hasCustomQrCode;
      if (plan.hasApiAccess !== undefined) planSchema.has_api_access = plan.hasApiAccess;
      if (plan.hasPrioritySupport !== undefined) planSchema.has_priority_support = plan.hasPrioritySupport;
      if (plan.hasCustomBranding !== undefined) planSchema.has_custom_branding = plan.hasCustomBranding;
      if (plan.hasAnalytics !== undefined) planSchema.has_analytics = plan.hasAnalytics;
      if (plan.hasPromotionFeatures !== undefined) planSchema.has_promotion_features = plan.hasPromotionFeatures;
      if (plan.features !== undefined) planSchema.features = plan.features;
      if (plan.featuresEn !== undefined) planSchema.features_en = plan.featuresEn;
      if (plan.isActive !== undefined) planSchema.is_active = plan.isActive;
      if (plan.sortOrder !== undefined) planSchema.sort_order = plan.sortOrder;

      const updatedPlan = await this.dataSource.update<SubscriptionPlanSchemaRecord>(
        'subscription_plans',
        id,
        planSchema
      );

      if (!updatedPlan) {
        throw new BackendSubscriptionError(
          BackendSubscriptionErrorType.OPERATION_FAILED,
          'Failed to update subscription plan',
          'updatePlan',
          { id, plan }
        );
      }

      return this.getPlanById(id) as Promise<SubscriptionPlanEntity>;
    } catch (error) {
      if (error instanceof BackendSubscriptionError) {
        throw error;
      }

      this.logger.error('Error in updatePlan', { error, id, plan });
      throw new BackendSubscriptionError(
        BackendSubscriptionErrorType.UNKNOWN,
        'An unexpected error occurred while updating subscription plan',
        'updatePlan',
        { id, plan },
        error
      );
    }
  }

  /**
   * Delete a subscription plan
   * @param id Plan ID
   * @returns true if deleted successfully
   */
  async deletePlan(id: string): Promise<boolean> {
    try {
      // Check if plan exists
      const existingPlan = await this.getPlanById(id);
      if (!existingPlan) {
        throw new BackendSubscriptionError(
          BackendSubscriptionErrorType.NOT_FOUND,
          `Subscription plan with ID ${id} not found`,
          'deletePlan',
          { id }
        );
      }

      await this.dataSource.delete('subscription_plans', id);
      return true;
    } catch (error) {
      if (error instanceof BackendSubscriptionError) {
        throw error;
      }

      this.logger.error('Error in deletePlan', { error, id });
      throw new BackendSubscriptionError(
        BackendSubscriptionErrorType.UNKNOWN,
        'An unexpected error occurred while deleting subscription plan',
        'deletePlan',
        { id },
        error
      );
    }
  }
}
