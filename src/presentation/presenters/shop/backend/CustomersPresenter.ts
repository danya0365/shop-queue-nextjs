import type { Customer, CustomersBackendService } from '@/src/application/services/shop/backend/customers-backend-service';
import { getServerContainer } from '@/src/di/server-container';
import type { Logger } from '@/src/domain/interfaces/logger';
import { BaseShopPresenter } from '../BaseShopPresenter';

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
export class CustomersPresenter extends BaseShopPresenter {
  constructor(
    logger: Logger,
    private readonly customersBackendService: CustomersBackendService,
  ) {
    super(logger);
  }

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
    return new CustomersPresenter(logger, customersBackendService);
  }
}
