import type { Logger } from '@/src/domain/interfaces/logger';
import type { UpdateShopSettingsInputDTO, CreateShopSettingsInputDTO } from '@/src/application/dtos/shop/backend/shop-settings-dto';
import type { ShopBackendShopSettingsRepository } from '@/src/domain/repositories/shop/backend/backend-shop-settings-repository';
import {
  CreateShopSettingsUseCase,
  DeleteShopSettingsUseCase,
  ExportShopSettingsUseCase,
  GetShopSettingsByIdUseCase,
  GetShopSettingsStatsUseCase,
  GetShopSettingsUseCase,
  ImportShopSettingsUseCase,
  ResetShopSettingsUseCase,
  UpdateShopSettingsUseCase,
  ValidateShopSettingsUseCase,
} from '@/src/application/usecases/shop/backend/shops/settings';

// Shop Settings interface and types
export interface ShopSettings {
  id: string;
  shopId: string;
  // Basic Shop Information
  shopName: string;
  shopDescription?: string;
  shopPhone?: string;
  shopEmail?: string;
  shopAddress?: string;
  shopWebsite?: string;
  shopLogo?: string;

  // Business Hours
  timezone: string;
  defaultOpenTime: string;
  defaultCloseTime: string;

  // Queue Settings
  maxQueuePerService: number;
  queueTimeoutMinutes: number;
  allowWalkIn: boolean;
  allowAdvanceBooking: boolean;
  maxAdvanceBookingDays: number;

  // Points System
  pointsEnabled: boolean;
  pointsPerBaht: number;
  pointsExpiryMonths: number;
  minimumPointsToRedeem: number;

  // Notification Settings
  smsEnabled: boolean;
  emailEnabled: boolean;
  lineNotifyEnabled: boolean;
  notifyBeforeMinutes: number;

  // Payment Settings
  acceptCash: boolean;
  acceptCreditCard: boolean;
  acceptBankTransfer: boolean;
  acceptPromptPay: boolean;
  promptPayId?: string;

  // Display Settings
  theme: "light" | "dark" | "auto";
  language: "th" | "en";
  currency: string;
  dateFormat: string;
  timeFormat: "12h" | "24h";

  // Advanced Settings
  autoConfirmBooking: boolean;
  requireCustomerPhone: boolean;
  allowGuestBooking: boolean;
  showPricesPublic: boolean;
  enableReviews: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export interface ShopSettingsStats {
  totalSettings: number;
  lastUpdated: Date;
  enabledFeatures: string[];
  disabledFeatures: string[];
  integrationStatus: Record<string, boolean>;
}

export interface IShopSettingsBackendService {
  getShopSettings(shopId: string): Promise<ShopSettings | null>;
  getShopSettingsById(id: string): Promise<ShopSettings | null>;
  createShopSettings(settings: Omit<ShopSettings, 'id' | 'createdAt' | 'updatedAt'>): Promise<ShopSettings>;
  updateShopSettings(shopId: string, data: Partial<ShopSettings>): Promise<ShopSettings>;
  deleteShopSettings(shopId: string): Promise<boolean>;
  resetShopSettings(shopId: string): Promise<ShopSettings>;
  getShopSettingsStats(shopId: string): Promise<ShopSettingsStats>;
  validateShopSettings(
    settings: Partial<ShopSettings>
  ): Promise<{ isValid: boolean; errors: string[] }>;
  exportSettings(shopId: string): Promise<string>;
  importSettings(shopId: string, settingsData: string): Promise<ShopSettings>;
}

export class ShopSettingsBackendService implements IShopSettingsBackendService {
  constructor(
    private readonly getShopSettingsUseCase: GetShopSettingsUseCase,
    private readonly getShopSettingsByIdUseCase: GetShopSettingsByIdUseCase,
    private readonly createShopSettingsUseCase: CreateShopSettingsUseCase,
    private readonly updateShopSettingsUseCase: UpdateShopSettingsUseCase,
    private readonly deleteShopSettingsUseCase: DeleteShopSettingsUseCase,
    private readonly resetShopSettingsUseCase: ResetShopSettingsUseCase,
    private readonly getShopSettingsStatsUseCase: GetShopSettingsStatsUseCase,
    private readonly validateShopSettingsUseCase: ValidateShopSettingsUseCase,
    private readonly exportShopSettingsUseCase: ExportShopSettingsUseCase,
    private readonly importShopSettingsUseCase: ImportShopSettingsUseCase,
    private readonly logger: Logger
  ) {}

