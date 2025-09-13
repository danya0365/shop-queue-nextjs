import {
  CreatePromotionEntity,
  PaginatedPromotionsEntity,
  PromotionEntity,
  PromotionStatsEntity,
} from "@/src/domain/entities/shop/backend/backend-promotion.entity";
import {
  DatabaseDataSource,
  FilterOperator,
  QueryOptions,
  SortDirection,
} from "@/src/domain/interfaces/datasources/database-datasource";
import { Logger } from "@/src/domain/interfaces/logger";
import { PaginationParamsWithShopId } from "@/src/domain/interfaces/pagination-types";
import {
  ShopBackendPromotionError,
  ShopBackendPromotionErrorType,
  ShopBackendPromotionRepository,
} from "@/src/domain/repositories/shop/backend/backend-promotion-repository";
import { SupabaseShopBackendPromotionMapper } from "@/src/infrastructure/mappers/shop/backend/supabase-backend-promotion.mapper";
import {
  PromotionSchema,
  PromotionStatsSchema,
} from "@/src/infrastructure/schemas/shop/backend/promotion.schema";
import { StandardRepository } from "../../base/standard-repository";

// Extended types for joined data
type PromotionWithJoins = PromotionSchema & {
  shops?: { name?: string };
  profiles?: { name?: string };
};
type PromotionSchemaRecord = Record<string, unknown> & PromotionSchema;
type PromotionStatsSchemaRecord = Record<string, unknown> &
  PromotionStatsSchema;

/**
 * Supabase implementation of the promotion repository
 * Following Clean Architecture principles for repository implementation
 */
