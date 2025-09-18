import type { Logger } from "@/src/domain/interfaces/logger";
import { ShopBackendDashboardRepository } from "@/src/domain/repositories/shop/backend/backend-dashboard-repository";
import type { RevenueStatsDTO } from "@/src/application/dtos/shop/backend/dashboard-stats-dto";

export interface IGetRevenueStatsUseCase {
  execute(shopId: string): Promise<RevenueStatsDTO>;
}

export class GetRevenueStatsUseCase implements IGetRevenueStatsUseCase {
  constructor(
    private readonly shopBackendDashboardRepository: ShopBackendDashboardRepository,
    private readonly logger: Logger
  ) {}

  async execute(shopId: string): Promise<RevenueStatsDTO> {
    try {
      const revenueStats = await this.shopBackendDashboardRepository.getRevenueStats(shopId);
      
      return {
        // Shop identification
        shopId: revenueStats.shopId,
        shopName: revenueStats.shopName,
        shopSlug: revenueStats.shopSlug,
        shopStatus: revenueStats.shopStatus,
        currency: revenueStats.currency,
        statsGeneratedAt: revenueStats.statsGeneratedAt,
        
        // Revenue metrics
        revenueToday: revenueStats.revenueToday,
        revenueThisWeek: revenueStats.revenueThisWeek,
        revenueThisMonth: revenueStats.revenueThisMonth,
        revenueLastMonth: revenueStats.revenueLastMonth,
        revenueLastWeek: revenueStats.revenueLastWeek,
        revenueYesterday: revenueStats.revenueYesterday,
        totalRevenue: revenueStats.totalRevenue,
        totalServiceRevenue: revenueStats.totalServiceRevenue,
        
        // Payment counts
        paymentsToday: revenueStats.paymentsToday,
        paymentsThisWeek: revenueStats.paymentsThisWeek,
        paymentsThisMonth: revenueStats.paymentsThisMonth,
        paymentsLastWeek: revenueStats.paymentsLastWeek,
        paymentsLastMonth: revenueStats.paymentsLastMonth,
        paymentsYesterday: revenueStats.paymentsYesterday,
        totalPayments: revenueStats.totalPayments,
        paidPayments: revenueStats.paidPayments,
        partialPayments: revenueStats.partialPayments,
        pendingPayments: revenueStats.pendingPayments,
        
        // Payment method breakdown
        cashPayments: revenueStats.cashPayments,
        cashRevenue: revenueStats.cashRevenue,
        cardPayments: revenueStats.cardPayments,
        cardRevenue: revenueStats.cardRevenue,
        qrPayments: revenueStats.qrPayments,
        qrRevenue: revenueStats.qrRevenue,
        transferPayments: revenueStats.transferPayments,
        transferRevenue: revenueStats.transferRevenue,
        
        // Payment amounts
        totalPaidAmount: revenueStats.totalPaidAmount,
        totalPartialAmount: revenueStats.totalPartialAmount,
        totalPendingAmount: revenueStats.totalPendingAmount,
        
        // Growth percentages
        weeklyGrowthPercentage: revenueStats.weeklyGrowthPercentage,
        dailyGrowthPercentage: revenueStats.dailyGrowthPercentage,
        monthlyGrowthPercentage: revenueStats.monthlyGrowthPercentage,
        
        // Averages
        averageDailyRevenue: revenueStats.averageDailyRevenue,
        averagePaymentAmount: revenueStats.averagePaymentAmount,
        averageQueueValue: revenueStats.averageQueueValue,
        
        // Top performing service
        mostRevenueServiceName: revenueStats.mostRevenueServiceName,
        mostRevenueServiceAmount: revenueStats.mostRevenueServiceAmount,
      };
    } catch (error) {
      this.logger.error("Error in GetRevenueStatsUseCase", { error, shopId });
      throw error;
    }
  }
}
