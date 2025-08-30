import type { QueuesDataDTO } from '@/src/application/dtos/backend/QueuesDTO';
import type { IBackendQueuesService } from '@/src/application/services/backend/BackendQueuesService';
import { getBackendContainer } from '@/src/di/backend-container';
import type { Logger } from '@/src/domain/interfaces/logger';

// Define ViewModel interface
export interface QueuesViewModel {
  queuesData: QueuesDataDTO;
}

// Main Presenter class
export class QueuesPresenter {
  constructor(
    private readonly backendQueuesService: IBackendQueuesService,
    private readonly logger: Logger
  ) { }

  async getViewModel(): Promise<QueuesViewModel> {
    try {
      this.logger.info('QueuesPresenter: Getting view model');

      const queuesData = await this.backendQueuesService.getQueuesData();

      return {
        queuesData
      };
    } catch (error) {
      this.logger.error('QueuesPresenter: Error getting view model', error);
      throw error;
    }
  }

  getMetadata() {
    return {
      title: "จัดการคิว | Shop Queue Admin",
      description: "ระบบจัดการคิวและข้อมูลคิวสำหรับผู้ดูแลระบบ Shop Queue",
      keywords: "shop queue, คิว, จัดการคิว, admin, backend",
    };
  }
}

// Factory class
export class QueuesPresenterFactory {
  static async create(): Promise<QueuesPresenter> {
    const serverContainer = await getBackendContainer();
    const logger = serverContainer.resolve<Logger>('Logger');
    const backendQueuesService = serverContainer.resolve<IBackendQueuesService>('BackendQueuesService');
    return new QueuesPresenter(backendQueuesService, logger);
  }
}
