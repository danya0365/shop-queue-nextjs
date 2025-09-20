import { ShopService } from "@/src/application/services/shop/ShopService";
import { ShopCustomerDashboardService } from "@/src/application/services/shop/customer/ShopCustomerDashboardService";
import { getServerContainer } from "@/src/di/server-container";
import type { Logger } from "@/src/domain/interfaces/logger";
import {
  BaseShopPresenter,
  ShopInfo,
} from "@/src/presentation/presenters/shop/BaseShopPresenter";

export interface QueueStatusStats {
  currentNumber: string;
  totalWaiting: number;
  estimatedWaitTime: number;
  averageServiceTime: number;
}

export interface PopularService {
  id: string;
  name: string;
  price: number;
  description: string;
  estimatedTime: number;
  icon: string;
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  discount: number;
  validUntil: string;
  icon: string;
}

// Define ViewModel interface
export interface CustomerDashboardViewModel {
  shopInfo: ShopInfo;
  queueStatus: QueueStatusStats;
  popularServices: PopularService[];
  promotions: Promotion[];
  canJoinQueue: boolean;
  announcement: string | null;
}

// Main Presenter class
export class CustomerDashboardPresenter extends BaseShopPresenter {
  constructor(
    logger: Logger,
    shopService: ShopService,
    private readonly shopCustomerDashboardService: ShopCustomerDashboardService
  ) {
    super(logger, shopService);
  }

  async getViewModel(shopId: string): Promise<CustomerDashboardViewModel> {
    try {
      // Get shop info and dashboard data in parallel
      const [shopInfo, dashboardData] = await Promise.all([
        this.getShopInfo(shopId),
        this.shopCustomerDashboardService.getCustomerDashboard(shopId),
      ]);

      return {
        shopInfo,
        queueStatus: dashboardData.queueStatus,
        popularServices: dashboardData.popularServices,
        promotions: dashboardData.promotions,
        canJoinQueue: dashboardData.canJoinQueue,
        announcement: dashboardData.announcement,
      };
    } catch (error) {
      this.logger.error(
        "CustomerDashboardPresenter: Error getting view model",
        error
      );
      throw error;
    }
  }


  // Metadata generation
  async generateMetadata(shopId: string) {
    return this.generateShopMetadata(
      shopId,
      "หน้าร้าน",
      "เข้าคิวออนไลน์ ติดตามสถานะคิว และรับโปรโมชันพิเศษ"
    );
  }
}

// Factory class
export class CustomerDashboardPresenterFactory {
  static async create(): Promise<CustomerDashboardPresenter> {
    const serverContainer = await getServerContainer();
    const logger = serverContainer.resolve<Logger>("Logger");
    const shopService = serverContainer.resolve<ShopService>("ShopService");
    const shopCustomerDashboardService = serverContainer.resolve<ShopCustomerDashboardService>("ShopCustomerDashboardService");
    return new CustomerDashboardPresenter(logger, shopService, shopCustomerDashboardService);
  }
}

// Client-side Factory class
export class ClientCustomerDashboardPresenterFactory {
  static async create(): Promise<CustomerDashboardPresenter> {
    const { getClientContainer } = await import("@/src/di/client-container");
    const clientContainer = await getClientContainer();
    const logger = clientContainer.resolve<Logger>("Logger");
    const shopService = clientContainer.resolve<ShopService>("ShopService");
    const shopCustomerDashboardService = clientContainer.resolve<ShopCustomerDashboardService>("ShopCustomerDashboardService");
    return new CustomerDashboardPresenter(logger, shopService, shopCustomerDashboardService);
  }
}
