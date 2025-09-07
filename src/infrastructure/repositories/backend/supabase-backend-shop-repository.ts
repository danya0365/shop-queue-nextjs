import { CreateShopEntity, PaginatedShopsEntity, ShopCategoryEntity, ShopEntity, ShopStatsEntity, UpdateShopEntity } from "../../../domain/entities/backend/backend-shop.entity";
import { DatabaseDataSource, FilterOperator, QueryOptions, SortDirection } from "../../../domain/interfaces/datasources/database-datasource";
import { Logger } from "../../../domain/interfaces/logger";
import { PaginationParams } from "../../../domain/interfaces/pagination-types";
import { BackendShopError, BackendShopErrorType, BackendShopRepository } from "../../../domain/repositories/backend/backend-shop-repository";
import { SupabaseBackendShopMapper } from "../../mappers/backend/supabase-backend-shop.mapper";
import { ShopSchema, ShopStatsSchema } from "../../schemas/backend/shop.schema";
import { BackendRepository } from "../base/backend-repository";

// Extended types for joined data
type ShopWithJoins = ShopSchema & {
  profiles?: { full_name?: string },
  categories?: ShopCategoryEntity[]
};
type ShopSchemaRecord = Record<string, unknown> & ShopSchema;
type ShopStatsSchemaRecord = Record<string, unknown> & ShopStatsSchema;

/**
 * Supabase implementation of the shop repository
 * Following Clean Architecture principles for repository implementation
 */
export class SupabaseBackendShopRepository extends BackendRepository implements BackendShopRepository {
  constructor(
    dataSource: DatabaseDataSource,
    logger: Logger
  ) {
    super(dataSource, logger, "BackendShop");
  }

  /**
   * Get paginated shops data from database
   * @param params Pagination parameters
   * @returns Paginated shops data
   */
  async getPaginatedShops(params: PaginationParams): Promise<PaginatedShopsEntity> {
    try {
      const { page, limit } = params;
      const offset = (page - 1) * limit;

      // First, get shops with owner information
      const queryOptions: QueryOptions = {
        select: ['*'],
        joins: [
          { table: 'profiles', on: { fromField: 'owner_id', toField: 'id' } }
        ],
        sort: [{ field: 'created_at', direction: SortDirection.DESC }],
        pagination: {
          limit,
          offset
        }
      };

      // Use extended type that satisfies Record<string, unknown> constraint
      const shops = await this.dataSource.getAdvanced<ShopSchemaRecord>(
        'shops',
        queryOptions
      );

      // Count total items
      const totalItems = await this.dataSource.count('shops', queryOptions);

      // Get categories for all shops in a single query
      const shopIds = shops.map(shop => shop.id);

      // Query to get categories for all shops
      const categoriesQuery: QueryOptions = {
        // Only select from category_shops table, we'll get categories data via join
        select: ['shop_id', 'category_id'],
        joins: [
          { table: 'categories', on: { fromField: 'category_id', toField: 'id' }, select: ['id', 'name'] }
        ],
        filters: [{
          field: 'shop_id',
          operator: FilterOperator.IN,
          value: shopIds
        }]
      };

      const shopCategories = await this.dataSource.getAdvanced<Record<string, unknown>>(
        'category_shops',
        categoriesQuery
      );

      // Group categories by shop_id
      const categoriesByShopId = shopCategories.reduce<Record<string, ShopCategoryEntity[]>>((acc, category) => {
        const shopId = category.shop_id as string;
        if (!acc[shopId]) {
          acc[shopId] = [];
        }

        // Get category data from the joined categories table
        const categoryData = category.categories as Record<string, unknown>;
        const categoryId = categoryData.id as string;

        // Only add if not already in the array (avoid duplicates)
        if (!acc[shopId].some(c => c.id === categoryId)) {
          acc[shopId].push({
            id: categoryId,
            name: categoryData.name as string
          });
        }
        return acc;
      }, {});

      // query shop_stats_by_shop_view for each department into hash map 
      const shopStatsByShopView = await this.dataSource.getAdvanced<ShopStatsSchemaRecord>(
        'shop_stats_by_shop_view',
        {
          select: ['shop_id', 'total_queues', 'total_services'],
          filters: [{
            field: 'shop_id',
            operator: FilterOperator.IN,
            value: shopIds
          }]
        }
      );

      // map shop_stats_by_shop_view to hash map
      const shopStatsByShopViewMap = shopStatsByShopView.reduce((acc, shopStats) => {
        acc[shopStats.shop_id as string] = shopStats;
        return acc;
      }, {} as Record<string, ShopStatsSchemaRecord>);

      // Map database results to domain entities
      const mappedShops = shops.map(shop => {
        // handle joined data from joined tables
        const shopWithJoinedData = shop as ShopWithJoins;
        const categories = categoriesByShopId[shop.id] || [];
        const shopStats = shopStatsByShopViewMap[shop.id];

        const shopWithJoins = {
          ...shop,
          queue_count: Number(shopStats?.total_queues || 0),
          total_services: Number(shopStats?.total_services || 0),
          owner_name: shopWithJoinedData.profiles?.full_name,
          categories: categories
        };

        return SupabaseBackendShopMapper.toDomain(shopWithJoins);
      });

      // Create pagination metadata
      const pagination = SupabaseBackendShopMapper.createPaginationMeta(page, limit, totalItems);

      return {
        data: mappedShops,
        pagination
      };
    } catch (error) {
      if (error instanceof BackendShopError) {
        throw error;
      }

      this.logger.error('Error in getPaginatedShops', { error });
      throw new BackendShopError(
        BackendShopErrorType.UNKNOWN,
        'An unexpected error occurred while fetching shops',
        'getPaginatedShops',
        {},
        error
      );
    }
  }

