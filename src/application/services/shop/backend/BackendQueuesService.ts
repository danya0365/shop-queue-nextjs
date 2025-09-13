import type { CreateQueueInput, PaginatedQueuesDTO, QueueDTO, QueuesDataDTO, QueueStatsDTO, UpdateQueueInput } from '@/src/application/dtos/shop/backend/queues-dto';
import type { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { CreateQueueUseCase } from '@/src/application/usecases/shop/backend/queues/CreateQueueUseCase';
import { DeleteQueueUseCase } from '@/src/application/usecases/shop/backend/queues/DeleteQueueUseCase';
import { GetQueueByIdUseCase } from '@/src/application/usecases/shop/backend/queues/GetQueueByIdUseCase';
import { GetQueuesPaginatedInput, GetQueuesPaginatedUseCase } from '@/src/application/usecases/shop/backend/queues/GetQueuesPaginatedUseCase';
import { GetQueueStatsUseCase } from '@/src/application/usecases/shop/backend/queues/GetQueueStatsUseCase';
import { UpdateQueueUseCase } from '@/src/application/usecases/shop/backend/queues/UpdateQueueUseCase';
import type { Logger } from '@/src/domain/interfaces/logger';
import { ShopBackendQueueRepository } from '@/src/domain/repositories/shop/backend/backend-queue-repository';

export interface IShopBackendQueuesService {
  getQueuesData(shopId: string, page?: number, perPage?: number): Promise<QueuesDataDTO>;
  getQueueById(id: string): Promise<QueueDTO>;
  createQueue(queueData: CreateQueueInput): Promise<QueueDTO>;
  updateQueue(id: string, queueData: Omit<UpdateQueueInput, 'id'>): Promise<QueueDTO>;
  deleteQueue(id: string): Promise<boolean>;
}

export class ShopBackendQueuesService implements IShopBackendQueuesService {
  constructor(
    private readonly getQueuesPaginatedUseCase: IUseCase<GetQueuesPaginatedInput, PaginatedQueuesDTO>,
    private readonly getQueueStatsUseCase: IUseCase<string, QueueStatsDTO>,
    private readonly getQueueByIdUseCase: IUseCase<string, QueueDTO>,
    private readonly createQueueUseCase: IUseCase<CreateQueueInput, QueueDTO>,
    private readonly updateQueueUseCase: IUseCase<UpdateQueueInput, QueueDTO>,
    private readonly deleteQueueUseCase: IUseCase<string, boolean>,
    private readonly logger: Logger
  ) { }

  /**
   * Get queues data including paginated queues and statistics
   * @param shopId Shop ID for filtering data
   * @param page Page number (default: 1)
   * @param perPage Items per page (default: 10)
   * @returns Queues data DTO
   */
  async getQueuesData(shopId: string, page: number = 1, perPage: number = 10): Promise<QueuesDataDTO> {
    try {
      this.logger.info('Getting queues data', { shopId, page, perPage });

      // Get queues and stats in parallel
      const [queuesResult, stats] = await Promise.all([
        this.getQueuesPaginatedUseCase.execute({ page, limit: perPage, filters: { shopId } }),
        this.getQueueStatsUseCase.execute(shopId)
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

export class ShopBackendQueuesServiceFactory {
  static create(repository: ShopBackendQueueRepository, logger: Logger): ShopBackendQueuesService {
    const getQueuesPaginatedUseCase = new GetQueuesPaginatedUseCase(repository, logger);
    const getQueueStatsUseCase = new GetQueueStatsUseCase(repository, logger);
    const getQueueByIdUseCase = new GetQueueByIdUseCase(repository, logger);
    const createQueueUseCase = new CreateQueueUseCase(repository, logger);
    const updateQueueUseCase = new UpdateQueueUseCase(repository, logger);
    const deleteQueueUseCase = new DeleteQueueUseCase(repository, logger);
    return new ShopBackendQueuesService(getQueuesPaginatedUseCase, getQueueStatsUseCase, getQueueByIdUseCase, createQueueUseCase, updateQueueUseCase, deleteQueueUseCase, logger);
  }
}

