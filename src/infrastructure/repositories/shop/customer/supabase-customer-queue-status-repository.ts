import {
  DatabaseDataSource,
  FilterOperator,
  QueryOptions,
  SortDirection,
} from "@/src/domain/interfaces/datasources/database-datasource";
import type { Logger } from "@/src/domain/interfaces/logger";
import type {
  CustomerQueueStatusEntity,
  QueueProgressEntity,
} from "@/src/domain/entities/shop/customer/customer-queue-status.entity";
import {
  CustomerQueueStatusError,
  CustomerQueueStatusErrorType,
  CustomerQueueStatusRepository,
} from "@/src/domain/repositories/shop/customer/customer-queue-status-repository";
import { SupabaseCustomerQueueStatusMapper } from "@/src/infrastructure/mappers/shop/customer/supabase-customer-queue-status-mapper";
import {
  CustomerQueueStatusSchema,
  QueueProgressSchema,
  CustomerQueueServiceSchema,
} from "@/src/infrastructure/schemas/shop/customer/customer-queue-status.schema";
import { StandardRepository } from "../../base/standard-repository";

// Extended types for database records
type CustomerQueueStatusSchemaRecord = Record<string, unknown> & CustomerQueueStatusSchema;
type QueueProgressSchemaRecord = Record<string, unknown> & QueueProgressSchema;
type CustomerQueueServiceSchemaRecord = Record<string, unknown> & CustomerQueueServiceSchema;

/**
 * Supabase implementation of the customer queue status repository
 * Following Clean Architecture principles for repository implementation
 */
