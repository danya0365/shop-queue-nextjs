import {
  ResetShopSettingsInput,
  ResetShopSettingsOutput,
} from "@/src/application/dtos/shop/backend/shop-settings-dto";
import { IUseCase } from "@/src/application/interfaces/use-case.interface";
import type { ShopBackendShopSettingsRepository } from "@/src/domain/repositories/shop/backend/backend-shop-settings-repository";
import {
  ShopBackendShopSettingsError,
  ShopBackendShopSettingsErrorType,
} from "@/src/domain/repositories/shop/backend/backend-shop-settings-repository";

export class ResetShopSettingsUseCase
  implements IUseCase<ResetShopSettingsInput, ResetShopSettingsOutput>
{
  constructor(
    private readonly shopSettingsRepository: ShopBackendShopSettingsRepository
  ) {}

  async execute(
    params: ResetShopSettingsInput
  ): Promise<ResetShopSettingsOutput> {
    try {
      // Validate required fields
      if (!params.shopId?.trim()) {
        throw new ShopBackendShopSettingsError(
          ShopBackendShopSettingsErrorType.VALIDATION_ERROR,
          "Shop ID is required",
          "ResetShopSettingsUseCase.execute",
          { params }
        );
      }

      // Check if shop exists
      const existingSettings =
        await this.shopSettingsRepository.getShopSettingsByShopId(
          params.shopId
        );
      if (!existingSettings) {
        throw new ShopBackendShopSettingsError(
          ShopBackendShopSettingsErrorType.NOT_FOUND,
          `Shop settings not found for shop ID ${params.shopId}`,
          "ResetShopSettingsUseCase.execute",
          { params }
        );
      }

      // Prepare reset data based on selected sections
      const resetData: Record<string, unknown> = {
        shopId: params.shopId,
        updatedAt: new Date(),
      };

      // Store original values for the result
      const originalValues: Record<string, unknown> = {};

      // Reset basic info if requested
      if (params.resetBasicInfo) {
        originalValues.basicInfo = {
          shopName: existingSettings.shopName,
          shopDescription: existingSettings.shopDescription,
          shopPhone: existingSettings.shopPhone,
          shopEmail: existingSettings.shopEmail,
          shopAddress: existingSettings.shopAddress,
          shopWebsite: existingSettings.shopWebsite,
          shopLogo: existingSettings.shopLogo,
        };
        Object.assign(resetData, this.getDefaultBasicInfo());
      }

      // Reset business hours if requested
      if (params.resetBusinessHours) {
        originalValues.businessHours = {
          timezone: existingSettings.timezone,
          defaultOpenTime: existingSettings.defaultOpenTime,
          defaultCloseTime: existingSettings.defaultCloseTime,
        };
        Object.assign(resetData, this.getDefaultBusinessHours());
      }

      // Reset queue settings if requested
      if (params.resetQueueSettings) {
        originalValues.queueSettings = {
          maxQueuePerService: existingSettings.maxQueuePerService,
          queueTimeoutMinutes: existingSettings.queueTimeoutMinutes,
          allowWalkIn: existingSettings.allowWalkIn,
          allowAdvanceBooking: existingSettings.allowAdvanceBooking,
          maxAdvanceBookingDays: existingSettings.maxAdvanceBookingDays,
        };
        Object.assign(resetData, this.getDefaultQueueSettings());
      }

      // Reset points settings if requested
      if (params.resetPointsSettings) {
        originalValues.pointsSettings = {
          pointsEnabled: existingSettings.pointsEnabled,
          pointsPerBaht: existingSettings.pointsPerBaht,
          pointsExpiryMonths: existingSettings.pointsExpiryMonths,
          minimumPointsToRedeem: existingSettings.minimumPointsToRedeem,
        };
        Object.assign(resetData, this.getDefaultPointsSettings());
      }

      // Reset notification settings if requested
      if (params.resetNotificationSettings) {
        originalValues.notificationSettings = {
          smsEnabled: existingSettings.smsEnabled,
          emailEnabled: existingSettings.emailEnabled,
          lineNotifyEnabled: existingSettings.lineNotifyEnabled,
          notifyBeforeMinutes: existingSettings.notifyBeforeMinutes,
        };
        Object.assign(resetData, this.getDefaultNotificationSettings());
      }

      // Reset payment settings if requested
      if (params.resetPaymentSettings) {
        originalValues.paymentSettings = {
          acceptCash: existingSettings.acceptCash,
          acceptCreditCard: existingSettings.acceptCreditCard,
          acceptBankTransfer: existingSettings.acceptBankTransfer,
          acceptPromptPay: existingSettings.acceptPromptPay,
          promptPayId: existingSettings.promptPayId,
        };
        Object.assign(resetData, this.getDefaultPaymentSettings());
      }

      // Reset display settings if requested
      if (params.resetDisplaySettings) {
        originalValues.displaySettings = {
          theme: existingSettings.theme,
          language: existingSettings.language,
          currency: existingSettings.currency,
          dateFormat: existingSettings.dateFormat,
          timeFormat: existingSettings.timeFormat,
        };
        Object.assign(resetData, this.getDefaultDisplaySettings());
      }

      // Reset advanced settings if requested
      if (params.resetAdvancedSettings) {
        originalValues.advancedSettings = {
          autoConfirmBooking: existingSettings.autoConfirmBooking,
          requireCustomerPhone: existingSettings.requireCustomerPhone,
          allowGuestBooking: existingSettings.allowGuestBooking,
          showPricesPublic: existingSettings.showPricesPublic,
          enableReviews: existingSettings.enableReviews,
        };
        Object.assign(resetData, this.getDefaultAdvancedSettings());
      }

      // Check if any sections were selected for reset
      const resetSections = this.getResetSections(params);
      if (resetSections.length === 0) {
        throw new ShopBackendShopSettingsError(
          ShopBackendShopSettingsErrorType.VALIDATION_ERROR,
          "No sections selected for reset",
          "ResetShopSettingsUseCase.execute",
          { params }
        );
      }

      // Perform the reset
      const resetSettings =
        await this.shopSettingsRepository.updateShopSettings(
          existingSettings.id,
          resetData
        );
      if (!resetSettings) {
        throw new ShopBackendShopSettingsError(
          ShopBackendShopSettingsErrorType.UNKNOWN,
          "Failed to reset shop settings",
          "ResetShopSettingsUseCase.execute",
          { params }
        );
      }

      return {
        success: true,
        message: "Shop settings reset successfully",
        resetSections,
        originalValues,
        resetAt: new Date().toISOString(),
        resetBy: params.resetBy || "system",
      };
    } catch (error) {
      if (error instanceof ShopBackendShopSettingsError) {
        throw error;
      }

      throw new ShopBackendShopSettingsError(
        ShopBackendShopSettingsErrorType.UNKNOWN,
        "Failed to reset shop settings",
        "ResetShopSettingsUseCase.execute",
        { params },
        error
      );
    }
  }

  private getDefaultBasicInfo(): Record<string, unknown> {
    return {
      shopName: "",
      shopDescription: null,
      shopPhone: null,
      shopEmail: null,
      shopAddress: null,
      shopWebsite: null,
      shopLogo: null,
    };
  }

  private getDefaultBusinessHours(): Record<string, unknown> {
    return {
      timezone: "Asia/Bangkok",
      defaultOpenTime: "09:00",
      defaultCloseTime: "17:00",
    };
  }

  private getDefaultQueueSettings(): Record<string, unknown> {
    return {
      maxQueuePerService: 50,
      queueTimeoutMinutes: 30,
      allowWalkIn: true,
      allowAdvanceBooking: true,
      maxAdvanceBookingDays: 30,
    };
  }

  private getDefaultPointsSettings(): Record<string, unknown> {
    return {
      pointsEnabled: false,
      pointsPerBaht: 1,
      pointsExpiryMonths: 12,
      minimumPointsToRedeem: 100,
    };
  }

  private getDefaultNotificationSettings(): Record<string, unknown> {
    return {
      smsEnabled: false,
      emailEnabled: true,
      lineNotifyEnabled: false,
      notifyBeforeMinutes: 15,
    };
  }

  private getDefaultPaymentSettings(): Record<string, unknown> {
    return {
      acceptCash: true,
      acceptCreditCard: false,
      acceptBankTransfer: false,
      acceptPromptPay: false,
      promptPayId: null,
    };
  }

  private getDefaultDisplaySettings(): Record<string, unknown> {
    return {
      theme: "light",
      language: "th",
      currency: "THB",
      dateFormat: "DD/MM/YYYY",
      timeFormat: "24h",
    };
  }

  private getDefaultAdvancedSettings(): Record<string, unknown> {
    return {
      autoConfirmBooking: false,
      requireCustomerPhone: true,
      allowGuestBooking: false,
      showPricesPublic: true,
      enableReviews: true,
    };
  }

  private getResetSections(params: ResetShopSettingsInput): string[] {
    const sections: string[] = [];

    if (params.resetBasicInfo) sections.push("basicInfo");
    if (params.resetBusinessHours) sections.push("businessHours");
    if (params.resetQueueSettings) sections.push("queueSettings");
    if (params.resetPointsSettings) sections.push("pointsSettings");
    if (params.resetNotificationSettings) sections.push("notificationSettings");
    if (params.resetPaymentSettings) sections.push("paymentSettings");
    if (params.resetDisplaySettings) sections.push("displaySettings");
    if (params.resetAdvancedSettings) sections.push("advancedSettings");

    return sections;
  }
}