  async getShopSettings(shopId: string): Promise<ShopSettings | null> {
    try {
      this.logger.info('ShopSettingsBackendService: Getting shop settings', { shopId });
      
      const result = await this.getShopSettingsUseCase.execute({ shopId });
      
      // Convert DTO to domain model
      if (!result) return null;
      
      const settings: ShopSettings = {
        id: result.id,
        shopId: result.shopId,
        shopName: result.shopName,
        shopDescription: result.shopDescription || undefined,
        shopPhone: result.shopPhone || undefined,
        shopEmail: result.shopEmail || undefined,
        shopAddress: result.shopAddress || undefined,
        shopWebsite: result.shopWebsite || undefined,
        shopLogo: result.shopLogo || undefined,
        timezone: result.timezone,
        defaultOpenTime: result.defaultOpenTime,
        defaultCloseTime: result.defaultCloseTime,
        maxQueuePerService: result.maxQueuePerService,
        queueTimeoutMinutes: result.queueTimeoutMinutes,
        allowWalkIn: result.allowWalkIn,
        allowAdvanceBooking: result.allowAdvanceBooking,
        maxAdvanceBookingDays: result.maxAdvanceBookingDays,
        pointsEnabled: result.pointsEnabled,
        pointsPerBaht: result.pointsPerBaht,
        pointsExpiryMonths: result.pointsExpiryMonths,
        minimumPointsToRedeem: result.minimumPointsToRedeem,
        smsEnabled: result.smsEnabled,
        emailEnabled: result.emailEnabled,
        lineNotifyEnabled: result.lineNotifyEnabled,
        notifyBeforeMinutes: result.notifyBeforeMinutes,
        acceptCash: result.acceptCash,
        acceptCreditCard: result.acceptCreditCard,
        acceptBankTransfer: result.acceptBankTransfer,
        acceptPromptPay: result.acceptPromptPay,
        promptPayId: result.promptPayId || undefined,
        theme: result.theme,
        language: result.language,
        currency: result.currency,
        dateFormat: result.dateFormat,
        timeFormat: result.timeFormat,
        autoConfirmBooking: result.autoConfirmBooking,
        requireCustomerPhone: result.requireCustomerPhone,
        allowGuestBooking: result.allowGuestBooking,
        showPricesPublic: result.showPricesPublic,
        enableReviews: result.enableReviews,
        createdAt: new Date(result.createdAt),
        updatedAt: new Date(result.updatedAt),
      };
      
      this.logger.info('ShopSettingsBackendService: Retrieved shop settings', { shopId });
      return settings;
    } catch (error) {
      this.logger.error('ShopSettingsBackendService: Error getting shop settings', { error, shopId });
      throw error;
    }
  }

