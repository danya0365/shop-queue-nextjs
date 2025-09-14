import {
  CreateShopSettingsInputDTO,
  UpdateShopSettingsInputDTO,
  ShopSettingsDTO,
  ShopSettingsStatsDTO,
  ShopSettingsValidationResultDTO,
  PaginatedShopSettingsDTO
} from "@/src/application/dtos/shop/backend/shop-settings-dto";
import {
  ShopSettingsEntity,
  ShopSettingsStatsEntity,
  ShopSettingsValidationResult,
  PaginatedShopSettingsEntity,
  CreateShopSettingsEntity,
  UpdateShopSettingsEntity
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
      shopName: entity.shopName,
      shopDescription: entity.shopDescription,
      shopPhone: entity.shopPhone,
      shopEmail: entity.shopEmail,
      shopAddress: entity.shopAddress,
      shopWebsite: entity.shopWebsite,
      shopLogo: entity.shopLogo,

      // Business Hours
      timezone: entity.timezone,
      defaultOpenTime: entity.defaultOpenTime,
      defaultCloseTime: entity.defaultCloseTime,

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
      language: entity.language,
      currency: entity.currency,
      dateFormat: entity.dateFormat,
      timeFormat: entity.timeFormat,

      // Advanced Settings
      autoConfirmBooking: entity.autoConfirmBooking,
      requireCustomerPhone: entity.requireCustomerPhone,
      allowGuestBooking: entity.allowGuestBooking,
      showPricesPublic: entity.showPricesPublic,
      enableReviews: entity.enableReviews,

      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  /**
   * Map stats domain entity to DTO
   * @param entity ShopSettings stats domain entity
   * @returns ShopSettings stats DTO
   */
  public static statsToDTO(entity: ShopSettingsStatsEntity): ShopSettingsStatsDTO {
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
  public static validationResultToDTO(entity: ShopSettingsValidationResult): ShopSettingsValidationResultDTO {
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
  public static createToEntity(dto: CreateShopSettingsInputDTO): CreateShopSettingsEntity {
    return {
      shopId: dto.shopId,
      shopName: dto.shopName,
      shopDescription: dto.shopDescription || null,
      shopPhone: dto.shopPhone || null,
      shopEmail: dto.shopEmail || null,
      shopAddress: dto.shopAddress || null,
      shopWebsite: dto.shopWebsite || null,
      shopLogo: dto.shopLogo || null,
      timezone: dto.timezone || 'Asia/Bangkok',
      defaultOpenTime: dto.defaultOpenTime || '09:00',
      defaultCloseTime: dto.defaultCloseTime || '17:00',
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
      theme: dto.theme || 'light',
      language: dto.language || 'th',
      currency: dto.currency || 'THB',
      dateFormat: dto.dateFormat || 'DD/MM/YYYY',
      timeFormat: dto.timeFormat || '24h',
      autoConfirmBooking: dto.autoConfirmBooking ?? false,
      requireCustomerPhone: dto.requireCustomerPhone ?? true,
      allowGuestBooking: dto.allowGuestBooking ?? false,
      showPricesPublic: dto.showPricesPublic ?? true,
      enableReviews: dto.enableReviews ?? true,
    };
  }

  /**
   * Map update input DTO to domain entity
   * @param dto UpdateShopSettingsInputDTO
   * @returns UpdateShopSettingsEntity
   */
  public static updateToEntity(dto: UpdateShopSettingsInputDTO): UpdateShopSettingsEntity {
    const entity: UpdateShopSettingsEntity = {};

    // Only include fields that are provided
    if (dto.shopName !== undefined) entity.shopName = dto.shopName;
    if (dto.shopDescription !== undefined) entity.shopDescription = dto.shopDescription || null;
    if (dto.shopPhone !== undefined) entity.shopPhone = dto.shopPhone || null;
    if (dto.shopEmail !== undefined) entity.shopEmail = dto.shopEmail || null;
    if (dto.shopAddress !== undefined) entity.shopAddress = dto.shopAddress || null;
    if (dto.shopWebsite !== undefined) entity.shopWebsite = dto.shopWebsite || null;
    if (dto.shopLogo !== undefined) entity.shopLogo = dto.shopLogo || null;
    if (dto.timezone !== undefined) entity.timezone = dto.timezone;
    if (dto.defaultOpenTime !== undefined) entity.defaultOpenTime = dto.defaultOpenTime;
    if (dto.defaultCloseTime !== undefined) entity.defaultCloseTime = dto.defaultCloseTime;
    if (dto.maxQueuePerService !== undefined) entity.maxQueuePerService = dto.maxQueuePerService;
    if (dto.queueTimeoutMinutes !== undefined) entity.queueTimeoutMinutes = dto.queueTimeoutMinutes;
    if (dto.allowWalkIn !== undefined) entity.allowWalkIn = dto.allowWalkIn;
    if (dto.allowAdvanceBooking !== undefined) entity.allowAdvanceBooking = dto.allowAdvanceBooking;
    if (dto.maxAdvanceBookingDays !== undefined) entity.maxAdvanceBookingDays = dto.maxAdvanceBookingDays;
    if (dto.pointsEnabled !== undefined) entity.pointsEnabled = dto.pointsEnabled;
    if (dto.pointsPerBaht !== undefined) entity.pointsPerBaht = dto.pointsPerBaht;
    if (dto.pointsExpiryMonths !== undefined) entity.pointsExpiryMonths = dto.pointsExpiryMonths;
    if (dto.minimumPointsToRedeem !== undefined) entity.minimumPointsToRedeem = dto.minimumPointsToRedeem;
    if (dto.smsEnabled !== undefined) entity.smsEnabled = dto.smsEnabled;
    if (dto.emailEnabled !== undefined) entity.emailEnabled = dto.emailEnabled;
    if (dto.lineNotifyEnabled !== undefined) entity.lineNotifyEnabled = dto.lineNotifyEnabled;
    if (dto.notifyBeforeMinutes !== undefined) entity.notifyBeforeMinutes = dto.notifyBeforeMinutes;
    if (dto.acceptCash !== undefined) entity.acceptCash = dto.acceptCash;
    if (dto.acceptCreditCard !== undefined) entity.acceptCreditCard = dto.acceptCreditCard;
    if (dto.acceptBankTransfer !== undefined) entity.acceptBankTransfer = dto.acceptBankTransfer;
    if (dto.acceptPromptPay !== undefined) entity.acceptPromptPay = dto.acceptPromptPay;
    if (dto.promptPayId !== undefined) entity.promptPayId = dto.promptPayId || null;
    if (dto.theme !== undefined) entity.theme = dto.theme;
    if (dto.language !== undefined) entity.language = dto.language;
    if (dto.currency !== undefined) entity.currency = dto.currency;
    if (dto.dateFormat !== undefined) entity.dateFormat = dto.dateFormat;
    if (dto.timeFormat !== undefined) entity.timeFormat = dto.timeFormat;
    if (dto.autoConfirmBooking !== undefined) entity.autoConfirmBooking = dto.autoConfirmBooking;
    if (dto.requireCustomerPhone !== undefined) entity.requireCustomerPhone = dto.requireCustomerPhone;
    if (dto.allowGuestBooking !== undefined) entity.allowGuestBooking = dto.allowGuestBooking;
    if (dto.showPricesPublic !== undefined) entity.showPricesPublic = dto.showPricesPublic;
    if (dto.enableReviews !== undefined) entity.enableReviews = dto.enableReviews;

    return entity;
  }
}
