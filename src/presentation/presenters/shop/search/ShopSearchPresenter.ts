import { ShopDTO } from "@/src/application/dtos/backend/shops-dto";
import {
  LocationDTO,
  MarketplaceCategoryDTO,
  ShopFiltersDTO,
  ShopListResultDTO,
} from "@/src/application/dtos/shop/marketplace-dto";
import { IAuthService } from "@/src/application/interfaces/auth-service.interface";
import { IProfileService } from "@/src/application/interfaces/profile-service.interface";
import { IShopMarketplaceService } from "@/src/application/services/shop/ShopMarketplaceService";
import { ISubscriptionService } from "@/src/application/services/subscription/SubscriptionService";
import { getClientContainer } from "@/src/di/client-container";
import { getServerContainer } from "@/src/di/server-container";
import type { Logger } from "@/src/domain/interfaces/logger";
import { BaseSubscriptionPresenter } from "@/src/presentation/presenters/base/BaseSubscriptionPresenter";

export interface ShopSearchViewParams {
  searchQuery?: string;
  category?: string | null;
  location?: string | null;
  page?: number;
}

export interface ShopSearchViewModel {
  // Search results with pagination
  searchResults: {
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
  currentPage: number;
  priceRange: [number, number] | null;
  ratingFilter: number | null;

  // Search statistics
  searchStats: {
    totalResults: number;
    searchTime: number;
    hasResults: boolean;
  };

  // Popular categories for filtering
  popularCategories: MarketplaceCategoryDTO[];

  // Popular locations for filtering
  popularLocations: LocationDTO[];

  // Suggested searches
  suggestedSearches: string[];

  // Recent searches (placeholder for future implementation)
  recentSearches: string[];
}

export class ShopSearchPresenter extends BaseSubscriptionPresenter {
  constructor(
    logger: Logger,
    authService: IAuthService,
    profileService: IProfileService,
    subscriptionService: ISubscriptionService,
    private readonly marketplaceService: IShopMarketplaceService
  ) {
    super(logger, authService, profileService, subscriptionService);
  }

  async getViewModel(
    params?: ShopSearchViewParams
  ): Promise<ShopSearchViewModel> {
    try {
      const searchQuery = params?.searchQuery || "";
      const category = params?.category || null;
      const location = params?.location || null;
      const page = params?.page || 1;

      const startTime = Date.now();

      // Get search results
      let searchResult: ShopListResultDTO;

      if (searchQuery || category || location) {
        // Use searchShops for actual search with filters
        const filters: ShopFiltersDTO = {};
        if (category) filters.category = category;
        if (location) filters.location = location;

        searchResult = await this.marketplaceService.searchShops(
          searchQuery,
          {
            ...filters,
            page,
            limit: 12,
          }
        );
      } else {
        // Use getAllShops for initial load
        searchResult = await this.marketplaceService.getAllShops({
          page,
          limit: 12,
          status: "active",
        });
      }

      const searchTime = Date.now() - startTime;

      // Get popular categories and locations for filters
      const [popularCategories, popularLocations] = await Promise.all([
        this.marketplaceService.getPopularCategories(),
        this.marketplaceService.getPopularLocations(),
      ]);

      return {
        searchResults: {
          shops: searchResult.shops,
          totalCount: searchResult.totalCount,
          perPage: searchResult.perPage,
          currentPage: searchResult.currentPage,
          totalPages: searchResult.totalPages,
        },
        searchQuery: searchQuery,
        selectedCategory: category,
        selectedLocation: location,
        currentPage: page,
        priceRange: null,
        ratingFilter: null,
        searchStats: {
          totalResults: searchResult.totalCount,
          searchTime: searchTime,
          hasResults: searchResult.shops.length > 0,
        },
        popularCategories: popularCategories,
        popularLocations: popularLocations,
        suggestedSearches: this.getSuggestedSearches(),
        recentSearches: [], // Placeholder for future implementation
      };
    } catch (error) {
      this.logger.error("Error getting search view model:", error);
      throw error;
    }
  }

