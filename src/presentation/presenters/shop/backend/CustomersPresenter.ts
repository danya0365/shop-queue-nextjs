import { IAuthService } from '@/src/application/interfaces/auth-service.interface';
import { IProfileService } from '@/src/application/interfaces/profile-service.interface';
import type { Customer, CustomersBackendService } from '@/src/application/services/shop/backend/customers-backend-service';
import { IShopService } from '@/src/application/services/shop/ShopService';
import { ISubscriptionService } from '@/src/application/services/subscription/SubscriptionService';
import { getServerContainer } from '@/src/di/server-container';
import type { Logger } from '@/src/domain/interfaces/logger';
import { BaseShopBackendPresenter } from './BaseShopBackendPresenter';

// Define ViewModel interface
export interface CustomersViewModel {
  customers: Customer[];
  totalCustomers: number;
  registeredCustomers: number;
  guestCustomers: number;
  totalRevenue: number;
  averageSpent: number;
}

// Main Presenter class
export class CustomersPresenter extends BaseShopBackendPresenter {
  constructor(
    logger: Logger,
    shopService: IShopService,
    authService: IAuthService,
    profileService: IProfileService,
    subscriptionService: ISubscriptionService,
    private readonly customersBackendService: CustomersBackendService,
  ) { super(logger, shopService, authService, profileService, subscriptionService); }

  async getViewModel(shopId: string): Promise<CustomersViewModel> {
    try {
      this.logger.info('CustomersPresenter: Getting view model', { shopId });

      // Get customers data
      const customers = await this.customersBackendService.getCustomers(shopId);

      // Calculate statistics
      const totalCustomers = customers.length;
      const registeredCustomers = customers.filter(customer => customer.profileId !== null).length;
      const guestCustomers = totalCustomers - registeredCustomers;
      const totalRevenue = customers.reduce((sum, customer) => sum + (customer.totalSpent || 0), 0);
      const averageSpent = totalCustomers > 0 ? totalRevenue / totalCustomers : 0;

      return {
        customers,
        totalCustomers,
        registeredCustomers,
        guestCustomers,
        totalRevenue,
        averageSpent,
      };
    } catch (error) {
      this.logger.error('CustomersPresenter: Error getting view model', error);
      throw error;
    }
  }

  // Metadata generation
  async generateMetadata(shopId: string) {
    return this.generateShopMetadata(shopId, 'จัดการลูกค้า', 'จัดการข้อมูลลูกค้า ดูประวัติการใช้บริการ และจัดการโปรแกรมสมาชิก');
  }
}

// Factory class
export class CustomersPresenterFactory {
  static async create(): Promise<CustomersPresenter> {
    const serverContainer = await getServerContainer();
    const logger = serverContainer.resolve<Logger>('Logger');
    const customersBackendService = serverContainer.resolve<CustomersBackendService>('CustomersBackendService');
    const shopService = serverContainer.resolve<IShopService>('ShopService');
    const authService = serverContainer.resolve<IAuthService>('AuthService');
    const profileService = serverContainer.resolve<IProfileService>('ProfileService');
    const subscriptionService = serverContainer.resolve<ISubscriptionService>('SubscriptionService');
    return new CustomersPresenter(logger, shopService, authService, profileService, subscriptionService, customersBackendService);
  }
}

// Client-side Factory class
export class ClientCustomersPresenterFactory {
  static async create(): Promise<CustomersPresenter> {
    const { getClientContainer } = await import('@/src/di/client-container');
    const clientContainer = await getClientContainer();
    const logger = clientContainer.resolve<Logger>('Logger');
    const customersBackendService = clientContainer.resolve<CustomersBackendService>('CustomersBackendService');
    const shopService = clientContainer.resolve<IShopService>('ShopService');
    const authService = clientContainer.resolve<IAuthService>('AuthService');
    const profileService = clientContainer.resolve<IProfileService>('ProfileService');
    const subscriptionService = clientContainer.resolve<ISubscriptionService>('SubscriptionService');
    return new CustomersPresenter(logger, shopService, authService, profileService, subscriptionService, customersBackendService);
  }
}
