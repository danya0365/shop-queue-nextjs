import type {
  CreateShopSettingsEntity,
  PaginatedShopSettingsEntity,
  ShopSettingsEntity,
  ShopSettingsStatsEntity,
  ShopSettingsValidationResult,
  UpdateShopSettingsEntity,
} from "@/src/domain/entities/shop/backend/backend-shop-settings.entity";
import type { PaginationParams } from "@/src/domain/interfaces/pagination-types";
import type { SupabaseDatasource } from "@/src/infrastructure/datasources/supabase-datasource";
import { ShopBackendShopSettingsError, ShopBackendShopSettingsErrorType } from "@/src/domain/repositories/shop/backend/backend-shop-settings-repository";
import type { ShopBackendShopSettingsRepository } from "@/src/domain/repositories/shop/backend/backend-shop-settings-repository";
import type { Logger } from "@/src/domain/interfaces/logger";

/**
 * Supabase implementation of Shop Settings repository
 * Following Clean Architecture principles and Infrastructure Layer pattern
 */
export class SupabaseBackendShopSettingsRepository implements ShopBackendShopSettingsRepository {
  constructor(
    private readonly databaseDatasource: SupabaseDatasource,
    private readonly logger: Logger
  ) {}

  async getShopSettingsByShopId(shopId: string): Promise<ShopSettingsEntity | null> {
    try {
      this.logger.info('SupabaseBackendShopSettingsRepository: Getting shop settings by shop ID', { shopId });
      
      const result = await this.databaseDatasource.getById<ShopSettingsEntity>('shop_settings', shopId);
      
      if (!result) {
        this.logger.info('SupabaseBackendShopSettingsRepository: Shop settings not found', { shopId });
        return null;
      }
      
      this.logger.info('SupabaseBackendShopSettingsRepository: Shop settings retrieved', { shopId });
      return result;
    } catch (error) {
      this.logger.error('SupabaseBackendShopSettingsRepository: Error getting shop settings by shop ID', { error, shopId });
      throw new ShopBackendShopSettingsError(
        ShopBackendShopSettingsErrorType.OPERATION_FAILED,
        'Failed to get shop settings by shop ID',
        'getShopSettingsByShopId',
        { shopId },
        error
      );
    }
  }

  async getShopSettingsById(id: string): Promise<ShopSettingsEntity | null> {
    try {
      this.logger.info('SupabaseBackendShopSettingsRepository: Getting shop settings by ID', { id });
      
      const result = await this.databaseDatasource.getById<ShopSettingsEntity>('shop_settings', id);
      
      if (!result) {
        this.logger.info('SupabaseBackendShopSettingsRepository: Shop settings not found', { id });
        return null;
      }
      
      this.logger.info('SupabaseBackendShopSettingsRepository: Shop settings retrieved', { id });
      return result;
    } catch (error) {
      this.logger.error('SupabaseBackendShopSettingsRepository: Error getting shop settings by ID', { error, id });
      throw new ShopBackendShopSettingsError(
        ShopBackendShopSettingsErrorType.OPERATION_FAILED,
        'Failed to get shop settings by ID',
        'getShopSettingsById',
        { id },
        error
      );
    }
  }

  async getPaginatedShopSettings(
    params: PaginationParams
  ): Promise<PaginatedShopSettingsEntity> {
    try {
      this.logger.info('SupabaseBackendShopSettingsRepository: Getting paginated shop settings', { params });
      
      // Use getAdvanced with pagination options
      const options = {
        filters: [],
        limit: params.limit,
        offset: (params.page - 1) * params.limit,
      };
      
      const [data, totalCount] = await Promise.all([
        this.databaseDatasource.getAdvanced<ShopSettingsEntity>('shop_settings', options),
        this.databaseDatasource.count('shop_settings', options)
      ]);
      
      const result: PaginatedShopSettingsEntity = {
        data,
        pagination: {
          currentPage: params.page,
          itemsPerPage: params.limit,
          totalItems: totalCount,
          totalPages: Math.ceil(totalCount / params.limit),
          hasNextPage: params.page < Math.ceil(totalCount / params.limit),
          hasPrevPage: params.page > 1
        }
      };
      
      this.logger.info('SupabaseBackendShopSettingsRepository: Paginated shop settings retrieved', { 
        page: params.page, 
        limit: params.limit 
      });
      return result;
    } catch (error) {
      this.logger.error('SupabaseBackendShopSettingsRepository: Error getting paginated shop settings', { error, params });
      throw new ShopBackendShopSettingsError(
        ShopBackendShopSettingsErrorType.OPERATION_FAILED,
        'Failed to get paginated shop settings',
        'getPaginatedShopSettings',
        { params },
        error
      );
    }
  }

