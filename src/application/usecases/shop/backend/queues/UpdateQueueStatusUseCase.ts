import { QueueDTO } from "@/src/application/dtos/shop/backend/queues-dto";
import { IUseCase } from "@/src/application/interfaces/use-case.interface";
import { QueueMapper } from "@/src/application/mappers/shop/backend/queue-mapper";
import { QueueStatus } from "@/src/domain/entities/shop/backend/backend-queue.entity";
import type { Logger } from "@/src/domain/interfaces/logger";
import type { ShopBackendQueueRepository } from "@/src/domain/repositories/shop/backend/backend-queue-repository";
import {
  ShopBackendQueueError,
  ShopBackendQueueErrorType,
} from "@/src/domain/repositories/shop/backend/backend-queue-repository";

/**
 * Input DTO for UpdateQueueStatusUseCase
 */
export interface UpdateQueueStatusInput {
  queueId: string;
  status: QueueStatus;
  shopId: string;
  employeeId?: string;
  notes?: string;
}

/**
 * Use case for updating queue status with business logic validation
 * Following SOLID principles and Clean Architecture
 */
export class UpdateQueueStatusUseCase
  implements IUseCase<UpdateQueueStatusInput, QueueDTO>
{
  constructor(
    private readonly queueRepository: ShopBackendQueueRepository,
    private readonly logger: Logger
  ) {}

  /**
   * Execute the use case to update queue status
   * @param input Status update parameters
   * @returns Updated queue DTO
   */
  async execute(input: UpdateQueueStatusInput): Promise<QueueDTO> {
    try {
      // Validate input
      if (!input.queueId || !input.status || !input.shopId) {
        throw new Error("Queue ID, status, and shop ID are required");
      }

      this.logger.info("Updating queue status", { input });

      // Get the queue
      const queue = await this.queueRepository.getQueueById(input.queueId);
      if (!queue) {
        throw new ShopBackendQueueError(
          ShopBackendQueueErrorType.NOT_FOUND,
          `Queue with ID ${input.queueId} not found`,
          "updateQueueStatus",
          { input }
        );
      }

      // Validate queue belongs to the shop
      if (queue.shopId !== input.shopId) {
        throw new ShopBackendQueueError(
          ShopBackendQueueErrorType.UNAUTHORIZED,
          "Queue does not belong to the specified shop",
          "updateQueueStatus",
          { input }
        );
      }

      // Validate status transitions
      this.validateStatusTransition(
        queue.status,
        input.status,
        input.employeeId
      );

      // Prepare update data based on status
      const updateData: Partial<
        import("@/src/domain/entities/shop/backend/backend-queue.entity").UpdateQueueEntity
      > = {
        status: input.status,
        notes: input.notes,
      };

      // Set timestamps based on status
      switch (input.status) {
        case QueueStatus.SERVING:
          updateData.calledAt = new Date().toISOString();
          if (input.employeeId) {
            updateData.servedByEmployeeId = input.employeeId;
          }
          break;
        case QueueStatus.COMPLETED:
          updateData.completedAt = new Date().toISOString();
          // Calculate actual wait time
          if (queue.calledAt) {
            const calledTime = new Date(queue.calledAt).getTime();
            const completedTime = new Date().getTime();
            updateData.actualWaitTime = Math.round(
              (completedTime - calledTime) / (1000 * 60)
            ); // in minutes
          }
          break;
        case QueueStatus.CANCELLED:
        case QueueStatus.NO_SHOW:
          updateData.completedAt = new Date().toISOString();
          break;
      }

      // Update the queue
      const updatedQueue = await this.queueRepository.updateQueue(
        input.queueId,
        updateData
      );

      return QueueMapper.toDTO(updatedQueue);
    } catch (error) {
      if (error instanceof ShopBackendQueueError) {
        throw error;
      }

      this.logger.error("Error in updateQueueStatus", { error, input });
      throw new ShopBackendQueueError(
        ShopBackendQueueErrorType.UNKNOWN,
        "An unexpected error occurred while updating queue status",
        "updateQueueStatus",
        { input },
        error
      );
    }
  }

  /**
   * Validate status transitions according to business rules
   * @param currentStatus Current queue status
   * @param newStatus New status to transition to
   * @param employeeId Employee ID (required for certain transitions)
   */
  private validateStatusTransition(
    currentStatus: QueueStatus,
    newStatus: QueueStatus,
    employeeId?: string
  ): void {
    const validTransitions: Record<QueueStatus, QueueStatus[]> = {
      [QueueStatus.WAITING]: [
        QueueStatus.CONFIRMED,
        QueueStatus.SERVING,
        QueueStatus.CANCELLED,
        QueueStatus.NO_SHOW,
      ],
      [QueueStatus.CONFIRMED]: [
        QueueStatus.SERVING,
        QueueStatus.CANCELLED,
        QueueStatus.NO_SHOW,
        QueueStatus.WAITING,
      ],
      [QueueStatus.SERVING]: [
        QueueStatus.COMPLETED,
        QueueStatus.CANCELLED,
        QueueStatus.NO_SHOW,
      ],
      [QueueStatus.COMPLETED]: [], // Cannot change from completed
      [QueueStatus.CANCELLED]: [], // Cannot change from cancelled
      [QueueStatus.NO_SHOW]: [], // Cannot change from no_show
    };

    if (!validTransitions[currentStatus].includes(newStatus)) {
      throw new ShopBackendQueueError(
        ShopBackendQueueErrorType.VALIDATION_ERROR,
        `Cannot transition from ${currentStatus} to ${newStatus}`,
        "updateQueueStatus",
        { currentStatus, newStatus }
      );
    }

    const isRequiredEmployeeId = [QueueStatus.NO_SHOW].includes(newStatus);

    // Additional validation for specific transitions
    if (isRequiredEmployeeId && !employeeId) {
      throw new ShopBackendQueueError(
        ShopBackendQueueErrorType.VALIDATION_ERROR,
        "Employee ID is required when changing status to serving",
        "updateQueueStatus",
        { currentStatus, newStatus }
      );
    }
  }
}
