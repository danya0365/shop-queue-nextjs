import {
  SubscriptionPlanEntity,
  FeatureAccessEntity,
  ProfileSubscriptionEntity,
  CreateProfileSubscriptionEntity,
  UpdateProfileSubscriptionEntity,
  SubscriptionUsageEntity,
  CurrentUsageStatsEntity,
  SubscriptionTier,
  SubscriptionStatus,
  BillingPeriod,
  FeatureType,
  SubscriptionStatsEntity
} from '@/src/domain/entities/subscription/backend/backend-subscription.entity';
import { PaginationMeta } from "@/src/domain/interfaces/pagination-types";
import { 
  SubscriptionPlanSchema, 
  ProfileSubscriptionSchema,
  SubscriptionUsageSchema,
  FeatureAccessSchema,
  SubscriptionStatsSchema,
  CurrentUsageStatsSchema
} from "@/src/infrastructure/schemas/subscription/backend/subscription.schema";

/**
 * Mapper class for converting between subscription database schema and domain entities
 * Following Clean Architecture principles for separation of concerns
 */
export class SupabaseBackendSubscriptionMapper {
  /**
   * Map subscription plan database schema to domain entity
   * @param schema Subscription plan database schema
   * @returns Subscription plan domain entity
   */
  public static subscriptionPlanSchemaToEntity(schema: SubscriptionPlanSchema): SubscriptionPlanEntity {
    return {
      id: schema.id,
      tier: schema.tier as SubscriptionTier,
      name: schema.name,
      nameEn: schema.name_en,
      description: schema.description,
      descriptionEn: schema.description_en,
      
      // Pricing
      monthlyPrice: schema.monthly_price,
      yearlyPrice: schema.yearly_price,
      lifetimePrice: schema.lifetime_price,
      currency: schema.currency,
      
      // Limits
      maxShops: schema.max_shops,
      maxQueuesPerDay: schema.max_queues_per_day,
      dataRetentionMonths: schema.data_retention_months,
      maxStaff: schema.max_staff,
      maxSmsPerMonth: schema.max_sms_per_month,
      maxPromotions: schema.max_promotions,
      maxFreePosterDesigns: schema.max_free_poster_designs,
      
      // Features
      hasAdvancedReports: schema.has_advanced_reports,
      hasCustomQrCode: schema.has_custom_qr_code,
      hasApiAccess: schema.has_api_access,
      hasPrioritySupport: schema.has_priority_support,
      hasCustomBranding: schema.has_custom_branding,
      hasAnalytics: schema.has_analytics,
      hasPromotionFeatures: schema.has_promotion_features,
      
      // Metadata
      features: schema.features,
      featuresEn: schema.features_en,
      isActive: schema.is_active,
      sortOrder: schema.sort_order,
      
      createdAt: schema.created_at,
      updatedAt: schema.updated_at,
    };
  }

  /**
   * Map subscription plan domain entity to database schema
   * @param entity Subscription plan domain entity
   * @returns Subscription plan database schema
   */
  public static planToSchema(entity: SubscriptionPlanEntity): SubscriptionPlanSchema {
    return {
      id: entity.id,
      tier: entity.tier,
      name: entity.name,
      name_en: entity.nameEn,
      description: entity.description,
      description_en: entity.descriptionEn,
      
      // Pricing
      monthly_price: entity.monthlyPrice,
      yearly_price: entity.yearlyPrice,
      lifetime_price: entity.lifetimePrice,
      currency: entity.currency,
      
      // Limits
      max_shops: entity.maxShops,
      max_queues_per_day: entity.maxQueuesPerDay,
      data_retention_months: entity.dataRetentionMonths,
      max_staff: entity.maxStaff,
      max_sms_per_month: entity.maxSmsPerMonth,
      max_promotions: entity.maxPromotions,
      max_free_poster_designs: entity.maxFreePosterDesigns,
      
      // Features
      has_advanced_reports: entity.hasAdvancedReports,
      has_custom_qr_code: entity.hasCustomQrCode,
      has_api_access: entity.hasApiAccess,
      has_priority_support: entity.hasPrioritySupport,
      has_custom_branding: entity.hasCustomBranding,
      has_analytics: entity.hasAnalytics,
      has_promotion_features: entity.hasPromotionFeatures,
      
      // Metadata
      features: entity.features,
      features_en: entity.featuresEn,
      is_active: entity.isActive,
      sort_order: entity.sortOrder,
      
      created_at: entity.createdAt,
      updated_at: entity.updatedAt,
    };
  }

