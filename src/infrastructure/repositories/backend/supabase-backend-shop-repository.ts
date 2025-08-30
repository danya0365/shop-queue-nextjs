import { PaginatedShopsEntity, ShopEntity, ShopStatsEntity } from "../../../domain/entities/backend/backend-shop.entity";
import { DatabaseDataSource, QueryOptions, SortDirection } from "../../../domain/interfaces/datasources/database-datasource";
import { Logger } from "../../../domain/interfaces/logger";
import { PaginationParams } from "../../../domain/interfaces/pagination-types";
import { BackendShopError, BackendShopErrorType, BackendShopRepository } from "../../../domain/repositories/backend/backend-shop-repository";
import { SupabaseBackendShopMapper } from "../../mappers/backend/supabase-backend-shop.mapper";
import { ShopSchema, ShopStatsSchema } from "../../schemas/backend/shop.schema";
import { BackendRepository } from "../base/backend-repository";

// Extended types for joined data
type ShopWithProfile = ShopSchema & { profiles?: { full_name?: string } };
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

      // Use getAdvanced with proper QueryOptions format
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
      const totalItems = await this.dataSource.count('shops');

      // Map database results to domain entities
      const mappedShops = shops.map(shop => {
        // Handle joined data from profiles table using our ShopWithProfile type
        const shopWithJoinedData = shop as ShopWithProfile;

        const shopWithOwner = {
          ...shop,
          owner_name: shopWithJoinedData.profiles?.full_name
        };
        return SupabaseBackendShopMapper.toDomain(shopWithOwner);
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
        'shop_stats_view',
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
          joins: [{ table: 'profiles', on: { fromField: 'owner_id', toField: 'id' } }]
        }
      );

      if (!shop) {
        return null;
      }

      // Handle joined data from profiles table using our ShopWithProfile type
      const shopWithJoinedData = shop as ShopWithProfile;

      const shopWithOwner = {
        ...shop,
        owner_name: shopWithJoinedData.profiles?.full_name
      };

      // Map database result to domain entity
      return SupabaseBackendShopMapper.toDomain(shopWithOwner);
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
}
