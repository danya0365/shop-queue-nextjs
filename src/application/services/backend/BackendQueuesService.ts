
import type { QueuesDataDTO } from '@/src/application/dtos/backend/queues-dto';
import type { IGetQueuesUseCase } from '@/src/application/usecases/backend/queues/GetQueuesUseCase';
import type { Logger } from '@/src/domain/interfaces/logger';

export interface IBackendQueuesService {
  getQueuesData(): Promise<QueuesDataDTO>;
}

export class BackendQueuesService implements IBackendQueuesService {
  constructor(
    private readonly getQueuesUseCase: IGetQueuesUseCase,
    private readonly logger: Logger
  ) { }

  async getQueuesData(): Promise<QueuesDataDTO> {
    try {
      this.logger.info('BackendQueuesService: Getting queues data');

      const queuesData = await this.getQueuesUseCase.execute();

      this.logger.info('BackendQueuesService: Successfully retrieved queues data');
      return queuesData;
    } catch (error) {
      this.logger.error('BackendQueuesService: Error getting queues data', error);
      throw error;
    }
  }
}
