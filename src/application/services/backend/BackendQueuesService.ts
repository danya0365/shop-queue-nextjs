import type { CreateQueueInput, PaginatedQueuesDTO, QueueDTO, QueuesDataDTO, QueueStatsDTO, UpdateQueueInput } from '@/src/application/dtos/backend/queues-dto';
import { GetQueuesPaginatedUseCase, type GetQueuesPaginatedInput } from '@/src/application/usecases/backend/queues/GetQueuesPaginatedUseCase';
import type { Logger } from '@/src/domain/interfaces/logger';
import { BackendQueueRepository } from '@/src/domain/repositories/backend/backend-queue-repository';
import { IUseCase } from '../../interfaces/use-case.interface';
import { CreateQueueUseCase } from '../../usecases/backend/queues/CreateQueueUseCase';
import { DeleteQueueUseCase } from '../../usecases/backend/queues/DeleteQueueUseCase';
import { GetQueueByIdUseCase } from '../../usecases/backend/queues/GetQueueByIdUseCase';
import { GetQueueStatsUseCase } from '../../usecases/backend/queues/GetQueueStatsUseCase';
import { UpdateQueueUseCase } from '../../usecases/backend/queues/UpdateQueueUseCase';

export interface IBackendQueuesService {
  getQueuesData(page?: number, perPage?: number): Promise<QueuesDataDTO>;
  getQueueById(id: string): Promise<QueueDTO>;
  createQueue(queueData: CreateQueueInput): Promise<QueueDTO>;
  updateQueue(id: string, queueData: Omit<UpdateQueueInput, 'id'>): Promise<QueueDTO>;
  deleteQueue(id: string): Promise<boolean>;
}

export class BackendQueuesService implements IBackendQueuesService {
  constructor(
    private readonly getQueuesPaginatedUseCase: IUseCase<GetQueuesPaginatedInput, PaginatedQueuesDTO>,
    private readonly getQueueStatsUseCase: IUseCase<void, QueueStatsDTO>,
    private readonly getQueueByIdUseCase: IUseCase<string, QueueDTO>,
    private readonly createQueueUseCase: IUseCase<CreateQueueInput, QueueDTO>,
    private readonly updateQueueUseCase: IUseCase<UpdateQueueInput, QueueDTO>,
    private readonly deleteQueueUseCase: IUseCase<string, boolean>,
    private readonly logger: Logger
  ) { }

  /**
   * Get queues data including paginated queues and statistics
   * @param page Page number (default: 1)
   * @param perPage Items per page (default: 10)
   * @returns Queues data DTO
   */
  async getQueuesData(page: number = 1, perPage: number = 10): Promise<QueuesDataDTO> {
    try {
      this.logger.info('Getting queues data', { page, perPage });

      // Get queues and stats in parallel
      const [queuesResult, stats] = await Promise.all([
        this.getQueuesPaginatedUseCase.execute({ page, limit: perPage }),
        this.getQueueStatsUseCase.execute()
      ]);

      return {
        queues: queuesResult.data,
        stats,
        totalCount: queuesResult.pagination.totalItems,
        currentPage: queuesResult.pagination.currentPage,
        perPage: queuesResult.pagination.itemsPerPage
      };
    } catch (error) {
      this.logger.error('Error getting queues data', { error, page, perPage });
      throw error;
    }
  }

  /**
   * Get a queue by ID
   * @param id Queue ID
   * @returns Queue DTO
   */
  async getQueueById(id: string): Promise<QueueDTO> {
    try {
      this.logger.info('Getting queue by ID', { id });

      const result = await this.getQueueByIdUseCase.execute(id);
      return result;
    } catch (error) {
      this.logger.error('Error getting queue by ID', { error, id });
      throw error;
    }
  }

  /**
   * Create a new queue
   * @param queueData Queue data
   * @returns Created queue DTO
   */
  async createQueue(queueData: CreateQueueInput): Promise<QueueDTO> {
    try {
      this.logger.info('Creating queue', { queueData });

      const result = await this.createQueueUseCase.execute(queueData);
      return result;
    } catch (error) {
      this.logger.error('Error creating queue', { error, queueData });
      throw error;
    }
  }

  /**
   * Update an existing queue
   * @param id Queue ID
   * @param queueData Queue data to update
   * @returns Updated queue DTO
   */
  async updateQueue(id: string, queueData: Omit<UpdateQueueInput, 'id'>): Promise<QueueDTO> {
    try {
      this.logger.info('Updating queue', { id, queueData });

      const updateData = { id, ...queueData };
      const result = await this.updateQueueUseCase.execute(updateData);
      return result;
    } catch (error) {
      this.logger.error('Error updating queue', { error, id, queueData });
      throw error;
    }
  }

  /**
   * Delete a queue
   * @param id Queue ID
   * @returns Success flag
   */
  async deleteQueue(id: string): Promise<boolean> {
    try {
      this.logger.info('Deleting queue', { id });

      const result = await this.deleteQueueUseCase.execute(id);
      return result;
    } catch (error) {
      this.logger.error('Error deleting queue', { error, id });
      throw error;
    }
  }
}

export class BackendQueuesServiceFactory {
  static create(repository: BackendQueueRepository, logger: Logger): BackendQueuesService {
    const getQueuesPaginatedUseCase = new GetQueuesPaginatedUseCase(repository, logger);
    const getQueueStatsUseCase = new GetQueueStatsUseCase(repository, logger);
    const getQueueByIdUseCase = new GetQueueByIdUseCase(repository, logger);
    const createQueueUseCase = new CreateQueueUseCase(repository, logger);
    const updateQueueUseCase = new UpdateQueueUseCase(repository, logger);
    const deleteQueueUseCase = new DeleteQueueUseCase(repository, logger);
    return new BackendQueuesService(getQueuesPaginatedUseCase, getQueueStatsUseCase, getQueueByIdUseCase, createQueueUseCase, updateQueueUseCase, deleteQueueUseCase, logger);
  }
}