  async createShopSettings(
    settings: Omit<CreateShopSettingsEntity, "id" | "createdAt" | "updatedAt">
  ): Promise<ShopSettingsEntity> {
    try {
      this.logger.info('SupabaseBackendShopSettingsRepository: Creating shop settings', { settings });
      
      const result = await this.databaseDatasource.insert<ShopSettingsEntity>('shop_settings', settings);
      
      this.logger.info('SupabaseBackendShopSettingsRepository: Shop settings created', { id: result.id });
      return result;
    } catch (error) {
      this.logger.error('SupabaseBackendShopSettingsRepository: Error creating shop settings', { error, settings });
      throw new ShopBackendShopSettingsError(
        ShopBackendShopSettingsErrorType.OPERATION_FAILED,
        'Failed to create shop settings',
        'createShopSettings',
        { settings },
        error
      );
    }
  }

  async updateShopSettings(
    shopId: string,
    settings: Partial<
      Omit<UpdateShopSettingsEntity, "id" | "createdAt" | "updatedAt">
    >
  ): Promise<ShopSettingsEntity> {
    try {
      this.logger.info('SupabaseBackendShopSettingsRepository: Updating shop settings', { shopId, settings });
      
      const result = await this.databaseDatasource.update<ShopSettingsEntity>('shop_settings', shopId, settings);
      
      this.logger.info('SupabaseBackendShopSettingsRepository: Shop settings updated', { shopId });
      return result;
    } catch (error) {
      this.logger.error('SupabaseBackendShopSettingsRepository: Error updating shop settings', { error, shopId, settings });
      throw new ShopBackendShopSettingsError(
        ShopBackendShopSettingsErrorType.OPERATION_FAILED,
        'Failed to update shop settings',
        'updateShopSettings',
        { shopId, settings },
        error
      );
    }
  }

  async resetShopSettingsToDefaults(shopId: string): Promise<ShopSettingsEntity> {
    try {
      this.logger.info('SupabaseBackendShopSettingsRepository: Resetting shop settings to defaults', { shopId });
      
      // Get existing settings
      const existingSettings = await this.getShopSettingsByShopId(shopId);
      
      if (!existingSettings) {
        throw new ShopBackendShopSettingsError(
          ShopBackendShopSettingsErrorType.NOT_FOUND,
          'Shop settings not found for reset',
          'resetShopSettingsToDefaults',
          { shopId }
        );
      }
      
      // Create default settings
      const defaultSettings: Partial<
        Omit<UpdateShopSettingsEntity, "id" | "createdAt" | "updatedAt">
      > = {
        shopName: 'My Shop',
        shopDescription: '',
        shopPhone: '',
        shopEmail: '',
        shopAddress: '',
        shopWebsite: '',
        shopLogo: '',
        timezone: 'Asia/Bangkok',
        defaultOpenTime: '09:00',
        defaultCloseTime: '18:00',
        maxQueuePerService: 10,
        queueTimeoutMinutes: 30,
        allowWalkIn: true,
        allowAdvanceBooking: true,
        maxAdvanceBookingDays: 7,
        pointsEnabled: false,
        pointsPerBaht: 1,
        pointsExpiryMonths: 12,
        minimumPointsToRedeem: 100,
        smsEnabled: false,
        emailEnabled: false,
        lineNotifyEnabled: false,
        notifyBeforeMinutes: 30,
        acceptCash: true,
        acceptCreditCard: false,
        acceptBankTransfer: false,
        acceptPromptPay: false,
        promptPayId: '',
        theme: 'light',
        language: 'th',
        currency: 'THB',
        dateFormat: 'DD/MM/YYYY',
        timeFormat: '24h',
        autoConfirmBooking: true,
        requireCustomerPhone: true,
        allowGuestBooking: false,
        showPricesPublic: true,
        enableReviews: true,
      };
      
      const result = await this.updateShopSettings(shopId, defaultSettings);
      
      this.logger.info('SupabaseBackendShopSettingsRepository: Shop settings reset to defaults', { shopId });
      return result;
    } catch (error) {
      this.logger.error('SupabaseBackendShopSettingsRepository: Error resetting shop settings to defaults', { error, shopId });
      throw new ShopBackendShopSettingsError(
        ShopBackendShopSettingsErrorType.OPERATION_FAILED,
        'Failed to reset shop settings to defaults',
        'resetShopSettingsToDefaults',
        { shopId },
        error
      );
    }
  }

  async deleteShopSettings(id: string): Promise<boolean> {
    try {
      this.logger.info('SupabaseBackendShopSettingsRepository: Deleting shop settings', { id });
      
      await this.databaseDatasource.delete('shop_settings', id);
      
      this.logger.info('SupabaseBackendShopSettingsRepository: Shop settings deleted', { id });
      return true; // Return true since delete completed successfully
    } catch (error) {
      this.logger.error('SupabaseBackendShopSettingsRepository: Error deleting shop settings', { error, id });
      throw new ShopBackendShopSettingsError(
        ShopBackendShopSettingsErrorType.OPERATION_FAILED,
        'Failed to delete shop settings',
        'deleteShopSettings',
        { id },
        error
      );
    }
  }

