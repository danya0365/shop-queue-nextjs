import type { Logger } from '@/src/domain/interfaces/logger';

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
  theme: 'light' | 'dark' | 'auto';
  language: 'th' | 'en';
  currency: string;
  dateFormat: string;
  timeFormat: '12h' | '24h';

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
  updateShopSettings(shopId: string, data: Partial<ShopSettings>): Promise<ShopSettings>;
  resetToDefaults(shopId: string): Promise<ShopSettings>;
  getSettingsStats(shopId: string): Promise<ShopSettingsStats>;
  validateSettings(settings: Partial<ShopSettings>): Promise<{ isValid: boolean; errors: string[] }>;
  exportSettings(shopId: string): Promise<string>;
  importSettings(shopId: string, settingsData: string): Promise<ShopSettings>;
}

export class ShopSettingsBackendService implements IShopSettingsBackendService {
  private mockSettings: ShopSettings = {
    id: 'settings_1',
    shopId: 'shop1',
    // Basic Shop Information
    shopName: 'ร้านตัดผมสไตล์โมเดิร์น',
    shopDescription: 'ร้านตัดผมและจัดแต่งทรงผม บริการครบครัน ด้วยช่างมืออาชีพ',
    shopPhone: '02-123-4567',
    shopEmail: 'info@modernhair.com',
    shopAddress: '123 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110',
    shopWebsite: 'https://modernhair.com',
    shopLogo: '/images/shop-logo.png',

    // Business Hours
    timezone: 'Asia/Bangkok',
    defaultOpenTime: '09:00',
    defaultCloseTime: '20:00',

    // Queue Settings
    maxQueuePerService: 10,
    queueTimeoutMinutes: 15,
    allowWalkIn: true,
    allowAdvanceBooking: true,
    maxAdvanceBookingDays: 7,

    // Points System
    pointsEnabled: true,
    pointsPerBaht: 1,
    pointsExpiryMonths: 12,
    minimumPointsToRedeem: 100,

    // Notification Settings
    smsEnabled: true,
    emailEnabled: true,
    lineNotifyEnabled: false,
    notifyBeforeMinutes: 30,

    // Payment Settings
    acceptCash: true,
    acceptCreditCard: true,
    acceptBankTransfer: true,
    acceptPromptPay: true,
    promptPayId: '0212345678',

    // Display Settings
    theme: 'light',
    language: 'th',
    currency: 'THB',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',

    // Advanced Settings
    autoConfirmBooking: false,
    requireCustomerPhone: true,
    allowGuestBooking: true,
    showPricesPublic: true,
    enableReviews: true,

    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-15T10:30:00Z'),
  };

  constructor(private readonly logger: Logger) { }

  async getShopSettings(shopId: string): Promise<ShopSettings | null> {
    this.logger.info('ShopSettingsBackendService: Getting shop settings', { shopId });

    if (this.mockSettings.shopId !== shopId) {
      this.logger.warn('ShopSettingsBackendService: Shop settings not found', { shopId });
      return null;
    }

    this.logger.info('ShopSettingsBackendService: Retrieved shop settings', { shopId });
    return this.mockSettings;
  }

  async updateShopSettings(shopId: string, data: Partial<ShopSettings>): Promise<ShopSettings> {
    this.logger.info('ShopSettingsBackendService: Updating shop settings', { shopId, data });

    if (this.mockSettings.shopId !== shopId) {
      this.logger.error('ShopSettingsBackendService: Shop not found for settings update', { shopId });
      throw new Error('Shop not found');
    }

    // Update settings
    this.mockSettings = {
      ...this.mockSettings,
      ...data,
      updatedAt: new Date(),
    };

    this.logger.info('ShopSettingsBackendService: Shop settings updated', {
      shopId,
      updatedFields: Object.keys(data)
    });

    return this.mockSettings;
  }

