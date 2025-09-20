import {
  DatabaseDataSource,
  FilterOperator,
  QueryOptions,
  SortDirection,
} from "@/src/domain/interfaces/datasources/database-datasource";
import type { Logger } from "@/src/domain/interfaces/logger";
import {
  CustomerDashboardEntity,
  PopularServiceEntity,
  PromotionEntity,
  QueueStatusStatsEntity,
} from "@/src/domain/entities/shop/customer/customer-dashboard.entity";
import {
  ShopCustomerDashboardError,
  ShopCustomerDashboardErrorType,
  ShopCustomerDashboardRepository,
} from "@/src/domain/repositories/shop/customer/customer-dashboard-repository";
import { SupabaseCustomerDashboardMapper } from "@/src/infrastructure/mappers/shop/customer/supabase-customer-dashboard-mapper";
import {
  QueueSchema,
  ServiceSchema,
  PromotionSchema,
  ShopSchema,
} from "@/src/infrastructure/schemas/shop/customer/customer-dashboard.schema";
import { StandardRepository } from "../../base/standard-repository";

// Extended types for database records
type QueueSchemaRecord = Record<string, unknown> & QueueSchema;
type ServiceSchemaRecord = Record<string, unknown> & ServiceSchema;
type PromotionSchemaRecord = Record<string, unknown> & PromotionSchema;
type ShopSchemaRecord = Record<string, unknown> & ShopSchema;

/**
 * Supabase implementation of the customer dashboard repository
 * Following Clean Architecture principles for repository implementation
 */
