import type { ShopsDataDTO } from '@/src/application/dtos/shop/backend/shops-dto';
import type { IShopBackendShopsService } from '@/src/application/services/shop/backend/BackendShopsService';
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
    private readonly shopBackendShopsService: IShopBackendShopsService,
    private readonly logger: Logger
  ) { }

  async getViewModel(page: number = 1, limit: number = 10): Promise<ShopsViewModel> {
    try {
      this.logger.info('ShopsPresenter: Getting view model', { page, limit });

      // Get both paginated data and stats in parallel for better performance
      const shopsData = await this.shopBackendShopsService.getShopsData(page, limit);

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

  async getShopsPaginated(page: number = 1, limit: number = 10) {
    try {
      this.logger.info('ShopsPresenter: Getting paginated shops', { page, limit });
      return await this.shopBackendShopsService.getShopsPaginated(page, limit);
    } catch (error) {
      this.logger.error('ShopsPresenter: Error getting paginated shops', error);
      throw error;
    }
  }

  async getShopById(id: string) {
    try {
      this.logger.info('ShopsPresenter: Getting shop by ID', { id });
      return await this.shopBackendShopsService.getShopById(id);
    } catch (error) {
      this.logger.error('ShopsPresenter: Error getting shop by ID', { error, id });
      throw error;
    }
  }

  async createShop(params: any) {
    try {
      this.logger.info('ShopsPresenter: Creating shop', { params });
      return await this.shopBackendShopsService.createShop(params);
    } catch (error) {
      this.logger.error('ShopsPresenter: Error creating shop', { error, params });
      throw error;
    }
  }

  async updateShop(params: any) {
    try {
      this.logger.info('ShopsPresenter: Updating shop', { params });
      return await this.shopBackendShopsService.updateShop(params);
    } catch (error) {
      this.logger.error('ShopsPresenter: Error updating shop', { error, params });
      throw error;
    }
  }

  async deleteShop(id: string) {
    try {
      this.logger.info('ShopsPresenter: Deleting shop', { id });
      return await this.shopBackendShopsService.deleteShop(id);
    } catch (error) {
      this.logger.error('ShopsPresenter: Error deleting shop', { error, id });
      throw error;
    }
  }
}

// Factory class
export class ShopsPresenterFactory {
  static async create(): Promise<ShopsPresenter> {
    const container = await getBackendContainer();
    const shopBackendShopsService = container.resolve<IShopBackendShopsService>('ShopBackendShopsService');
    const logger = container.resolve<Logger>('Logger');
    return new ShopsPresenter(shopBackendShopsService, logger);
  }
}