  async getShopSettingsStats(shopId: string): Promise<ShopSettingsStatsEntity> {
    try {
      this.logger.info('SupabaseBackendShopSettingsRepository: Getting shop settings stats', { shopId });
      
      // For now, return basic stats - in a real implementation, this would query aggregated data
      const stats: ShopSettingsStatsEntity = {
        totalSettings: 1,
        lastUpdated: new Date().toISOString(),
        enabledFeatures: [],
        disabledFeatures: [],
        integrationStatus: {},
      };
      
      this.logger.info('SupabaseBackendShopSettingsRepository: Shop settings stats retrieved', { shopId });
      return stats;
    } catch (error) {
      this.logger.error('SupabaseBackendShopSettingsRepository: Error getting shop settings stats', { error, shopId });
      throw new ShopBackendShopSettingsError(
        ShopBackendShopSettingsErrorType.OPERATION_FAILED,
        'Failed to get shop settings stats',
        'getShopSettingsStats',
        { shopId },
        error
      );
    }
  }

  async validateShopSettings(data: Partial<ShopSettingsEntity>): Promise<ShopSettingsValidationResult> {
    try {
      this.logger.info('SupabaseBackendShopSettingsRepository: Validating shop settings', { data });
      
      // Basic validation - in a real implementation, this would have comprehensive validation logic
      const errors: string[] = [];
      
      if (!data.shopName || data.shopName.trim().length === 0) {
        errors.push('Shop name is required');
      }
      
      if (!data.timezone || data.timezone.trim().length === 0) {
        errors.push('Timezone is required');
      }
      
      const result: ShopSettingsValidationResult = {
        isValid: errors.length === 0,
        errors,
      };
      
      this.logger.info('SupabaseBackendShopSettingsRepository: Shop settings validation completed', { 
        isValid: result.isValid, 
        errorsCount: errors.length 
      });
      return result;
    } catch (error) {
      this.logger.error('SupabaseBackendShopSettingsRepository: Error validating shop settings', { error, data });
      throw new ShopBackendShopSettingsError(
        ShopBackendShopSettingsErrorType.VALIDATION_ERROR,
        'Failed to validate shop settings',
        'validateShopSettings',
        { data },
        error
      );
    }
  }

  async exportShopSettings(shopId: string): Promise<string> {
    try {
      this.logger.info('SupabaseBackendShopSettingsRepository: Exporting shop settings', { shopId });
      
      const settings = await this.getShopSettingsByShopId(shopId);
      
      if (!settings) {
        throw new ShopBackendShopSettingsError(
          ShopBackendShopSettingsErrorType.NOT_FOUND,
          'Shop settings not found for export',
          'exportShopSettings',
          { shopId }
        );
      }
      
      // Convert to JSON string for export
      const exportData = JSON.stringify(settings, null, 2);
      
      this.logger.info('SupabaseBackendShopSettingsRepository: Shop settings exported', { shopId });
      return exportData;
    } catch (error) {
      this.logger.error('SupabaseBackendShopSettingsRepository: Error exporting shop settings', { error, shopId });
      throw new ShopBackendShopSettingsError(
        ShopBackendShopSettingsErrorType.OPERATION_FAILED,
        'Failed to export shop settings',
        'exportShopSettings',
        { shopId },
        error
      );
    }
  }

  async importShopSettings(shopId: string, settingsData: string): Promise<ShopSettingsEntity> {
    try {
      this.logger.info('SupabaseBackendShopSettingsRepository: Importing shop settings', { shopId });
      
      const parsedData = JSON.parse(settingsData);
      
      // Ensure the shopId matches
      const importData = {
        ...parsedData,
        shopId,
      };
      
      // Check if settings already exist for this shop
      const existingSettings = await this.getShopSettingsByShopId(shopId);
      
      let result: ShopSettingsEntity;
      
      if (existingSettings) {
        // Update existing settings
        result = await this.updateShopSettings(existingSettings.id, importData);
      } else {
        // Create new settings
        result = await this.createShopSettings(importData as CreateShopSettingsEntity);
      }
      
      this.logger.info('SupabaseBackendShopSettingsRepository: Shop settings imported', { shopId });
      return result;
    } catch (error) {
      this.logger.error('SupabaseBackendShopSettingsRepository: Error importing shop settings', { error, shopId });
      throw new ShopBackendShopSettingsError(
        ShopBackendShopSettingsErrorType.OPERATION_FAILED,
        'Failed to import shop settings',
        'importShopSettings',
        { shopId },
        error
      );
    }
  }

}
