import type { ShopDashboardStatsDTO } from "@/src/application/dtos/shop/backend/dashboard-stats-dto";
import type { Logger } from "@/src/domain/interfaces/logger";
import type { ShopBackendDashboardRepository } from "@/src/domain/repositories/shop/backend/backend-dashboard-repository";

export interface IGetDashboardStatsUseCase {
  execute(shopId: string): Promise<ShopDashboardStatsDTO>;
}

export class GetDashboardStatsUseCase implements IGetDashboardStatsUseCase {
  constructor(
    private readonly dashboardRepository: ShopBackendDashboardRepository,
    private readonly logger: Logger
  ) {}

  async execute(shopId: string): Promise<ShopDashboardStatsDTO> {
    try {
      // Get dashboard stats from repository
      const dashboardStats = await this.dashboardRepository.getDashboardStats(
        shopId
      );

      // Map domain entity to DTO
      const stats: ShopDashboardStatsDTO = {
        shopId: dashboardStats.shopId,
        shopName: dashboardStats.shopName,
        shopSlug: dashboardStats.shopSlug,
        shopStatus: dashboardStats.shopStatus,
        totalQueues: dashboardStats.totalQueues,
        totalCustomers: dashboardStats.totalCustomers,
        totalEmployees: dashboardStats.totalEmployees,
        totalServices: dashboardStats.totalServices,
        totalRevenue: dashboardStats.totalRevenue,
        totalReviews: dashboardStats.totalReviews,
        totalPointsEarned: dashboardStats.totalPointsEarned,
        totalPointsRedeemed: dashboardStats.totalPointsRedeemed,
        activeCustomers: dashboardStats.activeCustomers,
        activeEmployees: dashboardStats.activeEmployees,
        activeQueues: dashboardStats.activeQueues,
        activePromotions: dashboardStats.activePromotions,
        activeRewards: dashboardStats.activeRewards,
        availableServices: dashboardStats.availableServices,
        employeesOnDuty: dashboardStats.employeesOnDuty,
        waitingQueues: dashboardStats.waitingQueues,
        servingQueues: dashboardStats.servingQueues,
        completedQueuesToday: dashboardStats.completedQueuesToday,
        customersVisitedToday: dashboardStats.customersVisitedToday,
        revenueToday: dashboardStats.revenueToday,
        promotionsUsedToday: dashboardStats.promotionsUsedToday,
        rewardUsagesToday: dashboardStats.rewardUsagesToday,
        paidPayments: dashboardStats.paidPayments,
        pendingPayments: dashboardStats.pendingPayments,
        averageRating: dashboardStats.averageRating,
        averageWaitTime: dashboardStats.averageWaitTime,
        averageServiceTime: dashboardStats.averageServiceTime,
        statsGeneratedAt: dashboardStats.statsGeneratedAt,
      };

      return stats;
    } catch (error) {
      this.logger.error(
        "GetDashboardStatsUseCase: Error retrieving dashboard stats",
        error
      );
      throw error;
    }
  }
}
