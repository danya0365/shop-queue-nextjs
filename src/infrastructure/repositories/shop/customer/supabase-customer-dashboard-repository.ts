import type {
  CustomerDashboardEntity,
  PopularServiceEntity,
  PromotionEntity,
  QueueStatusStatsEntity,
} from "@/src/domain/entities/shop/customer/customer-dashboard.entity";
import { DatabaseDataSource } from "@/src/domain/interfaces/datasources/database-datasource";
import type { Logger } from "@/src/domain/interfaces/logger";
import {
  ShopCustomerDashboardError,
  ShopCustomerDashboardErrorType,
  ShopCustomerDashboardRepository,
} from "@/src/domain/repositories/shop/customer/customer-dashboard-repository";
import { SupabaseCustomerDashboardMapper } from "@/src/infrastructure/mappers/shop/customer/supabase-customer-dashboard-mapper";
import { StandardRepository } from "@/src/infrastructure/repositories/base/standard-repository";

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

      // Use RPC call to get comprehensive queue status data for anonymous access
      const queueStatusResult = await this.dataSource.callRpc<{
        waiting_queues: number;
        confirmed_queues: number;
        serving_queues: number;
        average_wait_time_minutes: number;
        average_service_time_minutes: number;
      }>("get_queue_comprehensive_stats", {
        p_shop_id: shopId,
      });

      if (
        !queueStatusResult ||
        !Array.isArray(queueStatusResult) ||
        queueStatusResult.length === 0
      ) {
        throw new ShopCustomerDashboardError(
          ShopCustomerDashboardErrorType.DATABASE_ERROR,
          "Failed to fetch queue status data",
          "SupabaseCustomerDashboardRepository.getQueueStatus",
          { shopId }
        );
      }

      const queueStatusData = queueStatusResult[0];

      const queueProgressResult = await this.dataSource.callRpc<{
        current_number: number;
        total_ahead: number;
        average_service_time: number;
        estimated_call_time: string;
      }>("get_customer_queue_progress", {
        p_shop_id: shopId,
      });

      if (
        !queueProgressResult ||
        !Array.isArray(queueProgressResult) ||
        queueProgressResult.length === 0
      ) {
        throw new ShopCustomerDashboardError(
          ShopCustomerDashboardErrorType.DATABASE_ERROR,
          "Failed to fetch queue progress data",
          "SupabaseCustomerDashboardRepository.getQueueStatus",
          { shopId }
        );
      }

      const queueProgressData = queueProgressResult[0];
      const currentNumber = queueProgressData.current_number;

      // Transform the RPC response to match the expected entity format
      const queueStatus: QueueStatusStatsEntity = {
        currentNumber: String(currentNumber),
        totalConfirmed: queueStatusData.confirmed_queues || 0,
        totalWaiting: queueStatusData.waiting_queues || 0,
        estimatedWaitTime: queueStatusData.average_wait_time_minutes || 0,
        averageServiceTime: queueStatusData.average_service_time_minutes || 0,
      };

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

      // Use RPC call instead of direct view query for RLS compliance
      const servicesResult = await this.dataSource.callRpc(
        "get_customer_popular_services",
        {
          p_shop_id: shopId,
          p_limit: limit || 10,
        }
      );

      if (!servicesResult || !Array.isArray(servicesResult)) {
        throw new ShopCustomerDashboardError(
          ShopCustomerDashboardErrorType.DATABASE_ERROR,
          "Failed to fetch services data",
          "SupabaseCustomerDashboardRepository.getPopularServices",
          { shopId }
        );
      }

      const servicesData = servicesResult as Array<{
        id: string;
        name: string;
        shop_id: string;
        queue_count: number;
        revenue: number;
        category: string;
      }>;

      // Transform the RPC response to match PopularServiceEntity format
      const popularServices: PopularServiceEntity[] = servicesData.map(
        (service) => ({
          id: service.id,
          name: service.name,
          price: service.revenue, // Using revenue as price since RPC doesn't provide price directly
          description: "",
          estimatedTime: 0, // RPC doesn't provide this
          icon: "", // RPC doesn't provide this
        })
      );

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
   * @param limit Maximum number of promotions to return
   * @returns Active promotions
   */
  async getPromotions(
    shopId: string,
    limit?: number
  ): Promise<PromotionEntity[]> {
    try {
      if (!shopId) {
        throw new ShopCustomerDashboardError(
          ShopCustomerDashboardErrorType.VALIDATION_ERROR,
          "Shop ID is required",
          "SupabaseCustomerDashboardRepository.getPromotions",
          { shopId }
        );
      }

      this.logger.info("Getting promotions", { shopId, limit });

      // Use RPC call to get promotions data
      const promotionsData = await this.dataSource.callRpc<
        Array<Record<string, unknown>>
      >("get_customer_promotions", {
        p_shop_id: shopId,
        p_limit: limit || 10,
      });

      if (!promotionsData || !Array.isArray(promotionsData)) {
        throw new ShopCustomerDashboardError(
          ShopCustomerDashboardErrorType.DATABASE_ERROR,
          "Invalid promotions data response",
          "SupabaseCustomerDashboardRepository.getPromotions",
          { shopId }
        );
      }

      // Transform the data using the mapper
      const promotions = SupabaseCustomerDashboardMapper.toPromotionEntities(
        promotionsData as any[]
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
  async getCustomerDashboard(shopId: string): Promise<CustomerDashboardEntity> {
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

      const shop = shopResult as any;

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
