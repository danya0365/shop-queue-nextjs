import type {
  JoinQueueResultEntity,
  QueueJoinEntity,
  ServiceOptionEntity,
  ShopQueueInfoEntity,
} from "@/src/domain/entities/shop/customer/queue-join.entity";
import type { DatabaseDataSource } from "@/src/domain/interfaces/datasources/database-datasource";
import type { Logger } from "@/src/domain/interfaces/logger";
import {
  ShopCustomerQueueJoinError,
  ShopCustomerQueueJoinErrorType,
  ShopCustomerQueueJoinRepository,
} from "@/src/domain/repositories/shop/customer/queue-join-repository";
import { SupabaseQueueJoinMapper } from "@/src/infrastructure/mappers/shop/customer/supabase-queue-join-mapper";
import type {
  JoinQueueResultSchema,
  PublicShopInfoSchema,
  QueueComprehensiveStatsRpcSchema,
  ServiceOptionSchema,
  ShopQueueInfoSchema,
} from "@/src/infrastructure/schemas/shop/customer/queue-join.schema";
import { StandardRepository } from "../../base/standard-repository";

// Extended types for database records
type ServiceOptionSchemaRecord = Record<string, unknown> & ServiceOptionSchema;
type QueueComprehensiveStatsRpcSchemaRecord =
  Partial<QueueComprehensiveStatsRpcSchema>;

/**
 * Supabase implementation of the customer queue join repository
 * Following Clean Architecture principles for repository implementation
 */
