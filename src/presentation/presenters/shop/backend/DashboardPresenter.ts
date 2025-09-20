import type {
  RecentActivityDTO,
  RevenueStatsDTO,
} from "@/src/application/dtos/shop/backend/dashboard-stats-dto";
import {
  SubscriptionLimits,
  UsageStatsDto,
} from "@/src/application/dtos/subscription-dto";
import { IAuthService } from "@/src/application/interfaces/auth-service.interface";
import { IProfileService } from "@/src/application/interfaces/profile-service.interface";
import type { IShopBackendDashboardService } from "@/src/application/services/shop/backend/BackendDashboardService";
import { IShopService } from "@/src/application/services/shop/ShopService";
import {
  ShopSetupProgress,
  ShopSetupProgressService,
} from "@/src/application/services/shop/ShopSetupProgressService";
import { ISubscriptionService } from "@/src/application/services/subscription/SubscriptionService";
import { getServerContainer } from "@/src/di/server-container";
import { ActivityType } from "@/src/domain/entities/backend/backend-dashboard.entity";
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
  type: RecentActivityDTO["type"];
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
  setupProgress: ShopSetupProgress;
  isQueueReady: boolean;
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
  private readonly setupProgressService: ShopSetupProgressService;

  constructor(
    logger: Logger,
    shopService: IShopService,
    authService: IAuthService,
    profileService: IProfileService,
    subscriptionService: ISubscriptionService,
    dashboardService: IShopBackendDashboardService,
    setupProgressService: ShopSetupProgressService
  ) {
    super(
      logger,
      shopService,
      authService,
      profileService,
      subscriptionService
    );
    this.dashboardService = dashboardService;
    this.setupProgressService = setupProgressService;
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

      // Get data from dashboard service and setup progress
      const [
        queueStats,
        revenueStats,
        employeeStats,
        shopName,
        recentActivities,
        setupProgress,
        isQueueReady,
      ] = await Promise.all([
        this.dashboardService.getQueueStats(shopId),
        this.dashboardService.getRevenueStats(shopId),
        this.dashboardService.getEmployeeStats(shopId),
        this.dashboardService.getShopName(shopId),
        this.dashboardService.getRecentActivities(shopId),
        this.setupProgressService.getShopSetupProgress(shopId),
        this.setupProgressService.isShopQueueReady(shopId),
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
        setupProgress,
        isQueueReady,
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

  private mapRecentActivities(
    activities: RecentActivityDTO[]
  ): RecentActivity[] {
    const mapActivityTypeToIcon = (type: ActivityType): string => {
      switch (type) {
        // Queue activities
        case ActivityType.QUEUE_CREATED:
          return "📝";
        case ActivityType.QUEUE_COMPLETED:
          return "✅";
          
        // Customer activities
        case ActivityType.CUSTOMER_REGISTERED:
          return "👥";
          
        // Shop activities
        case ActivityType.SHOP_CREATED:
          return "🏪";
        case ActivityType.SHOP_OPENED:
          return "🔓";
        case ActivityType.SHOP_CLOSED:
          return "🔒";
          
        // Employee activities
        case ActivityType.EMPLOYEE_ADDED:
          return "👤";
        case ActivityType.EMPLOYEE_UPDATED:
          return "✏️";
        case ActivityType.EMPLOYEE_REMOVED:
          return "❌";
        case ActivityType.EMPLOYEE_LOGIN:
          return "🔑";
        case ActivityType.EMPLOYEE_LOGOUT:
          return "🚪";
        case ActivityType.EMPLOYEE_DUTY_START:
          return "⏰";
        case ActivityType.EMPLOYEE_DUTY_END:
          return "🏁";
          
        // Service activities
        case ActivityType.SERVICE_ADDED:
          return "🎯";
        case ActivityType.SERVICE_UPDATED:
          return "🔄";
        case ActivityType.SERVICE_REMOVED:
          return "🗑️";
        case ActivityType.SERVICE_AVAILABILITY_CHANGED:
          return "🔔";
          
        // Payment activities
        case ActivityType.PAYMENT_CREATED:
          return "💳";
        case ActivityType.PAYMENT_COMPLETED:
          return "✅";
        case ActivityType.PAYMENT_FAILED:
          return "❌";
        case ActivityType.PAYMENT_REFUNDED:
          return "💰";
          
        // Promotion activities
        case ActivityType.PROMOTION_CREATED:
          return "🏷️";
        case ActivityType.PROMOTION_UPDATED:
          return "✏️";
        case ActivityType.PROMOTION_ACTIVATED:
          return "✅";
        case ActivityType.PROMOTION_DEACTIVATED:
          return "⏸️";
        case ActivityType.PROMOTION_USED:
          return "🎁";
          
        // Points and rewards activities
        case ActivityType.POINTS_EARNED:
          return "⭐";
        case ActivityType.POINTS_REDEEMED:
          return "🎯";
        case ActivityType.POINTS_EXPIRED:
          return "⏰";
        case ActivityType.REWARD_CLAIMED:
          return "🎁";
        case ActivityType.MEMBERSHIP_UPGRADED:
          return "⬆️";
          
        // Department activities
        case ActivityType.DEPARTMENT_CREATED:
          return "🏢";
        case ActivityType.DEPARTMENT_UPDATED:
          return "✏️";
        case ActivityType.DEPARTMENT_REMOVED:
          return "🗑️";
          
        // System activities
        case ActivityType.SYSTEM_BACKUP:
          return "💾";
        case ActivityType.SYSTEM_MAINTENANCE:
          return "🔧";
        case ActivityType.SYSTEM_ERROR:
          return "⚠️";
        case ActivityType.SYSTEM_ALERT:
          return "📢";
          
        // Settings activities
        case ActivityType.OPENING_HOURS_UPDATED:
          return "🕐";
          
        default:
          return "📋";
      }
    };
    return activities.map((activity) => {
      // Map activity type to appropriate icon
      const icon = mapActivityTypeToIcon(activity.type);

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
        type: activity.type,
        message,
        timestamp: formatTimestamp(activity.createdAt),
        icon,
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

    const setupProgressService =
      serverContainer.resolve<ShopSetupProgressService>(
        "ShopSetupProgressService"
      );

    return new BackendDashboardPresenter(
      logger,
      shopService,
      authService,
      profileService,
      subscriptionService,
      dashboardService,
      setupProgressService
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
    const setupProgressService =
      clientContainer.resolve<ShopSetupProgressService>(
        "ShopSetupProgressService"
      );

    return new BackendDashboardPresenter(
      logger,
      shopService,
      authService,
      profileService,
      subscriptionService,
      dashboardService,
      setupProgressService
    );
  }
}
