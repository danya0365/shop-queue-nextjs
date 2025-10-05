/**
 * Global Dashboard DTOs
 * Data Transfer Objects for global dashboard operations
 */

/**
 * Global Dashboard Statistics DTO
 */
export interface GlobalDashboardStatsDTO {
  // Shop Statistics
  totalShops: number;
  activeShops: number;
  inactiveShops: number;

  // Queue Statistics
  totalQueuesAllTime: number;
  activeQueues: number;
  waitingQueues: number;
  confirmedQueues: number;
  servingQueues: number;
  completedQueuesToday: number;
  cancelledQueuesToday: number;
  pendingQueues: number;

  // Revenue Statistics
  todayRevenue: number;
  yesterdayRevenue: number;
  thisWeekRevenue: number;
  thisMonthRevenue: number;
  revenueChange: number;
  revenueChangeType: 'increase' | 'decrease' | 'stable';

  // Service Statistics
  servedToday: number;
  servedYesterday: number;
  servedChange: number;
  servedChangeType: 'increase' | 'decrease' | 'stable';

  // Wait Time Statistics
  averageWaitTime: number;
  averageWaitTimeYesterday: number;
  waitTimeChange: number;
  waitTimeChangeType: 'increase' | 'decrease' | 'stable';

  // Employee Statistics
  totalEmployees: number;
  activeEmployees: number;
  onlineEmployees: number;
  servingEmployees: number;

  // Customer Statistics
  totalCustomers: number;
  newCustomersToday: number;
  returningCustomersToday: number;

  // Timestamp
  lastUpdated: string;
}

/**
 * Global Recent Activity DTO
 */
export interface GlobalRecentActivityDTO {
  id: string;
  shopId: string;
  shopName: string;
  type: 'queue_created' | 'queue_confirmed' | 'queue_serving' | 'queue_completed' | 'queue_cancelled' | 'payment_received' | 'customer_registered' | 'employee_joined';
  title: string;
  description: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

/**
 * Shop Performance Summary DTO
 */
export interface ShopPerformanceSummaryDTO {
  shopId: string;
  shopName: string;
  todayQueues: number;
  todayRevenue: number;
  todayServed: number;
  averageWaitTime: number;
  activeQueues: number;
  completionRate: number;
  status: 'active' | 'inactive';
}

/**
 * Global Dashboard Data DTO
 */
export interface GlobalDashboardDataDTO {
  stats: GlobalDashboardStatsDTO;
  recentActivities: GlobalRecentActivityDTO[];
  shopPerformances: ShopPerformanceSummaryDTO[];
  lastUpdated: string;
}

/**
 * Get Global Stats Input DTO
 */
export interface GetGlobalStatsInput {
  profileId: string;
}

/**
 * Get Recent Activities Input DTO
 */
export interface GetRecentActivitiesInput {
  profileId: string;
  limit?: number;
}

/**
 * Get Shop Performances Input DTO
 */
export interface GetShopPerformancesInput {
  profileId: string;
}

/**
 * Get Global Dashboard Data Input DTO
 */
export interface GetGlobalDashboardDataInput {
  profileId: string;
  activityLimit?: number;
}
