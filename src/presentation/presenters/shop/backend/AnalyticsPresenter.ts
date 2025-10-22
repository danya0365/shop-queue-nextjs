import type {
  SubscriptionLimits,
  UsageStatsDto,
} from "@/src/application/dtos/subscription-dto";
import type { IAuthService } from "@/src/application/interfaces/auth-service.interface";
import { IProfileService } from "@/src/application/interfaces/profile-service.interface";
import type { ShopBackendAnalyticsService } from "@/src/application/services/shop/backend/BackendAnalyticsService";
import type { ShopBackendDashboardService } from "@/src/application/services/shop/backend/BackendDashboardService";
import { IShopService } from "@/src/application/services/shop/ShopService";
import { ISubscriptionService } from "@/src/application/services/subscription/SubscriptionService";
import { getClientContainer } from "@/src/di/client-container";
import { getServerContainer } from "@/src/di/server-container";
import type { Logger } from "@/src/domain/interfaces/logger";
import { BaseShopBackendPresenter } from "./BaseShopBackendPresenter";

// Define interfaces for data structures
export interface RevenueData {
  date: string;
  revenue: number;
  orders: number;
  avgOrderValue: number;
}

export interface ServiceStats {
  serviceId: string;
  serviceName: string;
  totalOrders: number;
  totalRevenue: number;
  avgRating: number;
  popularityRank: number;
}

export interface EmployeePerformance {
  employeeId: string;
  employeeName: string;
  totalQueues: number;
  totalRevenue: number;
  avgServiceTime: number;
  customerRating: number;
  efficiency: number;
}

export interface CustomerInsights {
  totalCustomers: number;
  newCustomers: number;
  returningCustomers: number;
  avgVisitsPerCustomer: number;
  customerSatisfaction: number;
  peakHours: Array<{
    hour: number;
    queueCount: number;
  }>;
}

export interface AnalyticsFilters {
  dateRange: "today" | "week" | "month" | "quarter" | "year" | "custom";
  startDate?: string;
  endDate?: string;
  compareWith?: "previous_period" | "last_year" | "none";
}

// Define ViewModel interface
export interface AnalyticsViewModel {
  revenueData: RevenueData[];
  serviceStats: ServiceStats[];
  employeePerformance: EmployeePerformance[];
  customerInsights: CustomerInsights;
  filters: AnalyticsFilters;
  totalRevenue: number;
  totalOrders: number;
  avgOrderValue: number;
  growthRate: number;
  subscription: {
    limits: SubscriptionLimits;
    usage: UsageStatsDto;
    hasDataRetentionLimit: boolean;
    dataRetentionDays: number;
    isFreeTier: boolean;
  };
}

// Main Presenter class
export class AnalyticsPresenter extends BaseShopBackendPresenter {
  constructor(
    logger: Logger,
    shopService: IShopService,
    authService: IAuthService,
    profileService: IProfileService,
    subscriptionService: ISubscriptionService,
    private readonly analyticsService: ShopBackendAnalyticsService,
    private readonly dashboardService: ShopBackendDashboardService
  ) {
    super(
      logger,
      shopService,
      authService,
      profileService,
      subscriptionService
    );
  }

