/**
 * Presenter for Shop Marketplace Layout
 * Handles layout-specific data and business logic
 * Following Clean Architecture principles
 */

import { IShopMarketplaceService } from "@/src/application/services/shop/ShopMarketplaceService";
import { getClientContainer } from "@/src/di/client-container";
import { getServerContainer } from "@/src/di/server-container";
import { Logger } from "@/src/domain/interfaces/logger";

export interface Category {
  id: string;
  name: string;
}

export interface NavigationLink {
  href: string;
  label: string;
  order: number;
}

export interface ShopMarketplaceLayoutViewModel {
  categories: Category[];
  navigationLinks: NavigationLink[];
  heroTitle: string;
  heroDescription: string;
  searchPlaceholder: string;
}

export class ShopMarketplaceLayoutPresenter {
  constructor(
    private readonly marketplaceService: IShopMarketplaceService,
    private readonly logger: Logger
  ) {}

  /**
   * Get layout view model with all necessary data for the layout
   */
  async getLayoutViewModel(): Promise<ShopMarketplaceLayoutViewModel> {
    try {
      const [categories, navigationLinks] = await Promise.all([
        this.getPopularCategories(),
        this.getNavigationLinks(),
      ]);

      return {
        categories,
        navigationLinks,
        heroTitle: "ค้นหาร้านค้าที่ใช่สำหรับคุณ",
        heroDescription: "สำรวจร้านค้ามากมาย จองคิวและรับบริการได้ทันที",
        searchPlaceholder: "ค้นหาร้านค้า, บริการ, หรือสถานที่...",
      };
    } catch (error) {
      this.logger.error("Error getting layout view model:", error);
      throw error;
    }
  }

  async getPopularCategories(): Promise<Category[]> {
    try {
      return await this.marketplaceService.getPopularCategories();
    } catch (error) {
      this.logger.error("Error getting popular categories:", error);
      throw error;
    }
  }

  async getNavigationLinks(): Promise<NavigationLink[]> {
    try {
      const navigationLinks = [
        { href: "/shop", label: "ตลาดร้านค้า", order: 1 },
        { href: "/shop/categories", label: "หมวดหมู่", order: 2 },
        { href: "/shop/about", label: "เกี่ยวกับเรา", order: 3 },
        { href: "/shop/contact", label: "ติดต่อเรา", order: 4 },
      ];
      return navigationLinks;
    } catch (error) {
      this.logger.error("Error getting navigation links:", error);
      throw error;
    }
  }
}

/**
 * Factory for server-side presenter creation
 */
export class ShopMarketplaceLayoutPresenterFactory {
  static async create(): Promise<ShopMarketplaceLayoutPresenter> {
    const container = await getServerContainer();

    const marketplaceService = container.resolve<IShopMarketplaceService>(
      "ShopMarketplaceService"
    );
    const logger = container.resolve<Logger>("Logger");

    return new ShopMarketplaceLayoutPresenter(marketplaceService, logger);
  }
}

/**
 * Factory for client-side presenter creation
 */
export class ClientShopMarketplaceLayoutPresenterFactory {
  static create(): ShopMarketplaceLayoutPresenter {
    const container = getClientContainer();

    const marketplaceService = container.resolve<IShopMarketplaceService>(
      "ShopMarketplaceService"
    );
    const logger = container.resolve<Logger>("Logger");

    return new ShopMarketplaceLayoutPresenter(marketplaceService, logger);
  }
}