  async getShopSettingsById(id: string): Promise<ShopSettings | null> {
    try {
      this.logger.info('ShopSettingsBackendService: Getting shop settings by id', { id });
      
      const result = await this.getShopSettingsByIdUseCase.execute(id);
      
      // Convert DTO to domain model
      if (!result) return null;
      
      const settings: ShopSettings = {
        id: result.id,
        shopId: result.shopId,
        shopName: result.shopName,
        shopDescription: result.shopDescription || undefined,
        shopPhone: result.shopPhone || undefined,
        shopEmail: result.shopEmail || undefined,
        shopAddress: result.shopAddress || undefined,
        shopWebsite: result.shopWebsite || undefined,
        shopLogo: result.shopLogo || undefined,
        timezone: result.timezone,
        defaultOpenTime: result.defaultOpenTime,
        defaultCloseTime: result.defaultCloseTime,
        maxQueuePerService: result.maxQueuePerService,
        queueTimeoutMinutes: result.queueTimeoutMinutes,
        allowWalkIn: result.allowWalkIn,
        allowAdvanceBooking: result.allowAdvanceBooking,
        maxAdvanceBookingDays: result.maxAdvanceBookingDays,
        pointsEnabled: result.pointsEnabled,
        pointsPerBaht: result.pointsPerBaht,
        pointsExpiryMonths: result.pointsExpiryMonths,
        minimumPointsToRedeem: result.minimumPointsToRedeem,
        smsEnabled: result.smsEnabled,
        emailEnabled: result.emailEnabled,
        lineNotifyEnabled: result.lineNotifyEnabled,
        notifyBeforeMinutes: result.notifyBeforeMinutes,
        acceptCash: result.acceptCash,
        acceptCreditCard: result.acceptCreditCard,
        acceptBankTransfer: result.acceptBankTransfer,
        acceptPromptPay: result.acceptPromptPay,
        promptPayId: result.promptPayId || undefined,
        theme: result.theme,
        language: result.language,
        currency: result.currency,
        dateFormat: result.dateFormat,
        timeFormat: result.timeFormat,
        autoConfirmBooking: result.autoConfirmBooking,
        requireCustomerPhone: result.requireCustomerPhone,
        allowGuestBooking: result.allowGuestBooking,
        showPricesPublic: result.showPricesPublic,
        enableReviews: result.enableReviews,
        createdAt: new Date(result.createdAt),
        updatedAt: new Date(result.updatedAt),
      };
      
      this.logger.info('ShopSettingsBackendService: Retrieved shop settings by id', { id });
      return settings;
    } catch (error) {
      this.logger.error('ShopSettingsBackendService: Error getting shop settings by id', { error, id });
      throw error;
    }
  }

