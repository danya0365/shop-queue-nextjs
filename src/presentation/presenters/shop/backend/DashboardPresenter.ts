import {
  SubscriptionLimits,
  UsageStatsDto,
} from "@/src/application/dtos/subscription-dto";
import type { RecentActivityDTO } from "@/src/application/dtos/shop/backend/dashboard-stats-dto";
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
      const [queueStats, revenueStats, employeeStats, shopName, recentActivities] =
        await Promise.all([
          this.dashboardService.getQueueStats(shopId),
          this.dashboardService.getRevenueStats(shopId),
          this.dashboardService.getEmployeeStats(shopId),
          this.dashboardService.getShopName(shopId),
          this.dashboardService.getRecentActivities(shopId),
        ]);

      // Map DTOs to ViewModel format
      const mappedRecentActivities = this.mapRecentActivities(recentActivities);

      return {
        queueStats,
        revenueStats,
        employeeStats,
        recentActivities: mappedRecentActivities,
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

  private mapRecentActivities(activities: RecentActivityDTO[]): RecentActivity[] {
    return activities.map((activity) => {
      // Map activity type to appropriate icon
      const iconMap: Record<string, string> = {
        queue_created: "📝",
        queue_served: "✅",
        payment_completed: "💳",
        employee_login: "👤",
        queue_cancelled: "❌",
        customer_joined: "👥",
        service_completed: "🎯",
      };

      // Format timestamp to Thai relative time
      const formatTimestamp = (createdAt: string): string => {
        const now = new Date();
        const created = new Date(createdAt);
        const diffMs = now.getTime() - created.getTime();
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffMinutes < 1) return "เมื่อสักครู่";
        if (diffMinutes < 60) return `${diffMinutes} นาทีที่แล้ว`;
        if (diffHours < 24) return `${diffHours} ชั่วโมงที่แล้ว`;
        return `${diffDays} วันที่แล้ว`;
      };

      // Combine title and description into message
      const message = activity.description
        ? `${activity.title}: ${activity.description}`
        : activity.title;

      return {
        id: activity.id,
        type: activity.type as RecentActivity["type"], // Cast to match the expected type
        message,
        timestamp: formatTimestamp(activity.createdAt),
        icon: iconMap[activity.type] || "📋",
      };
    });
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
