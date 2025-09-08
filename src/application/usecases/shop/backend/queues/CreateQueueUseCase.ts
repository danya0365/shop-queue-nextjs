import { CreateQueueInput, QueueDTO } from '@/src/application/dtos/shop/backend/queues-dto';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { QueueMapper } from '@/src/application/mappers/shop/backend/queue-mapper';
import { CreateQueueEntity } from '@/src/domain/entities/shop/backend/backend-queue.entity';
import type { Logger } from '@/src/domain/interfaces/logger';
import type { ShopBackendQueueRepository } from '@/src/domain/repositories/shop/backend/backend-queue-repository';

/**
 * Use case for creating a new queue
 * Following SOLID principles and Clean Architecture
 */
export class CreateQueueUseCase implements IUseCase<CreateQueueInput, QueueDTO> {
  constructor(
    private readonly queueRepository: ShopBackendQueueRepository,
    private readonly logger: Logger
  ) { }

  /**
   * Execute the use case to create a new queue
   * @param input Queue data to create
   * @returns Created queue dto
   */
  async execute(input: CreateQueueInput): Promise<QueueDTO> {
    try {
      // Validate required fields
      if (!input.customerId) {
        throw new Error('Customer ID is required');
      }
      if (!input.shopId) {
        throw new Error('Shop ID is required');
      }
      if (!input.queueNumber) {
        throw new Error('Queue number is required');
      }
      if (!input.status) {
        throw new Error('Status is required');
      }
      if (!input.priority) {
        throw new Error('Priority is required');
      }
      if (!input.queueServices || !Array.isArray(input.queueServices) || input.queueServices.length === 0) {
        throw new Error('At least one queue service is required');
      }

      // Map input to domain entity format expected by repository
      const queueToCreate: CreateQueueEntity = {
        customerId: input.customerId,
        shopId: input.shopId,
        queueNumber: input.queueNumber,
        status: input.status,
        priority: input.priority,
        estimatedWaitTime: input.estimatedWaitTime,
        notes: input.notes || undefined,
        queueServices: input.queueServices.map(service => ({
          serviceId: service.serviceId,
          quantity: service.quantity,
          price: service.price
        }))
      };

      const createdQueue = await this.queueRepository.createQueue(queueToCreate);
      return QueueMapper.toDTO(createdQueue);
    } catch (error) {
      this.logger.error('Error in CreateQueueUseCase.execute', { error, input });
      throw error;
    }
  }
}