export class SupabaseCustomerQueueStatusRepository
  extends StandardRepository
  implements CustomerQueueStatusRepository
{
  constructor(dataSource: DatabaseDataSource, logger: Logger) {
    super(dataSource, logger, "CustomerQueueStatus");
  }

  /**
   * Get queue ID by queue number (helper method for backward compatibility)
   * @param shopId The shop ID
   * @param queueNumber The queue number
   * @returns Queue ID or null if not found
   */
  async getQueueIdByNumber(
    shopId: string,
    queueNumber: string,
  ): Promise<string | null> {
    try {
      this.logger.info("Getting queue ID by number", { shopId, queueNumber });

      const queueQueryOptions: QueryOptions = {
        filters: [
          { field: "shop_id", operator: FilterOperator.EQ, value: shopId },
          { field: "queue_number", operator: FilterOperator.EQ, value: queueNumber },
          { field: "status", operator: FilterOperator.IN, value: ["waiting", "confirmed", "serving"] },
        ],
        pagination: {
          limit: 1,
        },
      };

      const queueResult = await this.dataSource.getAdvanced(
        "queues",
        queueQueryOptions,
      );

      if (!queueResult || queueResult.length === 0) {
        return null;
      }

      const queueData = queueResult[0] as CustomerQueueStatusSchemaRecord;
      return queueData.id;
    } catch (error) {
      this.logger.error("Error getting queue ID by number", {
        error,
        shopId,
        queueNumber,
      });

      throw new CustomerQueueStatusError(
        CustomerQueueStatusErrorType.OPERATION_FAILED,
        "Failed to get queue ID by number",
        "getQueueIdByNumber",
        { shopId, queueNumber },
        error
      );
    }
  }

  /**
   * Get customer queue status by queue ID
   * @param shopId The shop ID
   * @param queueId The queue ID
   * @returns Customer queue status entity or null if not found
   */
  async getCustomerQueueStatus(
    shopId: string,
    queueId: string,
  ): Promise<CustomerQueueStatusEntity | null> {
    try {
      // Validate parameters
      if (!queueId) {
        throw new CustomerQueueStatusError(
          CustomerQueueStatusErrorType.VALIDATION_ERROR,
          "Queue ID is required",
          "getCustomerQueueStatus",
          { shopId, queueId }
        );
      }

      this.logger.info("Getting customer queue status", { shopId, queueId });

      // Query for customer queue status using queue ID
      const queueQueryOptions: QueryOptions = {
        filters: [
          { field: "shop_id", operator: FilterOperator.EQ, value: shopId },
          { field: "id", operator: FilterOperator.EQ, value: queueId },
          { field: "status", operator: FilterOperator.IN, value: ["waiting", "confirmed", "serving"] },
        ],
        pagination: {
          limit: 1,
        },
      };

      const queueResult = await this.dataSource.getAdvanced(
        "queues",
        queueQueryOptions,
      );

      if (!queueResult || queueResult.length === 0) {
        return null;
      }

      const queueData = queueResult[0] as CustomerQueueStatusSchemaRecord;

      // Query for queue services
      const servicesQueryOptions: QueryOptions = {
        filters: [
          { field: "queue_id", operator: FilterOperator.EQ, value: queueData.id },
        ],
      };

      const servicesResult = await this.dataSource.getAdvanced(
        "queue_services",
        servicesQueryOptions,
      );

      const servicesData = servicesResult as CustomerQueueServiceSchemaRecord[] || [];

      // Combine queue and services data
      const completeQueueData: CustomerQueueStatusSchemaRecord = {
        ...queueData,
        services: servicesData,
      };

      return SupabaseCustomerQueueStatusMapper.toCustomerQueueStatusEntity(completeQueueData);
    } catch (error) {
      if (error instanceof CustomerQueueStatusError) {
        throw error;
      }

      this.logger.error("Error getting customer queue status", {
        error,
        shopId,
        queueId,
      });

      throw new CustomerQueueStatusError(
        CustomerQueueStatusErrorType.OPERATION_FAILED,
        "Failed to get customer queue status",
        "getCustomerQueueStatus",
        { shopId, queueId },
        error
      );
    }
  }

  /**
   * Get queue progress information for a shop
   * @param shopId The shop ID
   * @returns Queue progress entity
   */
  async getQueueProgress(shopId: string): Promise<QueueProgressEntity> {
    try {
      this.logger.info("Getting queue progress", { shopId });

      // Get current serving queue number
      const currentQueueQueryOptions: QueryOptions = {
        filters: [
          { field: "shop_id", operator: FilterOperator.EQ, value: shopId },
          { field: "status", operator: FilterOperator.EQ, value: "serving" },
        ],
        sort: [
          { field: "position", direction: SortDirection.ASC },
        ],
        pagination: {
          limit: 1,
        },
      };

      const currentQueueResult = await this.dataSource.getAdvanced(
        "queues",
        currentQueueQueryOptions,
      );

      const currentNumber = currentQueueResult && currentQueueResult.length > 0
        ? (currentQueueResult[0] as CustomerQueueStatusSchemaRecord).queue_number
        : "";

      // Get total queues ahead (waiting and confirmed)
      const waitingQueuesQueryOptions: QueryOptions = {
        filters: [
          { field: "shop_id", operator: FilterOperator.EQ, value: shopId },
          { field: "status", operator: FilterOperator.IN, value: ["waiting", "confirmed"] },
        ],
      };

      const waitingQueuesResult = await this.dataSource.getAdvanced(
        "queues",
        waitingQueuesQueryOptions,
      );

      const totalAhead = waitingQueuesResult?.length || 0;

      // Get average service time (mock data for now, could be calculated from historical data)
      const averageServiceTime = 8; // minutes

      // Calculate estimated call time
      const estimatedCallTime = new Date();
      estimatedCallTime.setMinutes(estimatedCallTime.getMinutes() + (totalAhead * averageServiceTime));

      const progressData: QueueProgressSchemaRecord = {
        shop_id: shopId,
        current_number: currentNumber,
        total_ahead: totalAhead,
        average_service_time: averageServiceTime,
        estimated_call_time: estimatedCallTime.toISOString(),
      };

      return SupabaseCustomerQueueStatusMapper.toQueueProgressEntity(progressData);
    } catch (error) {
      this.logger.error("Error getting queue progress", { error, shopId });

      throw new CustomerQueueStatusError(
        CustomerQueueStatusErrorType.OPERATION_FAILED,
        "Failed to get queue progress",
        "getQueueProgress",
        { shopId },
        error
      );
    }
  }

  /**
   * Cancel a customer queue
   * @param shopId The shop ID
   * @param queueNumber The queue number
   * @returns True if cancellation was successful
   */
  async cancelCustomerQueue(
    shopId: string,
    queueNumber: string,
  ): Promise<boolean> {
    try {
      this.logger.info("Cancelling customer queue", { shopId, queueNumber });

      // First, find the queue by queue number to get the queue ID
      const queueQueryOptions: QueryOptions = {
        filters: [
          { field: "shop_id", operator: FilterOperator.EQ, value: shopId },
          { field: "queue_number", operator: FilterOperator.EQ, value: queueNumber },
          { field: "status", operator: FilterOperator.IN, value: ["waiting", "confirmed", "serving"] },
        ],
        pagination: {
          limit: 1,
        },
      };

      const queueResult = await this.dataSource.getAdvanced(
        "queues",
        queueQueryOptions,
      );

      if (!queueResult || queueResult.length === 0) {
        throw new CustomerQueueStatusError(
          CustomerQueueStatusErrorType.NOT_FOUND,
          "Queue not found",
          "cancelCustomerQueue",
          { shopId, queueNumber }
        );
      }

      const queueData = queueResult[0] as CustomerQueueStatusSchemaRecord;
      
      // Get the complete queue data using the queue ID
      const queue = await this.getCustomerQueueStatus(shopId, queueData.id);

      if (!queue) {
        throw new CustomerQueueStatusError(
          CustomerQueueStatusErrorType.NOT_FOUND,
          "Queue not found",
          "cancelCustomerQueue",
          { shopId, queueNumber }
        );
      }

      // Check if queue can be cancelled (only waiting or confirmed status)
      if (queue.status !== "waiting" && queue.status !== "confirmed") {
        throw new CustomerQueueStatusError(
          CustomerQueueStatusErrorType.VALIDATION_ERROR,
          "Queue cannot be cancelled",
          "cancelCustomerQueue",
          { shopId, queueNumber, status: queue.status }
        );
      }

      // Update queue status to cancelled
      const updateData = {
        status: "cancelled",
        updated_at: new Date().toISOString(),
      };

      const updateResult = await this.dataSource.update(
        "queues",
        queue.id,
        updateData,
      );

      if (!updateResult.success) {
        throw new CustomerQueueStatusError(
          CustomerQueueStatusErrorType.OPERATION_FAILED,
          "Failed to update queue status",
          "cancelCustomerQueue",
          { shopId, queueNumber }
        );
      }

      return true;
    } catch (error) {
      if (error instanceof CustomerQueueStatusError) {
        throw error;
      }

      this.logger.error("Error cancelling customer queue", {
        error,
        shopId,
        queueNumber,
      });

      throw new CustomerQueueStatusError(
        CustomerQueueStatusErrorType.OPERATION_FAILED,
        "Failed to cancel customer queue",
        "cancelCustomerQueue",
        { shopId, queueNumber },
        error
      );
    }
  }
}