  /**
   * Generate metadata for the search page
   */
  async generateMetadata() {
    try {
      this.logger.info("ShopSearchPresenter: Generating metadata");

      return {
        title: "ค้นหาร้านค้า | Shop Queue",
        description: "ค้นหาและกรองร้านค้าที่คุณต้องการ",
      };
    } catch (error) {
      this.logger.error("ShopSearchPresenter: Error generating metadata", {
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
  ): Promise<ShopSearchViewModel> {
    try {
      const startTime = Date.now();

      const searchResult = await this.marketplaceService.searchShops(query, {
        ...filters,
        page: filters?.page || 1,
        limit: filters?.limit || 12,
      });

      const searchTime = Date.now() - startTime;

      const [popularCategories, popularLocations] = await Promise.all([
        this.marketplaceService.getPopularCategories(),
        this.marketplaceService.getPopularLocations(),
      ]);

      return {
        searchResults: {
          shops: searchResult.shops,
          totalCount: searchResult.totalCount,
          perPage: searchResult.perPage,
          currentPage: searchResult.currentPage,
          totalPages: searchResult.totalPages,
        },
        searchQuery: query,
        selectedCategory: filters?.category || null,
        selectedLocation: filters?.location || null,
        currentPage: filters?.page || 1,
        priceRange: filters?.priceRange || null,
        ratingFilter: filters?.rating || null,
        searchStats: {
          totalResults: searchResult.totalCount,
          searchTime: searchTime,
          hasResults: searchResult.shops.length > 0,
        },
        popularCategories: popularCategories,
        popularLocations: popularLocations,
        suggestedSearches: this.getSuggestedSearches(),
        recentSearches: [],
      };
    } catch (error) {
      this.logger.error("Error searching shops:", error);
      throw error;
    }
  }

  async getShopsByCategory(
    categoryId: string,
    page: number = 1
  ): Promise<ShopSearchViewModel> {
    try {
      const startTime = Date.now();

      const result = await this.marketplaceService.getShopsByCategory(
        categoryId,
        {
          page,
          limit: 12,
        }
      );

      const searchTime = Date.now() - startTime;

      const [popularCategories, popularLocations] = await Promise.all([
        this.marketplaceService.getPopularCategories(),
        this.marketplaceService.getPopularLocations(),
      ]);

      return {
        searchResults: {
          shops: result.shops,
          totalCount: result.totalCount,
          perPage: result.perPage,
          currentPage: result.currentPage,
          totalPages: result.totalPages,
        },
        searchQuery: "",
        selectedCategory: categoryId,
        selectedLocation: null,
        currentPage: page,
        priceRange: null,
        ratingFilter: null,
        searchStats: {
          totalResults: result.totalCount,
          searchTime: searchTime,
          hasResults: result.shops.length > 0,
        },
        popularCategories: popularCategories,
        popularLocations: popularLocations,
        suggestedSearches: this.getSuggestedSearches(),
        recentSearches: [],
      };
    } catch (error) {
      this.logger.error("Error getting shops by category:", error);
      throw error;
    }
  }

  async getShopsByLocation(
    locationId: string,
    page: number = 1
  ): Promise<ShopSearchViewModel> {
    try {
      const startTime = Date.now();

      const result = await this.marketplaceService.getShopsByLocation(
        locationId,
        {
          page,
          limit: 12,
        }
      );

      const searchTime = Date.now() - startTime;

      const [popularCategories, popularLocations] = await Promise.all([
        this.marketplaceService.getPopularCategories(),
        this.marketplaceService.getPopularLocations(),
      ]);

      return {
        searchResults: {
          shops: result.shops,
          totalCount: result.totalCount,
          perPage: result.perPage,
          currentPage: result.currentPage,
          totalPages: result.totalPages,
        },
        searchQuery: "",
        selectedCategory: null,
        selectedLocation: locationId,
        currentPage: page,
        priceRange: null,
        ratingFilter: null,
        searchStats: {
          totalResults: result.totalCount,
          searchTime: searchTime,
          hasResults: result.shops.length > 0,
        },
        popularCategories: popularCategories,
        popularLocations: popularLocations,
        suggestedSearches: this.getSuggestedSearches(),
        recentSearches: [],
      };
    } catch (error) {
      this.logger.error("Error getting shops by location:", error);
      throw error;
    }
  }

  /**
   * Get suggested searches
   */
  private getSuggestedSearches(): string[] {
    return [
      "ร้านอาหาร",
      "ร้านกาแฟ",
      "ร้านเสื้อผ้า",
      "ร้านเครื่องสำอาง",
      "ร้านตัดผม",
      "คลินิกความงาม",
      "ร้านซ่อมรถ",
      "ร้านขายยา",
    ];
  }

  /**
   * Create a shop (placeholder for search functionality)
   */
  async createShop(shopData: unknown): Promise<void> {
    try {
      this.logger.info("ShopSearchPresenter: Shop creation attempted", {
        shopData,
      });
      throw new Error("Shop creation not available in search context");
    } catch (error) {
      this.logger.error("Error creating shop:", error);
      throw error;
    }
  }

  /**
   * Update a shop (placeholder for search functionality)
   */
  async updateShop(id: string, shopData: unknown): Promise<void> {
    try {
      this.logger.info("ShopSearchPresenter: Shop update attempted", {
        id,
        shopData,
      });
      throw new Error("Shop update not available in search context");
    } catch (error) {
      this.logger.error("Error updating shop:", error);
      throw error;
    }
  }

  /**
   * Delete a shop (placeholder for search functionality)
   */
  async deleteShop(id: string): Promise<void> {
    try {
      this.logger.info("ShopSearchPresenter: Shop deletion attempted", {
        id,
      });
      throw new Error("Shop deletion not available in search context");
    } catch (error) {
      this.logger.error("Error deleting shop:", error);
      throw error;
    }
  }
}

// Factory class
export class ShopSearchPresenterFactory {
  static async create(): Promise<ShopSearchPresenter> {
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

    return new ShopSearchPresenter(
      logger,
      authService,
      profileService,
      subscriptionService,
      marketplaceService
    );
  }
}

// Client-side factory class
export class ClientShopSearchPresenterFactory {
  static create(): ShopSearchPresenter {
    const clientContainer = getClientContainer();
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

    return new ShopSearchPresenter(
      logger,
      authService,
      profileService,
      subscriptionService,
      marketplaceService
    );
  }
}