  async createShopSettings(settings: Omit<ShopSettings, 'id' | 'createdAt' | 'updatedAt'>): Promise<ShopSettings> {
    try {
      this.logger.info('ShopSettingsBackendService: Creating shop settings', { settings });
      
      const createData: CreateShopSettingsInputDTO = {
        shopId: settings.shopId,
        shopName: settings.shopName,
        shopDescription: settings.shopDescription,
        shopPhone: settings.shopPhone,
        shopEmail: settings.shopEmail,
        shopAddress: settings.shopAddress,
        shopWebsite: settings.shopWebsite,
        shopLogo: settings.shopLogo,
        timezone: settings.timezone,
        defaultOpenTime: settings.defaultOpenTime,
        defaultCloseTime: settings.defaultCloseTime,
        maxQueuePerService: settings.maxQueuePerService,
        queueTimeoutMinutes: settings.queueTimeoutMinutes,
        allowWalkIn: settings.allowWalkIn,
        allowAdvanceBooking: settings.allowAdvanceBooking,
        maxAdvanceBookingDays: settings.maxAdvanceBookingDays,
        pointsEnabled: settings.pointsEnabled,
        pointsPerBaht: settings.pointsPerBaht,
        pointsExpiryMonths: settings.pointsExpiryMonths,
        minimumPointsToRedeem: settings.minimumPointsToRedeem,
        smsEnabled: settings.smsEnabled,
        emailEnabled: settings.emailEnabled,
        lineNotifyEnabled: settings.lineNotifyEnabled,
        notifyBeforeMinutes: settings.notifyBeforeMinutes,
        acceptCash: settings.acceptCash,
        acceptCreditCard: settings.acceptCreditCard,
        acceptBankTransfer: settings.acceptBankTransfer,
        acceptPromptPay: settings.acceptPromptPay,
        promptPayId: settings.promptPayId,
        theme: settings.theme,
        language: settings.language,
        currency: settings.currency,
        dateFormat: settings.dateFormat,
        timeFormat: settings.timeFormat,
        autoConfirmBooking: settings.autoConfirmBooking,
        requireCustomerPhone: settings.requireCustomerPhone,
        allowGuestBooking: settings.allowGuestBooking,
        showPricesPublic: settings.showPricesPublic,
        enableReviews: settings.enableReviews,
      };
      
      const result = await this.createShopSettingsUseCase.execute(createData);
      
      // Convert DTO to domain model
      const newSettings: ShopSettings = {
        id: result.id,
        shopId: result.shopId,
        shopName: result.shopName,
        shopDescription: result.shopDescription || undefined,
        shopPhone: result.shopPhone || undefined,
        shopEmail: result.shopEmail || undefined,
        shopAddress: result.shopAddress || undefined,
        shopWebsite: result.shopWebsite || undefined,
        shopLogo: result.shopLogo || undefined,
        timezone: result.timezone,
        defaultOpenTime: result.defaultOpenTime,
        defaultCloseTime: result.defaultCloseTime,
        maxQueuePerService: result.maxQueuePerService,
        queueTimeoutMinutes: result.queueTimeoutMinutes,
        allowWalkIn: result.allowWalkIn,
        allowAdvanceBooking: result.allowAdvanceBooking,
        maxAdvanceBookingDays: result.maxAdvanceBookingDays,
        pointsEnabled: result.pointsEnabled,
        pointsPerBaht: result.pointsPerBaht,
        pointsExpiryMonths: result.pointsExpiryMonths,
        minimumPointsToRedeem: result.minimumPointsToRedeem,
        smsEnabled: result.smsEnabled,
        emailEnabled: result.emailEnabled,
        lineNotifyEnabled: result.lineNotifyEnabled,
        notifyBeforeMinutes: result.notifyBeforeMinutes,
        acceptCash: result.acceptCash,
        acceptCreditCard: result.acceptCreditCard,
        acceptBankTransfer: result.acceptBankTransfer,
        acceptPromptPay: result.acceptPromptPay,
        promptPayId: result.promptPayId || undefined,
        theme: result.theme,
        language: result.language,
        currency: result.currency,
        dateFormat: result.dateFormat,
        timeFormat: result.timeFormat,
        autoConfirmBooking: result.autoConfirmBooking,
        requireCustomerPhone: result.requireCustomerPhone,
        allowGuestBooking: result.allowGuestBooking,
        showPricesPublic: result.showPricesPublic,
        enableReviews: result.enableReviews,
        createdAt: new Date(result.createdAt),
        updatedAt: new Date(result.updatedAt),
      };
      
      this.logger.info('ShopSettingsBackendService: Shop settings created', {
        shopId: settings.shopId,
        settingsId: newSettings.id,
      });
      
      return newSettings;
    } catch (error) {
      this.logger.error('ShopSettingsBackendService: Error creating shop settings', { error, settings });
      throw error;
    }
  }

