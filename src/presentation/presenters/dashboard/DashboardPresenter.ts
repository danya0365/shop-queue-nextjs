import { AuthUserDto } from "@/src/application/dtos/auth-dto";
import { ShopDTO } from "@/src/application/dtos/shop/backend/shops-dto";
import { SubscriptionLimits, SubscriptionTier, UsageStatsDto } from "@/src/application/dtos/subscription-dto";
import { CurrentUsageStatsDTO } from "@/src/application/dtos/subscription/subscription-dto";
import { IAuthService } from "@/src/application/interfaces/auth-service.interface";
import { IProfileService } from "@/src/application/interfaces/profile-service.interface";
import { IShopService } from "@/src/application/services/shop/ShopService";
import { ISubscriptionService } from "@/src/application/services/subscription/SubscriptionService";
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
    subscriptionService: ISubscriptionService
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

      // Calculate dashboard statistics
      const stats = await this.calculateStats(profile.id, shops);

      // Get recent activity
      const recentActivity = await this.getRecentActivity(profile.id, shops);

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
   * Calculate dashboard statistics
   */
  private async calculateStats(
    userId: string,
    shops: ShopDTO[]
  ): Promise<DashboardStats> {
    try {
      console.log(userId);
      console.log(shops);
      // Mock data for now - replace with actual service calls
      return {
        totalShops: shops.length,
        activeQueues: 12,
        todayRevenue: 15750,
        servedToday: 45,
        pendingQueues: 8,
        averageWaitTime: 15,
      };
    } catch (error) {
      this.logger.error("DashboardPresenter: Error calculating stats", error);
      return {
        totalShops: 0,
        activeQueues: 0,
        todayRevenue: 0,
        servedToday: 0,
        pendingQueues: 0,
        averageWaitTime: 0,
      };
    }
  }

  /**
   * Get recent activity
   */
  private async getRecentActivity(
    userId: string,
    shops: ShopDTO[]
  ): Promise<RecentActivity[]> {
    console.log(userId);
    console.log(shops);
    try {
      // Mock data for now - replace with actual service calls
      return [
        {
          id: "1",
          type: "queue_created",
          message: 'ลูกค้าใหม่เข้าคิวที่ร้าน "กาแฟดีดี"',
          timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        },
        {
          id: "2",
          type: "payment_received",
          message: "ได้รับชำระเงินจากคิว #045",
          timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          amount: 350,
        },
        {
          id: "3",
          type: "queue_served",
          message: "ให้บริการคิว #044 เรียบร้อยแล้ว",
          timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
        },
      ];
    } catch (error) {
      this.logger.error(
        "DashboardPresenter: Error getting recent activity",
        error
      );
      return [];
    }
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
    return new DashboardPresenter(
      logger,
      authService,
      profileService,
      shopService,
      subscriptionService
    );
  }
}
