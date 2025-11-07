import { IAuthService } from "@/src/application/interfaces/auth-service.interface";
import { IProfileService } from "@/src/application/interfaces/profile-service.interface";
import type {
  CustomerPoints,
  CustomerPointsBackendService,
} from "@/src/application/services/shop/backend/customer-points-backend-service";
import type {
  CustomerPointsTransaction,
  CustomerPointsTransactionBackendService,
  CustomerPointsTransactionListResult,
  CustomerPointsTransactionFiltersInput,
} from "@/src/application/services/shop/backend/customer-points-transactions-backend-service";
import type {
  CustomerPointsFilters as ServiceCustomerPointsFilters,
  CustomerPointsSortByOption as ServiceCustomerPointsSortByOption,
  CustomerPointsSortOrder as ServiceCustomerPointsSortOrder,
} from "@/src/application/services/shop/backend/customer-points-backend-service";
import { IShopService } from "@/src/application/services/shop/ShopService";
import { ISubscriptionService } from "@/src/application/services/subscription/SubscriptionService";
import { getClientContainer } from "@/src/di/client-container";
import { getServerContainer } from "@/src/di/server-container";
import type { Logger } from "@/src/domain/interfaces/logger";
import { BaseShopBackendPresenter } from "./BaseShopBackendPresenter";

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

export type CustomerPointsFilters = ServiceCustomerPointsFilters;
export type CustomerPointsSortByOption = ServiceCustomerPointsSortByOption;
export type CustomerPointsSortOrder = ServiceCustomerPointsSortOrder;
export type CustomerPointTransactionItem = CustomerPointsTransaction;
export type CustomerPointTransactionFilters = CustomerPointsTransactionFiltersInput;

// Main Presenter class
export class CustomerPointsPresenter extends BaseShopBackendPresenter {
  constructor(
    logger: Logger,
    shopService: IShopService,
    authService: IAuthService,
    profileService: IProfileService,
    subscriptionService: ISubscriptionService,
    private readonly customerPointsBackendService: CustomerPointsBackendService,
    private readonly customerPointsTransactionBackendService: CustomerPointsTransactionBackendService
  ) {
    super(
      logger,
      shopService,
      authService,
      profileService,
      subscriptionService
    );
  }

  async getCustomerTransactions(
    shopId: string,
    customerId: string,
    params: {
      page: number;
      limit: number;
      filters?: CustomerPointsTransactionFiltersInput;
    }
  ): Promise<CustomerPointsTransactionListResult> {
    try {
      this.logger.info(
        "CustomerPointsPresenter: Fetching customer transactions",
        {
          shopId,
          customerId,
          params,
        }
      );

      return await this.customerPointsTransactionBackendService.getTransactionsByCustomer(
        shopId,
        customerId,
        { page: params.page, limit: params.limit },
        params.filters
      );
    } catch (error) {
      this.logger.error(
        "CustomerPointsPresenter: Error fetching customer transactions",
        error
      );
      throw error;
    }
  }

  async getViewModel(
    shopId: string,
    filters?: CustomerPointsFilters
  ): Promise<CustomerPointsViewModel> {
    try {
      this.logger.info("CustomerPointsPresenter: Getting view model", {
        shopId,
        filters,
      });

      // Get customer points data
      const customerPoints =
        await this.customerPointsBackendService.getCustomerPoints(
          shopId,
          filters
        );
      const stats = await this.customerPointsBackendService.getPointsStats(
        shopId
      );

      // Get top customers by current points
      const topCustomers = [...customerPoints]
        .sort((a, b) => b.currentPoints - a.currentPoints)
        .slice(0, 5);

      // Get recent activity (customers with recent updates)
      const recentActivity = [...customerPoints]
        .sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        )
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
      this.logger.error(
        "CustomerPointsPresenter: Error getting view model",
        error
      );
      throw error;
    }
  }

  async addPoints(
    shopId: string,
    customerId: string,
    points: number,
    description: string
  ): Promise<CustomerPoints> {
    try {
      this.logger.info("CustomerPointsPresenter: Adding points", {
        shopId,
        customerId,
        points,
      });
      return await this.customerPointsBackendService.addPoints(
        shopId,
        customerId,
        points,
        description
      );
    } catch (error) {
      this.logger.error("CustomerPointsPresenter: Error adding points", error);
      throw error;
    }
  }

  async redeemPoints(
    shopId: string,
    customerId: string,
    points: number,
    description: string
  ): Promise<CustomerPoints> {
    try {
      this.logger.info("CustomerPointsPresenter: Redeeming points", {
        shopId,
        customerId,
        points,
      });
      return await this.customerPointsBackendService.redeemPoints(
        shopId,
        customerId,
        points,
        description
      );
    } catch (error) {
      this.logger.error("CustomerPointsPresenter: Error redeeming points", error);
      throw error;
    }
  }

  // Metadata generation
  async generateMetadata(_shopId: string) {
    return this.generateShopMetadata(
      _shopId,
      "จัดการแต้มลูกค้า",
      "จัดการแต้มสะสมลูกค้า ระบบสมาชิก และสิทธิพิเศษ"
    );
  }
}

// Factory class
export class CustomerPointsPresenterFactory {
  static async createServer(): Promise<CustomerPointsPresenter> {
    const serverContainer = await getServerContainer();
    const logger = serverContainer.resolve<Logger>("Logger");
    const subscriptionService = serverContainer.resolve<ISubscriptionService>(
      "SubscriptionService"
    );
    const authService = serverContainer.resolve<IAuthService>("AuthService");
    const profileService =
      serverContainer.resolve<IProfileService>("ProfileService");
    const shopService = serverContainer.resolve<IShopService>("ShopService");
    const customerPointsBackendService =
      serverContainer.resolve<CustomerPointsBackendService>(
        "CustomerPointsBackendService"
      );
    const customerPointsTransactionBackendService =
      serverContainer.resolve<CustomerPointsTransactionBackendService>(
        "CustomerPointsTransactionBackendService"
      );
    return new CustomerPointsPresenter(
      logger,
      shopService,
      authService,
      profileService,
      subscriptionService,
      customerPointsBackendService,
      customerPointsTransactionBackendService
    );
  }

  static createClient(): CustomerPointsPresenter {
    const clientContainer = getClientContainer();
    const logger = clientContainer.resolve<Logger>("Logger");
    const customerPointsBackendService =
      clientContainer.resolve<CustomerPointsBackendService>(
        "CustomerPointsBackendService"
      );
    const shopService = clientContainer.resolve<IShopService>("ShopService");
    const authService = clientContainer.resolve<IAuthService>("AuthService");
    const profileService =
      clientContainer.resolve<IProfileService>("ProfileService");
    const subscriptionService = clientContainer.resolve<ISubscriptionService>(
      "SubscriptionService"
    );
    const customerPointsTransactionBackendService =
      clientContainer.resolve<CustomerPointsTransactionBackendService>(
        "CustomerPointsTransactionBackendService"
      );
    return new CustomerPointsPresenter(
      logger,
      shopService,
      authService,
      profileService,
      subscriptionService,
      customerPointsBackendService,
      customerPointsTransactionBackendService
    );
  }
}
