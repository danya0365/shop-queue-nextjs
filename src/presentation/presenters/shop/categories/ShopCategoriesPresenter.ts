import { IAuthService } from "@/src/application/interfaces/auth-service.interface";
import { IProfileService } from "@/src/application/interfaces/profile-service.interface";
import { IShopMarketplaceService } from "@/src/application/services/shop/ShopMarketplaceService";
import { ISubscriptionService } from "@/src/application/services/subscription/SubscriptionService";
import { MarketplaceCategoryDTO } from "@/src/application/dtos/shop/marketplace-dto";
import { getClientContainer } from "@/src/di/client-container";
import { getServerContainer } from "@/src/di/server-container";
import type { Logger } from "@/src/domain/interfaces/logger";
import { BaseSubscriptionPresenter } from "@/src/presentation/presenters/base/BaseSubscriptionPresenter";

// Define interfaces and types for categories
export interface ShopCategory extends MarketplaceCategoryDTO {
  description: string;
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
    subscriptionService: ISubscriptionService,
    private readonly marketplaceService: IShopMarketplaceService
  ) {
    super(logger, authService, profileService, subscriptionService);
  }

  /**
   * Get view model for the categories page
   */
  async getViewModel(): Promise<ShopCategoriesViewModel> {
    try {
      this.logger.info("ShopCategoriesPresenter: Getting view model");

      // Use marketplace service to get categories with stats
      const result = await this.marketplaceService.getCategoriesWithStats();

      // Transform MarketplaceCategoryDTO to ShopCategory with additional fields
      const categories: ShopCategory[] = result.categories.map((category) => ({
        ...category,
        description: `หมวดหมู่${category.name}สำหรับร้านค้าปลีกและบริการ`,
        isActive: category.shopCount > 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));

      return {
        categories,
        stats: result.stats,
        totalCount: result.stats.totalCategories,
        page: 1,
        perPage: 50,
      };
    } catch (error: unknown) {
      this.logger.error("ShopCategoriesPresenter: Error getting view model", {
        error,
      });

      // Return empty data on error
      return {
        categories: [],
        stats: {
          totalCategories: 0,
          activeCategories: 0,
          inactiveCategories: 0,
          totalShopsInCategories: 0,
        },
        totalCount: 0,
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

      const category = await this.marketplaceService.getCategoryById(id);
      
      if (!category) {
        return null;
      }

      // Transform MarketplaceCategoryDTO to ShopCategory with additional fields
      return {
        ...category,
        description: `หมวดหมู่${category.name}สำหรับร้านค้าปลีกและบริการ`,
        isActive: category.shopCount > 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    } catch (error: unknown) {
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

      const categories = await this.marketplaceService.searchCategories(query);

      // Transform MarketplaceCategoryDTO to ShopCategory with additional fields
      return categories.map((category) => ({
        ...category,
        description: `หมวดหมู่${category.name}สำหรับร้านค้าปลีกและบริการ`,
        isActive: category.shopCount > 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));
    } catch (error: unknown) {
      this.logger.error("ShopCategoriesPresenter: Error searching categories", {
        error,
      });
      return [];
    }
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
    const marketplaceService =
      serverContainer.resolve<IShopMarketplaceService>("ShopMarketplaceService");

    return new ShopCategoriesPresenter(
      logger,
      authService,
      profileService,
      subscriptionService,
      marketplaceService
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
    const marketplaceService =
      clientContainer.resolve<IShopMarketplaceService>("ShopMarketplaceService");

    return new ShopCategoriesPresenter(
      logger,
      authService,
      profileService,
      subscriptionService,
      marketplaceService
    );
  }
}