export class SupabaseCustomerQueueJoinRepository
  extends StandardRepository
  implements ShopCustomerQueueJoinRepository
{
  constructor(dataSource: DatabaseDataSource, logger: Logger) {
    super(dataSource, logger, "CustomerQueueJoin");
  }

  /**
   * Get available services for a shop
   * @param shopId The shop ID
   * @returns Array of available service options
   */
  async getAvailableServices(shopId: string): Promise<ServiceOptionEntity[]> {
    try {
      // Use RPC call instead of direct table query for security
      const result = await this.dataSource.callRpc<ServiceOptionSchemaRecord>(
        "get_available_services",
        { p_shop_id: shopId }
      );

      if (!result || !Array.isArray(result) || result.length === 0) {
        // Return empty array instead of throwing error when no services found
        return [];
      }

      return SupabaseQueueJoinMapper.toServiceOptionEntities(result);
    } catch (error) {
      if (error instanceof ShopCustomerQueueJoinError) {
        throw error;
      }

      throw new ShopCustomerQueueJoinError(
        ShopCustomerQueueJoinErrorType.UNKNOWN,
        "Failed to get available services",
        "SupabaseCustomerQueueJoinRepository.getAvailableServices",
        {
          shopId,
          error: error instanceof Error ? error.message : String(error),
        },
        error
      );
    }
  }

  /**
   * Get shop queue information
   * @param shopId The shop ID
   * @returns Shop queue information
   */
  async getShopQueueInfo(shopId: string): Promise<ShopQueueInfoEntity> {
    try {
      this.logger.info("Getting shop queue info", { shopId });

      // Use RPC call to get public shop info with shops and shop_settings left join
      const shopInfoResult =
        await this.dataSource.callRpc<PublicShopInfoSchema>(
          "get_public_shop_info",
          { p_shop_id: shopId }
        );

      if (
        !shopInfoResult ||
        !Array.isArray(shopInfoResult) ||
        shopInfoResult.length === 0
      ) {
        throw new ShopCustomerQueueJoinError(
          ShopCustomerQueueJoinErrorType.UNKNOWN,
          "Shop not found",
          "SupabaseCustomerQueueJoinRepository.getShopQueueInfo",
          { shopId }
        );
      }

      const shopInfoData = shopInfoResult[0];

      // Get current queue statistics using RPC call
      const queueStatsResult =
        await this.dataSource.callRpc<QueueComprehensiveStatsRpcSchemaRecord>(
          "get_public_queue_comprehensive_stats",
          { p_shop_id: shopId }
        );

      // Calculate queue statistics from RPC result
      const queueStats =
        queueStatsResult &&
        Array.isArray(queueStatsResult) &&
        queueStatsResult.length > 0
          ? queueStatsResult[0]
          : null;

      const currentQueueLength =
        (queueStats?.confirmed_queues || 0) + (queueStats?.serving_queues || 0);
      const estimatedWaitTime =
        queueStats?.current_wait_time_estimate ||
        queueStats?.average_wait_time_minutes ||
        currentQueueLength * 5;

      // Create queue info data from RPC result
      const queueInfoData: ShopQueueInfoSchema = {
        shop_id: String(shopInfoData.shop_id || ""),
        shop_name: String(shopInfoData.shop_name || ""),
        is_accepting_queues: Boolean(shopInfoData.settings_is_accepting_queues),
        max_queue_length: Number(
          shopInfoData.settings_max_queue_per_service ?? 50
        ),
        current_queue_length: currentQueueLength,
        estimated_wait_time: estimatedWaitTime,
      };

      return SupabaseQueueJoinMapper.toShopQueueInfoEntity(queueInfoData);
    } catch (error) {
      if (error instanceof ShopCustomerQueueJoinError) {
        throw error;
      }

      throw new ShopCustomerQueueJoinError(
        ShopCustomerQueueJoinErrorType.UNKNOWN,
        "Failed to get shop queue info",
        "SupabaseCustomerQueueJoinRepository.getShopQueueInfo",
        {
          shopId,
          error: error instanceof Error ? error.message : String(error),
        },
        error
      );
    }
  }

  /**
   * Join a queue
   * @param queueJoinData Queue join data
   * @returns Result of the queue join operation
   */
  async joinQueue(
    queueJoinData: Omit<
      QueueJoinEntity,
      "id" | "status" | "createdAt" | "updatedAt"
    >
  ): Promise<JoinQueueResultEntity> {
    try {
      this.logger.info("Joining queue", {
        shopId: queueJoinData.shopId,
        customerName: queueJoinData.customerName,
        serviceCount: queueJoinData.services.length,
      });

      // Create queue using RPC function
      const createdQueueId = await this.dataSource.callRpc<string>(
        "create_queue",
        {
          p_shop_id: queueJoinData.shopId,
          p_customer_name: queueJoinData.customerName,
          p_customer_phone: queueJoinData.customerPhone,
          p_customer_email: null,
          p_customer_id: queueJoinData.customerId || null,
          p_priority: queueJoinData.priority,
          p_note: queueJoinData.specialRequests || null,
          p_services: queueJoinData.services.map((service) => {
            return {
              service_id: service.id,
              quantity: service.quantity,
              price: service.price,
            };
          }),
        }
      );

      if (!createdQueueId) {
        throw new ShopCustomerQueueJoinError(
          ShopCustomerQueueJoinErrorType.UNKNOWN,
          "Failed to create queue",
          "SupabaseCustomerQueueJoinRepository.joinQueue",
          { queueJoinData }
        );
      }

      // Return success result
      const resultData: JoinQueueResultSchema = {
        success: true,
        queue_number: "",
        estimated_wait_time: 0,
        message: "Successfully joined the queue",
      };

      return SupabaseQueueJoinMapper.toJoinQueueResultEntity(resultData);
    } catch (error) {
      if (error instanceof ShopCustomerQueueJoinError) {
        throw error;
      }

      throw new ShopCustomerQueueJoinError(
        ShopCustomerQueueJoinErrorType.UNKNOWN,
        "Failed to join queue",
        "SupabaseCustomerQueueJoinRepository.joinQueue",
        {
          shopId: queueJoinData.shopId,
          customerName: queueJoinData.customerName,
          error: error instanceof Error ? error.message : String(error),
        },
        error
      );
    }
  }

  /**
   * Generate a queue number
   * @param shopId The shop ID
   * @param currentQueueLength Current queue length
   * @returns Generated queue number
   */
  private generateQueueNumber(
    shopId: string,
    currentQueueLength: number
  ): string {
    const shopPrefix = shopId.slice(0, 3).toUpperCase();
    const sequenceNumber = String(currentQueueLength + 1).padStart(3, "0");
    return `${shopPrefix}-${sequenceNumber}`;
  }
}
