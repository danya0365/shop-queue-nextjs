import { IAuthService } from '@/src/application/interfaces/auth-service.interface';
import { IProfileService } from '@/src/application/interfaces/profile-service.interface';
import { IShopBackendCustomersService } from '@/src/application/services/shop/backend/BackendCustomersService';
import { IShopService } from '@/src/application/services/shop/ShopService';
import { ISubscriptionService } from '@/src/application/services/subscription/SubscriptionService';
import { getServerContainer } from '@/src/di/server-container';
import type { Logger } from '@/src/domain/interfaces/logger';
import { BaseShopBackendPresenter } from './BaseShopBackendPresenter';
import type { CustomerDTO } from '@/src/application/dtos/shop/backend/customers-dto';

// Define ViewModel interface for customer selection
export interface CustomerSelectionViewModel {
  customers: CustomerDTO[];
  totalCount: number;
  currentPage: number;
  perPage: number;
}

// Main Presenter class for customer selection
export class CustomerSelectionPresenter extends BaseShopBackendPresenter {
  constructor(
    logger: Logger,
    shopService: IShopService,
    authService: IAuthService,
    profileService: IProfileService,
    subscriptionService: ISubscriptionService,
    private readonly customersService: IShopBackendCustomersService,
  ) { super(logger, shopService, authService, profileService, subscriptionService); }

  async getViewModel(
    shopId: string,
    page: number = 1,
    perPage: number = 100,
    filters?: {
      searchQuery?: string;
      membershipTierFilter?: string;
      isActiveFilter?: boolean;
      minTotalPoints?: number;
      maxTotalPoints?: number;
      minTotalQueues?: number;
      maxTotalQueues?: number;
    }
  ): Promise<CustomerSelectionViewModel> {
    try {
      this.logger.info('CustomerSelectionPresenter: Getting view model', { shopId, page, perPage, filters });

      // Get customers data with filters
      const customersData = await this.customersService.getCustomersData(
        page,
        perPage,
        undefined, // searchTerm
        undefined, // sortBy
        undefined, // sortOrder
        filters
      );

      return {
        customers: customersData.customers,
        totalCount: customersData.totalCount,
        currentPage: customersData.currentPage,
        perPage: customersData.perPage,
      };
    } catch (error) {
      this.logger.error('CustomerSelectionPresenter: Error getting view model', error);
      throw error;
    }
  }

  async createCustomer(customerData: {
    name: string;
    phone?: string;
    email?: string;
    dateOfBirth?: string;
    gender?: 'male' | 'female' | 'other';
    address?: string;
    notes?: string;
  }): Promise<CustomerDTO> {
    try {
      this.logger.info('CustomerSelectionPresenter: Creating customer', { name: customerData.name });

      const customer = await this.customersService.createCustomer(customerData);

      return customer;
    } catch (error) {
      this.logger.error('CustomerSelectionPresenter: Error creating customer', error);
      throw error;
    }
  }
}

// Factory class
export class CustomerSelectionPresenterFactory {
  static async create(): Promise<CustomerSelectionPresenter> {
    const serverContainer = await getServerContainer();
    const logger = serverContainer.resolve<Logger>('Logger');
    const customersService = serverContainer.resolve<IShopBackendCustomersService>('ShopBackendCustomersService');
    const shopService = serverContainer.resolve<IShopService>('ShopService');
    const authService = serverContainer.resolve<IAuthService>('AuthService');
    const profileService = serverContainer.resolve<IProfileService>('ProfileService');
    const subscriptionService = serverContainer.resolve<ISubscriptionService>('SubscriptionService');
    return new CustomerSelectionPresenter(logger, shopService, authService, profileService, subscriptionService, customersService);
  }
}

// Client-side Factory class
export class ClientCustomerSelectionPresenterFactory {
  static async create(): Promise<CustomerSelectionPresenter> {
    const { getClientContainer } = await import('@/src/di/client-container');
    const clientContainer = await getClientContainer();
    const logger = clientContainer.resolve<Logger>('Logger');
    const customersService = clientContainer.resolve<IShopBackendCustomersService>('ShopBackendCustomersService');
    const shopService = clientContainer.resolve<IShopService>('ShopService');
    const authService = clientContainer.resolve<IAuthService>('AuthService');
    const profileService = clientContainer.resolve<IProfileService>('ProfileService');
    const subscriptionService = clientContainer.resolve<ISubscriptionService>('SubscriptionService');
    return new CustomerSelectionPresenter(logger, shopService, authService, profileService, subscriptionService, customersService);
  }
}