  async resetToDefaults(shopId: string): Promise<ShopSettings> {
    this.logger.info('ShopSettingsBackendService: Resetting settings to defaults', { shopId });

    const defaultSettings: ShopSettings = {
      id: this.mockSettings.id,
      shopId,
      // Basic Shop Information
      shopName: 'ร้านของฉัน',
      shopDescription: undefined,
      shopPhone: undefined,
      shopEmail: undefined,
      shopAddress: undefined,
      shopWebsite: undefined,
      shopLogo: undefined,

      // Business Hours
      timezone: 'Asia/Bangkok',
      defaultOpenTime: '09:00',
      defaultCloseTime: '18:00',

      // Queue Settings
      maxQueuePerService: 5,
      queueTimeoutMinutes: 10,
      allowWalkIn: true,
      allowAdvanceBooking: false,
      maxAdvanceBookingDays: 3,

      // Points System
      pointsEnabled: false,
      pointsPerBaht: 1,
      pointsExpiryMonths: 12,
      minimumPointsToRedeem: 50,

      // Notification Settings
      smsEnabled: false,
      emailEnabled: false,
      lineNotifyEnabled: false,
      notifyBeforeMinutes: 15,

      // Payment Settings
      acceptCash: true,
      acceptCreditCard: false,
      acceptBankTransfer: false,
      acceptPromptPay: false,
      promptPayId: undefined,

      // Display Settings
      theme: 'light',
      language: 'th',
      currency: 'THB',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '24h',

      // Advanced Settings
      autoConfirmBooking: false,
      requireCustomerPhone: false,
      allowGuestBooking: true,
      showPricesPublic: false,
      enableReviews: false,

      createdAt: this.mockSettings.createdAt,
      updatedAt: new Date(),
    };

    this.mockSettings = defaultSettings;

    this.logger.info('ShopSettingsBackendService: Settings reset to defaults', { shopId });
    return this.mockSettings;
  }

  async getSettingsStats(shopId: string): Promise<ShopSettingsStats> {
    this.logger.info('ShopSettingsBackendService: Getting settings stats', { shopId });

    const settings = await this.getShopSettings(shopId);
    if (!settings) {
      throw new Error('Shop settings not found');
    }

    const enabledFeatures: string[] = [];
    const disabledFeatures: string[] = [];

    // Check feature status
    const features = [
      { key: 'pointsEnabled', name: 'ระบบแต้มสะสม' },
      { key: 'allowAdvanceBooking', name: 'จองล่วงหน้า' },
      { key: 'smsEnabled', name: 'แจ้งเตือน SMS' },
      { key: 'emailEnabled', name: 'แจ้งเตือน Email' },
      { key: 'lineNotifyEnabled', name: 'แจ้งเตือน LINE' },
      { key: 'acceptCreditCard', name: 'รับบัตรเครดิต' },
      { key: 'acceptPromptPay', name: 'รับ PromptPay' },
      { key: 'autoConfirmBooking', name: 'ยืนยันการจองอัตโนมัติ' },
      { key: 'enableReviews', name: 'ระบบรีวิว' },
    ];

    features.forEach(feature => {
      if (settings[feature.key as keyof ShopSettings]) {
        enabledFeatures.push(feature.name);
      } else {
        disabledFeatures.push(feature.name);
      }
    });

    const integrationStatus = {
      'SMS Gateway': settings.smsEnabled,
      'Email Service': settings.emailEnabled,
      'LINE Notify': settings.lineNotifyEnabled,
      'Payment Gateway': settings.acceptCreditCard || settings.acceptPromptPay,
      'Points System': settings.pointsEnabled,
    };

    const stats = {
      totalSettings: Object.keys(settings).length - 4, // Exclude id, shopId, createdAt, updatedAt
      lastUpdated: settings.updatedAt,
      enabledFeatures,
      disabledFeatures,
      integrationStatus,
    };

    this.logger.info('ShopSettingsBackendService: Settings stats calculated', {
      shopId,
      enabledCount: enabledFeatures.length,
      disabledCount: disabledFeatures.length
    });

    return stats;
  }

