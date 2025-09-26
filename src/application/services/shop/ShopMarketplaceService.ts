import {
  DatabaseDataSource,
} from "@/src/domain/interfaces/datasources/database-datasource";
import { Logger } from "@/src/domain/interfaces/logger";
import {
  MarketplaceStatsDTO,
  ShopListResultDTO,
  ShopFiltersDTO,
  MarketplaceCategoryDTO,
  GetAllShopsParams,
  GetShopsByCategoryParams,
  GetShopsByLocationParams
, LocationDTO
} from "@/src/application/dtos/shop/marketplace-dto";
import { ShopDTO } from "@/src/application/dtos/backend/shops-dto";
import { CategoryMarketplaceSchema, LocationMarketplaceSchema, ShopMarketplaceSchema } from "../../../infrastructure/schemas/shop/marketplace.schema";
import { MarketplaceMapper } from "@/src/infrastructure/mappers/shop/marketplace.mapper";

export interface IShopMarketplaceService {
  // Public browsing
  getAllShops(params: GetAllShopsParams): Promise<ShopListResultDTO>;
  
  getFeaturedShops(limit: number): Promise<ShopDTO[]>;
  getShopById(id: string): Promise<ShopDTO | null>;
  
  // Search & Filter
  searchShops(query: string, filters?: ShopFiltersDTO): Promise<ShopListResultDTO>;
  getShopsByCategory(categoryId: string, params: GetShopsByCategoryParams): Promise<ShopListResultDTO>;
  
  getShopsByLocation(locationId: string, params: GetShopsByLocationParams): Promise<ShopListResultDTO>;
  
  // Marketplace data
  getMarketplaceStats(): Promise<MarketplaceStatsDTO>;
  getPopularCategories(): Promise<MarketplaceCategoryDTO[]>;
  getPopularLocations(): Promise<LocationDTO[]>;
}

export class ShopMarketplaceService implements IShopMarketplaceService {
  constructor(
    private readonly databaseDataSource: DatabaseDataSource,
    private readonly logger: Logger
  ) {}

  async getAllShops(params: GetAllShopsParams): Promise<ShopListResultDTO> {
    try {
      const { page, limit, search, status } = params;
      
      // Call RPC function to get shops with pagination
      const shopsResult = await this.databaseDataSource.callRpc<ShopMarketplaceSchema[]>(
        "get_marketplace_shops",
        {
          p_page: page,
          p_limit: limit,
          p_search: search || null,
          p_status: status || "active",
          p_sort_field: "createdAt",
          p_sort_direction: "DESC"
        }
      );

      // For total count, we need to call the RPC without pagination
      // Since RPC doesn't return count directly, we'll use a separate approach
      // For now, we'll estimate based on the result (this should be improved)
      const totalCount = shopsResult.length >= limit ? (page * limit) + 1 : ((page - 1) * limit) + shopsResult.length;

      const shops = shopsResult.map((shop: ShopMarketplaceSchema) => MarketplaceMapper.toShopDTO(shop));

      return {
        shops,
        totalCount,
        perPage: limit,
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
      };
    } catch (error) {
      this.logger.error("Error getting all shops", { params, error });
      throw error;
    }
  }

  async getFeaturedShops(limit: number): Promise<ShopDTO[]> {
    try {
      const featuredShops = await this.databaseDataSource.callRpc<ShopMarketplaceSchema[]>(
        "get_marketplace_shops",
        {
          p_page: 1,
          p_limit: limit,
          p_status: "active",
          p_is_featured: true,
          p_sort_field: "rating",
          p_sort_direction: "DESC"
        }
      );

      return featuredShops.map((shop: ShopMarketplaceSchema) => MarketplaceMapper.toShopDTO(shop));
    } catch (error) {
      this.logger.error("Error getting featured shops", { limit, error });
      throw error;
    }
  }

  async getShopById(id: string): Promise<ShopDTO | null> {
    try {
      const shopResult = await this.databaseDataSource.callRpc<ShopMarketplaceSchema[]>(
        "get_shop_by_id",
        {
          p_shop_id: id
        }
      );
      
      if (!shopResult || shopResult.length === 0) {
        return null;
      }

      return MarketplaceMapper.toShopDTO(shopResult[0]);
    } catch (error) {
      this.logger.error("Error getting shop by id", { id, error });
      throw error;
    }
  }

  async searchShops(query: string, filters?: ShopFiltersDTO): Promise<ShopListResultDTO> {
    try {
      const page = filters?.page || 1;
      const limit = filters?.limit || 12;
      
      // Call RPC function to search shops
      const searchResult = await this.databaseDataSource.callRpc<ShopMarketplaceSchema[]>(
        "get_marketplace_shops",
        {
          p_page: page,
          p_limit: limit,
          p_search: query,
          p_status: "active",
          p_category_id: filters?.category || null,
          p_sort_field: "rating",
          p_sort_direction: "DESC"
        }
      );

      // Note: For location filtering, we would need to handle it differently
      // since the RPC doesn't support location filtering directly
      // For now, we'll estimate total count
      const totalCount = searchResult.length >= limit ? (page * limit) + 1 : ((page - 1) * limit) + searchResult.length;

      const shops = searchResult.map((shop: ShopMarketplaceSchema) => MarketplaceMapper.toShopDTO(shop));

      return {
        shops,
        totalCount,
        perPage: limit,
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
      };
    } catch (error) {
      this.logger.error("Error searching shops", { query, filters, error });
      throw error;
    }
  }

