import type { DashboardDataDTO } from '@/src/application/dtos/backend/DashboardStatsDTO';
import type { IBackendDashboardService } from '@/src/application/services/backend/BackendDashboardService';
import { getBackendContainer } from '@/src/di/backend-container';
import type { Logger } from '@/src/domain/interfaces/logger';

// Define ViewModel interface
export interface BackendDashboardViewModel {
  dashboardData: DashboardDataDTO;
}

// Main Presenter class
export class BackendDashboardPresenter {
  constructor(
    private readonly backendDashboardService: IBackendDashboardService,
    private readonly logger: Logger
  ) { }

  async getViewModel(): Promise<BackendDashboardViewModel> {
    try {
      this.logger.info('BackendDashboardPresenter: Getting dashboard view model');

      const dashboardData = await this.backendDashboardService.getDashboardData();

      return {
        dashboardData
      };
    } catch (error) {
      this.logger.error('BackendDashboardPresenter: Error getting dashboard view model', error);
      throw error;
    }
  }

  // Metadata generation
  generateMetadata() {
    return {
      title: 'แดชบอร์ด | Shop Queue Admin',
      description: 'ระบบจัดการแดชบอร์ดสำหรับผู้ดูแลระบบ Shop Queue',
    };
  }
}

// Factory class
export class BackendDashboardPresenterFactory {
  static async create(): Promise<BackendDashboardPresenter> {
    const serverContainer = await getBackendContainer();
    const logger = serverContainer.resolve<Logger>('Logger');
    const backendDashboardService = serverContainer.resolve<IBackendDashboardService>('BackendDashboardService');

    return new BackendDashboardPresenter(backendDashboardService, logger);
  }
}
