import {
  CreateShopSettingsInputDTO,
  PaginatedShopSettingsDTO,
  ShopSettingsDTO,
  ShopSettingsStatsDTO,
  ShopSettingsValidationResultDTO,
  UpdateShopSettingsInputDTO,
} from "@/src/application/dtos/shop/backend/shop-settings-dto";
import {
  CreateShopSettingsEntity,
  PaginatedShopSettingsEntity,
  ShopSettingsEntity,
  ShopSettingsStatsEntity,
  ShopSettingsValidationResult,
  UpdateShopSettingsEntity,
} from "@/src/domain/entities/shop/backend/backend-shop-settings.entity";

/**
 * Mapper class for converting between domain entities and DTOs
 * Following Clean Architecture principles for separation of concerns
 */
export class ShopSettingsMapper {
  /**
   * Map domain entity to DTO
   * @param entity ShopSettings domain entity
   * @returns ShopSettings DTO
   */
  public static toDTO(entity: ShopSettingsEntity): ShopSettingsDTO {
    return {
      id: entity.id,
      shopId: entity.shopId,
      // Basic Shop Information
      shopName: entity.shopName ?? '',
      shopDescription: entity.shopDescription ?? null,
      shopPhone: entity.shopPhone ?? null,
      shopEmail: entity.shopEmail ?? null,
      shopAddress: entity.shopAddress ?? null,
      shopWebsite: entity.shopWebsite ?? null,
      shopLogo: entity.shopLogo ?? null,

      // Business Hours (default values)
      timezone: 'Asia/Bangkok',
      defaultOpenTime: '09:00',
      defaultCloseTime: '17:00',

      // Queue Settings
      maxQueuePerService: entity.maxQueuePerService,
      queueTimeoutMinutes: entity.queueTimeoutMinutes,
      allowWalkIn: entity.allowWalkIn,
      allowAdvanceBooking: entity.allowAdvanceBooking,
      maxAdvanceBookingDays: entity.maxAdvanceBookingDays,

      // Points System
      pointsEnabled: entity.pointsEnabled,
      pointsPerBaht: entity.pointsPerBaht,
      pointsExpiryMonths: entity.pointsExpiryMonths,
      minimumPointsToRedeem: entity.minimumPointsToRedeem,

      // Notification Settings
      smsEnabled: entity.smsEnabled,
      emailEnabled: entity.emailEnabled,
      lineNotifyEnabled: entity.lineNotifyEnabled,
      notifyBeforeMinutes: entity.notifyBeforeMinutes,

      // Payment Settings
      acceptCash: entity.acceptCash,
      acceptCreditCard: entity.acceptCreditCard,
      acceptBankTransfer: entity.acceptBankTransfer,
      acceptPromptPay: entity.acceptPromptPay,
      promptPayId: entity.promptPayId,

      // Display Settings
      theme: entity.theme,
      language: 'th',
      currency: 'THB',
      dateFormat: entity.dateFormat,
      timeFormat: entity.timeFormat,

      // Advanced Settings
      autoConfirmBooking: entity.autoConfirmBooking,
      requireCustomerPhone: entity.requireCustomerPhone,
      allowGuestBooking: entity.allowGuestBooking,
      showPricesPublic: entity.showPricesPublic,
      enableReviews: entity.enableReviews,

      // Security Settings
      enableTwoFactor: entity.enableTwoFactor,
      requireEmailVerification: entity.requireEmailVerification,
      enableSessionTimeout: entity.enableSessionTimeout,

      // Data & Privacy Settings
      enableAnalytics: entity.enableAnalytics,
      enableDataBackup: entity.enableDataBackup,
      allowDataExport: entity.allowDataExport,

      // API & Integration Settings
      apiKey: entity.apiKey,
      enableWebhooks: entity.enableWebhooks,

      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  /**
   * Map stats domain entity to DTO
   * @param entity ShopSettings stats domain entity
   * @returns ShopSettings stats DTO
   */
  public static statsToDTO(
    entity: ShopSettingsStatsEntity
  ): ShopSettingsStatsDTO {
    return {
      totalSettings: entity.totalSettings,
      lastUpdated: entity.lastUpdated,
      enabledFeatures: entity.enabledFeatures,
      disabledFeatures: entity.disabledFeatures,
      integrationStatus: entity.integrationStatus,
    };
  }

  /**
   * Map validation result domain entity to DTO
   * @param entity ShopSettings validation result domain entity
   * @returns ShopSettings validation result DTO
   */
  public static validationResultToDTO(
    entity: ShopSettingsValidationResult
  ): ShopSettingsValidationResultDTO {
    return {
      isValid: entity.isValid,
      errors: entity.errors,
    };
  }

  /**
   * Map paginated shop settings entity to DTO
   * @param entity Paginated shop settings entity
   * @returns Paginated shop settings DTO
   */
  public static toPaginatedDTO(
    entity: PaginatedShopSettingsEntity
  ): PaginatedShopSettingsDTO {
    return {
      data: entity.data.map((settings) => this.toDTO(settings)),
      pagination: {
        currentPage: entity.pagination.currentPage,
        totalPages: entity.pagination.totalPages,
        totalItems: entity.pagination.totalItems,
        itemsPerPage: entity.pagination.itemsPerPage,
        hasNextPage: entity.pagination.hasNextPage,
        hasPrevPage: entity.pagination.hasPrevPage,
      },
    };
  }

  /**
   * Map create input DTO to domain entity
   * @param dto CreateShopSettingsInputDTO
   * @returns CreateShopSettingsEntity
   */
  public static createToEntity(
    dto: CreateShopSettingsInputDTO
  ): CreateShopSettingsEntity {
    return {
      shopId: dto.shopId,
      maxQueuePerService: dto.maxQueuePerService || 10,
      queueTimeoutMinutes: dto.queueTimeoutMinutes || 30,
      allowWalkIn: dto.allowWalkIn ?? true,
      allowAdvanceBooking: dto.allowAdvanceBooking ?? true,
      maxAdvanceBookingDays: dto.maxAdvanceBookingDays || 7,
      pointsEnabled: dto.pointsEnabled ?? false,
      pointsPerBaht: dto.pointsPerBaht || 1,
      pointsExpiryMonths: dto.pointsExpiryMonths || 12,
      minimumPointsToRedeem: dto.minimumPointsToRedeem || 100,
      smsEnabled: dto.smsEnabled ?? false,
      emailEnabled: dto.emailEnabled ?? true,
      lineNotifyEnabled: dto.lineNotifyEnabled ?? false,
      notifyBeforeMinutes: dto.notifyBeforeMinutes || 15,
      acceptCash: dto.acceptCash ?? true,
      acceptCreditCard: dto.acceptCreditCard ?? false,
      acceptBankTransfer: dto.acceptBankTransfer ?? false,
      acceptPromptPay: dto.acceptPromptPay ?? false,
      promptPayId: dto.promptPayId || null,
      theme: dto.theme || "light",
      dateFormat: dto.dateFormat || "DD/MM/YYYY",
      timeFormat: dto.timeFormat || "24h",
      autoConfirmBooking: dto.autoConfirmBooking ?? false,
      requireCustomerPhone: dto.requireCustomerPhone ?? true,
      allowGuestBooking: dto.allowGuestBooking ?? false,
      showPricesPublic: dto.showPricesPublic ?? true,
      enableReviews: dto.enableReviews ?? true,
      enableTwoFactor: dto.enableTwoFactor ?? false,
      requireEmailVerification: dto.requireEmailVerification ?? false,
      enableSessionTimeout: dto.enableSessionTimeout ?? false,
      enableAnalytics: dto.enableAnalytics ?? false,
      enableDataBackup: dto.enableDataBackup ?? false,
      allowDataExport: dto.allowDataExport ?? false,
      apiKey: dto.apiKey || "",
      enableWebhooks: dto.enableWebhooks ?? false,
    };
  }

  /**
   * Map update input DTO to domain entity
   * @param dto UpdateShopSettingsInputDTO
   * @returns UpdateShopSettingsEntity
   */
  public static updateToEntity(
    dto: UpdateShopSettingsInputDTO
  ): UpdateShopSettingsEntity {
    const entity: UpdateShopSettingsEntity = {};

    // Only include fields that are provided
    if (dto.maxQueuePerService !== undefined)
      entity.maxQueuePerService = dto.maxQueuePerService;
    if (dto.queueTimeoutMinutes !== undefined)
      entity.queueTimeoutMinutes = dto.queueTimeoutMinutes;
    if (dto.allowWalkIn !== undefined) entity.allowWalkIn = dto.allowWalkIn;
    if (dto.allowAdvanceBooking !== undefined)
      entity.allowAdvanceBooking = dto.allowAdvanceBooking;
    if (dto.maxAdvanceBookingDays !== undefined)
      entity.maxAdvanceBookingDays = dto.maxAdvanceBookingDays;
    if (dto.pointsEnabled !== undefined)
      entity.pointsEnabled = dto.pointsEnabled;
    if (dto.pointsPerBaht !== undefined)
      entity.pointsPerBaht = dto.pointsPerBaht;
    if (dto.pointsExpiryMonths !== undefined)
      entity.pointsExpiryMonths = dto.pointsExpiryMonths;
    if (dto.minimumPointsToRedeem !== undefined)
      entity.minimumPointsToRedeem = dto.minimumPointsToRedeem;
    if (dto.smsEnabled !== undefined) entity.smsEnabled = dto.smsEnabled;
    if (dto.emailEnabled !== undefined) entity.emailEnabled = dto.emailEnabled;
    if (dto.lineNotifyEnabled !== undefined)
      entity.lineNotifyEnabled = dto.lineNotifyEnabled;
    if (dto.notifyBeforeMinutes !== undefined)
      entity.notifyBeforeMinutes = dto.notifyBeforeMinutes;
    if (dto.acceptCash !== undefined) entity.acceptCash = dto.acceptCash;
    if (dto.acceptCreditCard !== undefined)
      entity.acceptCreditCard = dto.acceptCreditCard;
    if (dto.acceptBankTransfer !== undefined)
      entity.acceptBankTransfer = dto.acceptBankTransfer;
    if (dto.acceptPromptPay !== undefined)
      entity.acceptPromptPay = dto.acceptPromptPay;
    if (dto.promptPayId !== undefined)
      entity.promptPayId = dto.promptPayId || null;
    if (dto.theme !== undefined) entity.theme = dto.theme;
    if (dto.dateFormat !== undefined) entity.dateFormat = dto.dateFormat;
    if (dto.timeFormat !== undefined) entity.timeFormat = dto.timeFormat;
    if (dto.autoConfirmBooking !== undefined)
      entity.autoConfirmBooking = dto.autoConfirmBooking;
    if (dto.requireCustomerPhone !== undefined)
      entity.requireCustomerPhone = dto.requireCustomerPhone;
    if (dto.allowGuestBooking !== undefined)
      entity.allowGuestBooking = dto.allowGuestBooking;
    if (dto.showPricesPublic !== undefined)
      entity.showPricesPublic = dto.showPricesPublic;
    if (dto.enableReviews !== undefined)
      entity.enableReviews = dto.enableReviews;
    if (dto.enableTwoFactor !== undefined)
      entity.enableTwoFactor = dto.enableTwoFactor;
    if (dto.requireEmailVerification !== undefined)
      entity.requireEmailVerification = dto.requireEmailVerification;
    if (dto.enableSessionTimeout !== undefined)
      entity.enableSessionTimeout = dto.enableSessionTimeout;
    if (dto.enableAnalytics !== undefined)
      entity.enableAnalytics = dto.enableAnalytics;
    if (dto.enableDataBackup !== undefined)
      entity.enableDataBackup = dto.enableDataBackup;
    if (dto.allowDataExport !== undefined)
      entity.allowDataExport = dto.allowDataExport;
    if (dto.apiKey !== undefined) entity.apiKey = dto.apiKey;
    if (dto.enableWebhooks !== undefined)
      entity.enableWebhooks = dto.enableWebhooks;

    return entity;
  }
}
