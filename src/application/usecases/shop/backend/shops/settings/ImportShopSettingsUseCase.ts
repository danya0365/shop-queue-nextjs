import {
  ImportShopSettingsInput,
  ShopSettingsValidationResultDTO,
} from "@/src/application/dtos/shop/backend/shop-settings-dto";
import { IUseCase } from "@/src/application/interfaces/use-case.interface";
import type { ShopBackendShopSettingsRepository } from "@/src/domain/repositories/shop/backend/backend-shop-settings-repository";
import {
  ShopBackendShopSettingsError,
  ShopBackendShopSettingsErrorType,
} from "@/src/domain/repositories/shop/backend/backend-shop-settings-repository";
import { ValidateShopSettingsUseCase } from "./ValidateShopSettingsUseCase";

interface ImportSettingsData {
  shopId: string;
  exportedAt?: string;
  version?: string;
  shopName?: string;
  shopDescription?: string | null;
  shopPhone?: string | null;
  shopEmail?: string | null;
  shopAddress?: string | null;
  shopWebsite?: string | null;
  shopLogo?: string | null;
  timezone?: string;
  defaultOpenTime?: string;
  defaultCloseTime?: string;
  maxQueuePerService?: number;
  queueTimeoutMinutes?: number;
  allowWalkIn?: boolean;
  allowAdvanceBooking?: boolean;
  maxAdvanceBookingDays?: number;
  pointsEnabled?: boolean;
  pointsPerBaht?: number;
  pointsExpiryMonths?: number;
  minimumPointsToRedeem?: number;
  smsEnabled?: boolean;
  emailEnabled?: boolean;
  lineNotifyEnabled?: boolean;
  notifyBeforeMinutes?: number;
  acceptCash?: boolean;
  acceptCreditCard?: boolean;
  acceptBankTransfer?: boolean;
  acceptPromptPay?: boolean;
  promptPayId?: string | null;
  theme?: "light" | "dark" | "auto";
  language?: "th" | "en";
  currency?: string;
  dateFormat?: string;
  timeFormat?: "12h" | "24h";
  autoConfirmBooking?: boolean;
  requireCustomerPhone?: boolean;
  allowGuestBooking?: boolean;
  showPricesPublic?: boolean;
  enableReviews?: boolean;
  [key: string]: unknown;
}

