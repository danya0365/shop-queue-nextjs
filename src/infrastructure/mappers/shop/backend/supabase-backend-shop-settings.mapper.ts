import {
  ShopSettingsEntity,
  ShopSettingsStatsEntity,
} from "@/src/domain/entities/shop/backend/backend-shop-settings.entity";
import { ShopSettingsSchema, ShopSettingsStatsSchema } from "@/src/infrastructure/schemas/shop/backend/shop-settings.schema";
import { PaginationMeta, PaginatedResult } from "@/src/domain/interfaces/pagination-types";

/**
 * Mapper class for converting between shop settings database schema and domain entities
 * Following Clean Architecture principles for separation of concerns
 */
export class SupabaseShopBackendShopSettingsMapper {
  /**
   * Map database schema to domain entity
   * @param schema Shop settings database schema
   * @returns Shop settings domain entity
   */
  public static toDomain(schema: ShopSettingsSchema): ShopSettingsEntity {
    return {
      id: schema.id,
      shopId: schema.shop_id,
      
      // Basic Settings
      estimatedServiceTime: schema.estimated_service_time ?? 15,
      maintenanceMode: schema.maintenance_mode ?? false,
      allowRegistration: schema.allow_registration ?? true,
      sessionTimeout: schema.session_timeout ?? 30,
      backupFrequency: schema.backup_frequency ?? null,
      logLevel: schema.log_level ?? null,
      dataRetentionDays: schema.data_retention_days ?? 365,
      
      // Queue Settings
      autoConfirmQueues: schema.auto_confirm_queues ?? true,
      maxQueueSize: schema.max_queue_size ?? 50,
      maxQueuePerService: schema.max_queue_per_service,
      queueTimeoutMinutes: schema.queue_timeout_minutes,
      allowWalkIn: schema.allow_walk_in ?? true,
      allowAdvanceBooking: schema.allow_advance_booking ?? true,
      maxAdvanceBookingDays: schema.max_advance_booking_days,
      bookingWindowHours: schema.booking_window_hours ?? 24,
      cancellationDeadline: schema.cancellation_deadline ?? 30,
      
      // Points System
      pointsEnabled: schema.points_enabled ?? false,
      pointsPerBaht: schema.points_per_baht,
      pointsExpiryMonths: schema.points_expiry_months,
      minimumPointsToRedeem: schema.minimum_points_to_redeem,
      
      // Notification Settings
      smsEnabled: schema.sms_enabled ?? false,
      emailEnabled: schema.email_enabled ?? true,
      lineNotifyEnabled: schema.line_notify_enabled ?? false,
      notifyBeforeMinutes: schema.notify_before_minutes,
      
      // Payment Settings
      acceptCash: schema.accept_cash ?? true,
      acceptCreditCard: schema.accept_credit_card ?? false,
      acceptBankTransfer: schema.accept_bank_transfer ?? false,
      acceptPromptPay: schema.accept_promptpay ?? false,
      promptPayId: schema.promptpay_id ?? null,
      
      // Display Settings
      theme: (schema.theme as "light" | "dark" | "auto") || "light",
      dateFormat: schema.date_format || "DD/MM/YYYY",
      timeFormat: (schema.time_format as "12h" | "24h") || "24h",
      
      // Advanced Settings
      autoConfirmBooking: schema.auto_confirm_booking ?? false,
      requireCustomerPhone: schema.require_customer_phone ?? true,
      allowGuestBooking: schema.allow_guest_booking ?? false,
      showPricesPublic: schema.show_prices_public ?? true,
      enableReviews: schema.enable_reviews ?? true,
      
      // Security Settings
      enableTwoFactor: schema.enable_two_factor ?? false,
      requireEmailVerification: schema.require_email_verification ?? false,
      enableSessionTimeout: schema.enable_session_timeout ?? false,
      
      // Data & Privacy Settings
      enableAnalytics: schema.enable_analytics ?? false,
      enableDataBackup: schema.enable_data_backup ?? false,
      allowDataExport: schema.allow_data_export ?? false,
      
      // API & Integration Settings
      apiKey: schema.api_key || "",
      enableWebhooks: schema.enable_webhooks ?? false,
      
      // Joined Shop Information
      shopName: schema.shops?.name,
      shopDescription: schema.shops?.description,
      shopPhone: schema.shops?.phone,
      shopEmail: schema.shops?.email,
      shopAddress: schema.shops?.address,
      shopWebsite: schema.shops?.website,
      shopLogo: schema.shops?.logo,
      
      createdAt: schema.created_at ?? '',
      updatedAt: schema.updated_at ?? '',
    };
  }