  async updateShopSettings(
    shopId: string,
    data: Partial<ShopSettings>
  ): Promise<ShopSettings> {
    try {
      this.logger.info('ShopSettingsBackendService: Updating shop settings', { shopId, data });
      
      // Create update data with only the fields that should be updated
      const updateData: UpdateShopSettingsInputDTO = {
        shopId: shopId,
        shopName: data.shopName,
        shopDescription: data.shopDescription,
        shopPhone: data.shopPhone,
        shopEmail: data.shopEmail,
        shopAddress: data.shopAddress,
        shopWebsite: data.shopWebsite,
        shopLogo: data.shopLogo,
        timezone: data.timezone,
        defaultOpenTime: data.defaultOpenTime,
        defaultCloseTime: data.defaultCloseTime,
        maxQueuePerService: data.maxQueuePerService,
        queueTimeoutMinutes: data.queueTimeoutMinutes,
        allowWalkIn: data.allowWalkIn,
        allowAdvanceBooking: data.allowAdvanceBooking,
        maxAdvanceBookingDays: data.maxAdvanceBookingDays,
        pointsEnabled: data.pointsEnabled,
        pointsPerBaht: data.pointsPerBaht,
        pointsExpiryMonths: data.pointsExpiryMonths,
        minimumPointsToRedeem: data.minimumPointsToRedeem,
        smsEnabled: data.smsEnabled,
        emailEnabled: data.emailEnabled,
        lineNotifyEnabled: data.lineNotifyEnabled,
        notifyBeforeMinutes: data.notifyBeforeMinutes,
        acceptCash: data.acceptCash,
        acceptCreditCard: data.acceptCreditCard,
        acceptBankTransfer: data.acceptBankTransfer,
        acceptPromptPay: data.acceptPromptPay,
        promptPayId: data.promptPayId,
        theme: data.theme,
        language: data.language,
        currency: data.currency,
        dateFormat: data.dateFormat,
        timeFormat: data.timeFormat,
        autoConfirmBooking: data.autoConfirmBooking,
        requireCustomerPhone: data.requireCustomerPhone,
        allowGuestBooking: data.allowGuestBooking,
        showPricesPublic: data.showPricesPublic,
        enableReviews: data.enableReviews,
      };
      
      const result = await this.updateShopSettingsUseCase.execute(updateData);
      
      // Convert DTO to domain model
      const settings: ShopSettings = {
        id: result.id,
        shopId: result.shopId,
        shopName: result.shopName,
        shopDescription: result.shopDescription || undefined,
        shopPhone: result.shopPhone || undefined,
        shopEmail: result.shopEmail || undefined,
        shopAddress: result.shopAddress || undefined,
        shopWebsite: result.shopWebsite || undefined,
        shopLogo: result.shopLogo || undefined,
        timezone: result.timezone,
        defaultOpenTime: result.defaultOpenTime,
        defaultCloseTime: result.defaultCloseTime,
        maxQueuePerService: result.maxQueuePerService,
        queueTimeoutMinutes: result.queueTimeoutMinutes,
        allowWalkIn: result.allowWalkIn,
        allowAdvanceBooking: result.allowAdvanceBooking,
        maxAdvanceBookingDays: result.maxAdvanceBookingDays,
        pointsEnabled: result.pointsEnabled,
        pointsPerBaht: result.pointsPerBaht,
        pointsExpiryMonths: result.pointsExpiryMonths,
        minimumPointsToRedeem: result.minimumPointsToRedeem,
        smsEnabled: result.smsEnabled,
        emailEnabled: result.emailEnabled,
        lineNotifyEnabled: result.lineNotifyEnabled,
        notifyBeforeMinutes: result.notifyBeforeMinutes,
        acceptCash: result.acceptCash,
        acceptCreditCard: result.acceptCreditCard,
        acceptBankTransfer: result.acceptBankTransfer,
        acceptPromptPay: result.acceptPromptPay,
        promptPayId: result.promptPayId || undefined,
        theme: result.theme,
        language: result.language,
        currency: result.currency,
        dateFormat: result.dateFormat,
        timeFormat: result.timeFormat,
        autoConfirmBooking: result.autoConfirmBooking,
        requireCustomerPhone: result.requireCustomerPhone,
        allowGuestBooking: result.allowGuestBooking,
        showPricesPublic: result.showPricesPublic,
        enableReviews: result.enableReviews,
        createdAt: new Date(result.createdAt),
        updatedAt: new Date(result.updatedAt),
      };
      
      this.logger.info('ShopSettingsBackendService: Shop settings updated', {
        shopId,
        updatedFields: Object.keys(data),
      });
      
      return settings;
    } catch (error) {
      this.logger.error('ShopSettingsBackendService: Error updating shop settings', { error, shopId, data });
      throw error;
    }
  }

  async deleteShopSettings(shopId: string): Promise<boolean> {
    try {
      this.logger.info('ShopSettingsBackendService: Deleting shop settings', { shopId });
      
      const result = await this.deleteShopSettingsUseCase.execute({ shopId });
      
      this.logger.info('ShopSettingsBackendService: Shop settings deleted', { shopId, success: result });
      return result;
    } catch (error) {
      this.logger.error('ShopSettingsBackendService: Error deleting shop settings', { error, shopId });
      throw error;
    }
  }

