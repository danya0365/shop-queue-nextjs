import { QueueDTO, UpdateQueueInput } from "@/src/application/dtos/backend/queues-dto";
import { UpdateQueueEntity } from "@/src/domain/entities/backend/backend-queue.entity";
import { Logger } from "../../../../domain/interfaces/logger";
import { BackendQueueRepository } from "../../../../domain/repositories/backend/backend-queue-repository";
import { IUseCase } from "../../../interfaces/use-case.interface";


/**
 * Use case for updating an existing queue
 * Following SOLID principles and Clean Architecture
 */
export class UpdateQueueUseCase implements IUseCase<UpdateQueueInput, QueueDTO> {
  constructor(
    private queueRepository: BackendQueueRepository,
    private logger: Logger
  ) { }

  /**
   * Execute the use case to update an existing queue
   * @param input Queue data to update
   * @returns Updated queue entity
   */
  async execute(input: UpdateQueueInput): Promise<QueueDTO> {
    try {
      // Extract ID from input
      const { id, ...queueData } = input;

      // Map input to domain entity format expected by repository
      const queueToUpdate: UpdateQueueEntity = {
        ...queueData,

      };

      // Update queue in repository
      const updatedQueue = await this.queueRepository.updateQueue(id, queueToUpdate);

      if (!updatedQueue) {
        throw new Error(`Queue with ID ${id} not found`);
      }

      const queueDTO: QueueDTO = {
        id: updatedQueue.id,
        customerId: updatedQueue.customerId,
        customerName: updatedQueue.customerName,
        customerPhone: updatedQueue.customerPhone,
        shopId: updatedQueue.shopId,
        shopName: updatedQueue.shopName,
        queueServices: updatedQueue.queueServices,
        queueNumber: updatedQueue.queueNumber,
        status: updatedQueue.status,
        priority: updatedQueue.priority,
        estimatedWaitTime: updatedQueue.estimatedWaitTime,
        actualWaitTime: updatedQueue.actualWaitTime,
        notes: updatedQueue.notes,
        createdAt: updatedQueue.createdAt,
        updatedAt: updatedQueue.updatedAt,
        calledAt: updatedQueue.calledAt,
        completedAt: updatedQueue.completedAt
      };

      return queueDTO;
    } catch (error) {
      this.logger.error('Error in UpdateQueueUseCase.execute', { error, input });
      throw error;
    }
  }
}