  /**
   * Map profile subscription database schema to domain entity
   * @param schema Profile subscription database schema
   * @returns Profile subscription domain entity
   */
  public static profileSubscriptionSchemaToEntity(schema: ProfileSubscriptionSchema): ProfileSubscriptionEntity {
    return {
      id: schema.id,
      profileId: schema.profile_id,
      planId: schema.plan_id,
      
      // Subscription details
      status: (schema.status as SubscriptionStatus) || SubscriptionStatus.PENDING,
      billingPeriod: schema.billing_period as BillingPeriod,
      
      // Dates
      startDate: schema.start_date,
      endDate: schema.end_date,
      trialEndDate: schema.trial_end_date,
      cancelledAt: schema.cancelled_at,
      // Note: deletedAt is not part of ProfileSubscriptionEntity
      
      // Payment
      pricePerPeriod: schema.price_per_period,
      currency: schema.currency,
      autoRenew: schema.auto_renew,
      
      // Metadata
      paymentProvider: schema.payment_provider,
      externalSubscriptionId: schema.external_subscription_id,
      metadata: schema.metadata,
      
      // Joined data
      plan: schema.plan ? this.subscriptionPlanSchemaToEntity(schema.plan) : undefined,
      profileName: schema.profile_name || undefined,
      
      createdAt: schema.created_at,
      updatedAt: schema.updated_at,
    };
  }

  /**
   * Map create profile subscription entity to database schema
   */
  public static createProfileSubscriptionEntityToSchema(entity: Omit<CreateProfileSubscriptionEntity, 'id' | 'createdAt' | 'updatedAt'>): Omit<ProfileSubscriptionSchema, 'id' | 'created_at' | 'updated_at'> {
    return {
      profile_id: entity.profileId,
      plan_id: entity.planId,
      status: entity.status as 'active' | 'cancelled' | 'expired' | 'pending' | 'suspended',
      billing_period: entity.billingPeriod,
      start_date: entity.startDate ?? '',
      end_date: entity.endDate ?? null,
      trial_end_date: entity.trialEndDate || null,
      cancelled_at: null,
      price_per_period: entity.pricePerPeriod,
      currency: entity.currency ?? 'USD',
      auto_renew: entity.autoRenew ?? false,
      payment_provider: entity.paymentProvider || null,
      external_subscription_id: entity.externalSubscriptionId ?? null,
      metadata: entity.metadata || {}
    };
  }

  /**
   * Map update profile subscription entity to database schema
   */
  public static updateProfileSubscriptionEntityToSchema(entity: UpdateProfileSubscriptionEntity): Partial<ProfileSubscriptionSchema> {
    const updateData: Partial<ProfileSubscriptionSchema> = {
      updated_at: new Date().toISOString(),
    };

    if (entity.planId !== undefined) updateData.plan_id = entity.planId;
    if (entity.status !== undefined) updateData.status = entity.status;
    if (entity.billingPeriod !== undefined) updateData.billing_period = entity.billingPeriod;
    if (entity.endDate !== undefined) updateData.end_date = entity.endDate || null;
    if (entity.trialEndDate !== undefined) updateData.trial_end_date = entity.trialEndDate || null;
    if (entity.cancelledAt !== undefined) updateData.cancelled_at = entity.cancelledAt || null;
    // Note: deletedAt is not part of UpdateProfileSubscriptionEntity
    if (entity.pricePerPeriod !== undefined) updateData.price_per_period = entity.pricePerPeriod;
    if (entity.currency !== undefined) updateData.currency = entity.currency;
    if (entity.autoRenew !== undefined) updateData.auto_renew = entity.autoRenew;
    if (entity.paymentProvider !== undefined) updateData.payment_provider = entity.paymentProvider;
    if (entity.externalSubscriptionId !== undefined) updateData.external_subscription_id = entity.externalSubscriptionId;
    if (entity.metadata !== undefined) updateData.metadata = entity.metadata;

    return updateData;
  }

  /**
   * Map profile subscription domain entity to database schema
   * @param entity Profile subscription domain entity
   * @returns Profile subscription database schema
   */
  public static subscriptionToSchema(entity: ProfileSubscriptionEntity): ProfileSubscriptionSchema {
    return {
      id: entity.id,
      profile_id: entity.profileId,
      plan_id: entity.planId,
      
      // Subscription details
      status: entity.status,
      billing_period: entity.billingPeriod,
      
      // Dates
      start_date: entity.startDate,
      end_date: entity.endDate,
      trial_end_date: entity.trialEndDate,
      cancelled_at: entity.cancelledAt,
      
      // Payment
      price_per_period: entity.pricePerPeriod,
      currency: entity.currency,
      auto_renew: entity.autoRenew,
      
      // Metadata
      payment_provider: entity.paymentProvider,
      external_subscription_id: entity.externalSubscriptionId,
      metadata: entity.metadata,
      
      created_at: entity.createdAt,
      updated_at: entity.updatedAt,
    };
  }

