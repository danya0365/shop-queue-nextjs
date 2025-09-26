import type { ShopsDataDTO } from '@/src/application/dtos/backend/shops-dto';
import type { IBackendShopsService } from '@/src/application/services/backend/BackendShopsService';
import { getServerContainer } from '@/src/di/server-container';
import { getClientContainer } from '@/src/di/client-container';
import type { Logger } from '@/src/domain/interfaces/logger';
import type { IAuthService } from '@/src/application/interfaces/auth-service.interface';
import type { IProfileService } from '@/src/application/interfaces/profile-service.interface';
import type { ISubscriptionService } from '@/src/application/services/subscription/SubscriptionService';
import { BaseSubscriptionPresenter } from '@/src/presentation/presenters/base/BaseSubscriptionPresenter';
import type { Metadata } from 'next';

// Define ViewModel interface
export interface ShopsDashboardViewModel {
  shopsData: ShopsDataDTO;
  isLoading: boolean;
  error: string | null;
}

// Main Presenter class
export class ShopsDashboardPresenter extends BaseSubscriptionPresenter {
  constructor(
    logger: Logger,
    authService: IAuthService,
    profileService: IProfileService,
    subscriptionService: ISubscriptionService,
    private readonly backendShopsService: IBackendShopsService
  ) {
    super(logger, authService, profileService, subscriptionService);
  }

  /**
   * Get view model for the page
   */
  async getViewModel(page: number = 1, limit: number = 10, searchQuery?: string): Promise<ShopsDashboardViewModel> {
    try {
      this.logger.info('ShopsDashboardPresenter: Getting view model', { page, limit, searchQuery });

      // Get user for authentication
      const user = await this.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      // Get data in parallel for better performance
      const shopsData = await this.backendShopsService.getShopsData(page, limit);

      return {
        shopsData,
        isLoading: false,
        error: null
      };
    } catch (error) {
      this.logger.error('ShopsDashboardPresenter: Error getting view model', { error });
      throw error;
    }
  }

  /**
   * Get paginated shops data without stats
   * @param page Page number
   * @param limit Items per page
   * @param searchQuery Search query for filtering shops
   * @returns View model with only paginated shops data
   */
  async getShopsPaginatedViewModel(page: number, limit: number, searchQuery?: string) {
    try {
      this.logger.info('ShopsDashboardPresenter: Getting paginated shops data', { page, limit, searchQuery });

      const shopsData = await this.backendShopsService.getShopsPaginated(page, limit);

      return {
        shops: shopsData.data,
        totalCount: shopsData.pagination.totalItems,
        currentPage: shopsData.pagination.currentPage,
        perPage: shopsData.pagination.itemsPerPage
      };
    } catch (error) {
      this.logger.error('ShopsDashboardPresenter: Error getting paginated shops data', error);
      return {
        shops: [],
        totalCount: 0,
        currentPage: page,
        perPage: limit
      };
    }
  }

  /**
   * Get shop statistics without paginated data
   * @returns View model with only shop statistics
   */
  async getShopStatsViewModel() {
    try {
      this.logger.info('ShopsDashboardPresenter: Getting shop statistics');

      const stats = await this.backendShopsService.getShopStats();

      return stats;
    } catch (error) {
      this.logger.error('ShopsDashboardPresenter: Error getting shop statistics', error);
      return {
        totalShops: 0,
        activeShops: 0,
        pendingApproval: 0,
        newThisMonth: 0
      };
    }
  }

  /**
   * Generate metadata for the page
   * @returns Metadata object
   */
  async getMetadata(): Promise<Metadata> {
    return {
      title: "รวมร้านค้า | Shop Queue",
      description: "ระบบจัดการคิวร้านค้าทั้งหมดใน Shop Queue",
      keywords: ["ร้านค้า", "คิว", "จัดการคิว", "Shop Queue"],
      openGraph: {
        title: "รวมร้านค้า | Shop Queue",
        description: "ระบบจัดการคิวร้านค้าทั้งหมดใน Shop Queue",
        type: "website",
      },
    };
  }
}

// Factory class
export class ShopsDashboardPresenterFactory {
  static async create(): Promise<ShopsDashboardPresenter> {
    const serverContainer = await getServerContainer();
    const logger = serverContainer.resolve<Logger>("Logger");
    const authService = serverContainer.resolve<IAuthService>("IAuthService");
    const profileService = serverContainer.resolve<IProfileService>("IProfileService");
    const subscriptionService = serverContainer.resolve<ISubscriptionService>("ISubscriptionService");
    const backendShopsService = serverContainer.resolve<IBackendShopsService>("IBackendShopsService");

    return new ShopsDashboardPresenter(logger, authService, profileService, subscriptionService, backendShopsService);
  }
}

// Client-side factory class
export class ClientShopsDashboardPresenterFactory {
  static async create(): Promise<ShopsDashboardPresenter> {
    const clientContainer = await getClientContainer();
    const logger = clientContainer.resolve<Logger>("Logger");
    const authService = clientContainer.resolve<IAuthService>("IAuthService");
    const profileService = clientContainer.resolve<IProfileService>("IProfileService");
    const subscriptionService = clientContainer.resolve<ISubscriptionService>("ISubscriptionService");
    const backendShopsService = clientContainer.resolve<IBackendShopsService>("IBackendShopsService");

    return new ShopsDashboardPresenter(logger, authService, profileService, subscriptionService, backendShopsService);
  }
}
