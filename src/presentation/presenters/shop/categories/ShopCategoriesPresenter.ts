import { IAuthService } from "@/src/application/interfaces/auth-service.interface";
import { IProfileService } from "@/src/application/interfaces/profile-service.interface";
import { ISubscriptionService } from "@/src/application/services/subscription/SubscriptionService";
import { getClientContainer } from "@/src/di/client-container";
import { getServerContainer } from "@/src/di/server-container";
import type { Logger } from "@/src/domain/interfaces/logger";
import { BaseSubscriptionPresenter } from "@/src/presentation/presenters/base/BaseSubscriptionPresenter";

// Define interfaces and types for categories
export interface ShopCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  shopCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ShopCategoryStats {
  totalCategories: number;
  activeCategories: number;
  inactiveCategories: number;
  totalShopsInCategories: number;
}

export interface ShopCategoriesViewModel {
  categories: ShopCategory[];
  stats: ShopCategoryStats;
  totalCount: number;
  page: number;
  perPage: number;
}

/**
 * Presenter for Shop Categories management
 * Follows Clean Architecture with proper separation of concerns
 */
export class ShopCategoriesPresenter extends BaseSubscriptionPresenter {
  constructor(
    logger: Logger,
    authService: IAuthService,
    profileService: IProfileService,
    subscriptionService: ISubscriptionService
  ) {
    super(logger, authService, profileService, subscriptionService);
  }

  /**
   * Get view model for the categories page
   */
  async getViewModel(): Promise<ShopCategoriesViewModel> {
    try {
      this.logger.info("ShopCategoriesPresenter: Getting view model");

      // Use mock data for demonstration
      const categories: ShopCategory[] = this.getDefaultCategories();

      return {
        categories,
        stats: {
          totalCategories: categories.length,
          activeCategories: categories.filter((c: ShopCategory) => c.isActive)
            .length,
          inactiveCategories: categories.filter(
            (c: ShopCategory) => !c.isActive
          ).length,
          totalShopsInCategories: categories.reduce(
            (sum: number, c: ShopCategory) => sum + c.shopCount,
            0
          ),
        },
        totalCount: categories.length,
        page: 1,
        perPage: 50,
      };
    } catch (error: any) {
      this.logger.error("ShopCategoriesPresenter: Error getting view model", {
        error,
      });

      // Return default categories on error
      const defaultCategories = this.getDefaultCategories();
      return {
        categories: defaultCategories,
        stats: {
          totalCategories: defaultCategories.length,
          activeCategories: defaultCategories.length,
          inactiveCategories: 0,
          totalShopsInCategories: defaultCategories.reduce(
            (sum: number, c: ShopCategory) => sum + c.shopCount,
            0
          ),
        },
        totalCount: defaultCategories.length,
        page: 1,
        perPage: 50,
      };
    }
  }

  /**
   * Get category by ID
   */
  async getCategoryById(id: string): Promise<ShopCategory | null> {
    try {
      this.logger.info("ShopCategoriesPresenter: Getting category by id", {
        id,
      });

      const categories = this.getDefaultCategories();
      const category = categories.find((c) => c.id === id);

      return category || null;
    } catch (error: any) {
      this.logger.error(
        "ShopCategoriesPresenter: Error getting category by id",
        { error }
      );
      return null;
    }
  }

  /**
   * Search categories by name
   */
  async searchCategories(query: string): Promise<ShopCategory[]> {
    try {
      this.logger.info("ShopCategoriesPresenter: Searching categories", {
        query,
      });

      const categories = this.getDefaultCategories();

      if (!query.trim()) {
        return categories;
      }

      return categories.filter(
        (category) =>
          category.name.toLowerCase().includes(query.toLowerCase()) ||
          category.description.toLowerCase().includes(query.toLowerCase())
      );
    } catch (error: any) {
      this.logger.error("ShopCategoriesPresenter: Error searching categories", {
        error,
      });
      return [];
    }
  }

