import { IAuthService } from '@/src/application/interfaces/auth-service.interface';
import { IProfileService } from '@/src/application/interfaces/profile-service.interface';
import type { NotificationSettings, NotificationSettingsBackendService, NotificationStats, NotificationTemplate } from '@/src/application/services/shop/backend/notification-settings-backend-service';
import { IShopService } from '@/src/application/services/shop/ShopService';
import { ISubscriptionService } from '@/src/application/services/subscription/SubscriptionService';
import { getServerContainer } from '@/src/di/server-container';
import type { Logger } from '@/src/domain/interfaces/logger';
import type { Metadata } from 'next';
import { BaseShopBackendPresenter } from './BaseShopBackendPresenter';

export interface NotificationSettingsViewModel {
  settings: NotificationSettings | null;
  templates: NotificationTemplate[];
  stats: NotificationStats;
  categories: NotificationCategory[];
  providerOptions: ProviderOption[];
  eventOptions: EventOption[];
  variableOptions: VariableOption[];
}

export interface NotificationCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  enabled: boolean;
  settingsCount: number;
}

export interface ProviderOption {
  value: string;
  label: string;
  description: string;
  isRecommended?: boolean;
}

export interface EventOption {
  value: string;
  label: string;
  description: string;
  defaultEnabled: boolean;
}

export interface VariableOption {
  name: string;
  description: string;
  example: string;
  category: string;
}

export class NotificationSettingsPresenter extends BaseShopBackendPresenter {
  constructor(
    logger: Logger,
    shopService: IShopService,
    authService: IAuthService,
    profileService: IProfileService,
    subscriptionService: ISubscriptionService,
    private readonly notificationSettingsService: NotificationSettingsBackendService,
  ) {
    super(logger, shopService, authService, profileService, subscriptionService);
  }

