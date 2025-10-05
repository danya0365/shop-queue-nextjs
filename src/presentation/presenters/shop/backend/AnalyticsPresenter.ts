import type {
  SubscriptionLimits,
  UsageStatsDto,
} from "@/src/application/dtos/subscription-dto";
import type { IAuthService } from "@/src/application/interfaces/auth-service.interface";
import { IProfileService } from "@/src/application/interfaces/profile-service.interface";
import { IShopService } from "@/src/application/services/shop/ShopService";
import { ISubscriptionService } from "@/src/application/services/subscription/SubscriptionService";
import { getServerContainer } from "@/src/di/server-container";
import type { Logger } from "@/src/domain/interfaces/logger";
import { BaseShopBackendPresenter } from "./BaseShopBackendPresenter";
import type { ShopBackendAnalyticsService } from "@/src/application/services/shop/backend/BackendAnalyticsService";

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
    private readonly analyticsService: ShopBackendAnalyticsService
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

      // Real data via analytics service
      // Summary for overall metrics + peak hours + top services (month)
      const summary = await this.analyticsService.getSummary(shopId);

      // Peak hours from summary for customer insights
      const peakHours = summary.peakHours;

      // Service analytics (month) for service stats
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999).toISOString();
      const serviceAnalytics = await this.analyticsService.getServiceAnalytics({
        shopId,
        dateFrom: monthStart,
        dateTo: monthEnd,
      });

      // Map service analytics to view's ServiceStats
      const serviceStats = serviceAnalytics.serviceStats.map((s, idx) => ({
        serviceId: s.serviceId,
        serviceName: s.serviceName,
        totalOrders: s.totalQueues,
        totalRevenue: s.revenue,
        avgRating: 0, // not available in analytics, keep 0
        popularityRank: idx + 1,
      }));

      // Employee performance not implemented in analytics yet -> keep mock for now
      const employeePerformance = this.getEmployeePerformance();

      // Customer insights using summary peak hours and rough totals
      const customerInsights = {
        totalCustomers: 0,
        newCustomers: 0,
        returningCustomers: 0,
        avgVisitsPerCustomer: 0,
        customerSatisfaction: 0,
        peakHours: peakHours.map((p) => ({ hour: p.hour, queueCount: p.queueCount })),
      };

      // Revenue chart is not provided by analytics; keep simple mock filtered by retention
      const revenueData = this.getRevenueData(dataRetentionDays);

      const totalRevenue = revenueData.reduce(
        (sum, data) => sum + data.revenue,
        0
      );
      const totalOrders = revenueData.reduce(
        (sum, data) => sum + data.orders,
        0
      );

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
        avgOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
        growthRate: 12.5, // Mock growth rate
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

  // Private methods for data preparation
  private getRevenueData(dataRetentionDays: number): RevenueData[] {
    // Filter data based on retention policy
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - dataRetentionDays);

    const allData = this.getAllRevenueData();
    return allData.filter((data) => new Date(data.date) >= cutoffDate);
  }

  private getAllRevenueData(): RevenueData[] {
    return [
      { date: "2024-01-01", revenue: 12500, orders: 85, avgOrderValue: 147 },
      { date: "2024-01-02", revenue: 15200, orders: 92, avgOrderValue: 165 },
      { date: "2024-01-03", revenue: 18300, orders: 108, avgOrderValue: 169 },
      { date: "2024-01-04", revenue: 14800, orders: 89, avgOrderValue: 166 },
      { date: "2024-01-05", revenue: 22100, orders: 125, avgOrderValue: 177 },
      { date: "2024-01-06", revenue: 25400, orders: 142, avgOrderValue: 179 },
      { date: "2024-01-07", revenue: 19800, orders: 115, avgOrderValue: 172 },
      { date: "2024-01-08", revenue: 16900, orders: 98, avgOrderValue: 173 },
      { date: "2024-01-09", revenue: 20500, orders: 118, avgOrderValue: 174 },
      { date: "2024-01-10", revenue: 23200, orders: 135, avgOrderValue: 172 },
      { date: "2024-01-11", revenue: 21800, orders: 128, avgOrderValue: 170 },
      { date: "2024-01-12", revenue: 26500, orders: 152, avgOrderValue: 174 },
      { date: "2024-01-13", revenue: 24300, orders: 140, avgOrderValue: 174 },
      { date: "2024-01-14", revenue: 27800, orders: 158, avgOrderValue: 176 },
      { date: "2024-01-15", revenue: 29200, orders: 165, avgOrderValue: 177 },
    ];
  }

  private getServiceStats(): ServiceStats[] {
    return [
      {
        serviceId: "1",
        serviceName: "กาแฟลาเต้",
        totalOrders: 245,
        totalRevenue: 20825,
        avgRating: 4.8,
        popularityRank: 1,
      },
      {
        serviceId: "2",
        serviceName: "กาแฟอเมริกาโน่",
        totalOrders: 198,
        totalRevenue: 12870,
        avgRating: 4.6,
        popularityRank: 2,
      },
      {
        serviceId: "3",
        serviceName: "เค้กช็อกโกแลต",
        totalOrders: 156,
        totalRevenue: 18720,
        avgRating: 4.9,
        popularityRank: 3,
      },
      {
        serviceId: "4",
        serviceName: "แซนด์วิชไก่",
        totalOrders: 134,
        totalRevenue: 12730,
        avgRating: 4.5,
        popularityRank: 4,
      },
      {
        serviceId: "5",
        serviceName: "สมูทตี้ผลไม้",
        totalOrders: 98,
        totalRevenue: 8330,
        avgRating: 4.7,
        popularityRank: 5,
      },
    ];
  }

  private getEmployeePerformance(): EmployeePerformance[] {
    return [
      {
        employeeId: "1",
        employeeName: "สมชาย ใจดี",
        totalQueues: 156,
        totalRevenue: 28420,
        avgServiceTime: 8.5,
        customerRating: 4.8,
        efficiency: 92,
      },
      {
        employeeId: "2",
        employeeName: "สมหญิง รักงาน",
        totalQueues: 142,
        totalRevenue: 26180,
        avgServiceTime: 9.2,
        customerRating: 4.9,
        efficiency: 89,
      },
      {
        employeeId: "3",
        employeeName: "สมศรี ขยันทำงาน",
        totalQueues: 189,
        totalRevenue: 31250,
        avgServiceTime: 7.8,
        customerRating: 4.7,
        efficiency: 95,
      },
      {
        employeeId: "4",
        employeeName: "สมปอง มีความสุข",
        totalQueues: 98,
        totalRevenue: 18940,
        avgServiceTime: 10.1,
        customerRating: 4.6,
        efficiency: 85,
      },
    ];
  }

  private getCustomerInsights(): CustomerInsights {
    return {
      totalCustomers: 1248,
      newCustomers: 186,
      returningCustomers: 1062,
      avgVisitsPerCustomer: 2.8,
      customerSatisfaction: 4.7,
      peakHours: [
        { hour: 7, queueCount: 12 },
        { hour: 8, queueCount: 28 },
        { hour: 9, queueCount: 45 },
        { hour: 10, queueCount: 38 },
        { hour: 11, queueCount: 52 },
        { hour: 12, queueCount: 68 },
        { hour: 13, queueCount: 72 },
        { hour: 14, queueCount: 58 },
        { hour: 15, queueCount: 42 },
        { hour: 16, queueCount: 35 },
        { hour: 17, queueCount: 48 },
        { hour: 18, queueCount: 55 },
        { hour: 19, queueCount: 38 },
        { hour: 20, queueCount: 22 },
        { hour: 21, queueCount: 15 },
      ],
    };
  }

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
      analyticsService
    );
  }
}

// Client Factory class
export class ClientAnalyticsPresenterFactory {
  static async create(): Promise<AnalyticsPresenter> {
    const { getClientContainer } = await import("@/src/di/client-container");
    const clientContainer = await getClientContainer();
    const logger = clientContainer.resolve<Logger>("Logger");
    const analyticsService =
      clientContainer.resolve<ShopBackendAnalyticsService>(
        "ShopBackendAnalyticsService"
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
      analyticsService
    );
  }
}
