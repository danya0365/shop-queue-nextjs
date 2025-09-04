import type { ServicesDataDTO } from '@/src/application/dtos/backend/services-dto';
import type { IBackendServicesService } from '@/src/application/services/backend/BackendServicesService';
import { getBackendContainer } from '@/src/di/backend-container';
import type { Logger } from '@/src/domain/interfaces/logger';

// Define ViewModel interface
export interface ServicesViewModel {
  servicesData: ServicesDataDTO;
}

// Main Presenter class
export class ServicesPresenter {
  constructor(
    private readonly backendServicesService: IBackendServicesService,
    private readonly logger: Logger
  ) { }

  async getViewModel(): Promise<ServicesViewModel> {
    try {
      this.logger.info('ServicesPresenter: Getting view model');

      const servicesData = await this.backendServicesService.getServicesData();

      return {
        servicesData
      };
    } catch (error) {
      this.logger.error('ServicesPresenter: Error getting view model', error);
      throw error;
    }
  }

  getMetadata() {
    return {
      title: 'จัดการบริการ | Shop Queue Admin',
      description: 'ระบบจัดการบริการและราคาสำหรับผู้ดูแลระบบ Shop Queue',
      keywords: 'shop queue, บริการ, จัดการบริการ, admin, backend, services',
    };
  }
}

// Factory class
export class ServicesPresenterFactory {
  static async create(): Promise<ServicesPresenter> {
    const serverContainer = await getBackendContainer();
    const logger = serverContainer.resolve<Logger>('Logger');
    const backendServicesService = serverContainer.resolve<IBackendServicesService>('BackendServicesService');
    return new ServicesPresenter(backendServicesService, logger);
  }
}