  /**
   * Map subscription usage database schema to domain entity
   * @param schema Subscription usage database schema
   * @returns Subscription usage domain entity
   */
  public static subscriptionUsageSchemaToEntity(schema: SubscriptionUsageSchema): SubscriptionUsageEntity {
    return {
      id: schema.id,
      profileId: schema.profile_id,
      shopId: schema.shop_id,
      
      // Usage period
      usageDate: schema.usage_date,
      usageMonth: schema.usage_month,
      
      // Usage counters
      shopsCount: schema.shops_count,
      queuesCount: schema.queues_count,
      staffCount: schema.staff_count,
      smsSentCount: schema.sms_sent_count,
      promotionsCount: schema.promotions_count,
      
      // Metadata
      metadata: schema.metadata,
      
      createdAt: schema.created_at,
      updatedAt: schema.updated_at,
    };
  }

  /**
   * Map subscription usage domain entity to database schema
   * @param entity Subscription usage domain entity
   * @returns Subscription usage database schema
   */
  public static usageToSchema(entity: SubscriptionUsageEntity): SubscriptionUsageSchema {
    return {
      id: entity.id,
      profile_id: entity.profileId,
      shop_id: entity.shopId,
      
      // Usage period
      usage_date: entity.usageDate,
      usage_month: entity.usageMonth,
      
      // Usage counters
      shops_count: entity.shopsCount,
      queues_count: entity.queuesCount,
      staff_count: entity.staffCount,
      sms_sent_count: entity.smsSentCount,
      promotions_count: entity.promotionsCount,
      
      // Metadata
      metadata: entity.metadata,
      
      created_at: entity.createdAt,
      updated_at: entity.updatedAt,
    };
  }

  /**
   * Map feature access database schema to domain entity
   * @param schema Feature access database schema
   * @returns Feature access domain entity
   */
  public static featureAccessSchemaToEntity(schema: FeatureAccessSchema): FeatureAccessEntity {
    return {
      id: schema.id,
      profileId: schema.profile_id,
      
      // Feature details
      featureType: schema.feature_type as FeatureType,
      featureId: schema.feature_id,
      
      // Access details
      purchasedAt: schema.purchased_at,
      expiresAt: schema.expires_at,
      isActive: schema.is_active,
      
      // Payment
      price: schema.price,
      currency: schema.currency,
      
      // Metadata
      paymentProvider: schema.payment_provider,
      externalPaymentId: schema.external_payment_id || null,
      metadata: schema.metadata,
      
      createdAt: schema.created_at,
      updatedAt: schema.updated_at,
    };
  }

  /**
   * Map feature access domain entity to database schema
   * @param entity Feature access domain entity
   * @returns Feature access database schema
   */
  public static featureAccessToSchema(entity: FeatureAccessEntity): FeatureAccessSchema {
    return {
      id: entity.id,
      profile_id: entity.profileId,
      
      // Feature details
      feature_type: entity.featureType,
      feature_id: entity.featureId,
      
      // Access details
      purchased_at: entity.purchasedAt,
      expires_at: entity.expiresAt,
      is_active: entity.isActive,
      
      // Payment
      price: entity.price,
      currency: entity.currency,
      
      // Metadata
      payment_provider: entity.paymentProvider,
      external_payment_id: entity.externalPaymentId,
      metadata: entity.metadata,
      
      created_at: entity.createdAt,
      updated_at: entity.updatedAt,
    };
  }

  /**
   * Map subscription stats schema to domain entity
   * @param schema Subscription stats database schema
   * @returns Subscription stats domain entity
   */
  public static statsToEntity(schema: SubscriptionStatsSchema): SubscriptionStatsEntity {
    return {
      totalPlans: schema.total_plans,
      activePlans: schema.active_plans,
      totalSubscriptions: schema.total_subscriptions,
      activeSubscriptions: schema.active_subscriptions,
      freeUsers: schema.free_users,
      proUsers: schema.pro_users,
      enterpriseUsers: schema.enterprise_users,
      monthlyRevenue: schema.monthly_revenue,
      yearlyRevenue: schema.yearly_revenue,
      totalRevenue: schema.total_revenue,
    };
  }

  /**
   * Map current usage stats schema to domain entity
   * @param schema Current usage stats database schema
   * @returns Current usage stats domain entity
   */
  public static currentUsageStatsToEntity(schema: CurrentUsageStatsSchema): CurrentUsageStatsEntity {
    return {
      profileId: schema.profile_id,
      shopId: schema.shop_id,
      todayQueues: schema.today_queues,
      currentShops: schema.current_shops,
      currentStaff: schema.current_staff,
      monthlySmsSent: schema.monthly_sms_sent,
      activePromotions: schema.active_promotions,
    };
  }

  /**
   * Create pagination metadata from database results
   * @param page Current page number
   * @param limit Items per page
   * @param totalItems Total number of items
   * @returns Pagination metadata
   */
  public static createPaginationMeta(
    page: number,
    limit: number,
    totalItems: number
  ): PaginationMeta {
    const totalPages = Math.ceil(totalItems / limit);

    return {
      currentPage: page,
      totalPages,
      totalItems,
      itemsPerPage: limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    };
  }
}
