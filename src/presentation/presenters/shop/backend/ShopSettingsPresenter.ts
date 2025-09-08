import type { ShopSettings, ShopSettingsBackendService, ShopSettingsStats } from '@/src/application/services/shop/backend/shop-settings-backend-service';
import { IShopService } from '@/src/application/services/shop/ShopService';
import { getServerContainer } from '@/src/di/server-container';
import type { Logger } from '@/src/domain/interfaces/logger';
import { BaseShopPresenter } from '../BaseShopPresenter';
// Define ViewModel interface
export interface ShopSettingsViewModel {
  settings: ShopSettings | null;
  stats: ShopSettingsStats | null;
  settingsCategories: Array<{
    id: string;
    name: string;
    icon: string;
    description: string;
    settingsCount: number;
  }>;
  validationErrors: string[];
}

// Main Presenter class
export class ShopSettingsPresenter extends BaseShopPresenter {
  constructor(
    logger: Logger,
    shopService: IShopService,
    private readonly shopSettingsBackendService: ShopSettingsBackendService,
  ) {
    super(logger, shopService);
  }

  async getViewModel(shopId: string): Promise<ShopSettingsViewModel> {
    try {
      this.logger.info('ShopSettingsPresenter: Getting view model', { shopId });

      // Get settings and stats
      const [settings, stats] = await Promise.all([
        this.shopSettingsBackendService.getShopSettings(shopId),
        this.shopSettingsBackendService.getSettingsStats(shopId).catch(() => null)
      ]);

      // Define settings categories
      const settingsCategories = [
        {
          id: 'basic',
          name: 'ข้อมูลร้าน',
          icon: '🏪',
          description: 'ชื่อร้าน ที่อยู่ ติดต่อ และข้อมูลพื้นฐาน',
          settingsCount: 7
        },
        {
          id: 'hours',
          name: 'เวลาทำการ',
          icon: '🕐',
          description: 'เวลาเปิด-ปิด และโซนเวลา',
          settingsCount: 3
        },
        {
          id: 'queue',
          name: 'ระบบคิว',
          icon: '🎫',
          description: 'การจัดการคิว การจองล่วงหน้า',
          settingsCount: 5
        },
        {
          id: 'points',
          name: 'ระบบแต้ม',
          icon: '🎁',
          description: 'แต้มสะสม อัตราแลกเปลี่ยน',
          settingsCount: 4
        },
        {
          id: 'notifications',
          name: 'การแจ้งเตือน',
          icon: '📱',
          description: 'SMS Email LINE Notify',
          settingsCount: 4
        },
        {
          id: 'payments',
          name: 'การชำระเงิน',
          icon: '💳',
          description: 'วิธีการชำระเงินที่รับ',
          settingsCount: 5
        },
        {
          id: 'display',
          name: 'การแสดงผล',
          icon: '🎨',
          description: 'ธีม ภาษา รูปแบบวันที่',
          settingsCount: 5
        },
        {
          id: 'advanced',
          name: 'ขั้นสูง',
          icon: '⚙️',
          description: 'การตั้งค่าขั้นสูงและความปลอดภัย',
          settingsCount: 5
        }
      ];

      return {
        settings,
        stats,
        settingsCategories,
        validationErrors: [],
      };
    } catch (error) {
      this.logger.error('ShopSettingsPresenter: Error getting view model', error);
      throw error;
    }
  }

  // Metadata generation
  async generateMetadata(shopId: string) {
    return this.generateShopMetadata(
      shopId,
      'ตั้งค่าร้าน',
      'จัดการการตั้งค่าร้าน ข้อมูลพื้นฐาน ระบบคิว การชำระเงิน และฟีเจอร์ต่างๆ',
    );
  }
}

// Factory class
export class ShopSettingsPresenterFactory {
  static async create(): Promise<ShopSettingsPresenter> {
    const serverContainer = await getServerContainer();
    const logger = serverContainer.resolve<Logger>('Logger');
    const shopSettingsBackendService = serverContainer.resolve<ShopSettingsBackendService>('ShopSettingsBackendService');
    const shopService = serverContainer.resolve<IShopService>('ShopService');
    return new ShopSettingsPresenter(logger, shopService, shopSettingsBackendService);
  }
}