  async getViewModel(shopId: string): Promise<NotificationSettingsViewModel> {
    this.logger.info('NotificationSettingsPresenter: Getting view model', { shopId });

    try {
      const [settings, templates, stats] = await Promise.all([
        this.notificationSettingsService.getNotificationSettings(shopId),
        this.notificationSettingsService.getNotificationTemplates(shopId),
        this.notificationSettingsService.getNotificationStats(shopId),
      ]);

      const categories = this.getNotificationCategories(settings);
      const providerOptions = this.getProviderOptions();
      const eventOptions = this.getEventOptions();
      const variableOptions = this.getVariableOptions();

      this.logger.info('NotificationSettingsPresenter: View model created', {
        shopId,
        hasSettings: !!settings,
        templatesCount: templates.length,
        categoriesCount: categories.length,
      });

      return {
        settings,
        templates,
        stats,
        categories,
        providerOptions,
        eventOptions,
        variableOptions,
      };
    } catch (error) {
      this.logger.error('NotificationSettingsPresenter: Error getting view model', {
        shopId,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  private getNotificationCategories(settings: NotificationSettings | null): NotificationCategory[] {
    return [
      {
        id: 'sms',
        name: 'SMS',
        icon: '📱',
        description: 'การแจ้งเตือนผ่านข้อความ SMS',
        enabled: settings?.smsEnabled ?? false,
        settingsCount: 6,
      },
      {
        id: 'email',
        name: 'Email',
        icon: '📧',
        description: 'การแจ้งเตือนผ่านอีเมล',
        enabled: settings?.emailEnabled ?? false,
        settingsCount: 8,
      },
      {
        id: 'line',
        name: 'LINE Notify',
        icon: '💬',
        description: 'การแจ้งเตือนผ่าน LINE Notify',
        enabled: settings?.lineNotifyEnabled ?? false,
        settingsCount: 4,
      },
      {
        id: 'push',
        name: 'Push Notification',
        icon: '🔔',
        description: 'การแจ้งเตือนผ่านแอปพลิเคชัน',
        enabled: settings?.pushNotificationEnabled ?? false,
        settingsCount: 4,
      },
      {
        id: 'timing',
        name: 'การตั้งเวลา',
        icon: '⏰',
        description: 'การตั้งค่าเวลาและการลองส่งใหม่',
        enabled: true,
        settingsCount: 3,
      },
      {
        id: 'advanced',
        name: 'ขั้นสูง',
        icon: '⚙️',
        description: 'การตั้งค่าขั้นสูงและ Quiet Hours',
        enabled: true,
        settingsCount: 5,
      },
    ];
  }

  private getProviderOptions(): ProviderOption[] {
    return [
      // SMS Providers
      {
        value: 'local_provider',
        label: 'ผู้ให้บริการในประเทศ',
        description: 'ผู้ให้บริการ SMS ในประเทศไทย ราคาประหยัด',
        isRecommended: true,
      },
      {
        value: 'twilio',
        label: 'Twilio',
        description: 'ผู้ให้บริการ SMS ระดับโลก เสถียรสูง',
      },
      {
        value: 'aws_sns',
        label: 'AWS SNS',
        description: 'บริการ SMS จาก Amazon Web Services',
      },

      // Email Providers
      {
        value: 'smtp',
        label: 'SMTP Server',
        description: 'เซิร์ฟเวอร์ SMTP ทั่วไป เช่น Gmail, Outlook',
        isRecommended: true,
      },
      {
        value: 'sendgrid',
        label: 'SendGrid',
        description: 'บริการส่งอีเมลระดับโลก มีระบบติดตาม',
      },
      {
        value: 'aws_ses',
        label: 'AWS SES',
        description: 'บริการส่งอีเมลจาก Amazon Web Services',
      },
    ];
  }

  private getEventOptions(): EventOption[] {
    return [
      {
        value: 'booking_confirm',
        label: 'ยืนยันการจอง',
        description: 'ส่งเมื่อการจองได้รับการยืนยัน',
        defaultEnabled: true,
      },
      {
        value: 'booking_reminder',
        label: 'แจ้งเตือนนัดหมาย',
        description: 'ส่งก่อนเวลานัดหมายตามที่กำหนด',
        defaultEnabled: true,
      },
      {
        value: 'booking_cancelled',
        label: 'ยกเลิกการจอง',
        description: 'ส่งเมื่อการจองถูกยกเลิก',
        defaultEnabled: true,
      },
      {
        value: 'queue_ready',
        label: 'คิวพร้อม',
        description: 'ส่งเมื่อถึงคิวของลูกค้า',
        defaultEnabled: false,
      },
      {
        value: 'promotion',
        label: 'โปรโมชั่น',
        description: 'ส่งข้อมูลโปรโมชั่นและข่าวสาร',
        defaultEnabled: false,
      },
    ];
  }

  private getVariableOptions(): VariableOption[] {
    return [
      // Customer Variables
      {
        name: 'customerName',
        description: 'ชื่อลูกค้า',
        example: 'คุณสมชาย',
        category: 'ลูกค้า',
      },
      {
        name: 'customerPhone',
        description: 'เบอร์โทรลูกค้า',
        example: '081-234-5678',
        category: 'ลูกค้า',
      },
      {
        name: 'customerEmail',
        description: 'อีเมลลูกค้า',
        example: 'customer@email.com',
        category: 'ลูกค้า',
      },

      // Booking Variables
      {
        name: 'bookingDate',
        description: 'วันที่จอง',
        example: '15 มกราคม 2567',
        category: 'การจอง',
      },
      {
        name: 'bookingTime',
        description: 'เวลาจอง',
        example: '14:30',
        category: 'การจอง',
      },
      {
        name: 'bookingId',
        description: 'รหัสการจอง',
        example: 'BK001234',
        category: 'การจอง',
      },
      {
        name: 'queueNumber',
        description: 'หมายเลขคิว',
        example: 'A001',
        category: 'การจอง',
      },

      // Service Variables
      {
        name: 'serviceName',
        description: 'ชื่อบริการ',
        example: 'ตัดผมชาย',
        category: 'บริการ',
      },
      {
        name: 'servicePrice',
        description: 'ราคาบริการ',
        example: '300',
        category: 'บริการ',
      },
      {
        name: 'serviceDuration',
        description: 'ระยะเวลาบริการ',
        example: '60 นาที',
        category: 'บริการ',
      },

      // Shop Variables
      {
        name: 'shopName',
        description: 'ชื่อร้าน',
        example: 'ร้านตัดผมสไตล์โมเดิร์น',
        category: 'ร้าน',
      },
      {
        name: 'shopPhone',
        description: 'เบอร์โทรร้าน',
        example: '02-123-4567',
        category: 'ร้าน',
      },
      {
        name: 'shopAddress',
        description: 'ที่อยู่ร้าน',
        example: '123 ถนนสุขุมวิท กรุงเทพฯ',
        category: 'ร้าน',
      },

      // Time Variables
      {
        name: 'minutesLeft',
        description: 'เวลาที่เหลือ (นาที)',
        example: '30',
        category: 'เวลา',
      },
      {
        name: 'currentTime',
        description: 'เวลาปัจจุบัน',
        example: '13:45',
        category: 'เวลา',
      },
      {
        name: 'currentDate',
        description: 'วันที่ปัจจุบัน',
        example: '15 มกราคม 2567',
        category: 'เวลา',
      },
    ];
  }

  async generateMetadata(shopId: string): Promise<Metadata> {
    return this.generateShopMetadata(shopId, 'การตั้งค่าการแจ้งเตือน', 'จัดการการตั้งค่าการแจ้งเตือนทาง SMS, Email, LINE Notify และ Push Notification สำหรับร้านของคุณ');
  }
}

export class NotificationSettingsPresenterFactory {
  static async create(): Promise<NotificationSettingsPresenter> {
    const serverContainer = await getServerContainer();
    const logger = serverContainer.resolve<Logger>('Logger');
    const notificationSettingsService = serverContainer.resolve<NotificationSettingsBackendService>('NotificationSettingsBackendService');
    const shopService = serverContainer.resolve<IShopService>('ShopService');
    const authService = serverContainer.resolve<IAuthService>('AuthService');
    const profileService = serverContainer.resolve<IProfileService>('ProfileService');
    const subscriptionService = serverContainer.resolve<ISubscriptionService>('SubscriptionService');
    return new NotificationSettingsPresenter(logger, shopService, authService, profileService, subscriptionService, notificationSettingsService);
  }
}