  async validateSettings(settings: Partial<ShopSettings>): Promise<{ isValid: boolean; errors: string[] }> {
    this.logger.info('ShopSettingsBackendService: Validating settings', { settings });

    const errors: string[] = [];

    // Validate shop name
    if (settings.shopName !== undefined && settings.shopName.trim().length === 0) {
      errors.push('ชื่อร้านไม่สามารถเป็นค่าว่างได้');
    }

    // Validate email format
    if (settings.shopEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(settings.shopEmail)) {
      errors.push('รูปแบบอีเมลไม่ถูกต้อง');
    }

    // Validate phone format
    if (settings.shopPhone && !/^[0-9\-\s\+\(\)]+$/.test(settings.shopPhone)) {
      errors.push('รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง');
    }

    // Validate time format
    if (settings.defaultOpenTime && !/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(settings.defaultOpenTime)) {
      errors.push('รูปแบบเวลาเปิดไม่ถูกต้อง');
    }

    if (settings.defaultCloseTime && !/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(settings.defaultCloseTime)) {
      errors.push('รูปแบบเวลาปิดไม่ถูกต้อง');
    }

    // Validate numeric values
    if (settings.maxQueuePerService !== undefined && settings.maxQueuePerService < 1) {
      errors.push('จำนวนคิวสูงสุดต้องมากกว่า 0');
    }

    if (settings.pointsPerBaht !== undefined && settings.pointsPerBaht < 0) {
      errors.push('อัตราแต้มต่อบาทต้องไม่น้อยกว่า 0');
    }

    if (settings.minimumPointsToRedeem !== undefined && settings.minimumPointsToRedeem < 0) {
      errors.push('แต้มขั้นต่ำในการใช้ต้องไม่น้อยกว่า 0');
    }

    // Validate PromptPay ID
    if (settings.acceptPromptPay && settings.promptPayId && !/^[0-9]{10,13}$/.test(settings.promptPayId.replace(/\-/g, ''))) {
      errors.push('รูปแบบ PromptPay ID ไม่ถูกต้อง');
    }

    const isValid = errors.length === 0;

    this.logger.info('ShopSettingsBackendService: Settings validation completed', {
      isValid,
      errorCount: errors.length
    });

    return { isValid, errors };
  }

  async exportSettings(shopId: string): Promise<string> {
    this.logger.info('ShopSettingsBackendService: Exporting settings', { shopId });

    const settings = await this.getShopSettings(shopId);
    if (!settings) {
      throw new Error('Shop settings not found');
    }

    // Remove sensitive or non-exportable fields
    const exportData = {
      ...settings,
      id: undefined,
      shopId: undefined,
      createdAt: undefined,
      updatedAt: undefined,
    };

    const exportString = JSON.stringify(exportData, null, 2);

    this.logger.info('ShopSettingsBackendService: Settings exported', {
      shopId,
      dataSize: exportString.length
    });

    return exportString;
  }

  async importSettings(shopId: string, settingsData: string): Promise<ShopSettings> {
    this.logger.info('ShopSettingsBackendService: Importing settings', { shopId });

    try {
      const importedData = JSON.parse(settingsData);

      // Validate imported data
      const validation = await this.validateSettings(importedData);
      if (!validation.isValid) {
        throw new Error(`การตรวจสอบข้อมูลไม่ผ่าน: ${validation.errors.join(', ')}`);
      }

      // Update settings with imported data
      const updatedSettings = await this.updateShopSettings(shopId, importedData);

      this.logger.info('ShopSettingsBackendService: Settings imported successfully', { shopId });
      return updatedSettings;

    } catch (error) {
      this.logger.error('ShopSettingsBackendService: Failed to import settings', error);
      throw new Error('ไม่สามารถนำเข้าการตั้งค่าได้: รูปแบบข้อมูลไม่ถูกต้อง');
    }
  }
}
