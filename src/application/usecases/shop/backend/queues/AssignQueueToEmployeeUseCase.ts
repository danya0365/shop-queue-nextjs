import { QueueDTO } from '@/src/application/dtos/shop/backend/queues-dto';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { QueueMapper } from '@/src/application/mappers/shop/backend/queue-mapper';
import type { Logger } from '@/src/domain/interfaces/logger';
import { ShopBackendQueueError, ShopBackendQueueErrorType } from '@/src/domain/repositories/shop/backend/backend-queue-repository';
import type { ShopBackendQueueRepository } from '@/src/domain/repositories/shop/backend/backend-queue-repository';

/**
 * Input DTO for AssignQueueToEmployeeUseCase
 */
export interface AssignQueueToEmployeeInput {
  queueId: string;
  employeeId: string;
  shopId: string;
}

/**
 * Use case for assigning a queue to an employee
 * Following SOLID principles and Clean Architecture
 */
export class AssignQueueToEmployeeUseCase implements IUseCase<AssignQueueToEmployeeInput, QueueDTO> {
  constructor(
    private readonly queueRepository: ShopBackendQueueRepository,
    private readonly logger: Logger
  ) { }

  /**
   * Execute the use case to assign a queue to an employee
   * @param input Assignment parameters
   * @returns Updated queue DTO
   */
  async execute(input: AssignQueueToEmployeeInput): Promise<QueueDTO> {
    try {
      // Validate input
      if (!input.queueId || !input.employeeId || !input.shopId) {
        throw new Error('Queue ID, employee ID, and shop ID are required');
      }

      this.logger.info('Assigning queue to employee', { input });

      // Get the queue
      const queue = await this.queueRepository.getQueueById(input.queueId);
      if (!queue) {
        throw new ShopBackendQueueError(
          ShopBackendQueueErrorType.NOT_FOUND,
          `Queue with ID ${input.queueId} not found`,
          'assignQueueToEmployee',
          { input }
        );
      }

      // Validate queue belongs to the shop
      if (queue.shopId !== input.shopId) {
        throw new ShopBackendQueueError(
          ShopBackendQueueErrorType.UNAUTHORIZED,
          'Queue does not belong to the specified shop',
          'assignQueueToEmployee',
          { input }
        );
      }

      // Validate queue status - can only assign waiting or in_progress queues
      if (!['waiting', 'in_progress'].includes(queue.status)) {
        throw new ShopBackendQueueError(
          ShopBackendQueueErrorType.VALIDATION_ERROR,
          `Cannot assign queue with status ${queue.status}. Only waiting or in_progress queues can be assigned.`,
          'assignQueueToEmployee',
          { input, currentStatus: queue.status }
        );
      }

      // Update the queue with employee assignment
      const updatedQueue = await this.queueRepository.updateQueue(input.queueId, {
        status: 'in_progress',
        servedByEmployeeId: input.employeeId,
        calledAt: new Date().toISOString()
      });

      this.logger.info('Queue assigned to employee successfully', { 
        queueId: input.queueId, 
        employeeId: input.employeeId 
      });

      return QueueMapper.toDTO(updatedQueue);
    } catch (error) {
      if (error instanceof ShopBackendQueueError) {
        throw error;
      }

      this.logger.error('Error in assignQueueToEmployee', { error, input });
      throw new ShopBackendQueueError(
        ShopBackendQueueErrorType.UNKNOWN,
        'An unexpected error occurred while assigning queue to employee',
        'assignQueueToEmployee',
        { input },
        error
      );
    }
  }
}
