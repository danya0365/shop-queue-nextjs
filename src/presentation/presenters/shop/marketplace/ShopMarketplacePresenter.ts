import { ShopDTO } from "@/src/application/dtos/backend/shops-dto";
import { IAuthService } from "@/src/application/interfaces/auth-service.interface";
import { IProfileService } from "@/src/application/interfaces/profile-service.interface";
import { ISubscriptionService } from "@/src/application/services/subscription/SubscriptionService";
import { IShopMarketplaceService } from "@/src/application/services/shop/ShopMarketplaceService";
import { getClientContainer } from "@/src/di/client-container";
import { getServerContainer } from "@/src/di/server-container";
import type { Logger } from "@/src/domain/interfaces/logger";
import { BaseSubscriptionPresenter } from "@/src/presentation/presenters/base/BaseSubscriptionPresenter";
import { MarketplaceCategoryDTO, LocationDTO } from "@/src/application/dtos/shop/marketplace-dto";

export interface ShopMarketplaceViewModel {
  // Statistics for marketplace
  totalShops: number;
  activeShops: number;
  featuredShopsCount: number;
  newShopsThisMonth: number;

  // Shop data with pagination
  shopsData: {
    shops: ShopDTO[];
    totalCount: number;
    perPage: number;
    currentPage: number;
    totalPages: number;
  };

  // Search and filter state
  searchQuery: string;
  selectedCategory: string | null;
  selectedLocation: string | null;
  priceRange: [number, number] | null;
  ratingFilter: number | null;

  // Featured shops
  featuredShops: ShopDTO[];

  // Popular categories
  popularCategories: MarketplaceCategoryDTO[];

  // Popular locations
  popularLocations: LocationDTO[];
}

export class ShopMarketplacePresenter extends BaseSubscriptionPresenter {
  constructor(
    logger: Logger,
    authService: IAuthService,
    profileService: IProfileService,
    subscriptionService: ISubscriptionService,
    private readonly marketplaceService: IShopMarketplaceService
  ) {
    super(logger, authService, profileService, subscriptionService);
  }

  async getViewModel(): Promise<ShopMarketplaceViewModel> {
    try {
      // Check if user is authenticated
      const user = await this.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      // Get shops data with pagination
      const shopsResult = await this.marketplaceService.getAllShops({
        page: 1,
        limit: 12,
        search: "",
        status: "active",
      });

      // Get featured shops
      const featuredShops = await this.marketplaceService.getFeaturedShops(6);

      // Get marketplace statistics
      const stats = await this.marketplaceService.getMarketplaceStats();

      // Get popular categories
      const popularCategories =
        await this.marketplaceService.getPopularCategories();

      // Get popular locations
      const popularLocations =
        await this.marketplaceService.getPopularLocations();

      return {
        totalShops: stats.totalShops,
        activeShops: stats.activeShops,
        featuredShopsCount: stats.featuredShops,
        newShopsThisMonth: stats.newShopsThisMonth,
        shopsData: {
          shops: shopsResult.shops,
          totalCount: shopsResult.totalCount,
          perPage: shopsResult.perPage,
          currentPage: shopsResult.currentPage,
          totalPages: shopsResult.totalPages,
        },
        searchQuery: "",
        selectedCategory: null,
        selectedLocation: null,
        priceRange: null,
        ratingFilter: null,
        featuredShops: featuredShops,
        popularCategories: popularCategories,
        popularLocations: popularLocations,
      };
    } catch (error) {
      this.logger.error("Error getting marketplace view model:", error);
      throw error;
    }
  }

  /**
   * Generate metadata for the page
   */
  async generateMetadata() {
    try {
      this.logger.info("ShopMarketplacePresenter: Generating metadata");

      return {
        title: "สำรวจร้านค้า | Shop Queue",
        description: "ค้นหาและสำรวจร้านค้าที่น่าสนใจในพื้นที่ใกล้คุณ",
      };
    } catch (error) {
      this.logger.error("ShopMarketplacePresenter: Error generating metadata", {
        error,
      });
      throw error;
    }
  }

  async searchShops(
    query: string,
    filters?: {
      category?: string;
      location?: string;
      priceRange?: [number, number];
      rating?: number;
      page?: number;
      limit?: number;
    }
  ): Promise<ShopMarketplaceViewModel> {
    try {
      const user = await this.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      const searchResult = await this.marketplaceService.searchShops(query, {
        ...filters,
        page: filters?.page || 1,
        limit: filters?.limit || 12,
      });

      // Get updated statistics
      const stats = await this.marketplaceService.getMarketplaceStats();

      return {
        totalShops: stats.totalShops,
        activeShops: stats.activeShops,
        featuredShopsCount: stats.featuredShops,
        newShopsThisMonth: stats.newShopsThisMonth,
        shopsData: {
          shops: searchResult.shops,
          totalCount: searchResult.totalCount,
          perPage: searchResult.perPage,
          currentPage: searchResult.currentPage,
          totalPages: searchResult.totalPages,
        },
        searchQuery: query,
        selectedCategory: filters?.category || null,
        selectedLocation: filters?.location || null,
        priceRange: filters?.priceRange || null,
        ratingFilter: filters?.rating || null,
        featuredShops: await this.marketplaceService.getFeaturedShops(6),
        popularCategories:
          await this.marketplaceService.getPopularCategories(),
        popularLocations: await this.marketplaceService.getPopularLocations(),
      };
    } catch (error) {
      this.logger.error("Error searching shops:", error);
      throw error;
    }
  }

