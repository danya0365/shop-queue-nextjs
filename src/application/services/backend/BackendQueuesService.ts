
import type { QueuesDataDTO, QueueStatsDTO } from '@/src/application/dtos/backend/queues-dto';
import type { GetQueuesPaginatedInput } from '@/src/application/usecases/backend/queues/GetQueuesPaginatedUseCase';
import type { PaginatedQueuesEntity } from '@/src/domain/entities/backend/backend-queue.entity';
import type { Logger } from '@/src/domain/interfaces/logger';
import { IUseCase } from '../../interfaces/use-case.interface';

export interface IBackendQueuesService {
  getQueuesData(): Promise<QueuesDataDTO>;
}

export class BackendQueuesService implements IBackendQueuesService {
  constructor(
    private readonly getQueuesPaginatedUseCase: IUseCase<GetQueuesPaginatedInput, PaginatedQueuesEntity>,
    private readonly getQueueStatsUseCase: IUseCase<void, QueueStatsDTO>,
    private readonly logger: Logger
  ) { }

  async getQueuesData(): Promise<QueuesDataDTO> {
    try {
      this.logger.info('BackendQueuesService: Getting queues data');

      // Get paginated queues data and stats in parallel
      const [queuesData, queueStats] = await Promise.all([
        this.getQueuesPaginatedUseCase.execute({
          page: 1,
          limit: 10
        }),
        this.getQueueStatsUseCase.execute()
      ]);

      return {
        queues: queuesData.data,
        stats: queueStats,
        totalCount: queuesData.pagination.totalItems,
        currentPage: queuesData.pagination.currentPage,
        perPage: queuesData.pagination.itemsPerPage
      };
    } catch (error) {
      this.logger.error('BackendQueuesService: Error getting queues data', error);
      throw error;
    }
  }
}
