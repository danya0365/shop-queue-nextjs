import {
  CurrentUsageStatsDTO,
  FeatureAccessDTO,
  PaginatedFeatureAccessDTO,
  PaginatedProfileSubscriptionsDTO,
  PaginatedSubscriptionPlansDTO,
  PaginatedSubscriptionUsageDTO,
  ProfileSubscriptionDTO,
  SubscriptionPlanDTO,
  SubscriptionStatsDTO,
  SubscriptionUsageDTO
} from "@/src/application/dtos/backend/subscription-dto";
import {
  CurrentUsageStatsEntity,
  FeatureAccessEntity,
  ProfileSubscriptionEntity,
  SubscriptionPlanEntity,
  SubscriptionStatsEntity,
  SubscriptionUsageEntity
} from "@/src/domain/entities/backend/backend-subscription.entity";
import { PaginatedResult } from "@/src/domain/interfaces/pagination-types";

/**
 * Mapper class for subscription entities and DTOs
 * Following Clean Architecture and SOLID principles
 */
export class SubscriptionMapper {
  /**
   * Convert SubscriptionPlanEntity to SubscriptionPlanDTO
   */
  static subscriptionPlanToDTO(entity: SubscriptionPlanEntity): SubscriptionPlanDTO {
    return {
      id: entity.id,
      tier: entity.tier,
      name: entity.name,
      nameEn: entity.nameEn,
      description: entity.description,
      descriptionEn: entity.descriptionEn,

      // Pricing
      monthlyPrice: entity.monthlyPrice,
      yearlyPrice: entity.yearlyPrice,
      lifetimePrice: entity.lifetimePrice,
      currency: entity.currency,

      // Limits
      maxShops: entity.maxShops,
      maxQueuesPerDay: entity.maxQueuesPerDay,
      dataRetentionMonths: entity.dataRetentionMonths,
      maxStaff: entity.maxStaff,
      maxSmsPerMonth: entity.maxSmsPerMonth,
      maxPromotions: entity.maxPromotions,
      maxFreePosterDesigns: entity.maxFreePosterDesigns,

      // Features
      hasAdvancedReports: entity.hasAdvancedReports,
      hasCustomQrCode: entity.hasCustomQrCode,
      hasApiAccess: entity.hasApiAccess,
      hasPrioritySupport: entity.hasPrioritySupport,
      hasCustomBranding: entity.hasCustomBranding,
      hasAnalytics: entity.hasAnalytics,
      hasPromotionFeatures: entity.hasPromotionFeatures,

      // Metadata
      features: entity.features,
      featuresEn: entity.featuresEn,
      isActive: entity.isActive,
      sortOrder: entity.sortOrder,

      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt
    };
  }

  /**
   * Convert ProfileSubscriptionEntity to ProfileSubscriptionDTO
   */
  static profileSubscriptionToDTO(entity: ProfileSubscriptionEntity): ProfileSubscriptionDTO {
    return {
      id: entity.id,
      profileId: entity.profileId,
      planId: entity.planId,

      // Subscription details
      status: entity.status,
      billingPeriod: entity.billingPeriod,

      // Dates
      startDate: entity.startDate,
      endDate: entity.endDate || null,
      trialEndDate: entity.trialEndDate || null,
      cancelledAt: entity.cancelledAt || null,

      // Payment
      pricePerPeriod: entity.pricePerPeriod,
      currency: entity.currency,
      autoRenew: entity.autoRenew,

      // Metadata
      paymentProvider: entity.paymentProvider,
      externalSubscriptionId: entity.externalSubscriptionId,
      metadata: entity.metadata,

      // Joined data
      plan: entity.plan ? this.subscriptionPlanToDTO(entity.plan) : undefined,
      profileName: entity.profileName,

      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt
    };
  }