  async getShopsByCategory(categoryId: string, params: GetShopsByCategoryParams): Promise<ShopListResultDTO> {
    try {
      const { page, limit } = params;

      // Call RPC function to get shops by category
      const result = await this.databaseDataSource.callRpc<ShopMarketplaceSchema[]>(
        "get_marketplace_shops_by_category",
        {
          p_category_id: categoryId,
          p_page: page,
          p_limit: limit
        }
      );

      // Estimate total count since RPC doesn't return count directly
      const totalCount = result.length >= limit ? (page * limit) + 1 : ((page - 1) * limit) + result.length;

      const shops = result.map((shop: ShopMarketplaceSchema) => MarketplaceMapper.toShopDTO(shop));

      return {
        shops,
        totalCount,
        perPage: limit,
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
      };
    } catch (error) {
      this.logger.error("Error getting shops by category", { categoryId, params, error });
      throw error;
    }
  }

  async getShopsByLocation(locationId: string, params: GetShopsByLocationParams): Promise<ShopListResultDTO> {
    try {
      const { page, limit } = params;

      // Note: The RPC expects location name, not ID
      // For now, we'll assume locationId is the location name
      // In a real implementation, you might need to fetch location details first
      const locationName = locationId; // Assuming locationId is the location name

      // Call RPC function to get shops by location
      const result = await this.databaseDataSource.callRpc<ShopMarketplaceSchema[]>(
        "get_marketplace_shops_by_location",
        {
          p_location_name: locationName,
          p_page: page,
          p_limit: limit
        }
      );

      // Estimate total count since RPC doesn't return count directly
      const totalCount = result.length >= limit ? (page * limit) + 1 : ((page - 1) * limit) + result.length;

      const shops = result.map((shop: ShopMarketplaceSchema) => MarketplaceMapper.toShopDTO(shop));

      return {
        shops,
        totalCount,
        perPage: limit,
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
      };
    } catch (error) {
      this.logger.error("Error getting shops by location", { locationId, params, error });
      throw error;
    }
  }

  async getMarketplaceStats(): Promise<MarketplaceStatsDTO> {
    try {
      // Call RPC function to get marketplace stats
      const statsResult = await this.databaseDataSource.callRpc<{
        total_shops: number;
        active_shops: number;
        featured_shops: number;
        new_shops_this_month: number;
      }[]>("get_marketplace_stats");

      if (!statsResult || statsResult.length === 0) {
        throw new Error("Failed to get marketplace stats");
      }

      const stats = statsResult[0];

      return {
        totalShops: stats.total_shops,
        activeShops: stats.active_shops,
        featuredShops: stats.featured_shops,
        newShopsThisMonth: stats.new_shops_this_month,
      };
    } catch (error) {
      this.logger.error("Error getting marketplace stats", { error });
      throw error;
    }
  }

  async getPopularCategories(): Promise<MarketplaceCategoryDTO[]> {
    try {
      const popularCategories = await this.databaseDataSource.callRpc<{
        id: string;
        name: string;
        description: string;
        color: string;
        icon: string;
        slug: string;
        is_active: boolean;
        sort_order: number;
        shop_count: number;
      }[]>("get_marketplace_popular_categories", {
        p_limit: 10
      });

      return popularCategories.map((category) => 
        MarketplaceMapper.toMarketplaceCategoryDTO({
          id: category.id,
          name: category.name,
          description: category.description,
          color: category.color,
          icon: category.icon,
          slug: category.slug,
          is_active: category.is_active,
          sort_order: category.sort_order,
          shops_count: category.shop_count,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        } as CategoryMarketplaceSchema)
      );
    } catch (error) {
      this.logger.error("Error getting popular categories", { error });
      throw error;
    }
  }

  async getPopularLocations(): Promise<LocationDTO[]> {
    try {
      const popularLocations = await this.databaseDataSource.callRpc<{
        id: string;
        name: string;
        province: string;
        district: string;
        is_active: boolean;
        shops_count: number;
      }[]>("get_marketplace_popular_locations", {
        p_limit: 10
      });

      return popularLocations.map((location) => 
        MarketplaceMapper.toLocationDTO({
          id: location.id,
          name: location.name,
          province: location.province,
          district: location.district,
          is_active: location.is_active,
          shops_count: location.shops_count,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        } as LocationMarketplaceSchema)
      );
    } catch (error) {
      this.logger.error("Error getting popular locations", { error });
      throw error;
    }
  }

}

export class ShopMarketplaceServiceFactory {
  static create(
    databaseDataSource: DatabaseDataSource,
    logger: Logger
  ): ShopMarketplaceService {
    return new ShopMarketplaceService(databaseDataSource, logger);
  }
}