  async resetShopSettings(shopId: string): Promise<ShopSettings> {
    try {
      this.logger.info('ShopSettingsBackendService: Resetting shop settings', { shopId });
      
      const resetResult = await this.resetShopSettingsUseCase.execute({ shopId });
      
      this.logger.info('ShopSettingsBackendService: Shop settings reset', { shopId, success: resetResult.success });
      
      // Fetch the updated settings after reset
      const result = await this.getShopSettingsUseCase.execute({ shopId });
      
      // Convert DTO to domain model
      if (!result) {
        throw new Error('Failed to fetch shop settings after reset');
      }
      
      const settings: ShopSettings = {
        id: result.id,
        shopId: result.shopId,
        shopName: result.shopName,
        shopDescription: result.shopDescription || undefined,
        shopPhone: result.shopPhone || undefined,
        shopEmail: result.shopEmail || undefined,
        shopAddress: result.shopAddress || undefined,
        shopWebsite: result.shopWebsite || undefined,
        shopLogo: result.shopLogo || undefined,
        timezone: result.timezone,
        defaultOpenTime: result.defaultOpenTime,
        defaultCloseTime: result.defaultCloseTime,
        maxQueuePerService: result.maxQueuePerService,
        queueTimeoutMinutes: result.queueTimeoutMinutes,
        allowWalkIn: result.allowWalkIn,
        allowAdvanceBooking: result.allowAdvanceBooking,
        maxAdvanceBookingDays: result.maxAdvanceBookingDays,
        pointsEnabled: result.pointsEnabled,
        pointsPerBaht: result.pointsPerBaht,
        pointsExpiryMonths: result.pointsExpiryMonths,
        minimumPointsToRedeem: result.minimumPointsToRedeem,
        smsEnabled: result.smsEnabled,
        emailEnabled: result.emailEnabled,
        lineNotifyEnabled: result.lineNotifyEnabled,
        notifyBeforeMinutes: result.notifyBeforeMinutes,
        acceptCash: result.acceptCash,
        acceptCreditCard: result.acceptCreditCard,
        acceptBankTransfer: result.acceptBankTransfer,
        acceptPromptPay: result.acceptPromptPay,
        promptPayId: result.promptPayId || undefined,
        theme: result.theme,
        language: result.language,
        currency: result.currency,
        dateFormat: result.dateFormat,
        timeFormat: result.timeFormat,
        autoConfirmBooking: result.autoConfirmBooking,
        requireCustomerPhone: result.requireCustomerPhone,
        allowGuestBooking: result.allowGuestBooking,
        showPricesPublic: result.showPricesPublic,
        enableReviews: result.enableReviews,
        createdAt: new Date(result.createdAt),
        updatedAt: new Date(result.updatedAt)
      };
      
      return settings;
    } catch (error) {
      this.logger.error('ShopSettingsBackendService: Error resetting shop settings', { error, shopId });
      throw error;
    }
  }

  async getShopSettingsStats(shopId: string): Promise<ShopSettingsStats> {
    try {
      this.logger.info('ShopSettingsBackendService: Getting settings stats', { shopId });
      
      const result = await this.getShopSettingsStatsUseCase.execute({ shopId });
      
      // Convert DTO to domain model
      const stats: ShopSettingsStats = {
        totalSettings: result.totalSettings,
        lastUpdated: new Date(result.lastUpdated),
        enabledFeatures: result.enabledFeatures,
        disabledFeatures: result.disabledFeatures,
        integrationStatus: result.integrationStatus,
      };
      
      this.logger.info('ShopSettingsBackendService: Settings stats retrieved', { shopId });
      return stats;
    } catch (error) {
      this.logger.error('ShopSettingsBackendService: Error getting settings stats', { error, shopId });
      throw error;
    }
  }

