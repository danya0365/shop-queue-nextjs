import { IAuthService } from "@/src/application/interfaces/auth-service.interface";
import { IProfileService } from "@/src/application/interfaces/profile-service.interface";
import type {
  IShopBackendShopSettingsService,
  ShopSettings,
  ShopSettingsStats,
} from "@/src/application/services/shop/backend/BackendShopSettingsService";
import { IShopService } from "@/src/application/services/shop/ShopService";
import { ISubscriptionService } from "@/src/application/services/subscription/SubscriptionService";
import { getClientContainer } from "@/src/di/client-container";
import { getServerContainer } from "@/src/di/server-container";
import type { Logger } from "@/src/domain/interfaces/logger";
import { BaseShopBackendPresenter } from "./BaseShopBackendPresenter";
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
  isLoading?: boolean;
  error?: string | null;
}

// Main Presenter class
export class ShopSettingsPresenter extends BaseShopBackendPresenter {
  constructor(
    logger: Logger,
    shopService: IShopService,
    authService: IAuthService,
    profileService: IProfileService,
    subscriptionService: ISubscriptionService,
    private readonly shopBackendShopSettingsService: IShopBackendShopSettingsService
  ) {
    super(
      logger,
      shopService,
      authService,
      profileService,
      subscriptionService
    );
  }

  async getViewModel(shopId: string): Promise<ShopSettingsViewModel> {
    try {
      this.logger.info("ShopSettingsPresenter: Getting view model", { shopId });

      // Get settings and stats
      const [settings, stats] = await Promise.all([
        this.shopBackendShopSettingsService.getShopSettings(shopId),
        this.shopBackendShopSettingsService
          .getShopSettingsStats(shopId)
          .catch(() => null),
      ]);

      // Define settings categories
      const settingsCategories = [
        {
          id: "basic",
          name: "ข้อมูลร้าน",
          icon: "🏪",
          description: "ชื่อร้าน ที่อยู่ ติดต่อ และข้อมูลพื้นฐาน",
          settingsCount: 7,
        },
        {
          id: "queue",
          name: "ระบบคิว",
          icon: "🎫",
          description: "การจัดการคิว การจองล่วงหน้า",
          settingsCount: 5,
        },
        {
          id: "points",
          name: "ระบบแต้ม",
          icon: "🎁",
          description: "แต้มสะสม อัตราแลกเปลี่ยน",
          settingsCount: 4,
        },
        {
          id: "notifications",
          name: "การแจ้งเตือน",
          icon: "📱",
          description: "SMS Email LINE Notify",
          settingsCount: 4,
        },
        {
          id: "payments",
          name: "การชำระเงิน",
          icon: "💳",
          description: "วิธีการชำระเงินที่รับ",
          settingsCount: 5,
        },
        {
          id: "display",
          name: "การแสดงผล",
          icon: "🎨",
          description: "ธีม ภาษา รูปแบบวันที่",
          settingsCount: 5,
        },
        {
          id: "advanced",
          name: "ขั้นสูง",
          icon: "⚙️",
          description: "การตั้งค่าขั้นสูงและความปลอดภัย",
          settingsCount: 5,
        },
      ];

      return {
        settings,
        stats,
        settingsCategories,
        validationErrors: [],
      };
    } catch (error) {
      this.logger.error(
        "ShopSettingsPresenter: Error getting view model",
        error
      );
      throw error;
    }
  }

  // CRUD Operations
  async updateShopSettings(
    shopId: string,
    settings: Partial<ShopSettings>
  ): Promise<ShopSettings> {
    try {
      this.logger.info("ShopSettingsPresenter: Updating shop settings", {
        shopId,
      });
      const updatedSettings =
        await this.shopBackendShopSettingsService.updateShopSettings(
          shopId,
          settings
        );
      return updatedSettings;
    } catch (error) {
      this.logger.error(
        "ShopSettingsPresenter: Error updating shop settings",
        error
      );
      throw error;
    }
  }

  async createShopSettings(
    settings: Omit<ShopSettings, "id" | "createdAt" | "updatedAt">
  ): Promise<ShopSettings> {
    try {
      this.logger.info("ShopSettingsPresenter: Creating shop settings", {
        shopId: settings.shopId,
      });
      const newSettings =
        await this.shopBackendShopSettingsService.createShopSettings(settings);
      return newSettings;
    } catch (error) {
      this.logger.error(
        "ShopSettingsPresenter: Error creating shop settings",
        error
      );
      throw error;
    }
  }

  async exportShopSettings(shopId: string): Promise<string> {
    try {
      this.logger.info("ShopSettingsPresenter: Exporting shop settings", {
        shopId,
      });
      const exportData =
        await this.shopBackendShopSettingsService.exportSettings(shopId);
      return exportData;
    } catch (error) {
      this.logger.error(
        "ShopSettingsPresenter: Error exporting shop settings",
        error
      );
      throw error;
    }
  }

  async importShopSettings(
    shopId: string,
    importData: string
  ): Promise<ShopSettings> {
    try {
      this.logger.info("ShopSettingsPresenter: Importing shop settings", {
        shopId,
      });
      const importedSettings =
        await this.shopBackendShopSettingsService.importSettings(
          shopId,
          importData
        );
      return importedSettings;
    } catch (error) {
      this.logger.error(
        "ShopSettingsPresenter: Error importing shop settings",
        error
      );
      throw error;
    }
  }

  // Metadata generation
  async generateMetadata(shopId: string) {
    return this.generateShopMetadata(
      shopId,
      "ตั้งค่าร้าน",
      "จัดการการตั้งค่าร้าน ข้อมูลพื้นฐาน ระบบคิว การชำระเงิน และฟีเจอร์ต่างๆ"
    );
  }
}

// Factory class for server-side
export class ShopSettingsPresenterFactory {
  static async create(): Promise<ShopSettingsPresenter> {
    const serverContainer = await getServerContainer();
    const logger = serverContainer.resolve<Logger>("Logger");
    const shopBackendShopSettingsService =
      serverContainer.resolve<IShopBackendShopSettingsService>(
        "ShopBackendShopSettingsService"
      );
    const shopService = serverContainer.resolve<IShopService>("ShopService");
    const authService = serverContainer.resolve<IAuthService>("AuthService");
    const profileService =
      serverContainer.resolve<IProfileService>("ProfileService");
    const subscriptionService = serverContainer.resolve<ISubscriptionService>(
      "SubscriptionService"
    );
    return new ShopSettingsPresenter(
      logger,
      shopService,
      authService,
      profileService,
      subscriptionService,
      shopBackendShopSettingsService
    );
  }
}

// Factory class for client-side
export class ClientShopSettingsPresenterFactory {
  static async create(): Promise<ShopSettingsPresenter> {
    const clientContainer = await getClientContainer();
    const logger = clientContainer.resolve<Logger>("Logger");
    const shopBackendShopSettingsService =
      clientContainer.resolve<IShopBackendShopSettingsService>(
        "ShopBackendShopSettingsService"
      );
    const shopService = clientContainer.resolve<IShopService>("ShopService");
    const authService = clientContainer.resolve<IAuthService>("AuthService");
    const profileService =
      clientContainer.resolve<IProfileService>("ProfileService");
    const subscriptionService = clientContainer.resolve<ISubscriptionService>(
      "SubscriptionService"
    );
    return new ShopSettingsPresenter(
      logger,
      shopService,
      authService,
      profileService,
      subscriptionService,
      shopBackendShopSettingsService
    );
  }
}
