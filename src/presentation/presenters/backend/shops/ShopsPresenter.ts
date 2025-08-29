import { getServerContainer } from '@/src/di/server-container';
import type { Logger } from '@/src/domain/interfaces/logger';
import type { IBackendShopsService } from '@/src/application/services/backend/BackendShopsService';
import type { ShopsDataDTO } from '@/src/application/dtos/backend/ShopsDTO';

// Define ViewModel interface
export interface ShopsViewModel {
  shopsData: ShopsDataDTO;
}

// Main Presenter class
export class ShopsPresenter {
  constructor(
    private readonly backendShopsService: IBackendShopsService,
    private readonly logger: Logger
  ) {}

  async getViewModel(): Promise<ShopsViewModel> {
    try {
      this.logger.info('ShopsPresenter: Getting view model');
      
      const shopsData = await this.backendShopsService.getShopsData();
      
      return {
        shopsData
      };
    } catch (error) {
      this.logger.error('ShopsPresenter: Error getting view model', error);
      throw error;
    }
  }

  getMetadata() {
    return {
      title: "จัดการร้านค้า | Shop Queue Admin",
      description: "ระบบจัดการร้านค้าและข้อมูลร้านค้าสำหรับผู้ดูแลระบบ Shop Queue",
      keywords: "shop queue, ร้านค้า, จัดการร้านค้า, admin, backend",
    };
  }
}

// Factory class
export class ShopsPresenterFactory {
  static async create(): Promise<ShopsPresenter> {
    const serverContainer = await getServerContainer();
    const logger = serverContainer.resolve<Logger>('Logger');
    const backendShopsService = serverContainer.resolve<IBackendShopsService>('BackendShopsService');
    return new ShopsPresenter(backendShopsService, logger);
  }
}
