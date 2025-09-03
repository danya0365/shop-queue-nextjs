import { QueueDTO, UpdateQueueInput } from '@/src/application/dtos/backend/queues-dto';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { QueueMapper } from '@/src/application/mappers/backend/queue-mapper';
import { UpdateQueueEntity } from '@/src/domain/entities/backend/backend-queue.entity';
import type { Logger } from '@/src/domain/interfaces/logger';
import type { BackendQueueRepository } from '@/src/domain/repositories/backend/backend-queue-repository';

/**
 * Use case for updating an existing queue
 * Following SOLID principles and Clean Architecture
 */
export class UpdateQueueUseCase implements IUseCase<UpdateQueueInput, QueueDTO> {
  constructor(
    private readonly queueRepository: BackendQueueRepository,
    private readonly logger: Logger
  ) { }

  /**
   * Execute the use case to update an existing queue
   * @param input Queue data to update
   * @returns Updated queue DTO
   */
  async execute(input: UpdateQueueInput): Promise<QueueDTO> {
    try {
      // Validate input
      if (!input.id) {
        throw new Error('Queue ID is required');
      }

      // Extract ID from input
      const { id, ...queueData } = input;

      // Map input to domain entity format expected by repository
      const queueToUpdate: UpdateQueueEntity = {
        ...queueData,
        queueServices: queueData.queueServices?.map(service => ({
          serviceId: service.serviceId,
          quantity: service.quantity,
          price: service.price
        }))
      };

      // Update queue in repository
      const updatedQueue = await this.queueRepository.updateQueue(id, queueToUpdate);

      if (!updatedQueue) {
        throw new Error(`Queue with ID ${id} not found`);
      }

      return QueueMapper.toDTO(updatedQueue);
    } catch (error) {
      this.logger.error('Error updating queue', { error, input });
      throw error;
    }
  }
}
