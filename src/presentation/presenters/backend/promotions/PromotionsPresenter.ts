import type { PromotionsDataDTO } from '@/src/application/dtos/backend/promotions-dto';
import type { IBackendPromotionsService } from '@/src/application/services/backend/BackendPromotionsService';
import { getBackendContainer } from '@/src/di/backend-container';
import type { Logger } from '@/src/domain/interfaces/logger';

// Define ViewModel interface
export interface PromotionsViewModel {
  promotionsData: PromotionsDataDTO;
}

// Main Presenter class
export class PromotionsPresenter {
  constructor(private readonly logger: Logger, private readonly backendPromotionsService: IBackendPromotionsService) { }

  async getViewModel(page: number = 1, perPage: number = 10): Promise<PromotionsViewModel> {
    try {
      this.logger.info('PromotionsPresenter: Getting view model', { page, perPage });

      const promotionsData = await this.backendPromotionsService.getPromotionsData(page, perPage);

      return {
        promotionsData
      };
    } catch (error) {
      this.logger.error('PromotionsPresenter: Error getting view model', error);
      throw error;
    }
  }

  // Metadata generation
  getMetadata() {
    return {
      title: 'จัดการโปรโมชั่น | Shop Queue Admin',
      description: 'ระบบจัดการโปรโมชั่นและติดตามสถิติการใช้งานสำหรับผู้ดูแลระบบ Shop Queue',
    };
  }
}

// Factory class
export class PromotionsPresenterFactory {
  static async create(): Promise<PromotionsPresenter> {
    const backendContainer = await getBackendContainer();
    const logger = backendContainer.resolve<Logger>('Logger');
    const backendPromotionsService = backendContainer.resolve<IBackendPromotionsService>('BackendPromotionsService');
    return new PromotionsPresenter(logger, backendPromotionsService);
  }
}
