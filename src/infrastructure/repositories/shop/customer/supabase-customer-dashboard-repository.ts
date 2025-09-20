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
import { StandardRepository } from "../../base/standard-repository";

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

      const queuesData = queuesResult as Array<{ status: string; queue_number?: string }>;
      const waitingQueues = queuesData.filter(
        (queue) => queue.status === "waiting"
      );
      const servingQueues = queuesData.filter(
        (queue) => queue.status === "serving"
      );

      // Calculate statistics
      const totalWaiting = waitingQueues.length;
      const currentNumber =
        servingQueues.length > 0
          ? servingQueues[0].queue_number || "A001"
          : waitingQueues.length > 0
          ? waitingQueues[0].queue_number || "A001"
          : "A001";
      const estimatedWaitTime = totalWaiting * 5; // 5 minutes per person
      const averageServiceTime = 15; // 15 minutes average

      const queueStatus: QueueStatusStatsEntity = {
        totalWaiting,
        currentNumber,
        estimatedWaitTime,
        averageServiceTime,
      };

      this.logger.info("Queue status retrieved successfully", {
        shopId,
        totalWaiting,
        currentNumber,
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

      const servicesData = servicesResult as Array<{ id: string; name: string; price?: number; description?: string; estimated_time?: number; icon?: string; queue_count?: number }>;
      const popularServices = servicesData
        .filter((service) => (service.queue_count || 0) > 0)
        .map((service) => ({
          id: service.id,
          name: service.name,
          price: service.price || 0,
          description: service.description || "",
          estimatedTime: service.estimated_time || 5,
          icon: service.icon || "",
        }));

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

      const promotionsData = promotionsResult as Array<{ id: string; title: string; description: string; discount_value?: number; valid_until?: string; icon?: string; is_active?: boolean; start_date?: string; end_date?: string }>;
      const activePromotions = promotionsData.filter(
        (promotion) => {
          const now = new Date();
          const startDate = new Date(promotion.start_date || now);
          const endDate = new Date(promotion.end_date || now);
          return (
            promotion.is_active !== false &&
            startDate <= now &&
            endDate >= now
          );
        }
      );

      const promotions: PromotionEntity[] = activePromotions.map(
        (promotion) => ({
          id: promotion.id,
          title: promotion.title,
          description: promotion.description,
          discount: promotion.discount_value || 0,
          validUntil: promotion.valid_until || "",
          icon: promotion.icon || "",
        })
      );

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

      const shop = shopResult as { status?: string; announcement?: string | null };

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
