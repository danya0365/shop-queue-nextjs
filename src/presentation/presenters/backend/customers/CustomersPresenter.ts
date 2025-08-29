import { getServerContainer } from '@/src/di/server-container';
import type { Logger } from '@/src/domain/interfaces/logger';
import type { IBackendCustomersService } from '@/src/application/services/backend/BackendCustomersService';
import type { CustomersDataDTO } from '@/src/application/dtos/backend/CustomersDTO';

// Define ViewModel interface
export interface CustomersViewModel {
  customersData: CustomersDataDTO;
}

// Main Presenter class
export class CustomersPresenter {
  constructor(
    private readonly backendCustomersService: IBackendCustomersService,
    private readonly logger: Logger
  ) {}

  async getViewModel(): Promise<CustomersViewModel> {
    try {
      this.logger.info('CustomersPresenter: Getting view model');
      
      const customersData = await this.backendCustomersService.getCustomersData();
      
      return {
        customersData
      };
    } catch (error) {
      this.logger.error('CustomersPresenter: Error getting view model', error);
      throw error;
    }
  }

  getMetadata() {
    return {
      title: 'จัดการลูกค้า | Shop Queue Admin',
      description: 'ระบบจัดการลูกค้าและสมาชิกสำหรับผู้ดูแลระบบ Shop Queue',
      keywords: 'shop queue, ลูกค้า, จัดการลูกค้า, admin, backend',
    };
  }
}

// Factory class
export class CustomersPresenterFactory {
  static async create(): Promise<CustomersPresenter> {
    const serverContainer = await getServerContainer();
    const logger = serverContainer.resolve<Logger>('Logger');
    const backendCustomersService = serverContainer.resolve<IBackendCustomersService>('BackendCustomersService');
    return new CustomersPresenter(backendCustomersService, logger);
  }
}
