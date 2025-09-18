import {
  SubscriptionLimits,
  UsageStatsDto,
} from "@/src/application/dtos/subscription-dto";
import { IAuthService } from "@/src/application/interfaces/auth-service.interface";
import type { RevenueStatsDTO } from "@/src/application/dtos/shop/backend/dashboard-stats-dto";
import { IProfileService } from "@/src/application/interfaces/profile-service.interface";
import type { IShopBackendDashboardService } from "@/src/application/services/shop/backend/BackendDashboardService";
import { IShopService } from "@/src/application/services/shop/ShopService";
import { ISubscriptionService } from "@/src/application/services/subscription/SubscriptionService";
import { getServerContainer } from "@/src/di/server-container";
import type { Logger } from "@/src/domain/interfaces/logger";
import { BaseShopBackendPresenter } from "./BaseShopBackendPresenter";

// Define interfaces for data structures
export interface QueueStats {
  waiting: number;
  confirmed: number;
  serving: number;
  completed: number;
  cancelled: number;
}

export interface EmployeeStats {
  total: number;
  online: number;
  serving: number;
}

export interface RecentActivity {
  id: string;
  type:
    | "queue_created"
    | "queue_served"
    | "payment_completed"
    | "employee_login";
  message: string;
  timestamp: string;
  icon: string;
}

// Define ViewModel interface
export interface BackendDashboardViewModel {
  queueStats: QueueStats;
  revenueStats: RevenueStatsDTO;
  employeeStats: EmployeeStats;
  recentActivities: RecentActivity[];
  shopName: string;
  currentTime: string;
  subscription: {
    limits: SubscriptionLimits;
    usage: UsageStatsDto;
    hasDataRetentionLimit: boolean;
    dataRetentionDays: number;
    isFreeTier: boolean;
  };
}

// Main Presenter class
export class BackendDashboardPresenter extends BaseShopBackendPresenter {
  private readonly dashboardService: IShopBackendDashboardService;

  constructor(
    logger: Logger,
    shopService: IShopService,
    authService: IAuthService,
    profileService: IProfileService,
    subscriptionService: ISubscriptionService,
    dashboardService: IShopBackendDashboardService
  ) {
    super(
      logger,
      shopService,
      authService,
      profileService,
      subscriptionService
    );
    this.dashboardService = dashboardService;
  }

  async getViewModel(shopId: string): Promise<BackendDashboardViewModel> {
    try {
      this.logger.info(
        "BackendDashboardPresenter: Getting view model for shop",
        { shopId }
      );

      const user = await this.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      const profile = await this.getActiveProfile(user);
      if (!profile) {
        throw new Error("Profile not found");
      }

      const subscriptionPlan = await this.getSubscriptionPlan(
        profile.id,
        profile.role
      );
      const limits = this.mapSubscriptionPlanToLimits(subscriptionPlan);
      const usage = await this.getUsageStats(profile.id);

      // Get data from dashboard service
      const [queueStats, revenueStats, employeeStats, shopName] =
        await Promise.all([
          this.dashboardService.getQueueStats(shopId),
          this.dashboardService.getRevenueStats(shopId),
          this.dashboardService.getEmployeeStats(shopId),
          this.dashboardService.getShopName(shopId),
        ]);

      // Note: recentActivities is not available in the current dashboard service
      // We'll use the mock data for now until the service is updated
      const recentActivities = this.getRecentActivities();

      return {
        queueStats,
        revenueStats,
        employeeStats,
        recentActivities,
        shopName,
        currentTime: new Date().toLocaleString("th-TH"),
        subscription: {
          limits,
          usage,
          hasDataRetentionLimit: false,
          dataRetentionDays: 365,
          isFreeTier: false,
        },
      };
    } catch (error) {
      this.logger.error(
        "BackendDashboardPresenter: Error getting view model",
        error
      );
      throw error;
    }
  }

  private getRecentActivities(): RecentActivity[] {
    return [
      {
        id: "1",
        type: "queue_created",
        message: "ลูกค้าใหม่เข้าคิว - คิวที่ A015",
        timestamp: "2 นาทีที่แล้ว",
        icon: "📝",
      },
      {
        id: "2",
        type: "payment_completed",
        message: "ชำระเงินเรียบร้อย - คิวที่ A012 (฿350)",
        timestamp: "5 นาทีที่แล้ว",
        icon: "💳",
      },
      {
        id: "3",
        type: "queue_served",
        message: "ให้บริการเสร็จสิ้น - คิวที่ A011",
        timestamp: "8 นาทีที่แล้ว",
        icon: "✅",
      },
      {
        id: "4",
        type: "employee_login",
        message: "พนักงาน สมชาย เข้าสู่ระบบ",
        timestamp: "15 นาทีที่แล้ว",
        icon: "👤",
      },
    ];
  }

  // Metadata generation
  async generateMetadata(shopId: string) {
    this.logger.info(
      "BackendDashboardPresenter: Generating metadata for shop",
      { shopId }
    );
    return this.generateShopMetadata(
      shopId,
      "แดชบอร์ดจัดการร้าน",
      "ระบบจัดการร้านค้าและติดตามสถิติการให้บริการแบบเรียลไทม์"
    );
  }
}

// Factory class
export class BackendDashboardPresenterFactory {
  static async create(): Promise<BackendDashboardPresenter> {
    const serverContainer = await getServerContainer();
    const logger = serverContainer.resolve<Logger>("Logger");
    const subscriptionService = serverContainer.resolve<ISubscriptionService>(
      "SubscriptionService"
    );
    const authService = serverContainer.resolve<IAuthService>("AuthService");
    const profileService =
      serverContainer.resolve<IProfileService>("ProfileService");
    const shopService = serverContainer.resolve<IShopService>("ShopService");
    const dashboardService =
      serverContainer.resolve<IShopBackendDashboardService>(
        "ShopBackendDashboardService"
      );
    return new BackendDashboardPresenter(
      logger,
      shopService,
      authService,
      profileService,
      subscriptionService,
      dashboardService
    );
  }
}

// Client-side Factory class
export class ClientBackendDashboardPresenterFactory {
  static async create(): Promise<BackendDashboardPresenter> {
    const { getClientContainer } = await import("@/src/di/client-container");
    const clientContainer = await getClientContainer();
    const logger = clientContainer.resolve<Logger>("Logger");
    const subscriptionService = clientContainer.resolve<ISubscriptionService>(
      "SubscriptionService"
    );
    const authService = clientContainer.resolve<IAuthService>("AuthService");
    const profileService =
      clientContainer.resolve<IProfileService>("ProfileService");
    const shopService = clientContainer.resolve<IShopService>("ShopService");
    const dashboardService =
      clientContainer.resolve<IShopBackendDashboardService>(
        "ShopBackendDashboardService"
      );
    return new BackendDashboardPresenter(
      logger,
      shopService,
      authService,
      profileService,
      subscriptionService,
      dashboardService
    );
  }
}
