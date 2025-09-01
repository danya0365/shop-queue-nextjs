import type { EmployeesDataDTO } from '@/src/application/dtos/backend/employees-dto';
import type { IBackendEmployeesService } from '@/src/application/services/backend/BackendEmployeesService';
import { getBackendContainer } from '@/src/di/backend-container';
import type { Logger } from '@/src/domain/interfaces/logger';

// Define ViewModel interface
export interface EmployeesViewModel {
  employeesData: EmployeesDataDTO;
}

// Main Presenter class
export class EmployeesPresenter {
  constructor(
    private readonly backendEmployeesService: IBackendEmployeesService,
    private readonly logger: Logger
  ) { }

  async getViewModel(): Promise<EmployeesViewModel> {
    try {
      this.logger.info('EmployeesPresenter: Getting view model');

      const employeesData = await this.backendEmployeesService.getEmployeesData();

      return {
        employeesData
      };
    } catch (error) {
      this.logger.error('EmployeesPresenter: Error getting view model', error);
      throw error;
    }
  }

  getMetadata() {
    return {
      title: 'จัดการพนักงาน | Shop Queue Admin',
      description: 'ระบบจัดการพนักงานและบุคลากรสำหรับผู้ดูแลระบบ Shop Queue',
      keywords: 'shop queue, พนักงาน, จัดการพนักงาน, admin, backend',
    };
  }
}

// Factory class
export class EmployeesPresenterFactory {
  static async create(): Promise<EmployeesPresenter> {
    const serverContainer = await getBackendContainer();
    const logger = serverContainer.resolve<Logger>('Logger');
    const backendEmployeesService = serverContainer.resolve<IBackendEmployeesService>('BackendEmployeesService');
    return new EmployeesPresenter(backendEmployeesService, logger);
  }
}
