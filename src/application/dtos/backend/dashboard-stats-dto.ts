export interface DashboardStatsDTO {
  totalShops: number;
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
  type: 'queue_created' | 'queue_completed' | 'customer_registered' | 'shop_created';
  title: string;
  description: string;
  timestamp: string;
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
  stats: DashboardStatsDTO;
  recentActivities: RecentActivityDTO[];
  queueDistribution: QueueStatusDistributionDTO;
  popularServices: PopularServicesDTO[];
  lastUpdated: string;
}