  async getViewModel(shopId: string): Promise<AnalyticsViewModel> {
    try {
      this.logger.info("AnalyticsPresenter: Getting view model for shop", {
        shopId,
      });

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

      // Check data retention limits
      const hasDataRetentionLimit = false; // limits.dataRetentionDays !== null;
      const dataRetentionDays = 365; // limits.maxDataRetentionDays || 365;

      const isFreeTier = false; // TODO: for test
      //const isFreeTier = subscriptionPlan.tier === 'free';

      // Calculate date ranges
      const now = new Date();
      const monthStart = new Date(
        now.getFullYear(),
        now.getMonth(),
        1
      ).toISOString();
      const monthEnd = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0,
        23,
        59,
        59,
        999
      ).toISOString();

      // Fetch all analytics data in parallel
      const [
        summary,
        serviceAnalytics,
        timeAnalytics,
        peakHoursData,
        revenueStats,
      ] = await Promise.all([
        this.analyticsService.getSummary(shopId),
        this.analyticsService.getServiceAnalytics({
          shopId,
          dateFrom: monthStart,
          dateTo: monthEnd,
        }),
        this.analyticsService.getTimeAnalytics({
          shopId,
          dateFrom: monthStart,
          dateTo: monthEnd,
        }),
        this.analyticsService.getPeakHours({
          shopId,
          dateFrom: monthStart,
          dateTo: monthEnd,
        }),
        this.dashboardService.getRevenueStats(shopId),
      ]);

      // Map service analytics to view's ServiceStats
      const serviceStats: ServiceStats[] = serviceAnalytics.serviceStats.map(
        (s, idx) => ({
          serviceId: s.serviceId,
          serviceName: s.serviceName,
          totalOrders: s.totalQueues,
          totalRevenue: s.revenue,
          avgRating: 0, // not available in analytics
          popularityRank: idx + 1,
        })
      );

      // Build revenue data from analytics
      const days = Math.min(30, dataRetentionDays);
      const avgDaily = revenueStats.averageDailyRevenue ?? 0;
      const paymentsThisMonth = revenueStats.paymentsThisMonth ?? 0;
      const avgPaymentAmount = revenueStats.averagePaymentAmount ?? 0;

      const revenueData: RevenueData[] = Array.from({ length: days }).map(
        (_, i) => {
          const d = new Date(now);
          d.setDate(now.getDate() - (days - 1 - i));
          const revenue = Math.max(0, avgDaily);
          const ordersEstimate = Math.max(
            0,
            Math.round(paymentsThisMonth / days)
          );
          const aov =
            ordersEstimate > 0 ? revenue / ordersEstimate : avgPaymentAmount;
          return {
            date: d.toISOString().slice(0, 10),
            revenue,
            orders: ordersEstimate,
            avgOrderValue: aov,
          };
        }
      );

      const totalRevenue =
        (revenueStats.revenueThisMonth ?? 0) ||
        (revenueStats.totalRevenue ?? 0);
      const totalOrders =
        (revenueStats.paymentsThisMonth ?? 0) ||
        (revenueStats.totalPayments ?? 0);
      const avgOrderValue =
        totalOrders > 0 ? totalRevenue / totalOrders : avgPaymentAmount ?? 0;
      const growthRate = revenueStats.monthlyGrowthPercentage ?? 0;

      // Employee performance from time analytics
      const employeePerformance: EmployeePerformance[] = [
        {
          employeeId: "aggregate",
          employeeName: "ภาพรวมพนักงาน",
          totalQueues: summary.monthlyStats.totalQueues,
          totalRevenue,
          avgServiceTime: timeAnalytics.averageServiceTime,
          customerRating: 0, // not available
          efficiency: summary.monthlyStats.completionRate,
        },
      ];

      // Customer insights from analytics data
      const customerInsights: CustomerInsights = {
        totalCustomers: 0, // not available in current analytics
        newCustomers: 0, // not available
        returningCustomers: 0, // not available
        avgVisitsPerCustomer: 0, // not available
        customerSatisfaction: 0, // not available
        peakHours: peakHoursData.peakHours.map((p) => ({
          hour: p.hour,
          queueCount: p.queueCount,
        })),
      };

      return {
        revenueData,
        serviceStats,
        employeePerformance,
        customerInsights,
        filters: {
          dateRange: "month",
          compareWith: "previous_period",
        },
        totalRevenue,
        totalOrders,
        avgOrderValue,
        growthRate,
        subscription: {
          limits,
          usage,
          hasDataRetentionLimit,
          dataRetentionDays,
          isFreeTier,
        },
      };
    } catch (error) {
      this.logger.error("AnalyticsPresenter: Error getting view model", error);
      throw error;
    }
  }

  // Note: All mock data methods have been removed.
  // Data is now fetched from ShopBackendAnalyticsService and ShopBackendDashboardService

  // Metadata generation
  async generateMetadata(shopId: string) {
    return this.generateShopMetadata(
      shopId,
      "รายงานและวิเคราะห์",
      "ดูรายงานยอดขาย สถิติการใช้งาน และวิเคราะห์ประสิทธิภาพของร้าน"
    );
  }
}

// Factory class
export class AnalyticsPresenterFactory {
  static async create(): Promise<AnalyticsPresenter> {
    const serverContainer = await getServerContainer();
    const logger = serverContainer.resolve<Logger>("Logger");
    const analyticsService =
      serverContainer.resolve<ShopBackendAnalyticsService>(
        "ShopBackendAnalyticsService"
      );
    const dashboardService =
      serverContainer.resolve<ShopBackendDashboardService>(
        "ShopBackendDashboardService"
      );
    const subscriptionService = serverContainer.resolve<ISubscriptionService>(
      "SubscriptionService"
    );
    const authService = serverContainer.resolve<IAuthService>("AuthService");
    const profileService =
      serverContainer.resolve<IProfileService>("ProfileService");
    const shopService = serverContainer.resolve<IShopService>("ShopService");
    return new AnalyticsPresenter(
      logger,
      shopService,
      authService,
      profileService,
      subscriptionService,
      analyticsService,
      dashboardService
    );
  }
}

// Client Factory class
export class ClientAnalyticsPresenterFactory {
  static create(): AnalyticsPresenter {
    const clientContainer = getClientContainer();
    const logger = clientContainer.resolve<Logger>("Logger");
    const analyticsService =
      clientContainer.resolve<ShopBackendAnalyticsService>(
        "ShopBackendAnalyticsService"
      );
    const dashboardService =
      clientContainer.resolve<ShopBackendDashboardService>(
        "ShopBackendDashboardService"
      );
    const shopService = clientContainer.resolve<IShopService>("ShopService");
    const authService = clientContainer.resolve<IAuthService>("AuthService");
    const profileService =
      clientContainer.resolve<IProfileService>("ProfileService");
    const subscriptionService = clientContainer.resolve<ISubscriptionService>(
      "SubscriptionService"
    );
    return new AnalyticsPresenter(
      logger,
      shopService,
      authService,
      profileService,
      subscriptionService,
      analyticsService,
      dashboardService
    );
  }
}
