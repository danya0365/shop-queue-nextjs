import { SubscriptionLimits, UsageStatsDto } from '@/src/application/dtos/subscription-dto';
import { IAuthService } from '@/src/application/interfaces/auth-service.interface';
import { IProfileService } from '@/src/application/interfaces/profile-service.interface';
import { IShopService } from '@/src/application/services/shop/ShopService';
import { ISubscriptionService } from '@/src/application/services/subscription/SubscriptionService';
import { getServerContainer } from '@/src/di/server-container';
import type { Logger } from '@/src/domain/interfaces/logger';
import { BaseShopBackendPresenter } from './BaseShopBackendPresenter';

// Define interfaces for data structures
export interface ShopSettings {
  shopName: string;
  shopDescription: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  logo?: string;
  openingHours: OpeningHour[];
  timezone: string;
  currency: string;
  language: string;
}

export interface OpeningHour {
  day: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
  breakStart?: string;
  breakEnd?: string;
}

export interface QueueSettings {
  maxQueueSize: number;
  estimatedServiceTime: number;
  allowAdvanceBooking: boolean;
  advanceBookingDays: number;
  autoAssignEmployee: boolean;
  sendNotifications: boolean;
  notificationMinutes: number[];
  allowCancellation: boolean;
  cancellationDeadline: number;
}

export interface PaymentSettings {
  acceptCash: boolean;
  acceptCard: boolean;
  acceptQR: boolean;
  acceptTransfer: boolean;
  taxRate: number;
  serviceCharge: number;
  autoCalculateTax: boolean;
  printReceipt: boolean;
  emailReceipt: boolean;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  customerNotifications: {
    queueConfirmation: boolean;
    queueReminder: boolean;
    queueReady: boolean;
    queueCancelled: boolean;
    promotions: boolean;
  };
  employeeNotifications: {
    newQueue: boolean;
    queueUpdate: boolean;
    shiftReminder: boolean;
    systemAlerts: boolean;
  };
}

export interface SystemSettings {
  maintenanceMode: boolean;
  allowRegistration: boolean;
  requireEmailVerification: boolean;
  sessionTimeout: number;
  backupFrequency: 'daily' | 'weekly' | 'monthly';
  logLevel: 'error' | 'warn' | 'info' | 'debug';
  dataRetentionDays: number;
}

// Define ViewModel interface
export interface SettingsViewModel {
  shopSettings: ShopSettings;
  queueSettings: QueueSettings;
  paymentSettings: PaymentSettings;
  notificationSettings: NotificationSettings;
  systemSettings: SystemSettings;
  subscription: {
    limits: SubscriptionLimits;
    usage: UsageStatsDto;
    hasDataRetentionLimit: boolean;
    dataRetentionDays: number;
    isFreeTier: boolean;
  };
}

// Main Presenter class
export class SettingsPresenter extends BaseShopBackendPresenter {
  constructor(
    logger: Logger,
    shopService: IShopService,
    authService: IAuthService,
    profileService: IProfileService,
    subscriptionService: ISubscriptionService,
  ) { super(logger, shopService, authService, profileService, subscriptionService); }

  async getViewModel(shopId: string): Promise<SettingsViewModel> {
    try {
      this.logger.info('SettingsPresenter: Getting view model for shop', { shopId });

      const user = await this.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      const profile = await this.getActiveProfile(user);
      if (!profile) {
        throw new Error("Profile not found");
      }

      const subscriptionPlan = await this.getSubscriptionPlan(profile.id, profile.role);
      const limits = this.mapSubscriptionPlanToLimits(subscriptionPlan);
      const usage = await this.getUsageStats(profile.id);

      // Check data retention limits
      const hasDataRetentionLimit = false;// limits.dataRetentionDays !== null;
      const dataRetentionDays = 365; // limits.maxDataRetentionDays || 365;
      const isFreeTier = subscriptionPlan.tier === 'free';

      // Mock data - replace with actual service calls
      const shopSettings = this.getShopSettings();
      const queueSettings = this.getQueueSettings();
      const paymentSettings = this.getPaymentSettings();
      const notificationSettings = this.getNotificationSettings();
      const systemSettings = this.getSystemSettings();

      return {
        shopSettings,
        queueSettings,
        paymentSettings,
        notificationSettings,
        systemSettings,
        subscription: {
          limits,
          usage,
          hasDataRetentionLimit,
          dataRetentionDays,
          isFreeTier,
        },
      };
    } catch (error) {
      this.logger.error('SettingsPresenter: Error getting view model', error);
      throw error;
    }
  }



