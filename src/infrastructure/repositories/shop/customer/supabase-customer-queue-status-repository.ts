import { DatabaseDataSource } from "@/src/domain/interfaces/datasources/database-datasource";
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
   * Get queue ID by queue number (helper method for backward compatibility)
   * Uses RPC function to bypass RLS
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
      try {
        const positionResult = await this.dataSource.callRpc<Array<{
          queue_position: number;
          estimated_wait_minutes: number;
          ahead_count: number;
        }>>(
          "get_queue_position",
          { p_queue_id: queueId }
        );

        if (positionResult && positionResult.length > 0) {
          queuePosition = positionResult[0].queue_position;
        }
      } catch (positionError) {
        // If get_queue_position fails, just log and continue with position 0
        this.logger.warn("Failed to get queue position, using default 0", {
          queueId,
          error: positionError,
        });
      }

      // Map to entity with actual position
      const entity = SupabaseCustomerQueueStatusMapper.toCustomerQueueStatusEntity(queueData);
      entity.position = queuePosition;

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

      return SupabaseCustomerQueueStatusMapper.toQueueProgressEntity(progressData);
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
   * Cancel a customer queue
   * Uses RPC function to bypass RLS and perform security checks
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

      // Use RPC function to cancel queue with security checks
      const rpcParams = {
        p_shop_id: shopId,
        p_queue_number: queueNumber,
      };

      const result = await this.dataSource.callRpc<boolean>(
        "cancel_customer_queue",
        rpcParams
      );

      if (!result) {
        throw new CustomerQueueStatusError(
          CustomerQueueStatusErrorType.OPERATION_FAILED,
          "Failed to cancel queue",
          "cancelCustomerQueue",
          { shopId, queueNumber }
        );
      }

      this.logger.info("Successfully cancelled queue", { shopId, queueNumber });
      return true;
    } catch (error) {
      if (error instanceof CustomerQueueStatusError) {
        throw error;
      }

      // Check if error message contains specific error types
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      if (errorMessage.includes("Queue not found") || errorMessage.includes("already completed")) {
        throw new CustomerQueueStatusError(
          CustomerQueueStatusErrorType.NOT_FOUND,
          "Queue not found or already completed/cancelled",
          "cancelCustomerQueue",
          { shopId, queueNumber },
          error
        );
      }

      if (errorMessage.includes("Access denied")) {
        throw new CustomerQueueStatusError(
          CustomerQueueStatusErrorType.VALIDATION_ERROR,
          "Access denied: You can only cancel your own queues",
          "cancelCustomerQueue",
          { shopId, queueNumber },
          error
        );
      }

      if (errorMessage.includes("Invalid status")) {
        throw new CustomerQueueStatusError(
          CustomerQueueStatusErrorType.VALIDATION_ERROR,
          "Queue cannot be cancelled: Invalid status",
          "cancelCustomerQueue",
          { shopId, queueNumber },
          error
        );
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
