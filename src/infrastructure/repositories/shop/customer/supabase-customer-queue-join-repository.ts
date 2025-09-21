import { QueueStatus } from "@/src/domain/entities/backend/backend-queue.entity";
import type {
  JoinQueueResultEntity,
  QueueJoinEntity,
  ServiceOptionEntity,
  ShopQueueInfoEntity,
} from "@/src/domain/entities/shop/customer/queue-join.entity";
import {
  DatabaseDataSource,
  FilterOperator,
  QueryOptions,
} from "@/src/domain/interfaces/datasources/database-datasource";
import type { Logger } from "@/src/domain/interfaces/logger";
import {
  ShopCustomerQueueJoinError,
  ShopCustomerQueueJoinErrorType,
  ShopCustomerQueueJoinRepository,
} from "@/src/domain/repositories/shop/customer/queue-join-repository";
import { SupabaseQueueJoinMapper } from "@/src/infrastructure/mappers/shop/customer/supabase-queue-join-mapper";
import {
  JoinQueueResultSchema,
  QueueJoinSchema,
  QueueServiceSchema,
  ServiceOptionSchema,
  ShopQueueInfoSchema,
} from "@/src/infrastructure/schemas/shop/customer/queue-join.schema";
import { StandardRepository } from "../../base/standard-repository";

// Extended types for database records
type ServiceOptionSchemaRecord = Record<string, unknown> & ServiceOptionSchema;
type QueueJoinSchemaRecord = Record<string, unknown> & QueueJoinSchema;
type QueueServiceSchemaRecord = Record<string, unknown> & QueueServiceSchema;

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

      // Get shop information
      const shopQueryOptions: QueryOptions = {
        filters: [
          {
            field: "id",
            operator: FilterOperator.EQ,
            value: shopId,
          },
        ],
      };

      const shopResult = await this.dataSource.getAdvanced<
        Record<string, unknown>
      >("shops", shopQueryOptions);

      if (
        !shopResult ||
        !Array.isArray(shopResult) ||
        shopResult.length === 0
      ) {
        throw new ShopCustomerQueueJoinError(
          ShopCustomerQueueJoinErrorType.UNKNOWN,
          "Shop not found",
          "SupabaseCustomerQueueJoinRepository.getShopQueueInfo",
          { shopId }
        );
      }

      // Get current queue statistics
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
            value: [QueueStatus.CONFIRMED, QueueStatus.SERVING],
          },
        ],
      };

      const queueResult = await this.dataSource.getAdvanced<
        Record<string, unknown>
      >("queues", queueQueryOptions);

      const currentQueueLength =
        queueResult && Array.isArray(queueResult) ? queueResult.length : 0;
      const estimatedWaitTime = currentQueueLength * 5; // 5 minutes per person

      const shopData = shopResult[0];
      const queueInfoData: ShopQueueInfoSchema = {
        shop_id: String(shopData.id || ""),
        shop_name: String(shopData.name || ""),
        is_accepting_queues: Boolean(shopData.is_accepting_queues),
        max_queue_length: Number(shopData.max_queue_length || 50),
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

      // Check if shop is accepting queues
      const shopInfo = await this.getShopQueueInfo(queueJoinData.shopId);

      if (!shopInfo.isAcceptingQueues) {
        throw new ShopCustomerQueueJoinError(
          ShopCustomerQueueJoinErrorType.UNKNOWN,
          "Shop is not accepting queues at the moment",
          "SupabaseCustomerQueueJoinRepository.joinQueue",
          { shopId: queueJoinData.shopId }
        );
      }

      // Check if queue is full
      if (shopInfo.currentQueueLength >= shopInfo.maxQueueLength) {
        throw new ShopCustomerQueueJoinError(
          ShopCustomerQueueJoinErrorType.UNKNOWN,
          "Queue is full",
          "SupabaseCustomerQueueJoinRepository.joinQueue",
          {
            shopId: queueJoinData.shopId,
            currentLength: shopInfo.currentQueueLength,
            maxLength: shopInfo.maxQueueLength,
          }
        );
      }

      // Generate queue number
      const queueNumber = this.generateQueueNumber(
        queueJoinData.shopId,
        shopInfo.currentQueueLength
      );

      // Create queue record
      const queueCreateData =
        SupabaseQueueJoinMapper.fromQueueJoinEntityToCreateSchema(
          queueJoinData
        );
      const queueRecord: QueueJoinSchemaRecord = {
        ...queueCreateData,
        status: "waiting",
        queue_number: queueNumber,
      };

      const createdQueue = await this.dataSource.insert<QueueJoinSchemaRecord>(
        "queues",
        queueRecord
      );

      if (!createdQueue) {
        throw new ShopCustomerQueueJoinError(
          ShopCustomerQueueJoinErrorType.UNKNOWN,
          "Failed to create queue record",
          "SupabaseCustomerQueueJoinRepository.joinQueue",
          {}
        );
      }

      const queueId = String(createdQueue.id || "");

      // Create queue services
      for (const service of queueJoinData.services) {
        const queueServiceData =
          SupabaseQueueJoinMapper.fromQueueServiceEntityToSchema(
            service,
            queueId
          );

        const serviceResult =
          await this.dataSource.insert<QueueServiceSchemaRecord>(
            "queue_services",
            queueServiceData
          );

        if (!serviceResult) {
          this.logger.error("Failed to create queue service", {
            queueId,
            serviceId: service.id,
          });
        }
      }

      // Return success result
      const resultData: JoinQueueResultSchema = {
        success: true,
        queue_number: queueNumber,
        estimated_wait_time: shopInfo.estimatedWaitTime,
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
