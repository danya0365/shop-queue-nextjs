import { ActivityType } from "@/src/domain/entities/backend/backend-dashboard.entity";

export interface ShopDashboardStatsDTO {
  totalQueues: number;
  totalCustomers: number;
  totalEmployees: number;
  activeQueues: number;
  completedQueuesToday: number;
  totalRevenue: number;
  averageWaitTime: number;
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