  /**
   * Get shop statistics from database
   * @returns Shop statistics
   */
  async getShopStats(): Promise<ShopStatsEntity> {
    try {
      // Use getAdvanced to fetch statistics data
      const queryOptions: QueryOptions = {
        select: ['*'],
        // No joins needed for stats view
        // No pagination needed, we want all stats
      };

      // Assuming a view exists for shop statistics
      // Use extended type that satisfies Record<string, unknown> constraint
      const statsData = await this.dataSource.getAdvanced<ShopStatsSchemaRecord>(
        'shop_stats_summary_view',
        queryOptions
      );

      if (!statsData || statsData.length === 0) {
        // If no stats are found, return default values
        return {
          totalShops: 0,
          activeShops: 0,
          pendingApproval: 0,
          newThisMonth: 0
        };
      }

      // Map database results to domain entity
      // Assuming the first record contains all stats
      return SupabaseBackendShopMapper.statsToEntity(statsData[0]);
    } catch (error) {
      if (error instanceof BackendShopError) {
        throw error;
      }

      this.logger.error('Error in getShopStats', { error });
      throw new BackendShopError(
        BackendShopErrorType.UNKNOWN,
        'An unexpected error occurred while fetching shop statistics',
        'getShopStats',
        {},
        error
      );
    }
  }

  /**
   * Get shop by ID
   * @param id Shop ID
   * @returns Shop entity or null if not found
   */
  async getShopById(id: string): Promise<ShopEntity | null> {
    try {
      // Use getById which is designed for fetching by ID
      // Use extended type that satisfies Record<string, unknown> constraint
      const shop = await this.dataSource.getById<ShopSchemaRecord>(
        'shops',
        id,
        {
          select: ['*'],
          joins: [
            { table: 'profiles', on: { fromField: 'owner_id', toField: 'id' } }
          ]
        }
      );

      if (!shop) {
        return null;
      }

      // Get categories for this shop
      const categoriesQuery: QueryOptions = {
        // Only select from shop_categories table, we'll get categories data via join
        select: ['shop_id', 'category_id'],
        joins: [
          { table: 'categories', on: { fromField: 'category_id', toField: 'id' } }
        ],
        filters: [{
          field: 'shop_id',
          operator: FilterOperator.EQ,
          value: id
        }]
      };

      const shopCategories = await this.dataSource.getAdvanced<Record<string, unknown>>(
        'shop_categories',
        categoriesQuery
      );

      // Format categories - ensure no duplicates
      const categoriesMap = new Map<string, ShopCategoryEntity>();

      shopCategories.forEach(category => {
        // Get category data from the joined categories table
        const categoryData = category.categories as Record<string, unknown>;
        const categoryId = categoryData.id as string;

        if (!categoriesMap.has(categoryId)) {
          categoriesMap.set(categoryId, {
            id: categoryId,
            name: categoryData.name as string
          });
        }
      });

      const categories = Array.from(categoriesMap.values());

      // Handle joined data from profiles table
      const shopWithJoinedData = shop as ShopWithJoins;

      const shopWithOwnerAndCategories = {
        ...shop,
        queue_count: 10,
        total_services: 10,
        rating: 4.5,
        total_reviews: 10,
        owner_name: shopWithJoinedData.profiles?.full_name,
        categories: categories
      };

      // Map database result to domain entity
      return SupabaseBackendShopMapper.toDomain(shopWithOwnerAndCategories);
    } catch (error) {
      if (error instanceof BackendShopError) {
        throw error;
      }

      this.logger.error('Error in getShopById', { error, id });
      throw new BackendShopError(
        BackendShopErrorType.UNKNOWN,
        'An unexpected error occurred while fetching shop',
        'getShopById',
        { id },
        error
      );
    }
  }

