import type { Metadata } from "next";

import { AuthUserDto } from "@/src/application/dtos/auth-dto";
import { ProfileDto } from "@/src/application/dtos/profile-dto";
import { ShopDTO } from "@/src/application/dtos/shop/backend/shops-dto";
import {
  SubscriptionLimits,
  SubscriptionTier,
  UsageStatsDto,
} from "@/src/application/dtos/subscription-dto";
import { CurrentUsageStatsDTO } from "@/src/application/dtos/subscription/subscription-dto";
import type { IAuthService } from "@/src/application/interfaces/auth-service.interface";
import type { IProfileService } from "@/src/application/interfaces/profile-service.interface";
import type { IGlobalDashboardService } from "@/src/application/services/dashboard/GlobalDashboardService";
import type { IShopService } from "@/src/application/services/shop/ShopService";
import type { ISubscriptionService } from "@/src/application/services/subscription/SubscriptionService";
import { getClientContainer } from "@/src/di/client-container";
import { getServerContainer } from "@/src/di/server-container";
import type { Logger } from "@/src/domain/interfaces/logger";
import { BaseSubscriptionPresenter } from "@/src/presentation/presenters/base/BaseSubscriptionPresenter";

export interface ShopMerchantDashboardStats {
  totalShops: number;
  activeQueues: number;
  todayRevenue: number;
  servedToday: number;
  pendingQueues: number;
  averageWaitTime: number;
  activeQueuesChange?: string;
  activeQueuesChangeType?: "increase" | "decrease" | "neutral";
  revenueChange?: string;
  revenueChangeType?: "increase" | "decrease" | "neutral";
  servedChange?: string;
  servedChangeType?: "increase" | "decrease" | "neutral";
  waitTimeChange?: string;
  waitTimeChangeType?: "increase" | "decrease" | "neutral";
}

export interface ShopMerchantRecentActivity {
  id: string;
  type: "queue_created" | "queue_served" | "payment_received";
  message: string;
  timestamp: string;
  amount?: number;
}

export interface ShopMerchantDashboardViewModel {
  user: AuthUserDto | null;
  profile: ProfileDto | null;
  stats: ShopMerchantDashboardStats;
  recentActivity: ShopMerchantRecentActivity[];
  hasShops: boolean;
  shops: ShopDTO[];
  subscription: {
    tier: SubscriptionTier;
    limits: SubscriptionLimits;
    usage: UsageStatsDto;
    canCreateShop: boolean;
  };
}

export class ShopMerchantDashboardPresenter extends BaseSubscriptionPresenter {
  constructor(
    logger: Logger,
    authService: IAuthService,
    profileService: IProfileService,
    private readonly shopService: IShopService,
    subscriptionService: ISubscriptionService,
    private readonly globalDashboardService: IGlobalDashboardService
  ) {
    super(logger, authService, profileService, subscriptionService);
  }

  async getViewModel(): Promise<ShopMerchantDashboardViewModel> {
    try {
      const user = await this.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      const profile = await this.getActiveProfile(user);
      if (!profile) {
        throw new Error("Profile not found");
      }

      const shops = await this.shopService.getShopsByOwnerId(profile.id);
      const hasShops = shops.length > 0;

      const globalData =
        await this.globalDashboardService.getGlobalDashboardData(
          profile.id,
          10
        );

      const stats = this.mapGlobalStatsToDashboardStats(globalData.stats);
      const recentActivity = this.mapGlobalActivitiesToRecentActivities(
        globalData.recentActivities
      );

      const subscriptionPlan = await this.getSubscriptionPlan(
        profile.id,
        profile.role
      );
      const limits = this.mapSubscriptionPlanToLimits(subscriptionPlan);
      const usage = await this.getUsageStats(profile.id);
      const canCreateShop =
        limits.maxShops === null || shops.length < limits.maxShops;

      return {
        user,
        profile,
        stats,
        recentActivity,
        hasShops,
        shops,
        subscription: {
          tier: subscriptionPlan.tier,
          limits,
          usage,
          canCreateShop,
        },
      };
    } catch (error) {
      this.logger.error(
        "ShopMerchantDashboardPresenter: getViewModel failed",
        error
      );
      throw error;
    }
  }

  async generateMetadata(): Promise<Metadata> {
    try {
      const user = await this.getUser();
      if (!user) {
        return this.getDefaultMetadata();
      }

      const profile = await this.getActiveProfile(user);
      const profileName = profile?.name || profile?.username || "ผู้ประกอบการ";

      return {
        title: `แดชบอร์ดร้านค้า | Shop Queue`,
        description: `สรุปภาพรวมการดำเนินงานและคิวทั้งหมดของ ${profileName}`,
      };
    } catch (error) {
      this.logger.error(
        "ShopMerchantDashboardPresenter: generateMetadata failed",
        error
      );
      return this.getDefaultMetadata();
    }
  }

  private mapGlobalStatsToDashboardStats(globalStats: {
    totalShops: number;
    activeQueues: number;
    todayRevenue: number;
    servedToday: number;
    pendingQueues: number;
    averageWaitTime: number;
    revenueChange: number;
    revenueChangeType: "increase" | "decrease" | "stable";
    servedChange: number;
    servedChangeType: "increase" | "decrease" | "stable";
    waitTimeChange: number;
    waitTimeChangeType: "increase" | "decrease" | "stable";
  }): ShopMerchantDashboardStats {
    return {
      totalShops: globalStats.totalShops,
      activeQueues: globalStats.activeQueues,
      todayRevenue: globalStats.todayRevenue,
      servedToday: globalStats.servedToday,
      pendingQueues: globalStats.pendingQueues,
      averageWaitTime: globalStats.averageWaitTime,
      revenueChange: this.formatChangePercentage(globalStats.revenueChange),
      revenueChangeType: this.mapChangeType(globalStats.revenueChangeType),
      servedChange: this.formatChangeNumber(globalStats.servedChange),
      servedChangeType: this.mapChangeType(globalStats.servedChangeType),
      waitTimeChange: this.formatChangeMinutes(globalStats.waitTimeChange),
      waitTimeChangeType: this.mapChangeType(globalStats.waitTimeChangeType),
    };
  }

