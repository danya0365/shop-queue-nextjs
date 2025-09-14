import {
  CreateShopSettingsEntity,
  PaginatedShopSettingsEntity,
  ShopSettingsEntity,
  ShopSettingsStatsEntity,
  ShopSettingsValidationResult,
  UpdateShopSettingsEntity,
} from "@/src/domain/entities/shop/backend/backend-shop-settings.entity";
import {
  DatabaseDataSource,
  FilterOperator,
  QueryOptions,
  SortDirection,
} from "@/src/domain/interfaces/datasources/database-datasource";
import { Logger } from "@/src/domain/interfaces/logger";
import { PaginationParams } from "@/src/domain/interfaces/pagination-types";
import {
  ShopBackendShopSettingsError,
  ShopBackendShopSettingsErrorType,
  ShopBackendShopSettingsRepository,
} from "@/src/domain/repositories/shop/backend/backend-shop-settings-repository";
import { SupabaseShopBackendShopSettingsMapper } from "@/src/infrastructure/mappers/shop/backend/supabase-backend-shop-settings.mapper";
import {
  ShopSettingsSchema,
  ShopSettingsStatsSchema,
} from "@/src/infrastructure/schemas/shop/backend/shop-settings.schema";
import { StandardRepository } from "../../base/standard-repository";

// Extended types for joined data
type ShopSettingsWithShop = ShopSettingsSchema & {
  shops?: {
    name?: string;
    description?: string;
    address?: string;
    phone?: string;
    email?: string;
    website?: string;
    logo?: string;
    qr_code_url?: string;
    timezone?: string;
    currency?: string;
    language?: string;
    status?: string;
    owner_id?: string;
  };
};

type ShopSettingsSchemaRecord = Record<string, unknown> & ShopSettingsSchema;
type ShopSettingsStatsSchemaRecord = Record<string, unknown> &
  ShopSettingsStatsSchema;

/**
 * Supabase implementation of the shop settings repository
 * Following Clean Architecture principles for repository implementation
 */
