import { PaginatedQueuesEntity } from "../../../../domain/entities/backend/backend-queue.entity";
import { Logger } from "../../../../domain/interfaces/logger";
import { PaginationParams } from "../../../../domain/interfaces/pagination-types";
import { BackendQueueRepository } from "../../../../domain/repositories/backend/backend-queue-repository";
import { IUseCase } from "../../../interfaces/use-case.interface";

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
export class GetQueuesPaginatedUseCase implements IUseCase<GetQueuesPaginatedInput, PaginatedQueuesEntity> {
  constructor(
    private queueRepository: BackendQueueRepository,
    private logger: Logger
  ) { }

  /**
   * Execute the use case to get paginated queues data
   * @param input Pagination parameters
   * @returns Paginated queues data
   */
  async execute(input: GetQueuesPaginatedInput): Promise<PaginatedQueuesEntity> {
    try {
      this.logger.info('GetQueuesPaginatedUseCase.execute', { input });

      const paginationParams: PaginationParams = {
        page: input.page || 1,
        limit: input.limit || 10
      };

      return await this.queueRepository.getPaginatedQueues(paginationParams);
    } catch (error) {
      this.logger.error('Error in GetQueuesPaginatedUseCase.execute', { error });
      throw error;
    }
  }
}