export class SupabaseShopBackendPromotionRepository
  extends StandardRepository
  implements ShopBackendPromotionRepository
{
  constructor(dataSource: DatabaseDataSource, logger: Logger) {
    super(dataSource, logger, "ShopBackendPromotion");
  }

  /**
   * Get paginated promotions data from database
   * @param params Pagination and filter parameters
   * @returns Paginated promotions data
   */
  async getPaginatedPromotions(
    params: PaginationParamsWithShopId & {
      filters?: {
        searchQuery?: string;
        typeFilter?: string;
        statusFilter?: string;
        dateFrom?: string;
        dateTo?: string;
      };
    }
  ): Promise<PaginatedPromotionsEntity> {
    try {
      const { page = 1, limit = 10, shopId, filters } = params;
      const offset = (page - 1) * limit;

      if (!shopId) {
        throw new ShopBackendPromotionError(
          ShopBackendPromotionErrorType.NOT_FOUND,
          "Shop ID is required",
          "getPaginatedPromotions",
          { shopId },
          null
        );
      }

      // Build filters array
      const queryFilters: Array<{
        field: string;
        operator: FilterOperator;
        value: string | number;
      }> = [
        {
          field: "shop_id",
          operator: FilterOperator.EQ,
          value: shopId,
        },
      ];

      // Add optional filters
      if (filters?.searchQuery) {
        queryFilters.push({
          field: "name",
          operator: FilterOperator.ILIKE,
          value: `%${filters.searchQuery}%`,
        });
      }

      if (filters?.typeFilter) {
        queryFilters.push({
          field: "type",
          operator: FilterOperator.EQ,
          value: filters.typeFilter,
        });
      }

      if (filters?.statusFilter) {
        queryFilters.push({
          field: "status",
          operator: FilterOperator.EQ,
          value: filters.statusFilter,
        });
      }

      if (filters?.dateFrom) {
        queryFilters.push({
          field: "start_at",
          operator: FilterOperator.GTE,
          value: filters.dateFrom,
        });
      }

      if (filters?.dateTo) {
        queryFilters.push({
          field: "end_at",
          operator: FilterOperator.LTE,
          value: filters.dateTo,
        });
      }

      // Use getAdvanced with proper QueryOptions format
      const queryOptions: QueryOptions = {
        select: ["*"],
        filters: queryFilters,
        joins: [
          { table: "shops", on: { fromField: "shop_id", toField: "id" } },
          { table: "profiles", on: { fromField: "created_by", toField: "id" } },
        ],
        sort: [{ field: "created_at", direction: SortDirection.DESC }],
        pagination: {
          limit,
          offset,
        },
      };

      // Use extended type that satisfies Record<string, unknown> constraint
      const promotions =
        await this.dataSource.getAdvanced<PromotionSchemaRecord>(
          "promotions",
          queryOptions
        );

      // Count total items
      const totalItems = await this.dataSource.count(
        "promotions",
        queryOptions
      );

      // Map database results to domain entities
      const mappedPromotions = promotions.map((promotion) => {
        // Handle joined data from shops and profiles tables
        const promotionWithJoinedData = promotion as PromotionWithJoins;

        const promotionWithJoins = {
          ...promotion,
          shop_name: promotionWithJoinedData.shops?.name,
          created_by_name: promotionWithJoinedData.profiles?.name,
        };
        return SupabaseShopBackendPromotionMapper.toDomain(promotionWithJoins);
      });

      // Create pagination metadata
      const pagination =
        SupabaseShopBackendPromotionMapper.createPaginationMeta(
          page,
          limit,
          totalItems
        );

      return {
        data: mappedPromotions,
        pagination,
      };
    } catch (error) {
      if (error instanceof ShopBackendPromotionError) {
        throw error;
      }

      this.logger.error("Error in getPaginatedPromotions", { error });
      throw new ShopBackendPromotionError(
        ShopBackendPromotionErrorType.UNKNOWN,
        "An unexpected error occurred while fetching promotions",
        "getPaginatedPromotions",
        {},
        error
      );
    }
  }

  /**
   * Get promotion statistics from database
   * @returns Promotion statistics
   */
  async getPromotionStats(shopId: string): Promise<PromotionStatsEntity> {
    try {
      // Use getAdvanced to fetch statistics data
      const queryOptions: QueryOptions = {
        select: ["*"],
        filters: [
          {
            field: "shop_id",
            operator: FilterOperator.EQ,
            value: shopId,
          },
        ],
        // No joins needed for stats view
        // No pagination needed, we want all stats
      };

      // Assuming a view exists for promotion statistics
      // Use extended type that satisfies Record<string, unknown> constraint
      const statsData =
        await this.dataSource.getAdvanced<PromotionStatsSchemaRecord>(
          "promotion_stats_by_shop_view",
          queryOptions
        );

      if (!statsData || statsData.length === 0) {
        // If no stats are found, return default values
        return {
          totalPromotions: 0,
          activePromotions: 0,
          inactivePromotions: 0,
          expiredPromotions: 0,
          scheduledPromotions: 0,
          totalUsage: 0,
          totalDiscountGiven: 0,
          averageDiscountAmount: 0,
          mostUsedPromotionType: "percentage",
        };
      }

      // Map database results to domain entity
      // Assuming the first record contains all stats
      return SupabaseShopBackendPromotionMapper.statsToEntity(statsData[0]);
    } catch (error) {
      if (error instanceof ShopBackendPromotionError) {
        throw error;
      }

      this.logger.error("Error in getPromotionStats", { error });
      throw new ShopBackendPromotionError(
        ShopBackendPromotionErrorType.UNKNOWN,
        "An unexpected error occurred while fetching promotion statistics",
        "getPromotionStats",
        {},
        error
      );
    }
  }

  /**
   * Get promotion by ID
   * @param id Promotion ID
   * @returns Promotion entity or null if not found
   */
  async getPromotionById(id: string): Promise<PromotionEntity | null> {
    try {
      // Use getById which is designed for fetching by ID
      // Use extended type that satisfies Record<string, unknown> constraint
      const promotion = await this.dataSource.getById<PromotionSchemaRecord>(
        "promotions",
        id,
        {
          select: ["*"],
          joins: [
            { table: "shops", on: { fromField: "shop_id", toField: "id" } },
            {
              table: "profiles",
              on: { fromField: "created_by", toField: "id" },
            },
          ],
        }
      );

      if (!promotion) {
        return null;
      }

      // Handle joined data from shops and profiles tables
      const promotionWithJoinedData = promotion as PromotionWithJoins;

      const promotionWithJoins = {
        ...promotion,
        shop_name: promotionWithJoinedData.shops?.name,
        created_by_name: promotionWithJoinedData.profiles?.name,
      };

      // Map database result to domain entity
      return SupabaseShopBackendPromotionMapper.toDomain(promotionWithJoins);
    } catch (error) {
      if (error instanceof ShopBackendPromotionError) {
        throw error;
      }

      this.logger.error("Error in getPromotionById", { error, id });
      throw new ShopBackendPromotionError(
        ShopBackendPromotionErrorType.UNKNOWN,
        "An unexpected error occurred while fetching promotion",
        "getPromotionById",
        { id },
        error
      );
    }
  }

  /**
   * Create a new promotion
   * @param promotion Promotion data to create
   * @returns Created promotion entity
   */
  async createPromotion(
    promotion: Omit<CreatePromotionEntity, "id" | "createdAt" | "updatedAt">
  ): Promise<PromotionEntity> {
    try {
      // Convert domain entity to database schema
      const promotionSchema = {
        shop_id: promotion.shopId,
        name: promotion.name,
        description: promotion.description || null,
        type: promotion.type,
        value: promotion.value,
        min_purchase_amount: promotion.minPurchaseAmount || null,
        max_discount_amount: promotion.maxDiscountAmount || null,
        start_at: promotion.startAt,
        end_at: promotion.endAt,
        usage_limit: promotion.usageLimit || null,
        status: promotion.status || "active",
        conditions: promotion.conditions || null,
        created_by: promotion.createdBy,
      };

      // Create promotion in database
      const createdPromotion =
        await this.dataSource.insert<PromotionSchemaRecord>(
          "promotions",
          promotionSchema
        );

      if (!createdPromotion) {
        throw new ShopBackendPromotionError(
          ShopBackendPromotionErrorType.OPERATION_FAILED,
          "Failed to create promotion",
          "createPromotion",
          { promotion }
        );
      }

      // Get the created promotion with joined data
      return this.getPromotionById(
        createdPromotion.id
      ) as Promise<PromotionEntity>;
    } catch (error) {
      if (error instanceof ShopBackendPromotionError) {
        throw error;
      }

      this.logger.error("Error in createPromotion", { error, promotion });
      throw new ShopBackendPromotionError(
        ShopBackendPromotionErrorType.UNKNOWN,
        "An unexpected error occurred while creating promotion",
        "createPromotion",
        { promotion },
        error
      );
    }
  }

  /**
   * Update an existing promotion
   * @param id Promotion ID
   * @param promotion Promotion data to update
   * @returns Updated promotion entity
   */
  async updatePromotion(
    id: string,
    promotion: Partial<Omit<PromotionEntity, "id" | "createdAt" | "updatedAt">>
  ): Promise<PromotionEntity> {
    try {
      // Check if promotion exists
      const existingPromotion = await this.getPromotionById(id);
      if (!existingPromotion) {
        throw new ShopBackendPromotionError(
          ShopBackendPromotionErrorType.NOT_FOUND,
          `Promotion with ID ${id} not found`,
          "updatePromotion",
          { id, promotion }
        );
      }

      // Convert domain entity to database schema
      const promotionSchema: Partial<PromotionSchema> = {};
      if (promotion.shopId !== undefined)
        promotionSchema.shop_id = promotion.shopId;
      if (promotion.name !== undefined) promotionSchema.name = promotion.name;
      if (promotion.description !== undefined)
        promotionSchema.description = promotion.description;
      if (promotion.type !== undefined) promotionSchema.type = promotion.type;
      if (promotion.value !== undefined)
        promotionSchema.value = promotion.value;
      if (promotion.minPurchaseAmount !== undefined)
        promotionSchema.min_purchase_amount = promotion.minPurchaseAmount;
      if (promotion.maxDiscountAmount !== undefined)
        promotionSchema.max_discount_amount = promotion.maxDiscountAmount;
      if (promotion.startAt !== undefined)
        promotionSchema.start_at = promotion.startAt;
      if (promotion.endAt !== undefined)
        promotionSchema.end_at = promotion.endAt;
      if (promotion.usageLimit !== undefined)
        promotionSchema.usage_limit = promotion.usageLimit;
      if (promotion.status !== undefined)
        promotionSchema.status = promotion.status;
      if (promotion.conditions !== undefined)
        promotionSchema.conditions = promotion.conditions as
          | Record<string, unknown>[]
          | null;

      // Update promotion in database
      const updatedPromotion =
        await this.dataSource.update<PromotionSchemaRecord>(
          "promotions",
          id,
          promotionSchema
        );

      if (!updatedPromotion) {
        throw new ShopBackendPromotionError(
          ShopBackendPromotionErrorType.OPERATION_FAILED,
          "Failed to update promotion",
          "updatePromotion",
          { id, promotion }
        );
      }

      // Get the updated promotion with joined data
      return this.getPromotionById(id) as Promise<PromotionEntity>;
    } catch (error) {
      if (error instanceof ShopBackendPromotionError) {
        throw error;
      }

      this.logger.error("Error in updatePromotion", { error, id, promotion });
      throw new ShopBackendPromotionError(
        ShopBackendPromotionErrorType.UNKNOWN,
        "An unexpected error occurred while updating promotion",
        "updatePromotion",
        { id, promotion },
        error
      );
    }
  }

  /**
   * Delete a promotion
   * @param id Promotion ID
   * @returns true if deleted successfully
   */
  async deletePromotion(id: string): Promise<boolean> {
    try {
      // Check if promotion exists
      const existingPromotion = await this.getPromotionById(id);
      if (!existingPromotion) {
        throw new ShopBackendPromotionError(
          ShopBackendPromotionErrorType.NOT_FOUND,
          `Promotion with ID ${id} not found`,
          "deletePromotion",
          { id }
        );
      }

      // Delete promotion from database
      await this.dataSource.delete("promotions", id);

      // Since we've already checked if the promotion exists, we can return true
      return true;
    } catch (error) {
      if (error instanceof ShopBackendPromotionError) {
        throw error;
      }

      this.logger.error("Error in deletePromotion", { error, id });
      throw new ShopBackendPromotionError(
        ShopBackendPromotionErrorType.UNKNOWN,
        "An unexpected error occurred while deleting promotion",
        "deletePromotion",
        { id },
        error
      );
    }
  }
}
