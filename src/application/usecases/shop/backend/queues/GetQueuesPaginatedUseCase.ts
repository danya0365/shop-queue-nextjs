import { PaginatedQueuesDTO } from '@/src/application/dtos/shop/backend/queues-dto';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { QueueMapper } from '@/src/application/mappers/shop/backend/queue-mapper';
import type { Logger } from '@/src/domain/interfaces/logger';
import type { PaginationParams } from '@/src/domain/interfaces/pagination-types';
import type { ShopBackendQueueRepository } from '@/src/domain/repositories/shop/backend/backend-queue-repository';

/**
 * Input DTO for GetQueuesPaginatedUseCase
 */
export interface GetQueuesPaginatedInput {
  page: number;
  limit: number;
}

/**
 * Use case for getting paginated queues data
 * Following SOLID principles and Clean Architecture
 */
export class GetQueuesPaginatedUseCase implements IUseCase<GetQueuesPaginatedInput, PaginatedQueuesDTO> {
  constructor(
    private readonly queueRepository: ShopBackendQueueRepository,
    private readonly logger: Logger
  ) { }

  /**
   * Execute the use case to get paginated queues data
   * @param input Pagination parameters
   * @returns Paginated queues DTO
   */
  async execute(input: GetQueuesPaginatedInput): Promise<PaginatedQueuesDTO> {
    try {
      // Validate input
      if (input.page < 1) {
        throw new Error('Page must be greater than or equal to 1');
      }
      if (input.limit < 1) {
        throw new Error('Limit must be greater than or equal to 1');
      }

      this.logger.info('Getting paginated queues', { input });

      const paginationParams: PaginationParams = {
        page: input.page || 1,
        limit: input.limit || 10
      };

      const paginatedQueues = await this.queueRepository.getPaginatedQueues(paginationParams);

      // Map domain entities to DTOs
      return {
        data: paginatedQueues.data.map(queue => QueueMapper.toDTO(queue)),
        pagination: paginatedQueues.pagination
      };
    } catch (error) {
      this.logger.error('Error getting paginated queues', { error, input });
      throw error;
    }
  }
}