  /**
   * Create a new shop
   * @param shop Shop data to create
   * @returns Created shop entity
   */
  async createShop(shop: Omit<CreateShopEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<ShopEntity> {
    try {
      // Convert domain entity to database schema
      const shopSchema = {
        name: shop.name,
        description: shop.description,
        address: shop.address,
        phone: shop.phone,
        email: shop.email,
        owner_id: shop.ownerId,
        status: shop.status,
        queue_count: 0,
        total_services: 0,
        rating: 0,
        total_reviews: 0
      };

      // Create shop in database
      const createdShop = await this.dataSource.insert<ShopSchemaRecord>(
        'shops',
        shopSchema
      );

      if (!createdShop) {
        throw new BackendShopError(
          BackendShopErrorType.OPERATION_FAILED,
          'Failed to create shop',
          'createShop',
          { shop }
        );
      }

      // Get the created shop with joined data
      return this.getShopById(createdShop.id) as Promise<ShopEntity>;
    } catch (error) {
      if (error instanceof BackendShopError) {
        throw error;
      }

      this.logger.error('Error in createShop', { error, shop });
      throw new BackendShopError(
        BackendShopErrorType.UNKNOWN,
        'An unexpected error occurred while creating shop',
        'createShop',
        { shop },
        error
      );
    }
  }

  /**
   * Update an existing shop
   * @param id Shop ID
   * @param shop Shop data to update
   * @returns Updated shop entity
   */
  async updateShop(id: string, shop: Partial<Omit<UpdateShopEntity, 'id' | 'createdAt' | 'updatedAt'>>): Promise<ShopEntity> {
    try {
      // Check if shop exists
      const existingShop = await this.getShopById(id);
      if (!existingShop) {
        throw new BackendShopError(
          BackendShopErrorType.NOT_FOUND,
          `Shop with ID ${id} not found`,
          'updateShop',
          { id, shop }
        );
      }

      // Convert domain entity to database schema
      const shopSchema: Partial<ShopSchema> = {};
      if (shop.name !== undefined) shopSchema.name = shop.name;
      if (shop.description !== undefined) shopSchema.description = shop.description;
      if (shop.address !== undefined) shopSchema.address = shop.address;
      if (shop.phone !== undefined) shopSchema.phone = shop.phone;
      if (shop.email !== undefined) shopSchema.email = shop.email;
      if (shop.status !== undefined) shopSchema.status = shop.status;

      // Update shop in database
      const updatedShop = await this.dataSource.update<ShopSchemaRecord>(
        'shops',
        id,
        shopSchema
      );

      if (!updatedShop) {
        throw new BackendShopError(
          BackendShopErrorType.OPERATION_FAILED,
          'Failed to update shop',
          'updateShop',
          { id, shop }
        );
      }

      // Get the updated shop with joined data
      return this.getShopById(id) as Promise<ShopEntity>;
    } catch (error) {
      if (error instanceof BackendShopError) {
        throw error;
      }

      this.logger.error('Error in updateShop', { error, id, shop });
      throw new BackendShopError(
        BackendShopErrorType.UNKNOWN,
        'An unexpected error occurred while updating shop',
        'updateShop',
        { id, shop },
        error
      );
    }
  }

  /**
   * Delete a shop
   * @param id Shop ID
   * @returns true if deleted successfully
   */
  async deleteShop(id: string): Promise<boolean> {
    try {
      // Check if shop exists
      const existingShop = await this.getShopById(id);
      if (!existingShop) {
        throw new BackendShopError(
          BackendShopErrorType.NOT_FOUND,
          `Shop with ID ${id} not found`,
          'deleteShop',
          { id }
        );
      }

      // Delete shop from database
      await this.dataSource.delete(
        'shops',
        id
      );

      // Since we've already checked if the shop exists, we can return true
      return true;
    } catch (error) {
      if (error instanceof BackendShopError) {
        throw error;
      }

      this.logger.error('Error in deleteShop', { error, id });
      throw new BackendShopError(
        BackendShopErrorType.UNKNOWN,
        'An unexpected error occurred while deleting shop',
        'deleteShop',
        { id },
        error
      );
    }
  }
}
