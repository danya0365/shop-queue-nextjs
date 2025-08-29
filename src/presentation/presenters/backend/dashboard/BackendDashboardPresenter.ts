import { getServerContainer } from '@/src/di/server-container';
import type { Logger } from '@/src/domain/interfaces/logger';
import type { IBackendDashboardService } from '@/src/application/services/backend/BackendDashboardService';
import type { DashboardDataDTO } from '@/src/application/dtos/backend/DashboardStatsDTO';

// Define ViewModel interface
export interface BackendDashboardViewModel {
  dashboardData: DashboardDataDTO;
}

// Main Presenter class
export class BackendDashboardPresenter {
  constructor(
    private readonly backendDashboardService: IBackendDashboardService,
    private readonly logger: Logger
  ) {}

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
    const serverContainer = await getServerContainer();
    const logger = serverContainer.resolve<Logger>('Logger');
    const backendDashboardService = serverContainer.resolve<IBackendDashboardService>('BackendDashboardService');
    
    return new BackendDashboardPresenter(backendDashboardService, logger);
  }
}
