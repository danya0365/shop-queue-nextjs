import {
  ExportShopSettingsInput,
  ExportShopSettingsOutput,
} from "@/src/application/dtos/shop/backend/shop-settings-dto";
import { IUseCase } from "@/src/application/interfaces/use-case.interface";
import type { ShopBackendShopSettingsRepository } from "@/src/domain/repositories/shop/backend/backend-shop-settings-repository";
import {
  ShopBackendShopSettingsError,
  ShopBackendShopSettingsErrorType,
} from "@/src/domain/repositories/shop/backend/backend-shop-settings-repository";

export class ExportShopSettingsUseCase
  implements IUseCase<ExportShopSettingsInput, ExportShopSettingsOutput>
{
  constructor(
    private readonly shopSettingsRepository: ShopBackendShopSettingsRepository
  ) {}

  async execute(
    params: ExportShopSettingsInput
  ): Promise<ExportShopSettingsOutput> {
    try {
      // Validate required fields
      if (!params.shopId?.trim()) {
        throw new ShopBackendShopSettingsError(
          ShopBackendShopSettingsErrorType.VALIDATION_ERROR,
          "Shop ID is required",
          "ExportShopSettingsUseCase.execute",
          { params }
        );
      }

      // Get shop settings
      const shopSettings =
        await this.shopSettingsRepository.getShopSettingsByShopId(
          params.shopId
        );
      if (!shopSettings) {
        throw new ShopBackendShopSettingsError(
          ShopBackendShopSettingsErrorType.NOT_FOUND,
          `Shop settings not found for shop ID ${params.shopId}`,
          "ExportShopSettingsUseCase.execute",
          { params }
        );
      }

      // Prepare export data based on selected sections
      const exportData: Record<string, unknown> = {
        shopId: params.shopId,
        exportedAt: new Date().toISOString(),
        version: "1.0",
      };

      // Include basic info if requested
      if (params.includeBasicInfo) {
        exportData.basicInfo = {
          shopName: shopSettings.shopName,
          shopDescription: shopSettings.shopDescription,
          shopPhone: shopSettings.shopPhone,
          shopEmail: shopSettings.shopEmail,
          shopAddress: shopSettings.shopAddress,
          shopWebsite: shopSettings.shopWebsite,
          shopLogo: shopSettings.shopLogo,
        };
      }

      // Include business hours if requested
      if (params.includeBusinessHours) {
        exportData.businessHours = {
          timezone: 'Asia/Bangkok',
          defaultOpenTime: '09:00',
          defaultCloseTime: '17:00',
        };
      }

      // Include queue settings if requested
      if (params.includeQueueSettings) {
        exportData.queueSettings = {
          maxQueuePerService: shopSettings.maxQueuePerService,
          queueTimeoutMinutes: shopSettings.queueTimeoutMinutes,
          allowWalkIn: shopSettings.allowWalkIn,
          allowAdvanceBooking: shopSettings.allowAdvanceBooking,
          maxAdvanceBookingDays: shopSettings.maxAdvanceBookingDays,
        };
      }

      // Include points settings if requested
      if (params.includePointsSettings) {
        exportData.pointsSettings = {
          pointsEnabled: shopSettings.pointsEnabled,
          pointsPerBaht: shopSettings.pointsPerBaht,
          pointsExpiryMonths: shopSettings.pointsExpiryMonths,
          minimumPointsToRedeem: shopSettings.minimumPointsToRedeem,
        };
      }

      // Include notification settings if requested
      if (params.includeNotificationSettings) {
        exportData.notificationSettings = {
          smsEnabled: shopSettings.smsEnabled,
          emailEnabled: shopSettings.emailEnabled,
          lineNotifyEnabled: shopSettings.lineNotifyEnabled,
          notifyBeforeMinutes: shopSettings.notifyBeforeMinutes,
        };
      }

      // Include payment settings if requested
      if (params.includePaymentSettings) {
        exportData.paymentSettings = {
          acceptCash: shopSettings.acceptCash,
          acceptCreditCard: shopSettings.acceptCreditCard,
          acceptBankTransfer: shopSettings.acceptBankTransfer,
          acceptPromptPay: shopSettings.acceptPromptPay,
          promptPayId: shopSettings.promptPayId,
        };
      }

      // Include display settings if requested
      if (params.includeDisplaySettings) {
        exportData.displaySettings = {
          theme: shopSettings.theme,
          language: 'th',
          currency: 'THB',
          dateFormat: shopSettings.dateFormat,
          timeFormat: shopSettings.timeFormat,
        };
      }

      // Include advanced settings if requested
      if (params.includeAdvancedSettings) {
        exportData.advancedSettings = {
          autoConfirmBooking: shopSettings.autoConfirmBooking,
          requireCustomerPhone: shopSettings.requireCustomerPhone,
          allowGuestBooking: shopSettings.allowGuestBooking,
          showPricesPublic: shopSettings.showPricesPublic,
          enableReviews: shopSettings.enableReviews,
        };
      }

      // Generate export based on format
      let exportContent: string;
      let contentType: string;
      let fileName: string;

      switch (params.format) {
        case "json":
          exportContent = JSON.stringify(exportData, null, 2);
          contentType = "application/json";
          fileName = `shop-settings-${params.shopId}-${
            new Date().toISOString().split("T")[0]
          }.json`;
          break;

        case "csv":
          exportContent = this.convertToCSV(exportData);
          contentType = "text/csv";
          fileName = `shop-settings-${params.shopId}-${
            new Date().toISOString().split("T")[0]
          }.csv`;
          break;

        case "xml":
          exportContent = this.convertToXML(exportData);
          contentType = "application/xml";
          fileName = `shop-settings-${params.shopId}-${
            new Date().toISOString().split("T")[0]
          }.xml`;
          break;

        default:
          throw new ShopBackendShopSettingsError(
            ShopBackendShopSettingsErrorType.VALIDATION_ERROR,
            `Unsupported export format: ${params.format}`,
            "ExportShopSettingsUseCase.execute",
            { params }
          );
      }

      // Calculate checksum for data integrity
      const checksum = this.generateChecksum(exportContent);

      return {
        content: exportContent,
        contentType,
        fileName,
        checksum,
        exportedAt: exportData.exportedAt as string,
        version: exportData.version as string,
        size: exportContent.length,
      };
    } catch (error) {
      if (error instanceof ShopBackendShopSettingsError) {
        throw error;
      }

      throw new ShopBackendShopSettingsError(
        ShopBackendShopSettingsErrorType.UNKNOWN,
        "Failed to export shop settings",
        "ExportShopSettingsUseCase.execute",
        { params },
        error
      );
    }
  }

  private convertToCSV(data: Record<string, unknown>): string {
    const sections: string[] = [];

    // Helper function to flatten nested objects
    const flattenObject = (
      obj: Record<string, unknown>,
      prefix = ""
    ): string[] => {
      const result: string[] = [];

      for (const [key, value] of Object.entries(obj)) {
        const fullKey = prefix ? `${prefix}.${key}` : key;

        if (
          typeof value === "object" &&
          value !== null &&
          !Array.isArray(value)
        ) {
          result.push(
            ...flattenObject(value as Record<string, unknown>, fullKey)
          );
        } else if (Array.isArray(value)) {
          result.push(`${fullKey}:"${JSON.stringify(value)}"`);
        } else {
          result.push(`${fullKey}:"${value}"`);
        }
      }

      return result;
    };

    // Add metadata
    sections.push("Section,Key,Value");
    sections.push("Metadata,shopId," + data.shopId);
    sections.push("Metadata,exportedAt," + data.exportedAt);
    sections.push("Metadata,version," + data.version);

    // Add each section
    const sectionKeys = [
      "basicInfo",
      "businessHours",
      "queueSettings",
      "pointsSettings",
      "notificationSettings",
      "paymentSettings",
      "displaySettings",
      "advancedSettings",
    ];

    for (const sectionKey of sectionKeys) {
      if (data[sectionKey]) {
        if (Array.isArray(data[sectionKey])) {
          data[sectionKey].forEach(
            (item: Record<string, unknown>, index: number) => {
              const flatItem = flattenObject(item, `${sectionKey}[${index}]`);
              flatItem.forEach((line) => {
                const [key, value] = line.split(":");
                sections.push(`${sectionKey},${key},${value}`);
              });
            }
          );
        } else {
          const flatSection = flattenObject(
            data[sectionKey] as Record<string, unknown>,
            sectionKey
          );
          flatSection.forEach((line) => {
            const [key, value] = line.split(":");
            sections.push(`${sectionKey},${key},${value}`);
          });
        }
      }
    }

    return sections.join("\n");
  }

  private convertToXML(data: Record<string, unknown>): string {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += "<shopSettings>\n";

    // Add metadata
    xml += `  <metadata>\n`;
    xml += `    <shopId>${this.escapeXML(data.shopId as string)}</shopId>\n`;
    xml += `    <exportedAt>${this.escapeXML(
      data.exportedAt as string
    )}</exportedAt>\n`;
    xml += `    <version>${this.escapeXML(data.version as string)}</version>\n`;
    xml += `  </metadata>\n`;

    // Helper function to convert object to XML
    const objectToXML = (obj: Record<string, unknown>, indent = 2): string => {
      let result = "";
      const spaces = " ".repeat(indent);

      for (const [key, value] of Object.entries(obj)) {
        if (value === null || value === undefined) {
          continue;
        }

        if (Array.isArray(value)) {
          result += `${spaces}<${key}>\n`;
          value.forEach((item) => {
            if (typeof item === "object") {
              result += objectToXML(
                item as Record<string, unknown>,
                indent + 2
              );
            } else {
              result += `${spaces}  <item>${this.escapeXML(
                String(item)
              )}</item>\n`;
            }
          });
          result += `${spaces}</${key}>\n`;
        } else if (typeof value === "object") {
          result += `${spaces}<${key}>\n`;
          result += objectToXML(value as Record<string, unknown>, indent + 2);
          result += `${spaces}</${key}>\n`;
        } else {
          result += `${spaces}<${key}>${this.escapeXML(
            String(value)
          )}</${key}>\n`;
        }
      }

      return result;
    };

    // Add sections
    const sectionKeys = [
      "basicInfo",
      "businessHours",
      "queueSettings",
      "pointsSettings",
      "notificationSettings",
      "paymentSettings",
      "displaySettings",
      "advancedSettings",
    ];

    for (const sectionKey of sectionKeys) {
      if (data[sectionKey]) {
        xml += `  <${sectionKey}>\n`;
        xml += objectToXML(data[sectionKey] as Record<string, unknown>, 4);
        xml += `  </${sectionKey}>\n`;
      }
    }

    xml += "</shopSettings>";
    return xml;
  }

  private generateChecksum(content: string): string {
    // Simple checksum implementation (in production, use a proper cryptographic hash)
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16).padStart(8, "0");
  }

  private escapeXML(text: string): string {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }
}
