import type {
  CustomerQueueStatusEntity,
  QueueProgressEntity,
} from "@/src/domain/entities/shop/customer/customer-queue-status.entity";
import { DatabaseDataSource } from "@/src/domain/interfaces/datasources/database-datasource";
import type { Logger } from "@/src/domain/interfaces/logger";
import {
  CustomerQueueStatusError,
  CustomerQueueStatusErrorType,
  CustomerQueueStatusRepository,
} from "@/src/domain/repositories/shop/customer/customer-queue-status-repository";
import { SupabaseCustomerQueueStatusMapper } from "@/src/infrastructure/mappers/shop/customer/supabase-customer-queue-status-mapper";
import {
  CustomerQueueStatusSchema,
  QueueProgressSchema,
} from "@/src/infrastructure/schemas/shop/customer/customer-queue-status.schema";
import { StandardRepository } from "../../base/standard-repository";

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
   * Cancel a queue by ID with explicit customer ownership verification
   */
  async cancelCustomerQueueById(
    queueId: string,
    customerId: string
  ): Promise<boolean> {
    try {
      this.logger.info("Cancelling customer queue by ID", { queueId, customerId });

      const result = await this.dataSource.callRpc<boolean>(
        "cancel_queue_by_id",
        {
          p_queue_id: queueId,
          p_customer_id: customerId,
        }
      );

      if (!result) {
        throw new CustomerQueueStatusError(
          CustomerQueueStatusErrorType.OPERATION_FAILED,
          "Failed to cancel queue",
          "cancelCustomerQueueById",
          { queueId }
        );
      }

      return true;
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      if (msg.includes("Access denied")) {
        throw new CustomerQueueStatusError(
          CustomerQueueStatusErrorType.UNAUTHORIZED,
          "Access denied: You can only cancel your own queues",
          "cancelCustomerQueueById",
          { queueId, customerId },
          error
        );
      }
      if (msg.includes("Invalid status")) {
        throw new CustomerQueueStatusError(
          CustomerQueueStatusErrorType.VALIDATION_ERROR,
          "Queue cannot be cancelled: Invalid status",
          "cancelCustomerQueueById",
          { queueId },
          error
        );
      }
      if (msg.includes("Queue not found")) {
        throw new CustomerQueueStatusError(
          CustomerQueueStatusErrorType.NOT_FOUND,
          "Queue not found",
          "cancelCustomerQueueById",
          { queueId },
          error
        );
      }

      this.logger.error("Error cancelling queue by ID", { error, queueId, customerId });
      throw new CustomerQueueStatusError(
        CustomerQueueStatusErrorType.OPERATION_FAILED,
        "Failed to cancel customer queue",
        "cancelCustomerQueueById",
        { queueId, customerId },
        error
      );
    }
  }

  /**
   * Get queue ID by queue number (helper method for backward compatibility)
   * Uses RPC function to bypass RLS
   * @param shopId The shop ID
   * @param queueNumber The queue number
   * @returns Queue ID or null if not found
   */
  async getQueueIdByNumber(
    shopId: string,
    queueNumber: string
  ): Promise<string | null> {
    try {
      this.logger.info("Getting queue ID by number", { shopId, queueNumber });

      // Use RPC function to get queue by number
      const rpcParams = {
        p_shop_id: shopId,
        p_queue_number: queueNumber,
      };

      const result = await this.dataSource.callRpc<CustomerQueueStatusSchema[]>(
        "get_customer_queue_by_number",
        rpcParams
      );

      if (!result || result.length === 0) {
        return null;
      }

      return result[0].id;
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
   * Uses RPC function to bypass RLS
   * @param shopId The shop ID
   * @param queueId The queue ID
   * @returns Customer queue status entity or null if not found
   */
  async getCustomerQueueStatus(
    shopId: string,
    queueId: string
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

      // Use RPC function to get queue by ID
      const rpcParams = {
        p_queue_id: queueId,
      };

      const result = await this.dataSource.callRpc<CustomerQueueStatusSchema[]>(
        "get_public_queue_info_by_id",
        rpcParams
      );

      if (!result || result.length === 0) {
        return null;
      }

      const queueData = result[0];

      // Validate shop_id matches
      if (queueData.shop_id !== shopId) {
        this.logger.warn("Queue shop_id mismatch", {
          expected: shopId,
          actual: queueData.shop_id,
          queueId,
        });
        return null;
      }

      // Get queue position information
      let queuePosition = 0;
      let totalAhead = 0;
      try {
        const positionResult = await this.dataSource.callRpc<
          Array<{
            queue_position: number;
            estimated_wait_minutes: number;
            ahead_count: number;
          }>
        >("get_queue_position", { p_queue_id: queueId });

        if (positionResult && positionResult.length > 0) {
          queuePosition = positionResult[0].queue_position;
          totalAhead = positionResult[0].ahead_count;
        }
      } catch (positionError) {
        // If get_queue_position fails, just log and continue with position 0
        this.logger.warn("Failed to get queue position, using default 0", {
          queueId,
          error: positionError,
        });
      }

      // Map to entity with actual position
      const entity =
        SupabaseCustomerQueueStatusMapper.toCustomerQueueStatusEntity(
          queueData,
          queuePosition,
          totalAhead
        );

      return entity;
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
   * Uses RPC function to bypass RLS
   * @param shopId The shop ID
   * @returns Queue progress entity
   */
  async getQueueProgress(shopId: string): Promise<QueueProgressEntity> {
    try {
      this.logger.info("Getting queue progress", { shopId });

      // Use RPC function to get queue progress
      const rpcParams = {
        p_shop_id: shopId,
      };

      const result = await this.dataSource.callRpc<QueueProgressSchema[]>(
        "get_customer_queue_progress",
        rpcParams
      );

      if (!result || result.length === 0) {
        throw new CustomerQueueStatusError(
          CustomerQueueStatusErrorType.NOT_FOUND,
          "Queue progress not found",
          "getQueueProgress",
          { shopId }
        );
      }

      const progressData = result[0];

      return SupabaseCustomerQueueStatusMapper.toQueueProgressEntity(
        progressData
      );
    } catch (error) {
      if (error instanceof CustomerQueueStatusError) {
        throw error;
      }

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
   * Check if a customer is the owner of a queue
   * @param queueId The queue ID to check
   * @param customerId The customer ID to verify ownership
   * @returns Promise that resolves to boolean indicating if customer is the owner
   * @throws CustomerQueueStatusError if the operation fails
   */
  async isQueueOwner(queueId: string, customerId: string): Promise<boolean> {
    try {
      this.logger.info("Checking queue ownership via RPC", {
        queueId,
        customerId,
      });

      const result = await this.dataSource.callRpc<boolean>("is_queue_owner", {
        p_queue_id: queueId,
        p_customer_id: customerId,
      });
      return result;
    } catch (error) {
      this.logger.error("Error in isQueueOwner RPC call", {
        error,
        queueId,
        customerId,
      });

      if (error instanceof CustomerQueueStatusError) {
        throw error;
      }

      throw new CustomerQueueStatusError(
        CustomerQueueStatusErrorType.OPERATION_FAILED,
        "Failed to verify queue ownership",
        "isQueueOwner",
        { queueId, customerId },
        error
      );
    }
  }

  
}
