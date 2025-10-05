import { AuthUserDto } from "@/src/application/dtos/auth-dto";
import { ShopDTO } from "@/src/application/dtos/shop/backend/shops-dto";
import { SubscriptionLimits, SubscriptionTier, UsageStatsDto } from "@/src/application/dtos/subscription-dto";
import { CurrentUsageStatsDTO } from "@/src/application/dtos/subscription/subscription-dto";
import { IAuthService } from "@/src/application/interfaces/auth-service.interface";
import { IProfileService } from "@/src/application/interfaces/profile-service.interface";
import { IShopService } from "@/src/application/services/shop/ShopService";
import { ISubscriptionService } from "@/src/application/services/subscription/SubscriptionService";
import { IGlobalDashboardService } from "@/src/application/services/dashboard/GlobalDashboardService";
import { getServerContainer } from "@/src/di/server-container";
import type { Logger } from "@/src/domain/interfaces/logger";
import { BaseSubscriptionPresenter } from "../base/BaseSubscriptionPresenter";

/**
 * Dashboard statistics interface
 */
export interface DashboardStats {
  totalShops: number;
  activeQueues: number;
  todayRevenue: number;
  servedToday: number;
  pendingQueues: number;
  averageWaitTime: number;
  // Change statistics
  activeQueuesChange?: string;
  activeQueuesChangeType?: 'increase' | 'decrease' | 'neutral';
  revenueChange?: string;
  revenueChangeType?: 'increase' | 'decrease' | 'neutral';
  servedChange?: string;
  servedChangeType?: 'increase' | 'decrease' | 'neutral';
  waitTimeChange?: string;
  waitTimeChangeType?: 'increase' | 'decrease' | 'neutral';
}

/**
 * Recent activity interface
 */
export interface RecentActivity {
  id: string;
  type: "queue_created" | "queue_served" | "payment_received";
  message: string;
  timestamp: string;
  amount?: number;
}

/**
 * ViewModel for Dashboard page
 */
export interface DashboardViewModel {
  user: AuthUserDto | null;
  stats: DashboardStats;
  recentActivity: RecentActivity[];
  hasShops: boolean;
  shops: ShopDTO[];
  subscription: {
    tier: SubscriptionTier;
    limits: SubscriptionLimits;
    usage: UsageStatsDto;
    canCreateShop: boolean;
  };
}

/**
 * DashboardPresenter handles business logic for the dashboard page
 * Following SOLID principles and Clean Architecture
 */
export class DashboardPresenter extends BaseSubscriptionPresenter {
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

  /**
   * Get view model for dashboard page
   */
  async getViewModel(): Promise<DashboardViewModel> {
    try {
      const user = await this.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      const profile = await this.getActiveProfile(user);
      if (!profile) {
        throw new Error("Profile not found");
      }

      // Get user's shops
      const shops = await this.shopService.getShopsByOwnerId(profile.id);
      const hasShops = shops.length > 0;

      // Get global dashboard data from service
      const globalData = await this.globalDashboardService.getGlobalDashboardData(
        profile.id,
        10 // activity limit
      );

      // Map global stats to dashboard stats
      const stats = this.mapGlobalStatsToDashboardStats(globalData.stats);

      // Map global activities to recent activities
      const recentActivity = this.mapGlobalActivitiesToRecentActivities(
        globalData.recentActivities
      );

      // Get subscription information based on profile
      const subscriptionPlan = await this.getSubscriptionPlan(profile.id, profile.role);
      const limits = this.mapSubscriptionPlanToLimits(subscriptionPlan);
      const usage = await this.getUsageStats(profile.id);
      const canCreateShop = limits.maxShops === null || shops.length < limits.maxShops;

      return {
        user,
        stats,
        recentActivity,
        hasShops,
        shops,
        subscription: {
          tier: subscriptionPlan.tier,
          limits,
          usage,
          canCreateShop
        }
      };
    } catch (error) {
      this.logger.error("DashboardPresenter: Error getting view model", error);
      throw error;
    }
  }

  /**
   * Map Global Stats to Dashboard Stats
   */
  private mapGlobalStatsToDashboardStats(
    globalStats: {
      totalShops: number;
      activeQueues: number;
      todayRevenue: number;
      servedToday: number;
      pendingQueues: number;
      averageWaitTime: number;
      revenueChange: number;
      revenueChangeType: 'increase' | 'decrease' | 'stable';
      servedChange: number;
      servedChangeType: 'increase' | 'decrease' | 'stable';
      waitTimeChange: number;
      waitTimeChangeType: 'increase' | 'decrease' | 'stable';
    }
  ): DashboardStats {
    return {
      totalShops: globalStats.totalShops,
      activeQueues: globalStats.activeQueues,
      todayRevenue: globalStats.todayRevenue,
      servedToday: globalStats.servedToday,
      pendingQueues: globalStats.pendingQueues,
      averageWaitTime: globalStats.averageWaitTime,
      // Format change percentages
      revenueChange: this.formatChangePercentage(globalStats.revenueChange),
      revenueChangeType: this.mapChangeType(globalStats.revenueChangeType),
      servedChange: this.formatChangeNumber(globalStats.servedChange),
      servedChangeType: this.mapChangeType(globalStats.servedChangeType),
      waitTimeChange: this.formatChangeMinutes(globalStats.waitTimeChange),
      waitTimeChangeType: this.mapChangeType(globalStats.waitTimeChangeType),
    };
  }