export class SupabaseCustomerDashboardRepository
  extends StandardRepository
  implements ShopCustomerDashboardRepository
{
  constructor(dataSource: DatabaseDataSource, logger: Logger) {
    super(dataSource, logger, "CustomerDashboard");
  }

  /**
   * Get queue status statistics for a shop
   * @param shopId The shop ID
   * @returns Queue status statistics
   */
  async getQueueStatus(shopId: string): Promise<QueueStatusStatsEntity> {
    try {
      if (!shopId) {
        throw new ShopCustomerDashboardError(
          ShopCustomerDashboardErrorType.VALIDATION_ERROR,
          "Shop ID is required",
          "SupabaseCustomerDashboardRepository.getQueueStatus",
          { shopId }
        );
      }

      this.logger.info("Getting queue status", { shopId });

      const queueQueryOptions: QueryOptions = {
        filters: [
          {
            field: "shop_id",
            operator: FilterOperator.EQ,
            value: shopId,
          },
          {
            field: "status",
            operator: FilterOperator.IN,
            value: ["waiting", "serving"],
          },
        ],
        sort: [
          {
            field: "created_at",
            direction: SortDirection.ASC,
          },
        ],
      };

      const queuesResult = await this.dataSource.getAdvanced(
        "queues",
        queueQueryOptions
      );

      if (!queuesResult || !Array.isArray(queuesResult)) {
        throw new ShopCustomerDashboardError(
          ShopCustomerDashboardErrorType.DATABASE_ERROR,
          "Failed to fetch queues data",
          "SupabaseCustomerDashboardRepository.getQueueStatus",
          { shopId }
        );
      }

      const queuesData = queuesResult as Array<QueueSchemaRecord>;

      // Transform the data using the mapper
      const queueStatus = SupabaseCustomerDashboardMapper.toQueueStatusStatsEntity(queuesData);

      this.logger.info("Queue status retrieved successfully", {
        shopId,
        totalWaiting: queueStatus.totalWaiting,
        currentNumber: queueStatus.currentNumber,
      });

      return queueStatus;
    } catch (error) {
      if (error instanceof ShopCustomerDashboardError) {
        throw error;
      }
      this.logger.error("Error getting queue status", error);
      throw new ShopCustomerDashboardError(
        ShopCustomerDashboardErrorType.DATABASE_ERROR,
        "Failed to get queue status",
        "SupabaseCustomerDashboardRepository.getQueueStatus",
        { shopId },
        error as Error
      );
    }
  }

  /**
   * Get popular services for a shop
   * @param shopId The shop ID
   * @param limit Maximum number of services to return
   * @returns Popular services
   */
  async getPopularServices(
    shopId: string,
    limit?: number
  ): Promise<PopularServiceEntity[]> {
    try {
      if (!shopId) {
        throw new ShopCustomerDashboardError(
          ShopCustomerDashboardErrorType.VALIDATION_ERROR,
          "Shop ID is required",
          "SupabaseCustomerDashboardRepository.getPopularServices",
          { shopId }
        );
      }

      this.logger.info("Getting popular services", { shopId, limit });

      const serviceQueryOptions: QueryOptions = {
        filters: [
          {
            field: "shop_id",
            operator: FilterOperator.EQ,
            value: shopId,
          },
          {
            field: "is_active",
            operator: FilterOperator.EQ,
            value: true,
          },
        ],
        sort: [
          {
            field: "popularity_score",
            direction: SortDirection.DESC,
          },
        ],
        pagination: {
          limit: limit || 10,
        },
      };

      const servicesResult = await this.dataSource.getAdvanced(
        "services",
        serviceQueryOptions
      );

      if (!servicesResult || !Array.isArray(servicesResult)) {
        throw new ShopCustomerDashboardError(
          ShopCustomerDashboardErrorType.DATABASE_ERROR,
          "Failed to fetch services data",
          "SupabaseCustomerDashboardRepository.getPopularServices",
          { shopId }
        );
      }

      const servicesData = servicesResult as Array<ServiceSchemaRecord>;

      // Transform the data using the mapper
      const popularServices = SupabaseCustomerDashboardMapper.toPopularServiceEntities(servicesData);

      this.logger.info("Popular services retrieved successfully", {
        shopId,
        count: popularServices.length,
      });

      return popularServices;
    } catch (error) {
      if (error instanceof ShopCustomerDashboardError) {
        throw error;
      }
      this.logger.error("Error getting popular services", error);
      throw new ShopCustomerDashboardError(
        ShopCustomerDashboardErrorType.DATABASE_ERROR,
        "Failed to get popular services",
        "SupabaseCustomerDashboardRepository.getPopularServices",
        { shopId },
        error as Error
      );
    }
  }

  /**
   * Get active promotions for a shop
   * @param shopId The shop ID
   * @returns Active promotions
   */
  async getPromotions(shopId: string): Promise<PromotionEntity[]> {
    try {
      if (!shopId) {
        throw new ShopCustomerDashboardError(
          ShopCustomerDashboardErrorType.VALIDATION_ERROR,
          "Shop ID is required",
          "SupabaseCustomerDashboardRepository.getPromotions",
          { shopId }
        );
      }

      this.logger.info("Getting promotions", { shopId });

      const promotionQueryOptions: QueryOptions = {
        filters: [
          {
            field: "shop_id",
            operator: FilterOperator.EQ,
            value: shopId,
          },
          {
            field: "status",
            operator: FilterOperator.EQ,
            value: "active",
          },
        ],
        sort: [
          {
            field: "created_at",
            direction: SortDirection.DESC,
          },
        ],
      };

      const promotionsResult = await this.dataSource.getAdvanced(
        "promotions",
        promotionQueryOptions
      );

      if (!promotionsResult || !Array.isArray(promotionsResult)) {
        throw new ShopCustomerDashboardError(
          ShopCustomerDashboardErrorType.DATABASE_ERROR,
          "Failed to fetch promotions data",
          "SupabaseCustomerDashboardRepository.getPromotions",
          { shopId }
        );
      }

      const promotionsData = promotionsResult as Array<PromotionSchemaRecord>;

      // Transform the data using the mapper
      const promotions = SupabaseCustomerDashboardMapper.toPromotionEntities(promotionsData);

      this.logger.info("Promotions retrieved successfully", {
        shopId,
        count: promotions.length,
      });

      return promotions;
    } catch (error) {
      if (error instanceof ShopCustomerDashboardError) {
        throw error;
      }
      this.logger.error("Error getting promotions", error);
      throw new ShopCustomerDashboardError(
        ShopCustomerDashboardErrorType.DATABASE_ERROR,
        "Failed to get promotions",
        "SupabaseCustomerDashboardRepository.getPromotions",
        { shopId },
        error as Error
      );
    }
  }

  /**
   * Get complete customer dashboard data for a shop
   * @param shopId The shop ID
   * @returns Complete customer dashboard data
   */
  async getCustomerDashboard(
    shopId: string
  ): Promise<CustomerDashboardEntity> {
    try {
      if (!shopId) {
        throw new ShopCustomerDashboardError(
          ShopCustomerDashboardErrorType.VALIDATION_ERROR,
          "Shop ID is required",
          "SupabaseCustomerDashboardRepository.getCustomerDashboard",
          { shopId }
        );
      }

      this.logger.info("Getting customer dashboard data", { shopId });

      // Get all data in parallel for better performance
      const [queueStatus, popularServices, promotions] = await Promise.all([
        this.getQueueStatus(shopId),
        this.getPopularServices(shopId),
        this.getPromotions(shopId),
      ]);

      // Get shop info to check if it's open and get announcement
      const shopResult = await this.dataSource.getById("shops", shopId);

      if (!shopResult) {
        throw new ShopCustomerDashboardError(
          ShopCustomerDashboardErrorType.DATABASE_ERROR,
          "Shop not found",
          "SupabaseCustomerDashboardRepository.getCustomerDashboard",
          { shopId }
        );
      }

      const shop = shopResult as ShopSchemaRecord;

      const canJoinQueue =
        shop?.status === "active" && queueStatus.totalWaiting < 50;
      const announcement = shop?.announcement || null;

      const customerDashboard: CustomerDashboardEntity = {
        queueStatus,
        popularServices,
        promotions,
        canJoinQueue,
        announcement,
      };

      this.logger.info("Customer dashboard data retrieved successfully", {
        shopId,
        canJoinQueue,
        promotionsCount: promotions.length,
      });

      return customerDashboard;
    } catch (error) {
      if (error instanceof ShopCustomerDashboardError) {
        throw error;
      }
      this.logger.error("Error getting customer dashboard data", error);
      throw new ShopCustomerDashboardError(
        ShopCustomerDashboardErrorType.DATABASE_ERROR,
        "Failed to get customer dashboard data",
        "SupabaseCustomerDashboardRepository.getCustomerDashboard",
        { shopId },
        error as Error
      );
    }
  }
}
