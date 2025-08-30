import type { CategoriesDataDTO } from '@/src/application/dtos/backend/CategoriesDTO';
import type { IBackendCategoriesService } from '@/src/application/services/backend/BackendCategoriesService';
import { getBackendContainer } from '@/src/di/backend-container';
import type { Logger } from '@/src/domain/interfaces/logger';

// Define ViewModel interface
export interface CategoriesViewModel {
  categoriesData: CategoriesDataDTO;
}

// Main Presenter class
export class CategoriesPresenter {
  constructor(
    private readonly backendCategoriesService: IBackendCategoriesService,
    private readonly logger: Logger
  ) { }

  async getViewModel(): Promise<CategoriesViewModel> {
    try {
      this.logger.info('CategoriesPresenter: Getting view model');

      const categoriesData = await this.backendCategoriesService.getCategoriesData();

      return {
        categoriesData
      };
    } catch (error) {
      this.logger.error('CategoriesPresenter: Error getting view model', error);
      throw error;
    }
  }

  getMetadata() {
    return {
      title: 'จัดการหมวดหมู่ | Shop Queue Admin',
      description: 'ระบบจัดการหมวดหมู่และการจัดกลุ่มร้านค้าสำหรับผู้ดูแลระบบ Shop Queue',
      keywords: 'shop queue, หมวดหมู่, จัดการหมวดหมู่, admin, backend',
    };
  }
}

// Factory class
export class CategoriesPresenterFactory {
  static async create(): Promise<CategoriesPresenter> {
    const serverContainer = await getBackendContainer();
    const logger = serverContainer.resolve<Logger>('Logger');
    const backendCategoriesService = serverContainer.resolve<IBackendCategoriesService>('BackendCategoriesService');
    return new CategoriesPresenter(backendCategoriesService, logger);
  }
}
