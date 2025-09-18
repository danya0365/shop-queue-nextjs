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

export interface RevenueStatsDTO {
  // Shop identification
  shopId: string;
  shopName: string | null;
  shopSlug: string | null;
  shopStatus: string | null;
  currency: string | null;
  statsGeneratedAt: string | null;
  
  // Revenue metrics
  revenueToday: number | null;
  revenueThisWeek: number | null;
  revenueThisMonth: number | null;
  revenueLastMonth: number | null;
  revenueLastWeek: number | null;
  revenueYesterday: number | null;
  totalRevenue: number | null;
  totalServiceRevenue: number | null;
  
  // Payment counts
  paymentsToday: number | null;
  paymentsThisWeek: number | null;
  paymentsThisMonth: number | null;
  paymentsLastWeek: number | null;
  paymentsLastMonth: number | null;
  paymentsYesterday: number | null;
  totalPayments: number | null;
  paidPayments: number | null;
  partialPayments: number | null;
  pendingPayments: number | null;
  
  // Payment method breakdown
  cashPayments: number | null;
  cashRevenue: number | null;
  cardPayments: number | null;
  cardRevenue: number | null;
  qrPayments: number | null;
  qrRevenue: number | null;
  transferPayments: number | null;
  transferRevenue: number | null;
  
  // Payment amounts
  totalPaidAmount: number | null;
  totalPartialAmount: number | null;
  totalPendingAmount: number | null;
  
  // Growth percentages
  weeklyGrowthPercentage: number | null;
  dailyGrowthPercentage: number | null;
  monthlyGrowthPercentage: number | null;
  
  // Averages
  averageDailyRevenue: number | null;
  averagePaymentAmount: number | null;
  averageQueueValue: number | null;
  
  // Top performing service
  mostRevenueServiceName: string | null;
  mostRevenueServiceAmount: number | null;
}

export interface DashboardDataDTO {
  stats: ShopDashboardStatsDTO;
  recentActivities: RecentActivityDTO[];
  queueDistribution: QueueStatusDistributionDTO;
  popularServices: PopularServicesDTO[];
  lastUpdated: string;
}