  // Private methods for data preparation
  private getShopSettings(): ShopSettings {
    return {
      shopName: 'ร้านกาแฟสุขใจ',
      shopDescription: 'ร้านกาแฟและเบเกอรี่ที่ให้บริการด้วยใจ พร้อมระบบจัดคิวที่สะดวก',
      address: '123 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110',
      phone: '02-123-4567',
      email: 'info@sukchai-cafe.com',
      website: 'https://sukchai-cafe.com',
      logo: '☕',
      openingHours: [
        { day: 'จันทร์', isOpen: true, openTime: '07:00', closeTime: '20:00' },
        { day: 'อังคาร', isOpen: true, openTime: '07:00', closeTime: '20:00' },
        { day: 'พุธ', isOpen: true, openTime: '07:00', closeTime: '20:00' },
        { day: 'พฤหัสบดี', isOpen: true, openTime: '07:00', closeTime: '20:00' },
        { day: 'ศุกร์', isOpen: true, openTime: '07:00', closeTime: '21:00' },
        { day: 'เสาร์', isOpen: true, openTime: '08:00', closeTime: '21:00' },
        { day: 'อาทิตย์', isOpen: true, openTime: '08:00', closeTime: '20:00' },
      ],
      timezone: 'Asia/Bangkok',
      currency: 'THB',
      language: 'th',
    };
  }

  private getQueueSettings(): QueueSettings {
    return {
      maxQueueSize: 50,
      estimatedServiceTime: 10,
      allowAdvanceBooking: true,
      advanceBookingDays: 7,
      autoAssignEmployee: true,
      sendNotifications: true,
      notificationMinutes: [30, 15, 5],
      allowCancellation: true,
      cancellationDeadline: 30,
    };
  }

  private getPaymentSettings(): PaymentSettings {
    return {
      acceptCash: true,
      acceptCard: true,
      acceptQR: true,
      acceptTransfer: false,
      taxRate: 7,
      serviceCharge: 0,
      autoCalculateTax: true,
      printReceipt: true,
      emailReceipt: true,
    };
  }

  private getNotificationSettings(): NotificationSettings {
    return {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      customerNotifications: {
        queueConfirmation: true,
        queueReminder: true,
        queueReady: true,
        queueCancelled: true,
        promotions: false,
      },
      employeeNotifications: {
        newQueue: true,
        queueUpdate: true,
        shiftReminder: true,
        systemAlerts: true,
      },
    };
  }

  private getSystemSettings(): SystemSettings {
    return {
      maintenanceMode: false,
      allowRegistration: true,
      requireEmailVerification: true,
      sessionTimeout: 30,
      backupFrequency: 'daily',
      logLevel: 'info',
      dataRetentionDays: 365,
    };
  }

  // Metadata generation
  async generateMetadata(shopId: string) {
    return this.generateShopMetadata(
      shopId,
      'ตั้งค่าระบบ',
      'จัดการการตั้งค่าร้าน ระบบคิว การชำระเงิน และการแจ้งเตือน',
    );
  }
}

// Factory class
export class SettingsPresenterFactory {
  static async create(): Promise<SettingsPresenter> {
    const serverContainer = await getServerContainer();
    const logger = serverContainer.resolve<Logger>('Logger');
    const authService = serverContainer.resolve<IAuthService>('AuthService');
    const profileService = serverContainer.resolve<IProfileService>('ProfileService');
    const subscriptionService = serverContainer.resolve<ISubscriptionService>('SubscriptionService');
    const shopService = serverContainer.resolve<IShopService>('ShopService');
    return new SettingsPresenter(logger, shopService, authService, profileService, subscriptionService);
  }
}