  /**
   * Map domain entity to database schema
   * @param entity Shop settings domain entity
   * @returns Shop settings database schema
   */
  public static toSchema(entity: ShopSettingsEntity): ShopSettingsSchema {
    return {
      id: entity.id,
      shop_id: entity.shopId,
      
      // Basic Settings
      estimated_service_time: entity.estimatedServiceTime,
      maintenance_mode: entity.maintenanceMode,
      allow_registration: entity.allowRegistration,
      session_timeout: entity.sessionTimeout,
      backup_frequency: entity.backupFrequency,
      log_level: entity.logLevel,
      data_retention_days: entity.dataRetentionDays,
      
      // Queue Settings
      auto_confirm_queues: entity.autoConfirmQueues,
      max_queue_size: entity.maxQueueSize,
      max_queue_per_service: entity.maxQueuePerService,
      queue_timeout_minutes: entity.queueTimeoutMinutes,
      allow_walk_in: entity.allowWalkIn,
      allow_advance_booking: entity.allowAdvanceBooking,
      max_advance_booking_days: entity.maxAdvanceBookingDays,
      booking_window_hours: entity.bookingWindowHours,
      cancellation_deadline: entity.cancellationDeadline,
      
      // Points System
      points_enabled: entity.pointsEnabled,
      points_per_baht: entity.pointsPerBaht,
      points_expiry_months: entity.pointsExpiryMonths,
      minimum_points_to_redeem: entity.minimumPointsToRedeem,
      
      // Notification Settings
      sms_enabled: entity.smsEnabled,
      email_enabled: entity.emailEnabled,
      line_notify_enabled: entity.lineNotifyEnabled,
      notify_before_minutes: entity.notifyBeforeMinutes,
      
      // Payment Settings
      accept_cash: entity.acceptCash,
      accept_credit_card: entity.acceptCreditCard,
      accept_bank_transfer: entity.acceptBankTransfer,
      accept_promptpay: entity.acceptPromptPay,
      promptpay_id: entity.promptPayId,
      
      // Display Settings
      theme: entity.theme,
      date_format: entity.dateFormat,
      time_format: entity.timeFormat,
      
      // Advanced Settings
      auto_confirm_booking: entity.autoConfirmBooking,
      require_customer_phone: entity.requireCustomerPhone,
      allow_guest_booking: entity.allowGuestBooking,
      show_prices_public: entity.showPricesPublic,
      enable_reviews: entity.enableReviews,
      
      // Security Settings
      enable_two_factor: entity.enableTwoFactor,
      require_email_verification: entity.requireEmailVerification,
      enable_session_timeout: entity.enableSessionTimeout,
      
      // Data & Privacy Settings
      enable_analytics: entity.enableAnalytics,
      enable_data_backup: entity.enableDataBackup,
      allow_data_export: entity.allowDataExport,
      
      // API & Integration Settings
      api_key: entity.apiKey,
      enable_webhooks: entity.enableWebhooks,
      
      created_at: entity.createdAt,
      updated_at: entity.updatedAt,
    };
  }

  /**
   * Map database schema to stats domain entity
   * @param schema Shop settings stats database schema
   * @returns Shop settings stats domain entity
   */
  public static toStatsDomain(schema: ShopSettingsStatsSchema): ShopSettingsStatsEntity {
    const enabledFeatures: string[] = [];
    const disabledFeatures: string[] = [];
    const integrationStatus: Record<string, boolean> = {};
    
    if (schema.shops_with_analytics > 0) enabledFeatures.push('analytics');
    else disabledFeatures.push('analytics');
    
    if (schema.shops_with_reviews > 0) enabledFeatures.push('reviews');
    else disabledFeatures.push('reviews');
    
    if (schema.shops_with_points > 0) enabledFeatures.push('points');
    else disabledFeatures.push('points');
    
    if (schema.shops_with_webhooks > 0) {
      enabledFeatures.push('webhooks');
      integrationStatus.webhooks = true;
    } else {
      disabledFeatures.push('webhooks');
      integrationStatus.webhooks = false;
    }
    
    return {
      totalSettings: schema.total_shops,
      lastUpdated: new Date().toISOString(),
      enabledFeatures,
      disabledFeatures,
      integrationStatus,
    };
  }

  /**
   * Map database schemas to paginated domain entity
   * @param schemas Shop settings database schemas
   * @param pagination Pagination metadata
   * @returns Paginated shop settings domain entity
   */
  public static toPaginatedDomain(
    schemas: ShopSettingsSchema[],
    pagination: PaginationMeta
  ): PaginatedResult<ShopSettingsEntity> {
    const entities = schemas.map(schema => this.toDomain(schema));
    return {
      data: entities,
      pagination
    };
  }

  /**
   * Create pagination metadata
   * @param page Current page number
   * @param limit Items per page
   * @param total Total number of items
   * @returns Pagination metadata
   */
  public static createPaginationMeta(
    page: number,
    limit: number,
    total: number
  ): PaginationMeta {
    const totalPages = Math.ceil(total / limit);
    
    return {
      currentPage: page,
      itemsPerPage: limit,
      totalItems: total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    };
  }
}
