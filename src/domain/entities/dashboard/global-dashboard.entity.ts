/**
 * Global Dashboard Entity
 * Represents aggregated dashboard statistics across all shops owned by a user
 */

/**
 * Global Dashboard Statistics Entity
 * Aggregates data from all shops owned by the user
 */
export interface GlobalDashboardStatsEntity {
  // Shop Statistics
  totalShops: number;
  activeShops: number;
  inactiveShops: number;

  // Queue Statistics
  totalQueuesAllTime: number;
  activeQueues: number; // waiting + confirmed + serving
  waitingQueues: number;
  confirmedQueues: number;
  servingQueues: number;
  completedQueuesToday: number;
  cancelledQueuesToday: number;
  pendingQueues: number; // waiting + confirmed

  // Revenue Statistics
  todayRevenue: number;
  yesterdayRevenue: number;
  thisWeekRevenue: number;
  thisMonthRevenue: number;
  revenueChange: number; // percentage change from yesterday
  revenueChangeType: 'increase' | 'decrease' | 'stable';

  // Service Statistics
  servedToday: number;
  servedYesterday: number;
  servedChange: number; // percentage change from yesterday
  servedChangeType: 'increase' | 'decrease' | 'stable';

  // Wait Time Statistics
  averageWaitTime: number; // in minutes
  averageWaitTimeYesterday: number;
  waitTimeChange: number; // percentage change from yesterday
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
 * Global Recent Activity Entity
 * Represents recent activities across all shops
 */
export interface GlobalRecentActivityEntity {
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
 * Shop Performance Summary Entity
 * Summary of each shop's performance
 */
export interface ShopPerformanceSummaryEntity {
  shopId: string;
  shopName: string;
  todayQueues: number;
  todayRevenue: number;
  todayServed: number;
  averageWaitTime: number;
  activeQueues: number;
  completionRate: number; // percentage
  status: 'active' | 'inactive';
}

/**
 * Global Dashboard Data Entity
 * Complete dashboard data including stats, activities, and shop summaries
 */
export interface GlobalDashboardDataEntity {
  stats: GlobalDashboardStatsEntity;
  recentActivities: GlobalRecentActivityEntity[];
  shopPerformances: ShopPerformanceSummaryEntity[];
  lastUpdated: string;
}