export class SupabaseShopBackendShopSettingsRepository
  extends StandardRepository
  implements ShopBackendShopSettingsRepository
{
  constructor(dataSource: DatabaseDataSource, logger: Logger) {
    super(dataSource, logger, "ShopBackendShopSettings");
  }

  /**
   * Get shop settings by shop ID
   * @param shopId Shop ID
   * @returns Shop settings entity or null if not found
   */
  async getShopSettingsByShopId(
    shopId: string
  ): Promise<ShopSettingsEntity | null> {
    try {
      this.logger.info("Getting shop settings by shop ID", { shopId });

      const queryOptions: QueryOptions = {
        select: ["*"],
        joins: [
          {
            table: "shops",
            on: { fromField: "shop_id", toField: "id" },
          },
        ],
        filters: [
          {
            field: "shop_id",
            operator: FilterOperator.EQ,
            value: shopId,
          },
        ],
      };

      const result =
        await this.dataSource.getAdvanced<ShopSettingsSchemaRecord>(
          "shop_settings",
          queryOptions
        );

      if (!result || result.length === 0) {
        this.logger.info("Shop settings not found", { shopId });
        return null;
      }

      const shopSettingsWithShop = result[0] as ShopSettingsWithShop;
      const mappedResult =
        SupabaseShopBackendShopSettingsMapper.toDomain(shopSettingsWithShop);

      this.logger.info("Shop settings retrieved", { shopId });
      return mappedResult;
    } catch (error) {
      this.logger.error("Error getting shop settings by shop ID", {
        error,
        shopId,
      });
      throw new ShopBackendShopSettingsError(
        ShopBackendShopSettingsErrorType.OPERATION_FAILED,
        "Failed to get shop settings by shop ID",
        "getShopSettingsByShopId",
        { shopId },
        error
      );
    }
  }

  /**
   * Get paginated shop settings data from database
   * @param params Pagination parameters with filters
   * @returns Paginated shop settings data
   */
  async getPaginatedShopSettings(
    params: PaginationParams & {
      filters?: {
        searchQuery?: string;
        shopId?: string;
        themeFilter?: string;
        maintenanceModeFilter?: boolean;
        analyticsEnabledFilter?: boolean;
        pointsEnabledFilter?: boolean;
        reviewsEnabledFilter?: boolean;
        emailEnabledFilter?: boolean;
        smsEnabledFilter?: boolean;
        lineNotifyEnabledFilter?: boolean;
        webhooksEnabledFilter?: boolean;
        twoFactorEnabledFilter?: boolean;
        dataBackupEnabledFilter?: boolean;
        allowGuestBookingFilter?: boolean;
        allowWalkInFilter?: boolean;
        allowAdvanceBookingFilter?: boolean;
        acceptCashFilter?: boolean;
        acceptCreditCardFilter?: boolean;
        acceptPromptpayFilter?: boolean;
        acceptBankTransferFilter?: boolean;
        showPricesPublicFilter?: boolean;
        requireCustomerPhoneFilter?: boolean;
        minMaxQueueSize?: number;
        maxMaxQueueSize?: number;
        minMaxAdvanceBookingDays?: number;
        maxMaxAdvanceBookingDays?: number;
        minPointsPerBaht?: number;
        maxPointsPerBaht?: number;
        minNotifyBeforeMinutes?: number;
        maxNotifyBeforeMinutes?: number;
        minQueueTimeoutMinutes?: number;
        maxQueueTimeoutMinutes?: number;
      };
    }
  ): Promise<PaginatedShopSettingsEntity> {
    try {
      const { page, limit, filters } = params;
      const offset = (page - 1) * limit;

      // Build query options
      const queryOptions: QueryOptions = {
        select: ["*"],
        joins: [
          {
            table: "shops",
            on: { fromField: "shop_id", toField: "id" },
          },
        ],
        sort: [{ field: "created_at", direction: SortDirection.DESC }],
        pagination: {
          limit,
          offset,
        },
        filters: [],
      };

      // Apply filters
      if (filters?.searchQuery) {
        queryOptions.filters?.push({
          field: "shops.name",
          operator: FilterOperator.ILIKE,
          value: `%${filters.searchQuery}%`,
        });
      }

      if (filters?.shopId) {
        queryOptions.filters?.push({
          field: "shop_id",
          operator: FilterOperator.EQ,
          value: filters.shopId,
        });
      }

      if (filters?.themeFilter) {
        queryOptions.filters?.push({
          field: "theme",
          operator: FilterOperator.EQ,
          value: filters.themeFilter,
        });
      }

      if (filters?.maintenanceModeFilter !== undefined) {
        queryOptions.filters?.push({
          field: "maintenance_mode",
          operator: FilterOperator.EQ,
          value: filters.maintenanceModeFilter,
        });
      }

      if (filters?.analyticsEnabledFilter !== undefined) {
        queryOptions.filters?.push({
          field: "enable_analytics",
          operator: FilterOperator.EQ,
          value: filters.analyticsEnabledFilter,
        });
      }

      if (filters?.pointsEnabledFilter !== undefined) {
        queryOptions.filters?.push({
          field: "points_enabled",
          operator: FilterOperator.EQ,
          value: filters.pointsEnabledFilter,
        });
      }

      if (filters?.reviewsEnabledFilter !== undefined) {
        queryOptions.filters?.push({
          field: "enable_reviews",
          operator: FilterOperator.EQ,
          value: filters.reviewsEnabledFilter,
        });
      }

      if (filters?.emailEnabledFilter !== undefined) {
        queryOptions.filters?.push({
          field: "email_enabled",
          operator: FilterOperator.EQ,
          value: filters.emailEnabledFilter,
        });
      }

      if (filters?.smsEnabledFilter !== undefined) {
        queryOptions.filters?.push({
          field: "sms_enabled",
          operator: FilterOperator.EQ,
          value: filters.smsEnabledFilter,
        });
      }

      if (filters?.lineNotifyEnabledFilter !== undefined) {
        queryOptions.filters?.push({
          field: "line_notify_enabled",
          operator: FilterOperator.EQ,
          value: filters.lineNotifyEnabledFilter,
        });
      }

      if (filters?.webhooksEnabledFilter !== undefined) {
        queryOptions.filters?.push({
          field: "enable_webhooks",
          operator: FilterOperator.EQ,
          value: filters.webhooksEnabledFilter,
        });
      }

      if (filters?.twoFactorEnabledFilter !== undefined) {
        queryOptions.filters?.push({
          field: "enable_two_factor",
          operator: FilterOperator.EQ,
          value: filters.twoFactorEnabledFilter,
        });
      }

      if (filters?.dataBackupEnabledFilter !== undefined) {
        queryOptions.filters?.push({
          field: "enable_data_backup",
          operator: FilterOperator.EQ,
          value: filters.dataBackupEnabledFilter,
        });
      }

      if (filters?.allowGuestBookingFilter !== undefined) {
        queryOptions.filters?.push({
          field: "allow_guest_booking",
          operator: FilterOperator.EQ,
          value: filters.allowGuestBookingFilter,
        });
      }

      if (filters?.allowWalkInFilter !== undefined) {
        queryOptions.filters?.push({
          field: "allow_walk_in",
          operator: FilterOperator.EQ,
          value: filters.allowWalkInFilter,
        });
      }

      if (filters?.allowAdvanceBookingFilter !== undefined) {
        queryOptions.filters?.push({
          field: "allow_advance_booking",
          operator: FilterOperator.EQ,
          value: filters.allowAdvanceBookingFilter,
        });
      }

      if (filters?.acceptCashFilter !== undefined) {
        queryOptions.filters?.push({
          field: "accept_cash",
          operator: FilterOperator.EQ,
          value: filters.acceptCashFilter,
        });
      }

      if (filters?.acceptCreditCardFilter !== undefined) {
        queryOptions.filters?.push({
          field: "accept_credit_card",
          operator: FilterOperator.EQ,
          value: filters.acceptCreditCardFilter,
        });
      }

      if (filters?.acceptPromptpayFilter !== undefined) {
        queryOptions.filters?.push({
          field: "accept_promptpay",
          operator: FilterOperator.EQ,
          value: filters.acceptPromptpayFilter,
        });
      }

      if (filters?.acceptBankTransferFilter !== undefined) {
        queryOptions.filters?.push({
          field: "accept_bank_transfer",
          operator: FilterOperator.EQ,
          value: filters.acceptBankTransferFilter,
        });
      }

      if (filters?.showPricesPublicFilter !== undefined) {
        queryOptions.filters?.push({
          field: "show_prices_public",
          operator: FilterOperator.EQ,
          value: filters.showPricesPublicFilter,
        });
      }

      if (filters?.requireCustomerPhoneFilter !== undefined) {
        queryOptions.filters?.push({
          field: "require_customer_phone",
          operator: FilterOperator.EQ,
          value: filters.requireCustomerPhoneFilter,
        });
      }

      // Use extended type that satisfies Record<string, unknown> constraint
      const shopSettings =
        await this.dataSource.getAdvanced<ShopSettingsSchemaRecord>(
          "shop_settings",
          queryOptions
        );

      // Count total items with the same filters
      const countQueryOptions: QueryOptions = {
        filters: queryOptions.filters || [],
      };
      const totalItems = await this.dataSource.count(
        "shop_settings",
        countQueryOptions
      );

      // Map database results to domain entities
      let mappedShopSettings = shopSettings.map((shopSetting) => {
        // Handle joined data from shops table using our ShopSettingsWithShop type
        const shopSettingWithJoinedData = shopSetting as ShopSettingsWithShop;
        return SupabaseShopBackendShopSettingsMapper.toDomain(
          shopSettingWithJoinedData
        );
      });

      // Apply post-query filters for numeric range filtering
      if (filters?.minMaxQueueSize !== undefined) {
        mappedShopSettings = mappedShopSettings.filter(
          (setting) => setting.maxQueueSize >= filters.minMaxQueueSize!
        );
      }

      if (filters?.maxMaxQueueSize !== undefined) {
        mappedShopSettings = mappedShopSettings.filter(
          (setting) => setting.maxQueueSize <= filters.maxMaxQueueSize!
        );
      }

      if (filters?.minMaxAdvanceBookingDays !== undefined) {
        mappedShopSettings = mappedShopSettings.filter(
          (setting) =>
            setting.maxAdvanceBookingDays >= filters.minMaxAdvanceBookingDays!
        );
      }

      if (filters?.maxMaxAdvanceBookingDays !== undefined) {
        mappedShopSettings = mappedShopSettings.filter(
          (setting) =>
            setting.maxAdvanceBookingDays <= filters.maxMaxAdvanceBookingDays!
        );
      }

      if (filters?.minPointsPerBaht !== undefined) {
        mappedShopSettings = mappedShopSettings.filter(
          (setting) => setting.pointsPerBaht >= filters.minPointsPerBaht!
        );
      }

      if (filters?.maxPointsPerBaht !== undefined) {
        mappedShopSettings = mappedShopSettings.filter(
          (setting) => setting.pointsPerBaht <= filters.maxPointsPerBaht!
        );
      }

      if (filters?.minNotifyBeforeMinutes !== undefined) {
        mappedShopSettings = mappedShopSettings.filter(
          (setting) =>
            setting.notifyBeforeMinutes >= filters.minNotifyBeforeMinutes!
        );
      }

      if (filters?.maxNotifyBeforeMinutes !== undefined) {
        mappedShopSettings = mappedShopSettings.filter(
          (setting) =>
            setting.notifyBeforeMinutes <= filters.maxNotifyBeforeMinutes!
        );
      }

      if (filters?.minQueueTimeoutMinutes !== undefined) {
        mappedShopSettings = mappedShopSettings.filter(
          (setting) =>
            setting.queueTimeoutMinutes >= filters.minQueueTimeoutMinutes!
        );
      }

      if (filters?.maxQueueTimeoutMinutes !== undefined) {
        mappedShopSettings = mappedShopSettings.filter(
          (setting) =>
            setting.queueTimeoutMinutes <= filters.maxQueueTimeoutMinutes!
        );
      }

      // Create pagination metadata
      const pagination =
        SupabaseShopBackendShopSettingsMapper.createPaginationMeta(
          page,
          limit,
          totalItems
        );

      return {
        data: mappedShopSettings,
        pagination,
      };
    } catch (error) {
      if (error instanceof ShopBackendShopSettingsError) {
        throw error;
      }

      this.logger.error("Error in getPaginatedShopSettings", { error });
      throw new ShopBackendShopSettingsError(
        ShopBackendShopSettingsErrorType.UNKNOWN,
        "An unexpected error occurred while fetching shop settings",
        "getPaginatedShopSettings",
        {},
        error
      );
    }
  }

  /**
   * Get shop settings statistics
   * @param shopId Shop ID
   * @returns Shop settings statistics data
   */
  async getShopSettingsStats(shopId: string): Promise<ShopSettingsStatsEntity> {
    // TODO: Implement getShopSettingsStats
    return {
      totalSettings: 0,
      lastUpdated: new Date().toISOString(),
      enabledFeatures: [],
      disabledFeatures: [],
      integrationStatus: {},
    };
    try {
      this.logger.info("Getting shop settings statistics", { shopId });

      // Use getAdvanced to fetch statistics data
      const queryOptions: QueryOptions = {
        select: ["*"],
        filters: [
          {
            field: "shop_id",
            operator: FilterOperator.EQ,
            value: shopId,
          },
        ],
      };

      const result =
        await this.dataSource.getAdvanced<ShopSettingsStatsSchemaRecord>(
          "shop_settings_stats_view",
          queryOptions
        );

      if (!result || result.length === 0) {
        this.logger.info("Shop settings stats not found", { shopId });
        // Return default stats if no data found
        return {
          totalSettings: 0,
          lastUpdated: new Date().toISOString(),
          enabledFeatures: [],
          disabledFeatures: [],
          integrationStatus: {},
        };
      }

      const mappedResult = SupabaseShopBackendShopSettingsMapper.toStatsDomain(
        result[0] as ShopSettingsStatsSchema
      );

      this.logger.info("Shop settings statistics retrieved", { shopId });
      return mappedResult;
    } catch (error) {
      this.logger.error("Error getting shop settings statistics", {
        error,
        shopId,
      });
      throw new ShopBackendShopSettingsError(
        ShopBackendShopSettingsErrorType.OPERATION_FAILED,
        "Failed to get shop settings statistics",
        "getShopSettingsStats",
        { shopId },
        error
      );
    }
  }

  /**
   * Create shop settings
   * @param settings Shop settings data to create
   * @returns Created shop settings entity
   */
  async createShopSettings(
    settings: Omit<CreateShopSettingsEntity, "id" | "createdAt" | "updatedAt">
  ): Promise<ShopSettingsEntity> {
    try {
      this.logger.info("Creating shop settings", { shopId: settings.shopId });

      // Convert domain entity to database schema
      const schema = SupabaseShopBackendShopSettingsMapper.toSchema({
        ...settings,
        id: "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as ShopSettingsEntity);

      // Remove auto-generated fields
      const {
        id: _id,
        created_at: _created_at,
        updated_at: _updated_at,
        ...insertData
      } = schema;

      // Insert the new shop settings
      const result = await this.dataSource.insert<ShopSettingsSchemaRecord>(
        "shop_settings",
        insertData
      );

      if (!result) {
        throw new ShopBackendShopSettingsError(
          ShopBackendShopSettingsErrorType.OPERATION_FAILED,
          "Failed to create shop settings",
          "createShopSettings",
          { shopId: settings.shopId }
        );
      }

      // Get the created shop settings with joined shop data
      const createdSettings = await this.getShopSettingsByShopId(
        settings.shopId
      );
      if (!createdSettings) {
        throw new ShopBackendShopSettingsError(
          ShopBackendShopSettingsErrorType.OPERATION_FAILED,
          "Failed to retrieve created shop settings",
          "createShopSettings",
          { shopId: settings.shopId }
        );
      }

      this.logger.info("Shop settings created", { shopId: settings.shopId });
      return createdSettings;
    } catch (error) {
      if (error instanceof ShopBackendShopSettingsError) {
        throw error;
      }

      this.logger.error("Error creating shop settings", {
        error,
        shopId: settings.shopId,
      });
      throw new ShopBackendShopSettingsError(
        ShopBackendShopSettingsErrorType.OPERATION_FAILED,
        "Failed to create shop settings",
        "createShopSettings",
        { shopId: settings.shopId },
        error
      );
    }
  }

  /**
   * Update shop settings
   * @param shopId Shop ID
   * @param settings Shop settings data to update
   * @returns Updated shop settings entity
   */
  async updateShopSettings(
    shopId: string,
    settings: Partial<
      Omit<UpdateShopSettingsEntity, "id" | "createdAt" | "updatedAt">
    >
  ): Promise<ShopSettingsEntity> {
    try {
      this.logger.info("Updating shop settings", { shopId });

      // Get existing shop settings
      const existingSettings = await this.getShopSettingsByShopId(shopId);

      if (!existingSettings) {
        throw new ShopBackendShopSettingsError(
          ShopBackendShopSettingsErrorType.NOT_FOUND,
          "Shop settings not found",
          "updateShopSettings",
          { shopId }
        );
      }

      // Merge existing settings with updates
      const updatedSettings = {
        ...existingSettings,
        ...settings,
        updatedAt: new Date().toISOString(),
      };

      // Convert to database schema
      const schema =
        SupabaseShopBackendShopSettingsMapper.toSchema(updatedSettings);

      // Remove immutable fields
      const {
        id: _id,
        created_at: _created_at,
        shop_id: _shop_id,
        ...updateData
      } = schema;

      // Update the shop settings
      const result = await this.dataSource.update<ShopSettingsSchemaRecord>(
        "shop_settings",
        existingSettings.id,
        updateData
      );

      if (!result) {
        throw new ShopBackendShopSettingsError(
          ShopBackendShopSettingsErrorType.OPERATION_FAILED,
          "Failed to update shop settings",
          "updateShopSettings",
          { shopId }
        );
      }

      // Get the updated shop settings with joined shop data
      const updatedShopSettings = await this.getShopSettingsByShopId(shopId);
      if (!updatedShopSettings) {
        throw new ShopBackendShopSettingsError(
          ShopBackendShopSettingsErrorType.OPERATION_FAILED,
          "Failed to retrieve updated shop settings",
          "updateShopSettings",
          { shopId }
        );
      }

      this.logger.info("Shop settings updated", { shopId });
      return updatedShopSettings;
    } catch (error) {
      if (error instanceof ShopBackendShopSettingsError) {
        throw error;
      }

      this.logger.error("Error updating shop settings", { error, shopId });
      throw new ShopBackendShopSettingsError(
        ShopBackendShopSettingsErrorType.OPERATION_FAILED,
        "Failed to update shop settings",
        "updateShopSettings",
        { shopId },
        error
      );
    }
  }

  /**
   * Reset shop settings to defaults
   * @param shopId Shop ID
   * @returns Reset shop settings entity
   */
  async resetShopSettingsToDefaults(
    shopId: string
  ): Promise<ShopSettingsEntity> {
    try {
      this.logger.info("Resetting shop settings to defaults", { shopId });

      // Get existing shop settings
      const existingSettings = await this.getShopSettingsByShopId(shopId);
      if (!existingSettings) {
        throw new ShopBackendShopSettingsError(
          ShopBackendShopSettingsErrorType.NOT_FOUND,
          "Shop settings not found",
          "resetShopSettingsToDefaults",
          { shopId }
        );
      }

      // Create default settings
      const defaultSettings: Partial<ShopSettingsEntity> = {
        acceptBankTransfer: false,
        acceptCash: true,
        acceptCreditCard: false,
        acceptPromptPay: false,
        allowAdvanceBooking: true,
        allowDataExport: false,
        allowGuestBooking: false,
        allowRegistration: true,
        allowWalkIn: true,
        apiKey: "",
        autoConfirmBooking: false,
        autoConfirmQueues: true,
        backupFrequency: "daily",
        bookingWindowHours: 24,
        cancellationDeadline: 30,
        dataRetentionDays: 365,
        dateFormat: "DD/MM/YYYY",
        emailEnabled: true,
        enableAnalytics: false,
        enableDataBackup: false,
        enableReviews: true,
        enableSessionTimeout: false,
        enableTwoFactor: false,
        enableWebhooks: false,
        estimatedServiceTime: 15,
        lineNotifyEnabled: false,
        logLevel: "info",
        maintenanceMode: false,
        maxAdvanceBookingDays: 7,
        maxQueuePerService: 10,
        minimumPointsToRedeem: 100,
        notifyBeforeMinutes: 15,
        pointsEnabled: false,
        pointsExpiryMonths: 12,
        pointsPerBaht: 1,
        promptPayId: null,
        queueTimeoutMinutes: 30,
        requireCustomerPhone: true,
        requireEmailVerification: false,
        sessionTimeout: 30,
        showPricesPublic: true,
        smsEnabled: false,
        theme: "light",
        timeFormat: "24h",
        updatedAt: new Date().toISOString(),
      };

      // Update with default settings
      const updatedSettings = await this.updateShopSettings(
        shopId,
        defaultSettings
      );

      this.logger.info("Shop settings reset to defaults", { shopId });
      return updatedSettings;
    } catch (error) {
      if (error instanceof ShopBackendShopSettingsError) {
        throw error;
      }

      this.logger.error("Error resetting shop settings to defaults", {
        error,
        shopId,
      });
      throw new ShopBackendShopSettingsError(
        ShopBackendShopSettingsErrorType.OPERATION_FAILED,
        "Failed to reset shop settings to defaults",
        "resetShopSettingsToDefaults",
        { shopId },
        error
      );
    }
  }

  /**
   * Delete shop settings
   * @param shopId Shop ID
   * @returns true if deleted successfully
   * @throws ShopBackendShopSettingsError if the operation fails
   */
  async deleteShopSettings(shopId: string): Promise<boolean> {
    try {
      this.logger.info("Deleting shop settings", { shopId });

      // First, get the shop settings ID by shop_id
      const getOptions: QueryOptions = {
        filters: [
          {
            field: "shop_id",
            operator: FilterOperator.EQ,
            value: shopId,
          },
        ],
      };

      const settings =
        await this.dataSource.getAdvanced<ShopSettingsSchemaRecord>(
          "shop_settings",
          getOptions
        );

      if (!settings || settings.length === 0) {
        throw new ShopBackendShopSettingsError(
          ShopBackendShopSettingsErrorType.NOT_FOUND,
          "Shop settings not found",
          "deleteShopSettings",
          { shopId }
        );
      }

      // Delete by ID
      await this.dataSource.delete("shop_settings", settings[0].id);

      this.logger.info("Shop settings deleted successfully", { shopId });
      return true;
    } catch (error) {
      if (error instanceof ShopBackendShopSettingsError) {
        throw error;
      }

      this.logger.error("Error deleting shop settings", { error, shopId });
      throw new ShopBackendShopSettingsError(
        ShopBackendShopSettingsErrorType.OPERATION_FAILED,
        "Failed to delete shop settings",
        "deleteShopSettings",
        { shopId },
        error
      );
    }
  }

  /**
   * Validate shop settings
   * @param settings Shop settings data to validate
   * @returns Validation result
   * @throws ShopBackendShopSettingsError if the operation fails
   */
  async validateShopSettings(
    settings: Partial<ShopSettingsEntity>
  ): Promise<ShopSettingsValidationResult> {
    try {
      this.logger.info("Validating shop settings", { settings });

      const errors: string[] = [];

      // Validate required fields
      if (!settings.shopId || settings.shopId.trim() === "") {
        errors.push("Shop ID is required");
      }

      // Validate numeric ranges
      if (
        settings.maxQueuePerService !== undefined &&
        settings.maxQueuePerService <= 0
      ) {
        errors.push("Max queue per service must be greater than 0");
      }

      if (
        settings.queueTimeoutMinutes !== undefined &&
        settings.queueTimeoutMinutes <= 0
      ) {
        errors.push("Queue timeout minutes must be greater than 0");
      }

      // Validate configuration consistency
      if (settings.enableWebhooks && !settings.apiKey) {
        errors.push("Webhooks are enabled but no API key is provided");
      }

      if (settings.pointsEnabled && !settings.pointsPerBaht) {
        errors.push("Points system is enabled but points per baht is not set");
      }

      const isValid = errors.length === 0;

      this.logger.info("Shop settings validation completed", {
        isValid,
        errorsCount: errors.length,
      });

      return {
        isValid,
        errors,
      };
    } catch (error) {
      this.logger.error("Error validating shop settings", { error, settings });
      throw new ShopBackendShopSettingsError(
        ShopBackendShopSettingsErrorType.VALIDATION_ERROR,
        "Failed to validate shop settings",
        "validateShopSettings",
        { settings },
        error
      );
    }
  }

  /**
   * Export shop settings
   * @param shopId Shop ID
   * @returns Exported settings data as JSON string
   * @throws ShopBackendShopSettingsError if the operation fails
   */
  async exportShopSettings(shopId: string): Promise<string> {
    try {
      this.logger.info("Exporting shop settings", { shopId });

      const settings = await this.getShopSettingsByShopId(shopId);

      if (!settings) {
        throw new ShopBackendShopSettingsError(
          ShopBackendShopSettingsErrorType.NOT_FOUND,
          "Shop settings not found",
          "exportShopSettings",
          { shopId }
        );
      }

      // Remove sensitive data before export
      const exportData = {
        ...settings,
        apiKey: undefined, // Remove sensitive API key
      };

      const jsonString = JSON.stringify(exportData, null, 2);

      this.logger.info("Shop settings exported successfully", { shopId });
      return jsonString;
    } catch (error) {
      if (error instanceof ShopBackendShopSettingsError) {
        throw error;
      }

      this.logger.error("Error exporting shop settings", { error, shopId });
      throw new ShopBackendShopSettingsError(
        ShopBackendShopSettingsErrorType.OPERATION_FAILED,
        "Failed to export shop settings",
        "exportShopSettings",
        { shopId },
        error
      );
    }
  }

  /**
   * Import shop settings
   * @param shopId Shop ID
   * @param settingsData Settings data as JSON string
   * @returns Imported shop settings entity
   * @throws ShopBackendShopSettingsError if the operation fails
   */
  async importShopSettings(
    shopId: string,
    settingsData: string
  ): Promise<ShopSettingsEntity> {
    try {
      this.logger.info("Importing shop settings", { shopId });

      let parsedData: Partial<ShopSettingsEntity>;
      try {
        parsedData = JSON.parse(settingsData);
      } catch (_parseError) {
        throw new ShopBackendShopSettingsError(
          ShopBackendShopSettingsErrorType.VALIDATION_ERROR,
          "Invalid JSON format in settings data",
          "importShopSettings",
          { shopId, settingsData }
        );
      }

      // Validate the imported data
      const validationResult = await this.validateShopSettings(parsedData);
      if (!validationResult.isValid) {
        throw new ShopBackendShopSettingsError(
          ShopBackendShopSettingsErrorType.VALIDATION_ERROR,
          "Imported settings data is invalid",
          "importShopSettings",
          { shopId, errors: validationResult.errors }
        );
      }

      // Ensure shopId matches
      parsedData.shopId = shopId;

      // Check if settings already exist
      const existingSettings = await this.getShopSettingsByShopId(shopId);

      let result: ShopSettingsEntity;
      if (existingSettings) {
        // Update existing settings
        result = await this.updateShopSettings(shopId, parsedData);
      } else {
        // Create new settings
        result = await this.createShopSettings(
          parsedData as Omit<
            CreateShopSettingsEntity,
            "id" | "createdAt" | "updatedAt"
          >
        );
      }

      this.logger.info("Shop settings imported successfully", { shopId });
      return result;
    } catch (error) {
      if (error instanceof ShopBackendShopSettingsError) {
        throw error;
      }

      this.logger.error("Error importing shop settings", { error, shopId });
      throw new ShopBackendShopSettingsError(
        ShopBackendShopSettingsErrorType.OPERATION_FAILED,
        "Failed to import shop settings",
        "importShopSettings",
        { shopId },
        error
      );
    }
  }
}
