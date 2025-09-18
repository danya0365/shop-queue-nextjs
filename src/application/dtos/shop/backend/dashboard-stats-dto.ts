import { ActivityType } from "@/src/domain/entities/backend/backend-dashboard.entity";

export interface ShopDashboardStatsDTO {
  shopId: string | null;
  shopName: string | null;
  shopSlug: string | null;
  shopStatus: string | null;
  totalQueues: number;
  totalCustomers: number;
  totalEmployees: number;
  totalServices: number;
  totalRevenue: number;
  totalReviews: number;
  totalPointsEarned: number;
  totalPointsRedeemed: number;
  activeCustomers: number;
  activeEmployees: number;
  activeQueues: number;
  activePromotions: number;
  activeRewards: number;
  availableServices: number;
  employeesOnDuty: number;
  waitingQueues: number;
  servingQueues: number;
  completedQueuesToday: number;
  customersVisitedToday: number;
  revenueToday: number;
  promotionsUsedToday: number;
  rewardUsagesToday: number;
  paidPayments: number;
  pendingPayments: number;
  averageRating: number;
  averageWaitTime: number;
  averageServiceTime: number;
  statsGeneratedAt: string | null;
}

export interface RecentActivityDTO {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  createdAt: string;
  metadata?: Record<string, unknown>;
}

export interface QueueStatusDistributionDTO {
  waiting: number;
  serving: number;
  completed: number;
  cancelled: number;
  noShow: number;
}

export interface PopularServicesDTO {
  id: string;
  name: string;
  queueCount: number;
  revenue: number;
  category: string;
}

export interface DashboardDataDTO {
  stats: ShopDashboardStatsDTO;
  recentActivities: RecentActivityDTO[];
  queueDistribution: QueueStatusDistributionDTO;
  popularServices: PopularServicesDTO[];
  lastUpdated: string;
}