  private mapGlobalActivitiesToRecentActivities(
    globalActivities: Array<{
      id: string;
      shopId: string;
      shopName: string;
      type: string;
      title: string;
      description: string | null;
      createdAt: string;
    }>
  ): ShopMerchantRecentActivity[] {
    return globalActivities.map((activity) => {
      const type = this.mapActivityType(activity.type);
      const message = activity.description
        ? `${activity.title} - ${activity.shopName}: ${activity.description}`
        : `${activity.title} - ${activity.shopName}`;

      const timestamp = this.formatRelativeTime(activity.createdAt);

      return {
        id: activity.id,
        type,
        message,
        timestamp,
      };
    });
  }

  private mapActivityType(
    type: string
  ): "queue_created" | "queue_served" | "payment_received" {
    switch (type) {
      case "queue_completed":
        return "queue_served";
      case "payment_received":
        return "payment_received";
      default:
        return "queue_created";
    }
  }

  private mapChangeType(
    type: "increase" | "decrease" | "stable"
  ): "increase" | "decrease" | "neutral" {
    return type === "stable" ? "neutral" : type;
  }

  private formatChangePercentage(change: number): string {
    const sign = change > 0 ? "+" : "";
    return `${sign}${change.toFixed(1)}%`;
  }

  private formatChangeNumber(change: number): string {
    const sign = change > 0 ? "+" : "";
    return `${sign}${Math.round(change)} จากเมื่อวาน`;
  }

  private formatChangeMinutes(change: number): string {
    const sign = change > 0 ? "+" : "";
    return `${sign}${Math.round(change)} นาที`;
  }

  private formatRelativeTime(createdAt: string): string {
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
  }

  private async getUsageStats(profileId: string): Promise<UsageStatsDto> {
    try {
      const currentUsage = await this.subscriptionService.getCurrentUsageStats(
        profileId
      );
      return this.mapCurrentUsageToUsageStats(currentUsage);
    } catch (error) {
      this.logger.error(
        "ShopMerchantDashboardPresenter: getUsageStats failed",
        error
      );
      return {
        profileId,
        shopId: undefined,
        currentShops: 0,
        todayQueues: 0,
        currentStaff: 0,
        monthlySmsSent: 0,
        activePromotions: 0,
        usedPosterDesigns: 0,
        paidPosterDesigns: 0,
        totalPosters: 0,
        dataRetentionMonths: 12,
      };
    }
  }

  private mapCurrentUsageToUsageStats(
    currentUsage: CurrentUsageStatsDTO
  ): UsageStatsDto {
    return {
      profileId: currentUsage.profileId,
      shopId: currentUsage.shopId,
      currentShops: currentUsage.currentShops,
      todayQueues: currentUsage.todayQueues,
      currentStaff: currentUsage.currentStaff,
      monthlySmsSent: currentUsage.monthlySmsSent,
      activePromotions: currentUsage.activePromotions,
      usedPosterDesigns: 0,
      paidPosterDesigns: 0,
      totalPosters: 0,
      dataRetentionMonths: 12,
    };
  }

  private getDefaultMetadata(): Metadata {
    return {
      title: "แดชบอร์ดร้านค้า | Shop Queue",
      description: "ภาพรวมการจัดการร้านค้าและระบบคิวของคุณ",
    };
  }
}

export class ShopMerchantDashboardPresenterFactory {
  static async create(): Promise<ShopMerchantDashboardPresenter> {
    const serverContainer = await getServerContainer();
    const logger = serverContainer.resolve<Logger>("Logger");
    const authService = serverContainer.resolve<IAuthService>("AuthService");
    const profileService =
      serverContainer.resolve<IProfileService>("ProfileService");
    const shopService = serverContainer.resolve<IShopService>("ShopService");
    const subscriptionService = serverContainer.resolve<ISubscriptionService>(
      "SubscriptionService"
    );
    const globalDashboardService =
      serverContainer.resolve<IGlobalDashboardService>(
        "GlobalDashboardService"
      );

    return new ShopMerchantDashboardPresenter(
      logger,
      authService,
      profileService,
      shopService,
      subscriptionService,
      globalDashboardService
    );
  }
}

export class ClientShopMerchantDashboardPresenterFactory {
  static create(): ShopMerchantDashboardPresenter {
    const clientContainer = getClientContainer();
    const logger = clientContainer.resolve<Logger>("Logger");
    const authService = clientContainer.resolve<IAuthService>("AuthService");
    const profileService =
      clientContainer.resolve<IProfileService>("ProfileService");
    const shopService = clientContainer.resolve<IShopService>("ShopService");
    const subscriptionService = clientContainer.resolve<ISubscriptionService>(
      "SubscriptionService"
    );
    const globalDashboardService =
      clientContainer.resolve<IGlobalDashboardService>(
        "GlobalDashboardService"
      );

    return new ShopMerchantDashboardPresenter(
      logger,
      authService,
      profileService,
      shopService,
      subscriptionService,
      globalDashboardService
    );
  }
}
