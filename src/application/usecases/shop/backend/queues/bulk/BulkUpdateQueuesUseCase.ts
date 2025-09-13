import {
  BulkUpdateQueuesInput,
  BulkUpdateQueuesResult,
} from "@/src/application/dtos/shop/backend/queue-bulk-dto";
import { IUseCase } from "@/src/application/interfaces/use-case.interface";
import { QueueEntity } from "@/src/domain/entities/shop/backend/backend-queue.entity";
import type { Logger } from "@/src/domain/interfaces/logger";
import {
  ShopBackendQueueError,
  ShopBackendQueueErrorType,
  ShopBackendQueueRepository,
} from "@/src/domain/repositories/shop/backend/backend-queue-repository";

/**
 * Use case for bulk updating queues
 * Following SOLID principles and Clean Architecture
 */
export class BulkUpdateQueuesUseCase
  implements IUseCase<BulkUpdateQueuesInput, BulkUpdateQueuesResult>
{
  constructor(
    private readonly queueRepository: ShopBackendQueueRepository,
    private readonly logger: Logger
  ) {}

  /**
   * Execute the use case to bulk update queues
   * @param input Bulk update input
   * @returns Bulk update result
   */
  async execute(input: BulkUpdateQueuesInput): Promise<BulkUpdateQueuesResult> {
    try {
      // Validate input
      if (!input.queueIds || input.queueIds.length === 0) {
        throw new Error("Queue IDs are required");
      }

      if (!input.updates) {
        throw new Error("Update data is required");
      }

      this.logger.info("Starting bulk update queues", {
        queueCount: input.queueIds.length,
        updates: Object.keys(input.updates),
      });

      // Get queues by IDs (we'll need to get them one by one since getQueuesByIds doesn't exist)
      const queues = await this.getQueuesByIds(input.queueIds);

      // Prepare update operations
      const operations = this.prepareUpdateOperations(queues, input.updates);

      // Execute bulk update
      const { updated, failed } = await this.executeBulkUpdate(operations);

      const result: BulkUpdateQueuesResult = {
        success: failed.length === 0,
        updatedCount: updated.length,
        failedCount: failed.length,
        errors: failed.length > 0 ? failed.map((f) => f.error) : undefined,
        updatedQueues: updated.map((q) => q.id),
      };

      this.logger.info("Bulk update queues completed", {
        success: result.success,
        updatedCount: result.updatedCount,
        failedCount: result.failedCount,
        successRate: result.updatedCount / input.queueIds.length,
      });

      return result;
    } catch (error) {
      this.logger.error("Failed to bulk update queues", {
        error: error instanceof Error ? error.message : String(error),
        input,
      });

      if (error instanceof ShopBackendQueueError) {
        throw error;
      }

      throw new ShopBackendQueueError(
        ShopBackendQueueErrorType.OPERATION_FAILED,
        "Failed to bulk update queues",
        "bulkUpdateQueues",
        { input },
        error
      );
    }
  }

  /**
   * Get queues by IDs (since getQueuesByIds doesn't exist in repository)
   * @param queueIds Queue IDs to fetch
   * @returns Array of queue entities
   */
  private async getQueuesByIds(queueIds: string[]): Promise<QueueEntity[]> {
    const queues: QueueEntity[] = [];

    for (const queueId of queueIds) {
      try {
        const queue = await this.queueRepository.getQueueById(queueId);
        if (queue) {
          queues.push(queue);
        }
      } catch (error) {
        this.logger.warn("Failed to get queue by ID", {
          queueId,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    return queues;
  }

  /**
   * Prepare update operations for each queue
   * @param queues Existing queues
   * @param updates Update data
   * @returns Array of update operations
   */
  private prepareUpdateOperations(
    queues: QueueEntity[],
    updates: BulkUpdateQueuesInput["updates"]
  ): Array<{
    queueId: string;
    updateData: Partial<{
      status: "waiting" | "in_progress" | "completed" | "cancelled" | "no_show";
      priority: "normal" | "high" | "urgent";
      estimatedWaitTime: number;
      notes: string;
      calledAt: string | null;
      completedAt: string | null;
      servedByEmployeeId: string | null;
      queueServices: { serviceId: string; quantity: number; price: number }[];
    }>;
  }> {
    return queues.map((queue: QueueEntity) => {
      // Prepare update data for this specific queue
      const updateData: Partial<{
        status:
          | "waiting"
          | "in_progress"
          | "completed"
          | "cancelled"
          | "no_show";
        priority: "normal" | "high" | "urgent";
        estimatedWaitTime: number;
        notes: string;
        calledAt: string | null;
        completedAt: string | null;
        servedByEmployeeId: string | null;
        queueServices: { serviceId: string; quantity: number; price: number }[];
      }> = {};

      // Only include fields that are provided in updates
      if (updates.status !== undefined) {
        updateData.status = updates.status;
      }

      if (updates.priority !== undefined) {
        updateData.priority = updates.priority;
      }

      if (updates.estimatedWaitTime !== undefined) {
        updateData.estimatedWaitTime = updates.estimatedWaitTime;
      }

      if (updates.notes !== undefined) {
        updateData.notes = updates.notes;
      }

      if (updates.servedByEmployeeId !== undefined) {
        updateData.servedByEmployeeId = updates.servedByEmployeeId;
      }

      // Handle date fields
      if (updates.calledAt !== undefined) {
        updateData.calledAt = updates.calledAt || undefined;
      }

      if (updates.completedAt !== undefined) {
        updateData.completedAt = updates.completedAt || undefined;
      }

      // Handle queue services
      if (updates.queueServices !== undefined) {
        updateData.queueServices = updates.queueServices?.map(
          (service: {
            serviceId: string;
            quantity: number;
            price: number;
          }) => ({
            serviceId: service.serviceId,
            quantity: service.quantity,
            price: service.price,
          })
        );
      }

      return {
        queueId: queue.id,
        updateData,
      };
    });
  }

  /**
   * Execute bulk update operations
   * @param operations Array of update operations
   * @returns Update results
   */
  private async executeBulkUpdate(
    operations: Array<{
      queueId: string;
      updateData: any;
    }>
  ): Promise<{
    updated: any[];
    failed: Array<{
      queueId: string;
      error: string;
    }>;
  }> {
    const updated: any[] = [];
    const failed: Array<{
      queueId: string;
      error: string;
    }> = [];

    // Execute updates in parallel with concurrency limit
    const concurrencyLimit = 10;
    const chunks = this.chunkArray(operations, concurrencyLimit);

    for (const chunk of chunks) {
      const promises = chunk.map(async (operation) => {
        try {
          const updatedQueue = await this.queueRepository.updateQueue(
            operation.queueId,
            operation.updateData
          );

          updated.push(updatedQueue);
        } catch (error) {
          this.logger.error("Failed to update queue", {
            queueId: operation.queueId,
            error: error instanceof Error ? error.message : String(error),
          });

          failed.push({
            queueId: operation.queueId,
            error: error instanceof Error ? error.message : "Unknown error",
          });
        }
      });

      await Promise.all(promises);
    }

    return { updated, failed };
  }

  /**
   * Split array into chunks
   * @param array Array to split
   * @param size Chunk size
   * @returns Array of chunks
   */
  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }
}