  /**
   * Map change type from 'stable' to 'neutral'
   */
  private mapChangeType(type: 'increase' | 'decrease' | 'stable'): 'increase' | 'decrease' | 'neutral' {
    return type === 'stable' ? 'neutral' : type;
  }

  /**
   * Format change percentage
   */
  private formatChangePercentage(change: number): string {
    const sign = change > 0 ? '+' : '';
    return `${sign}${change.toFixed(1)}%`;
  }

  /**
   * Format change number
   */
  private formatChangeNumber(change: number): string {
    const sign = change > 0 ? '+' : '';
    return `${sign}${Math.round(change)} จากเมื่อวาน`;
  }

  /**
   * Format change minutes
   */
  private formatChangeMinutes(change: number): string {
    const sign = change > 0 ? '+' : '';
    return `${sign}${Math.round(change)} นาที`;
  }

  /**
   * Map Global Activities to Recent Activities
   */
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
  ): RecentActivity[] {
    return globalActivities.map((activity) => {
      // Map activity type
      const type = this.mapActivityType(activity.type);

      // Format message with shop name
      const message = activity.description
        ? `${activity.title} - ${activity.shopName}: ${activity.description}`
        : `${activity.title} - ${activity.shopName}`;

      // Format timestamp to relative time
      const timestamp = this.formatRelativeTime(activity.createdAt);

      return {
        id: activity.id,
        type,
        message,
        timestamp,
      };
    });
  }

  /**
   * Map activity type from global to dashboard format
   */
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

  /**
   * Format timestamp to Thai relative time
   */
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


  /**
   * Map CurrentUsageStatsDTO to UsageStatsDto
   */
  private mapCurrentUsageToUsageStats(currentUsage: CurrentUsageStatsDTO): UsageStatsDto {
    return {
      profileId: currentUsage.profileId,
      shopId: currentUsage.shopId,
      currentShops: currentUsage.currentShops,
      todayQueues: currentUsage.todayQueues,
      currentStaff: currentUsage.currentStaff,
      monthlySmsSent: currentUsage.monthlySmsSent,
      activePromotions: currentUsage.activePromotions,
      // Default values for fields not in CurrentUsageStatsDTO
      usedPosterDesigns: 0,
      paidPosterDesigns: 0,
      totalPosters: 0,
      dataRetentionMonths: 12
    };
  }

  /**
   * Get usage stats for a profile
   */
  private async getUsageStats(profileId: string): Promise<UsageStatsDto> {
    try {
      const currentUsage = await this.subscriptionService.getCurrentUsageStats(profileId);
      return this.mapCurrentUsageToUsageStats(currentUsage);
    } catch (error) {
      this.logger.error("Error getting usage stats", error);
      return {
        profileId: profileId,
        shopId: undefined,
        currentShops: 0,
        todayQueues: 0,
        currentStaff: 0,
        monthlySmsSent: 0,
        activePromotions: 0,
        usedPosterDesigns: 0,
        paidPosterDesigns: 0,
        totalPosters: 0,
        dataRetentionMonths: 12
      };
    }
  }

  /**
   * Generate metadata for the dashboard page
   */
  generateMetadata() {
    return {
      title: "แดชบอร์ด | Shop Queue",
      description: "ภาพรวมการจัดการร้านค้าและระบบคิวของคุณ",
    };
  }
}

export class DashboardPresenterFactory {
  static async create(): Promise<DashboardPresenter> {
    const serverContainer = await getServerContainer();
    const logger = serverContainer.resolve<Logger>("Logger");
    const authService = serverContainer.resolve<IAuthService>("AuthService");
    const profileService = serverContainer.resolve<IProfileService>("ProfileService");
    const shopService = serverContainer.resolve<IShopService>("ShopService");
    const subscriptionService = serverContainer.resolve<ISubscriptionService>("SubscriptionService");
    const globalDashboardService = serverContainer.resolve<IGlobalDashboardService>("GlobalDashboardService");
    return new DashboardPresenter(
      logger,
      authService,
      profileService,
      shopService,
      subscriptionService,
      globalDashboardService
    );
  }
}
