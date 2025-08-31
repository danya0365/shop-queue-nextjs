import type { ShopsDataDTO } from '@/src/application/dtos/backend/ShopsDTO';
import type { IBackendShopsService } from '@/src/application/services/backend/BackendShopsService';
import { getBackendContainer } from '@/src/di/backend-container';
import type { Logger } from '@/src/domain/interfaces/logger';

// Define ViewModel interface
export interface ShopsViewModel {
  shopsData: ShopsDataDTO;
  isLoading: boolean;
  error: string | null;
}

// Main Presenter class
export class ShopsPresenter {
  constructor(
    private readonly backendShopsService: IBackendShopsService,
    private readonly logger: Logger
  ) { }

  async getViewModel(page: number = 1, limit: number = 10): Promise<ShopsViewModel> {
    try {
      this.logger.info('ShopsPresenter: Getting view model', { page, limit });

      // Get both paginated data and stats in parallel for better performance
      const shopsData = await this.backendShopsService.getShopsData(page, limit);

      return {
        shopsData,
        isLoading: false,
        error: null
      };
    } catch (error) {
      this.logger.error('ShopsPresenter: Error getting view model', error);
      return {
        shopsData: {
          shops: [],
          stats: {
            totalShops: 0,
            activeShops: 0,
            pendingApproval: 0,
            newThisMonth: 0
          },
          totalCount: 0,
          currentPage: page,
          perPage: limit
        },
        isLoading: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      };
    }
  }

  /**
   * Get paginated shops data without stats
   * @param page Page number
   * @param limit Items per page
   * @returns View model with only paginated shops data
   */
  async getShopsPaginatedViewModel(page: number, limit: number): Promise<ShopsViewModel> {
    try {
      this.logger.info('ShopsPresenter: Getting paginated shops data', { page, limit });

      const shopsData = await this.backendShopsService.getShopsPaginated(page, limit);

      return {
        shopsData,
        isLoading: false,
        error: null
      };
    } catch (error) {
      this.logger.error('ShopsPresenter: Error getting paginated shops data', error);
      return {
        shopsData: {
          shops: [],
          stats: {
            totalShops: 0,
            activeShops: 0,
            pendingApproval: 0,
            newThisMonth: 0
          },
          totalCount: 0,
          currentPage: page,
          perPage: limit
        },
        isLoading: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      };
    }
  }

  /**
   * Get shop statistics without paginated data
   * @returns View model with only shop statistics
   */
  async getShopStatsViewModel(): Promise<ShopsViewModel> {
    try {
      this.logger.info('ShopsPresenter: Getting shop statistics');

      const shopsData = await this.backendShopsService.getShopStats();

      return {
        shopsData,
        isLoading: false,
        error: null
      };
    } catch (error) {
      this.logger.error('ShopsPresenter: Error getting shop statistics', error);
      return {
        shopsData: {
          shops: [],
          stats: {
            totalShops: 0,
            activeShops: 0,
            pendingApproval: 0,
            newThisMonth: 0
          },
          totalCount: 0,
          currentPage: 1,
          perPage: 10
        },
        isLoading: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      };
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
    const serverContainer = await getBackendContainer();
    const logger = serverContainer.resolve<Logger>('Logger');
    const backendShopsService = serverContainer.resolve<IBackendShopsService>('BackendShopsService');
    return new ShopsPresenter(backendShopsService, logger);
  }
}
