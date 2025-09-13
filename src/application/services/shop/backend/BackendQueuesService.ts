import type { CreateQueueInput, PaginatedQueuesDTO, QueueDTO, QueuesDataDTO, QueueStatsDTO, UpdateQueueInput } from '@/src/application/dtos/shop/backend/queues-dto';
import type { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { AssignQueueToEmployeeInput, AssignQueueToEmployeeUseCase } from '@/src/application/usecases/shop/backend/queues/AssignQueueToEmployeeUseCase';
import { CreateQueueUseCase } from '@/src/application/usecases/shop/backend/queues/CreateQueueUseCase';
import { DeleteQueueUseCase } from '@/src/application/usecases/shop/backend/queues/DeleteQueueUseCase';
import { GetQueueByIdUseCase } from '@/src/application/usecases/shop/backend/queues/GetQueueByIdUseCase';
import { GetNextQueueToServeInput, GetNextQueueToServeUseCase } from '@/src/application/usecases/shop/backend/queues/GetNextQueueToServeUseCase';
import { GetQueuePositionInput, GetQueuePositionUseCase, QueuePositionInfo } from '@/src/application/usecases/shop/backend/queues/GetQueuePositionUseCase';
import { GetQueuesPaginatedInput, GetQueuesPaginatedUseCase } from '@/src/application/usecases/shop/backend/queues/GetQueuesPaginatedUseCase';
import { GetQueueStatsUseCase } from '@/src/application/usecases/shop/backend/queues/GetQueueStatsUseCase';
import { UpdateQueueStatusInput, UpdateQueueStatusUseCase } from '@/src/application/usecases/shop/backend/queues/UpdateQueueStatusUseCase';
import { UpdateQueueUseCase } from '@/src/application/usecases/shop/backend/queues/UpdateQueueUseCase';
import type { Logger } from '@/src/domain/interfaces/logger';
import { ShopBackendQueueRepository } from '@/src/domain/repositories/shop/backend/backend-queue-repository';

export interface IShopBackendQueuesService {
  getQueuesData(shopId: string, page?: number, perPage?: number, filters?: GetQueuesPaginatedInput['filters']): Promise<QueuesDataDTO>;
  getQueuesPaginated(page: number, limit: number, filters?: GetQueuesPaginatedInput['filters']): Promise<PaginatedQueuesDTO>;
  getQueueById(id: string): Promise<QueueDTO>;
  createQueue(queueData: CreateQueueInput): Promise<QueueDTO>;
  updateQueue(id: string, queueData: Omit<UpdateQueueInput, 'id'>): Promise<QueueDTO>;
  deleteQueue(id: string): Promise<boolean>;
  
  // Queue Management Methods
  assignQueueToEmployee(input: AssignQueueToEmployeeInput): Promise<QueueDTO>;
  updateQueueStatus(input: UpdateQueueStatusInput): Promise<QueueDTO>;
  getNextQueueToServe(input: GetNextQueueToServeInput): Promise<QueueDTO | null>;
  getQueuePosition(input: GetQueuePositionInput): Promise<QueuePositionInfo>;
}

export class ShopBackendQueuesService implements IShopBackendQueuesService {
  constructor(
    private readonly getQueuesPaginatedUseCase: IUseCase<GetQueuesPaginatedInput, PaginatedQueuesDTO>,
    private readonly getQueueStatsUseCase: IUseCase<string, QueueStatsDTO>,
    private readonly getQueueByIdUseCase: IUseCase<string, QueueDTO>,
    private readonly createQueueUseCase: IUseCase<CreateQueueInput, QueueDTO>,
    private readonly updateQueueUseCase: IUseCase<UpdateQueueInput, QueueDTO>,
    private readonly deleteQueueUseCase: IUseCase<string, boolean>,
    private readonly assignQueueToEmployeeUseCase: IUseCase<AssignQueueToEmployeeInput, QueueDTO>,
    private readonly updateQueueStatusUseCase: IUseCase<UpdateQueueStatusInput, QueueDTO>,
    private readonly getNextQueueToServeUseCase: IUseCase<GetNextQueueToServeInput, QueueDTO | null>,
    private readonly getQueuePositionUseCase: IUseCase<GetQueuePositionInput, QueuePositionInfo>,
    private readonly logger: Logger
  ) { }

  /**
   * Get queues data including paginated queues and statistics
   * @param shopId Shop ID for filtering data
   * @param page Page number (default: 1)
   * @param perPage Items per page (default: 10)
   * @returns Queues data DTO
   */
  async getQueuesData(shopId: string, page: number = 1, perPage: number = 10, filters?: GetQueuesPaginatedInput['filters']): Promise<QueuesDataDTO> {
    try {
      this.logger.info('Getting queues data', { shopId, page, perPage, filters });

      // Merge shopId with provided filters
      const mergedFilters = {
        ...filters,
        shopId: shopId
      };

      // Get queues and stats in parallel
      const [queuesResult, stats] = await Promise.all([
        this.getQueuesPaginatedUseCase.execute({ page, limit: perPage, filters: mergedFilters }),
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
      this.logger.error('Error in getQueuesData', { error, shopId, page, perPage, filters });
      throw error;
    }
  }

  /**
   * Get paginated queues with advanced filtering
   * @param page Page number
   * @param limit Items per page
   * @param filters Advanced filtering options
   * @returns Paginated queues DTO
   */
  async getQueuesPaginated(page: number, limit: number, filters?: GetQueuesPaginatedInput['filters']): Promise<PaginatedQueuesDTO> {
    try {
      this.logger.info('Getting paginated queues with filters', { page, limit, filters });
      
      const result = await this.getQueuesPaginatedUseCase.execute({ page, limit, filters });
      
      return result;
    } catch (error) {
      this.logger.error('Error in getQueuesPaginated', { error, page, limit, filters });
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
   * @returns True if deletion was successful
   */
  async deleteQueue(id: string): Promise<boolean> {
    try {
      return await this.deleteQueueUseCase.execute(id);
    } catch (error) {
      this.logger.error('Error deleting queue', { error, id });
      throw error;
    }
  }

  /**
   * Assign a queue to an employee
   * @param input Assignment parameters
   * @returns Updated queue DTO
   */
  async assignQueueToEmployee(input: AssignQueueToEmployeeInput): Promise<QueueDTO> {
    try {
      return await this.assignQueueToEmployeeUseCase.execute(input);
    } catch (error) {
      this.logger.error('Error assigning queue to employee', { error, input });
      throw error;
    }
  }

  /**
   * Update queue status with business logic validation
   * @param input Status update parameters
   * @returns Updated queue DTO
   */
  async updateQueueStatus(input: UpdateQueueStatusInput): Promise<QueueDTO> {
    try {
      return await this.updateQueueStatusUseCase.execute(input);
    } catch (error) {
      this.logger.error('Error updating queue status', { error, input });
      throw error;
    }
  }

  /**
   * Get the next queue to serve
   * @param input Parameters for finding next queue
   * @returns Next queue DTO or null if no queue available
   */
  async getNextQueueToServe(input: GetNextQueueToServeInput): Promise<QueueDTO | null> {
    try {
      return await this.getNextQueueToServeUseCase.execute(input);
    } catch (error) {
      this.logger.error('Error getting next queue to serve', { error, input });
      throw error;
    }
  }

  /**
   * Get queue position and estimated wait time
   * @param input Queue position parameters
   * @returns Queue position information
   */
  async getQueuePosition(input: GetQueuePositionInput): Promise<QueuePositionInfo> {
    try {
      return await this.getQueuePositionUseCase.execute(input);
    } catch (error) {
      this.logger.error('Error getting queue position', { error, input });
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
    const assignQueueToEmployeeUseCase = new AssignQueueToEmployeeUseCase(repository, logger);
    const updateQueueStatusUseCase = new UpdateQueueStatusUseCase(repository, logger);
    const getNextQueueToServeUseCase = new GetNextQueueToServeUseCase(repository, logger);
    const getQueuePositionUseCase = new GetQueuePositionUseCase(repository, logger);

    return new ShopBackendQueuesService(
      getQueuesPaginatedUseCase,
      getQueueStatsUseCase,
      getQueueByIdUseCase,
      createQueueUseCase,
      updateQueueUseCase,
      deleteQueueUseCase,
      assignQueueToEmployeeUseCase,
      updateQueueStatusUseCase,
      getNextQueueToServeUseCase,
      getQueuePositionUseCase,
      logger
    );
  }
}