  /**
   * Get icon for category based on name
   */
  private getCategoryIcon(categoryName: string): string {
    const iconMap: Record<string, string> = {
      ร้านอาหาร: "🍽️",
      ร้านเสื้อผ้า: "👕",
      ร้านเครื่องสำอาง: "💄",
      ร้านหนังสือ: "📚",
      ร้านกาแฟ: "☕",
      ร้านขนม: "🧁",
      ร้านดอกไม้: "🌸",
      ร้านยา: "💊",
      ร้านแว่นตา: "👓",
      ร้านรองเท้า: "👟",
      ร้านเครื่องประดับ: "💎",
      ร้านของเล่น: "🧸",
      ร้านเครื่องใช้ไฟฟ้า: "🔌",
      ร้านมือถือ: "📱",
      ร้านกีฬา: "⚽",
      ร้านเฟอร์นิเจอร์: "🪑",
      ร้านสัตว์เลี้ยง: "🐕",
      ร้านซ่อมรถ: "🔧",
    };

    // Try exact match first
    if (iconMap[categoryName]) {
      return iconMap[categoryName];
    }

    // Try partial match
    for (const [key, icon] of Object.entries(iconMap)) {
      if (
        categoryName.includes(key.replace("ร้าน", "")) ||
        key.includes(categoryName)
      ) {
        return icon;
      }
    }

    // Default icon
    return "🏪";
  }

  /**
   * Get default categories for demonstration
   */
  private getDefaultCategories(): ShopCategory[] {
    const now = new Date().toISOString();

    return [
      {
        id: "1",
        name: "ร้านอาหาร",
        description: "ร้านอาหารและเครื่องดื่มทุกประเภท",
        icon: "🍽️",
        shopCount: 45,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "2",
        name: "ร้านเสื้อผ้า",
        description: "แฟชั่นและเสื้อผ้าสำหรับทุกเพศทุกวัย",
        icon: "👕",
        shopCount: 32,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "3",
        name: "ร้านเครื่องสำอาง",
        description: "เครื่องสำอางและผลิตภัณฑ์ความงาม",
        icon: "💄",
        shopCount: 28,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "4",
        name: "ร้านกาแฟ",
        description: "กาแฟและเครื่องดื่มร้อน-เย็น",
        icon: "☕",
        shopCount: 23,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "5",
        name: "ร้านขนม",
        description: "ขนมหวานและเบเกอรี่",
        icon: "🧁",
        shopCount: 19,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "6",
        name: "ร้านหนังสือ",
        description: "หนังสือและเครื่องเขียน",
        icon: "📚",
        shopCount: 15,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "7",
        name: "ร้านดอกไม้",
        description: "ดอกไม้สดและของตะกร้า",
        icon: "🌸",
        shopCount: 12,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "8",
        name: "ร้านยา",
        description: "ร้านขายยาและเวชภัณฑ์",
        icon: "💊",
        shopCount: 18,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "9",
        name: "ร้านแว่นตา",
        description: "แว่นตาและอุปกรณ์สายตา",
        icon: "👓",
        shopCount: 8,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "10",
        name: "ร้านรองเท้า",
        description: "รองเท้าและเครื่องหนัง",
        icon: "👟",
        shopCount: 25,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "11",
        name: "ร้านเครื่องประดับ",
        description: "เครื่องประดับและอัญมณี",
        icon: "💎",
        shopCount: 14,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "12",
        name: "ร้านของเล่น",
        description: "ของเล่นสำหรับเด็กและผู้ใหญ่",
        icon: "🧸",
        shopCount: 11,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
    ];
  }
}

/**
 * Factory for creating ShopCategoriesPresenter instances
 */
export class ShopCategoriesPresenterFactory {
  static async create(): Promise<ShopCategoriesPresenter> {
    const serverContainer = await getServerContainer();
    const logger = serverContainer.resolve<Logger>("Logger");
    const subscriptionService = serverContainer.resolve<ISubscriptionService>(
      "SubscriptionService"
    );
    const authService = serverContainer.resolve<IAuthService>("AuthService");
    const profileService =
      serverContainer.resolve<IProfileService>("ProfileService");

    return new ShopCategoriesPresenter(
      logger,
      authService,
      profileService,
      subscriptionService
    );
  }
}

/**
 * Factory for creating client-side ShopCategoriesPresenter instances
 */
export class ClientShopCategoriesPresenterFactory {
  static create(): ShopCategoriesPresenter {
    const clientContainer = getClientContainer();
    const logger = clientContainer.resolve<Logger>("Logger");
    const subscriptionService = clientContainer.resolve<ISubscriptionService>(
      "SubscriptionService"
    );
    const authService = clientContainer.resolve<IAuthService>("AuthService");
    const profileService =
      clientContainer.resolve<IProfileService>("ProfileService");

    return new ShopCategoriesPresenter(
      logger,
      authService,
      profileService,
      subscriptionService
    );
  }
}