  async validateShopSettings(
    settings: Partial<ShopSettings>
  ): Promise<{ isValid: boolean; errors: string[] }> {
    try {
      this.logger.info('ShopSettingsBackendService: Validating settings', { settings });
      
      const result = await this.validateShopSettingsUseCase.execute({ 
        settings: {
          ...settings,
          createdAt: settings.createdAt?.toISOString(),
          updatedAt: settings.updatedAt?.toISOString()
        }
      });
      
      this.logger.info('ShopSettingsBackendService: Settings validation completed', {
        isValid: result.isValid,
        errorCount: result.errors.length,
      });
      
      return result;
    } catch (error) {
      this.logger.error('ShopSettingsBackendService: Error validating settings', { error, settings });
      throw error;
    }
  }

  async exportSettings(shopId: string): Promise<string> {
    try {
      this.logger.info('ShopSettingsBackendService: Exporting settings', { shopId });
      
      const result = await this.exportShopSettingsUseCase.execute({ 
        shopId, 
        format: 'json' 
      });
      
      // The interface expects a string, but the use case returns ExportShopSettingsOutput
      // We need to convert the output to a string representation
      return JSON.stringify(result, null, 2);
    } catch (error) {
      this.logger.error('ShopSettingsBackendService: Error exporting settings', { error, shopId });
      throw error;
    }
  }

  async importSettings(
    shopId: string,
    settingsData: string
  ): Promise<ShopSettings> {
    try {
      this.logger.info('ShopSettingsBackendService: Importing settings', { shopId });
      
      const validationResult = await this.importShopSettingsUseCase.execute({ shopId, settingsData });
      
      if (!validationResult.isValid) {
        throw new Error(`Import validation failed: ${validationResult.errors.join(', ')}`);
      }
      
      // After successful import, fetch the updated settings
      const updatedSettings = await this.getShopSettings(shopId);
      
      if (!updatedSettings) {
        throw new Error('Failed to retrieve updated settings after import');
      }
      
      this.logger.info('ShopSettingsBackendService: Settings imported successfully', { shopId });
      return updatedSettings;
    } catch (error) {
      this.logger.error('ShopSettingsBackendService: Error importing settings', { error, shopId });
      throw error;
    }
  }
}

/**
 * Factory for creating ShopSettingsBackendService instances
 * Following Clean Architecture and Factory pattern principles
 */
export class ShopSettingsBackendServiceFactory {
  static create(
    repository: ShopBackendShopSettingsRepository,
    logger: Logger
  ): ShopSettingsBackendService {
    // Create all use cases with their dependencies
    const getShopSettingsUseCase = new GetShopSettingsUseCase(repository);
    const getShopSettingsByIdUseCase = new GetShopSettingsByIdUseCase(repository);
    const createShopSettingsUseCase = new CreateShopSettingsUseCase(repository);
    const updateShopSettingsUseCase = new UpdateShopSettingsUseCase(repository);
    const deleteShopSettingsUseCase = new DeleteShopSettingsUseCase(repository);
    const resetShopSettingsUseCase = new ResetShopSettingsUseCase(repository);
    const getShopSettingsStatsUseCase = new GetShopSettingsStatsUseCase(repository);
    const validateShopSettingsUseCase = new ValidateShopSettingsUseCase(repository);
    const exportShopSettingsUseCase = new ExportShopSettingsUseCase(repository);
    const importShopSettingsUseCase = new ImportShopSettingsUseCase(repository, validateShopSettingsUseCase);

    // Create and return the service instance
    return new ShopSettingsBackendService(
      getShopSettingsUseCase,
      getShopSettingsByIdUseCase,
      createShopSettingsUseCase,
      updateShopSettingsUseCase,
      deleteShopSettingsUseCase,
      resetShopSettingsUseCase,
      getShopSettingsStatsUseCase,
      validateShopSettingsUseCase,
      exportShopSettingsUseCase,
      importShopSettingsUseCase,
      logger
    );
  }
}