  async getShopsByCategory(
    categoryId: string,
    page: number = 1
  ): Promise<ShopMarketplaceViewModel> {
    try {
      const user = await this.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      const result = await this.marketplaceService.getShopsByCategory(
        categoryId,
        {
          page,
          limit: 12,
        }
      );

      const stats = await this.marketplaceService.getMarketplaceStats();

      return {
        totalShops: stats.totalShops,
        activeShops: stats.activeShops,
        featuredShopsCount: stats.featuredShops,
        newShopsThisMonth: stats.newShopsThisMonth,
        shopsData: {
          shops: result.shops,
          totalCount: result.totalCount,
          perPage: result.perPage,
          currentPage: result.currentPage,
          totalPages: result.totalPages,
        },
        searchQuery: "",
        selectedCategory: categoryId,
        selectedLocation: null,
        priceRange: null,
        ratingFilter: null,
        featuredShops: await this.marketplaceService.getFeaturedShops(6),
        popularCategories:
          await this.marketplaceService.getPopularCategories(),
        popularLocations: await this.marketplaceService.getPopularLocations(),
      };
    } catch (error) {
      this.logger.error("Error getting shops by category:", error);
      throw error;
    }
  }

  async getShopsByLocation(
    locationId: string,
    page: number = 1
  ): Promise<ShopMarketplaceViewModel> {
    try {
      const user = await this.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      const result = await this.marketplaceService.getShopsByLocation(
        locationId,
        {
          page,
          limit: 12,
        }
      );

      const stats = await this.marketplaceService.getMarketplaceStats();

      return {
        totalShops: stats.totalShops,
        activeShops: stats.activeShops,
        featuredShopsCount: stats.featuredShops,
        newShopsThisMonth: stats.newShopsThisMonth,
        shopsData: {
          shops: result.shops,
          totalCount: result.totalCount,
          perPage: result.perPage,
          currentPage: result.currentPage,
          totalPages: result.totalPages,
        },
        searchQuery: "",
        selectedCategory: null,
        selectedLocation: locationId,
        priceRange: null,
        ratingFilter: null,
        featuredShops: await this.marketplaceService.getFeaturedShops(6),
        popularCategories:
          await this.marketplaceService.getPopularCategories(),
        popularLocations: await this.marketplaceService.getPopularLocations(),
      };
    } catch (error) {
      this.logger.error("Error getting shops by location:", error);
      throw error;
    }
  }

  /**
   * Create a shop (placeholder for marketplace functionality)
   * Note: Marketplace typically doesn't create shops, but method added for pattern compliance
   */
  async createShop(shopData: unknown): Promise<void> {
    try {
      const user = await this.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      // Placeholder implementation
      // In a real marketplace, this might not be available
      // or would redirect to a shop registration flow
      this.logger.info("ShopMarketplacePresenter: Shop creation attempted", {
        shopData,
      });

      // This would typically call:
      // await this.backendShopsService.createShop(shopData);

      throw new Error("Shop creation not available in marketplace context");
    } catch (error) {
      this.logger.error("Error creating shop:", error);
      throw error;
    }
  }

  /**
   * Update a shop (placeholder for marketplace functionality)
   * Note: Marketplace typically doesn't update shops, but method added for pattern compliance
   */
  async updateShop(id: string, shopData: unknown): Promise<void> {
    try {
      const user = await this.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      // Placeholder implementation
      // In a real marketplace, this might not be available
      // or would redirect to shop owner dashboard
      this.logger.info("ShopMarketplacePresenter: Shop update attempted", {
        id,
        shopData,
      });

      // This would typically call:
      // await this.backendShopsService.updateShop(id, shopData);

      throw new Error("Shop update not available in marketplace context");
    } catch (error) {
      this.logger.error("Error updating shop:", error);
      throw error;
    }
  }

  /**
   * Delete a shop (placeholder for marketplace functionality)
   * Note: Marketplace typically doesn't delete shops, but method added for pattern compliance
   */
  async deleteShop(id: string): Promise<void> {
    try {
      const user = await this.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      // Placeholder implementation
      // In a real marketplace, this would not be available
      // or would require admin privileges
      this.logger.info("ShopMarketplacePresenter: Shop deletion attempted", {
        id,
      });

      // This would typically call:
      // await this.backendShopsService.deleteShop(id);

      throw new Error("Shop deletion not available in marketplace context");
    } catch (error) {
      this.logger.error("Error deleting shop:", error);
      throw error;
    }
  }
}

// Factory class
export class ShopMarketplacePresenterFactory {
  static async create(): Promise<ShopMarketplacePresenter> {
    const serverContainer = await getServerContainer();
    const logger = serverContainer.resolve<Logger>("Logger");
    const authService = serverContainer.resolve<IAuthService>("AuthService");
    const profileService =
      serverContainer.resolve<IProfileService>("ProfileService");
    const subscriptionService = serverContainer.resolve<ISubscriptionService>(
      "SubscriptionService"
    );
    const marketplaceService = serverContainer.resolve<IShopMarketplaceService>(
      "ShopMarketplaceService"
    );

    return new ShopMarketplacePresenter(
      logger,
      authService,
      profileService,
      subscriptionService,
      marketplaceService
    );
  }
}

// Client-side factory class
export class ClientShopMarketplacePresenterFactory {
  static async create(): Promise<ShopMarketplacePresenter> {
    const clientContainer = await getClientContainer();
    const logger = clientContainer.resolve<Logger>("Logger");
    const authService = clientContainer.resolve<IAuthService>("AuthService");
    const profileService =
      clientContainer.resolve<IProfileService>("ProfileService");
    const subscriptionService = clientContainer.resolve<ISubscriptionService>(
      "SubscriptionService"
    );
    const marketplaceService = clientContainer.resolve<IShopMarketplaceService>(
      "ShopMarketplaceService"
    );

    return new ShopMarketplacePresenter(
      logger,
      authService,
      profileService,
      subscriptionService,
      marketplaceService
    );
  }
}