  /**
   * Convert SubscriptionUsageEntity to SubscriptionUsageDTO
   */
  static subscriptionUsageToDTO(entity: SubscriptionUsageEntity): SubscriptionUsageDTO {
    return {
      id: entity.id,
      profileId: entity.profileId,
      shopId: entity.shopId,

      // Usage period
      usageDate: entity.usageDate, // YYYY-MM-DD format
      usageMonth: entity.usageMonth,

      // Usage counters
      shopsCount: entity.shopsCount,
      queuesCount: entity.queuesCount,
      staffCount: entity.staffCount,
      smsSentCount: entity.smsSentCount,
      promotionsCount: entity.promotionsCount,

      // Metadata
      metadata: entity.metadata,

      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt
    };
  }

  /**
   * Convert FeatureAccessEntity to FeatureAccessDTO
   */
  static featureAccessToDTO(entity: FeatureAccessEntity): FeatureAccessDTO {
    return {
      id: entity.id,
      profileId: entity.profileId,

      // Feature details
      featureType: entity.featureType,
      featureId: entity.featureId,

      // Access details
      purchasedAt: entity.purchasedAt,
      expiresAt: entity.expiresAt || null,
      isActive: entity.isActive,

      // Payment
      price: entity.price,
      currency: entity.currency,

      // Metadata
      paymentProvider: entity.paymentProvider,
      externalPaymentId: entity.externalPaymentId,
      metadata: entity.metadata,

      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt
    };
  }

  /**
   * Convert SubscriptionStatsEntity to SubscriptionStatsDTO
   */
  static subscriptionStatsToDTO(entity: SubscriptionStatsEntity): SubscriptionStatsDTO {
    return {
      totalPlans: entity.totalPlans,
      activePlans: entity.activePlans,
      totalSubscriptions: entity.totalSubscriptions,
      activeSubscriptions: entity.activeSubscriptions,
      freeUsers: entity.freeUsers,
      proUsers: entity.proUsers,
      enterpriseUsers: entity.enterpriseUsers,
      monthlyRevenue: entity.monthlyRevenue,
      yearlyRevenue: entity.yearlyRevenue,
      totalRevenue: entity.totalRevenue
    };
  }

  /**
   * Convert CurrentUsageStatsEntity to CurrentUsageStatsDTO
   */
  static currentUsageStatsToDTO(entity: CurrentUsageStatsEntity): CurrentUsageStatsDTO {
    return {
      profileId: entity.profileId,
      shopId: entity.shopId,
      todayQueues: entity.todayQueues,
      currentShops: entity.currentShops,
      currentStaff: entity.currentStaff,
      monthlySmsSent: entity.monthlySmsSent,
      activePromotions: entity.activePromotions
    };
  }

  /**
   * Convert paginated subscription plans to DTO
   */
  static toPaginatedSubscriptionPlansDTO(
    paginated: PaginatedResult<SubscriptionPlanEntity>
  ): PaginatedSubscriptionPlansDTO {
    return {
      data: paginated.data.map(entity => this.subscriptionPlanToDTO(entity)),
      pagination: paginated.pagination
    };
  }

  /**
   * Convert paginated profile subscriptions to DTO
   */
  static toPaginatedProfileSubscriptionsDTO(
    paginated: PaginatedResult<ProfileSubscriptionEntity>
  ): PaginatedProfileSubscriptionsDTO {
    return {
      data: paginated.data.map(entity => this.profileSubscriptionToDTO(entity)),
      pagination: paginated.pagination
    };
  }

  /**
   * Convert paginated subscription usage to DTO
   */
  static toPaginatedSubscriptionUsageDTO(
    paginated: PaginatedResult<SubscriptionUsageEntity>
  ): PaginatedSubscriptionUsageDTO {
    return {
      data: paginated.data.map(entity => this.subscriptionUsageToDTO(entity)),
      pagination: paginated.pagination
    };
  }

  /**
   * Convert paginated feature access to DTO
   */
  static toPaginatedFeatureAccessDTO(
    paginated: PaginatedResult<FeatureAccessEntity>
  ): PaginatedFeatureAccessDTO {
    return {
      data: paginated.data.map(entity => this.featureAccessToDTO(entity)),
      pagination: paginated.pagination
    };
  }
}