export class ImportShopSettingsUseCase
  implements IUseCase<ImportShopSettingsInput, ShopSettingsValidationResultDTO>
{
  constructor(
    private readonly shopSettingsRepository: ShopBackendShopSettingsRepository,
    private readonly validateShopSettingsUseCase: ValidateShopSettingsUseCase
  ) {}

  async execute(
    params: ImportShopSettingsInput
  ): Promise<ShopSettingsValidationResultDTO> {
    try {
      // Validate required fields
      if (!params.shopId?.trim()) {
        throw new ShopBackendShopSettingsError(
          ShopBackendShopSettingsErrorType.VALIDATION_ERROR,
          "Shop ID is required",
          "ImportShopSettingsUseCase.execute",
          { params }
        );
      }

      if (!params.settingsData?.trim()) {
        throw new ShopBackendShopSettingsError(
          ShopBackendShopSettingsErrorType.VALIDATION_ERROR,
          "Settings data is required",
          "ImportShopSettingsUseCase.execute",
          { params }
        );
      }

      // Parse the import content (assume JSON format for now)
      let parsedContent: ImportSettingsData;
      try {
        parsedContent = JSON.parse(params.settingsData);
      } catch (error) {
        throw new ShopBackendShopSettingsError(
          ShopBackendShopSettingsErrorType.VALIDATION_ERROR,
          "Invalid JSON format",
          "ImportShopSettingsUseCase.execute",
          { params },
          error
        );
      }

      // Validate parsed content structure
      const importData = this.validateImportStructure(parsedContent);

      // Check if shop exists
      const existingShop =
        await this.shopSettingsRepository.getShopSettingsByShopId(
          params.shopId
        );
      if (!existingShop) {
        throw new ShopBackendShopSettingsError(
          ShopBackendShopSettingsErrorType.NOT_FOUND,
          `Shop not found for shop ID ${params.shopId}`,
          "ImportShopSettingsUseCase.execute",
          { params }
        );
      }

      // Validate the imported settings
      const validationResult = await this.validateShopSettingsUseCase.execute({
        settings: importData,
      });
      if (!validationResult.isValid) {
        throw new ShopBackendShopSettingsError(
          ShopBackendShopSettingsErrorType.VALIDATION_ERROR,
          "Import validation failed",
          "ImportShopSettingsUseCase.execute",
          {
            params,
            validationErrors: validationResult.errors,
          }
        );
      }

      // Prepare update data with all imported settings
      const updateData: Partial<ImportSettingsData> = {
        shopId: params.shopId,
      };

      // Update all available settings from import data
      if (importData.shopName !== undefined)
        updateData.shopName = importData.shopName;
      if (importData.shopDescription !== undefined)
        updateData.shopDescription = importData.shopDescription;
      if (importData.shopPhone !== undefined)
        updateData.shopPhone = importData.shopPhone;
      if (importData.shopEmail !== undefined)
        updateData.shopEmail = importData.shopEmail;
      if (importData.shopAddress !== undefined)
        updateData.shopAddress = importData.shopAddress;
      if (importData.shopWebsite !== undefined)
        updateData.shopWebsite = importData.shopWebsite;
      if (importData.shopLogo !== undefined)
        updateData.shopLogo = importData.shopLogo;
      if (importData.timezone !== undefined)
        updateData.timezone = importData.timezone;
      if (importData.defaultOpenTime !== undefined)
        updateData.defaultOpenTime = importData.defaultOpenTime;
      if (importData.defaultCloseTime !== undefined)
        updateData.defaultCloseTime = importData.defaultCloseTime;
      if (importData.maxQueuePerService !== undefined)
        updateData.maxQueuePerService = importData.maxQueuePerService;
      if (importData.queueTimeoutMinutes !== undefined)
        updateData.queueTimeoutMinutes = importData.queueTimeoutMinutes;
      if (importData.allowWalkIn !== undefined)
        updateData.allowWalkIn = importData.allowWalkIn;
      if (importData.allowAdvanceBooking !== undefined)
        updateData.allowAdvanceBooking = importData.allowAdvanceBooking;
      if (importData.maxAdvanceBookingDays !== undefined)
        updateData.maxAdvanceBookingDays = importData.maxAdvanceBookingDays;
      if (importData.pointsEnabled !== undefined)
        updateData.pointsEnabled = importData.pointsEnabled;
      if (importData.pointsPerBaht !== undefined)
        updateData.pointsPerBaht = importData.pointsPerBaht;
      if (importData.pointsExpiryMonths !== undefined)
        updateData.pointsExpiryMonths = importData.pointsExpiryMonths;
      if (importData.minimumPointsToRedeem !== undefined)
        updateData.minimumPointsToRedeem = importData.minimumPointsToRedeem;
      if (importData.smsEnabled !== undefined)
        updateData.smsEnabled = importData.smsEnabled;
      if (importData.emailEnabled !== undefined)
        updateData.emailEnabled = importData.emailEnabled;
      if (importData.lineNotifyEnabled !== undefined)
        updateData.lineNotifyEnabled = importData.lineNotifyEnabled;
      if (importData.notifyBeforeMinutes !== undefined)
        updateData.notifyBeforeMinutes = importData.notifyBeforeMinutes;
      if (importData.acceptCash !== undefined)
        updateData.acceptCash = importData.acceptCash;
      if (importData.acceptCreditCard !== undefined)
        updateData.acceptCreditCard = importData.acceptCreditCard;
      if (importData.acceptBankTransfer !== undefined)
        updateData.acceptBankTransfer = importData.acceptBankTransfer;
      if (importData.acceptPromptPay !== undefined)
        updateData.acceptPromptPay = importData.acceptPromptPay;
      if (importData.promptPayId !== undefined)
        updateData.promptPayId = importData.promptPayId;
      if (importData.theme !== undefined) updateData.theme = importData.theme;
      if (importData.language !== undefined)
        updateData.language = importData.language;
      if (importData.currency !== undefined)
        updateData.currency = importData.currency;
      if (importData.dateFormat !== undefined)
        updateData.dateFormat = importData.dateFormat;
      if (importData.timeFormat !== undefined)
        updateData.timeFormat = importData.timeFormat;
      if (importData.autoConfirmBooking !== undefined)
        updateData.autoConfirmBooking = importData.autoConfirmBooking;
      if (importData.requireCustomerPhone !== undefined)
        updateData.requireCustomerPhone = importData.requireCustomerPhone;
      if (importData.allowGuestBooking !== undefined)
        updateData.allowGuestBooking = importData.allowGuestBooking;
      if (importData.showPricesPublic !== undefined)
        updateData.showPricesPublic = importData.showPricesPublic;
      if (importData.enableReviews !== undefined)
        updateData.enableReviews = importData.enableReviews;

      // Perform the update
      const updatedSettings =
        await this.shopSettingsRepository.updateShopSettings(
          existingShop.id,
          updateData
        );
      if (!updatedSettings) {
        throw new ShopBackendShopSettingsError(
          ShopBackendShopSettingsErrorType.UNKNOWN,
          "Failed to update shop settings",
          "ImportShopSettingsUseCase.execute",
          { params }
        );
      }

      return {
        isValid: true,
        errors: [],
      };
    } catch (error) {
      if (error instanceof ShopBackendShopSettingsError) {
        throw error;
      }

      throw new ShopBackendShopSettingsError(
        ShopBackendShopSettingsErrorType.UNKNOWN,
        "Failed to import shop settings",
        "ImportShopSettingsUseCase.execute",
        { params },
        error as Error
      );
    }
  }

  private parseCSV(content: string): ImportSettingsData {
    const lines = content.split("\n").filter((line) => line.trim());
    if (lines.length < 2) {
      throw new Error("CSV must have at least a header and one data row");
    }

    const headers = lines[0].split(",");
    const data: ImportSettingsData = {
      shopId: "",
    };

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",");
      if (values.length !== headers.length) {
        continue; // Skip malformed rows
      }

      const key = values[1].trim();
      const value = values[2].trim().replace(/^"|"$/g, "");

      // Direct mapping to ImportSettingsData properties
      if (key === "shopId") data.shopId = value;
      else if (key === "shopName") data.shopName = value;
      else if (key === "shopDescription") data.shopDescription = value;
      else if (key === "shopPhone") data.shopPhone = value;
      else if (key === "shopEmail") data.shopEmail = value;
      else if (key === "shopAddress") data.shopAddress = value;
      else if (key === "shopWebsite") data.shopWebsite = value;
      else if (key === "shopLogo") data.shopLogo = value;
      else if (key === "timezone") data.timezone = value;
      else if (key === "defaultOpenTime") data.defaultOpenTime = value;
      else if (key === "defaultCloseTime") data.defaultCloseTime = value;
      else if (key === "maxQueuePerService")
        data.maxQueuePerService = parseInt(value);
      else if (key === "queueTimeoutMinutes")
        data.queueTimeoutMinutes = parseInt(value);
      else if (key === "allowWalkIn")
        data.allowWalkIn = value.toLowerCase() === "true";
      else if (key === "allowAdvanceBooking")
        data.allowAdvanceBooking = value.toLowerCase() === "true";
      else if (key === "maxAdvanceBookingDays")
        data.maxAdvanceBookingDays = parseInt(value);
      else if (key === "pointsEnabled")
        data.pointsEnabled = value.toLowerCase() === "true";
      else if (key === "pointsPerBaht") data.pointsPerBaht = parseFloat(value);
      else if (key === "pointsExpiryMonths")
        data.pointsExpiryMonths = parseInt(value);
      else if (key === "minimumPointsToRedeem")
        data.minimumPointsToRedeem = parseInt(value);
      else if (key === "smsEnabled")
        data.smsEnabled = value.toLowerCase() === "true";
      else if (key === "emailEnabled")
        data.emailEnabled = value.toLowerCase() === "true";
      else if (key === "lineNotifyEnabled")
        data.lineNotifyEnabled = value.toLowerCase() === "true";
      else if (key === "notifyBeforeMinutes")
        data.notifyBeforeMinutes = parseInt(value);
      else if (key === "acceptCash")
        data.acceptCash = value.toLowerCase() === "true";
      else if (key === "acceptCreditCard")
        data.acceptCreditCard = value.toLowerCase() === "true";
      else if (key === "acceptBankTransfer")
        data.acceptBankTransfer = value.toLowerCase() === "true";
      else if (key === "acceptPromptPay")
        data.acceptPromptPay = value.toLowerCase() === "true";
      else if (key === "promptPayId") data.promptPayId = value;
      else if (key === "theme") data.theme = value as "light" | "dark" | "auto";
      else if (key === "language") data.language = value as "th" | "en";
      else if (key === "currency") data.currency = value;
      else if (key === "dateFormat") data.dateFormat = value;
      else if (key === "timeFormat") data.timeFormat = value as "12h" | "24h";
      else if (key === "autoConfirmBooking")
        data.autoConfirmBooking = value.toLowerCase() === "true";
      else if (key === "requireCustomerPhone")
        data.requireCustomerPhone = value.toLowerCase() === "true";
      else if (key === "allowGuestBooking")
        data.allowGuestBooking = value.toLowerCase() === "true";
      else if (key === "showPricesPublic")
        data.showPricesPublic = value.toLowerCase() === "true";
      else if (key === "enableReviews")
        data.enableReviews = value.toLowerCase() === "true";
    }

    return data;
  }

  private parseXML(content: string): ImportSettingsData {
    // Simple XML parser (in production, use a proper XML parser library)
    const data: ImportSettingsData = {
      shopId: "",
    };

    // Extract metadata
    const shopIdMatch = content.match(/<shopId>(.*?)<\/shopId>/);
    if (shopIdMatch) data.shopId = shopIdMatch[1];

    const exportedAtMatch = content.match(/<exportedAt>(.*?)<\/exportedAt>/);
    if (exportedAtMatch) data.exportedAt = exportedAtMatch[1];

    const versionMatch = content.match(/<version>(.*?)<\/version>/);
    if (versionMatch) data.version = versionMatch[1];

    // Extract sections
    const sections = [
      "basicInfo",
      "businessHours",
      "queueSettings",
      "pointsSettings",
      "notificationSettings",
      "paymentSettings",
      "displaySettings",
      "advancedSettings",
    ];

    for (const section of sections) {
      const sectionMatch = content.match(
        new RegExp(`<${section}>(.*?)<\\/${section}>`, "s")
      );
      if (sectionMatch) {
        data[section] = this.parseXMLSection(sectionMatch[1]);
      }
    }

    return data;
  }

  private parseXMLSection(content: string): Record<string, unknown> {
    const result: Record<string, unknown> = {};

    // Parse simple key-value pairs
    const simplePairs = content.match(/<([^>]+)>([^<]+)<\/\1>/g);
    if (simplePairs) {
      for (const pair of simplePairs) {
        const match = pair.match(/<([^>]+)>([^<]+)<\/\1>/);
        if (match) {
          const key = match[1];
          const value = match[2];

          // Try to parse as JSON first
          try {
            result[key] = JSON.parse(value);
          } catch {
            result[key] = value;
          }
        }
      }
    }

    // Parse arrays
    const arrayItems = content.match(
      /<([^>]+)>\s*<item>([^<]+)<\/item>\s*<\/\1>/g
    );
    if (arrayItems) {
      for (const arrayItem of arrayItems) {
        const match = arrayItem.match(
          /<([^>]+)>\s*<item>([^<]+)<\/item>\s*<\/\1>/
        );
        if (match) {
          const key = match[1];
          const value = match[2];

          if (!result[key]) {
            (result[key] as unknown[]) = [];
          }

          try {
            (result[key] as unknown[]).push(JSON.parse(value));
          } catch {
            (result[key] as unknown[]).push(value);
          }
        }
      }
    }

    return result;
  }

  private validateImportStructure(
    data: ImportSettingsData
  ): ImportSettingsData {
    const requiredFields: (keyof ImportSettingsData)[] = ["shopId"];
    const missingFields = requiredFields.filter((field) => !data[field]);

    if (missingFields.length > 0) {
      throw new ShopBackendShopSettingsError(
        ShopBackendShopSettingsErrorType.VALIDATION_ERROR,
        `Missing required fields: ${missingFields.join(", ")}`,
        "ImportShopSettingsUseCase.validateImportStructure",
        { data }
      );
    }

    // Validate that at least one settings section is present
    // Check if any settings are provided
    const hasSettings = Object.keys(data).some(
      (key) =>
        key !== "shopId" &&
        key !== "exportedAt" &&
        key !== "version" &&
        data[key] !== undefined
    );

    if (!hasSettings) {
      throw new ShopBackendShopSettingsError(
        ShopBackendShopSettingsErrorType.VALIDATION_ERROR,
        "No settings found in import data",
        "ImportShopSettingsUseCase.validateImportStructure",
        { data }
      );
    }

    return data;
  }
}
