import { IAuthService } from '@/src/application/interfaces/auth-service.interface';
import { IProfileService } from '@/src/application/interfaces/profile-service.interface';
import type { CustomerPoints, CustomerPointsBackendService } from '@/src/application/services/shop/backend/customer-points-backend-service';
import { IShopService } from '@/src/application/services/shop/ShopService';
import { ISubscriptionService } from '@/src/application/services/subscription/SubscriptionService';
import { getServerContainer } from '@/src/di/server-container';
import type { Logger } from '@/src/domain/interfaces/logger';
import { BaseShopBackendPresenter } from './BaseShopBackendPresenter';

// Define ViewModel interface
export interface CustomerPointsViewModel {
  customerPoints: CustomerPoints[];
  totalCustomers: number;
  totalPointsIssued: number;
  totalPointsRedeemed: number;
  averagePointsPerCustomer: number;
  tierDistribution: Record<string, number>;
  topCustomers: CustomerPoints[];
  recentActivity: CustomerPoints[];
}

// Main Presenter class
export class CustomerPointsPresenter extends BaseShopBackendPresenter {

  constructor(
    logger: Logger,
    shopService: IShopService,
    authService: IAuthService,
    profileService: IProfileService,
    subscriptionService: ISubscriptionService,
    private readonly customerPointsBackendService: CustomerPointsBackendService,
  ) { super(logger, shopService, authService, profileService, subscriptionService); }

  async getViewModel(shopId: string): Promise<CustomerPointsViewModel> {
    try {
      this.logger.info('CustomerPointsPresenter: Getting view model', { shopId });

      // Get customer points data
      const customerPoints = await this.customerPointsBackendService.getCustomerPoints(shopId);
      const stats = await this.customerPointsBackendService.getPointsStats(shopId);

      // Get top customers by current points
      const topCustomers = [...customerPoints]
        .sort((a, b) => b.currentPoints - a.currentPoints)
        .slice(0, 5);

      // Get recent activity (customers with recent updates)
      const recentActivity = [...customerPoints]
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 10);

      return {
        customerPoints,
        totalCustomers: stats.totalCustomers,
        totalPointsIssued: stats.totalPointsIssued,
        totalPointsRedeemed: stats.totalPointsRedeemed,
        averagePointsPerCustomer: stats.averagePointsPerCustomer,
        tierDistribution: stats.tierDistribution,
        topCustomers,
        recentActivity,
      };
    } catch (error) {
      this.logger.error('CustomerPointsPresenter: Error getting view model', error);
      throw error;
    }
  }

  // Metadata generation
  async generateMetadata(_shopId: string) {
    return this.generateShopMetadata(_shopId, 'จัดการแต้มลูกค้า', 'จัดการแต้มสะสมลูกค้า ระบบสมาชิก และสิทธิพิเศษ');
  }
}

// Factory class
export class CustomerPointsPresenterFactory {
  static async create(): Promise<CustomerPointsPresenter> {
    const serverContainer = await getServerContainer();
    const logger = serverContainer.resolve<Logger>('Logger');
    const subscriptionService = serverContainer.resolve<ISubscriptionService>('SubscriptionService');
    const authService = serverContainer.resolve<IAuthService>('AuthService');
    const profileService = serverContainer.resolve<IProfileService>('ProfileService');
    const shopService = serverContainer.resolve<IShopService>('ShopService');
    const customerPointsBackendService = serverContainer.resolve<CustomerPointsBackendService>('CustomerPointsBackendService');
    return new CustomerPointsPresenter(logger, shopService, authService, profileService, subscriptionService, customerPointsBackendService);
  }
}
