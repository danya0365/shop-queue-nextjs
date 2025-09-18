/**
 * Dashboard entities for the backend
 * Following Clean Architecture principles for domain entities
 */

export interface DashboardStatsEntity {
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

export enum ActivityType {
  QUEUE_CREATED = "queue_created",
  QUEUE_COMPLETED = "queue_completed",
  CUSTOMER_REGISTERED = "customer_registered",
  SHOP_CREATED = "shop_created",
  EMPLOYEE_ADDED = "employee_added",
  EMPLOYEE_UPDATED = "employee_updated",
  EMPLOYEE_REMOVED = "employee_removed",
  EMPLOYEE_LOGIN = "employee_login",
  EMPLOYEE_LOGOUT = "employee_logout",
  EMPLOYEE_DUTY_START = "employee_duty_start",
  EMPLOYEE_DUTY_END = "employee_duty_end",
  SERVICE_ADDED = "service_added",
  SERVICE_UPDATED = "service_updated",
  SERVICE_REMOVED = "service_removed",
  SERVICE_AVAILABILITY_CHANGED = "service_availability_changed",
  PAYMENT_CREATED = "payment_created",
  PAYMENT_COMPLETED = "payment_completed",
  PAYMENT_FAILED = "payment_failed",
  PAYMENT_REFUNDED = "payment_refunded",
  PROMOTION_CREATED = "promotion_created",
  PROMOTION_UPDATED = "promotion_updated",
  PROMOTION_ACTIVATED = "promotion_activated",
  PROMOTION_DEACTIVATED = "promotion_deactivated",
  PROMOTION_USED = "promotion_used",
  POINTS_EARNED = "points_earned",
  POINTS_REDEEMED = "points_redeemed",
  POINTS_EXPIRED = "points_expired",
  REWARD_CLAIMED = "reward_claimed",
  MEMBERSHIP_UPGRADED = "membership_upgraded",
  SYSTEM_BACKUP = "system_backup",
  SYSTEM_MAINTENANCE = "system_maintenance",
  SYSTEM_ERROR = "system_error",
  SYSTEM_ALERT = "system_alert",
  DEPARTMENT_CREATED = "department_created",
  DEPARTMENT_UPDATED = "department_updated",
  DEPARTMENT_REMOVED = "department_removed",
  OPENING_HOURS_UPDATED = "opening_hours_updated",
  SHOP_OPENED = "shop_opened",
  SHOP_CLOSED = "shop_closed",
}

export interface RecentActivityEntity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  created_at: string;
  metadata?: Record<string, unknown>;
}

export interface QueueStatusDistributionEntity {
  waiting: number;
  serving: number;
  completed: number;
  cancelled: number;
  noShow: number;
}

export interface PopularServiceEntity {
  id: string;
  name: string;
  queueCount: number;
  revenue: number;
  category: string;
}

/**
 * Revenue statistics entity
 * Contains comprehensive revenue data for a shop
 */
export interface RevenueStatsEntity {
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

export interface DashboardDataEntity {
  stats: DashboardStatsEntity;
  recentActivities: RecentActivityEntity[];
  queueDistribution: QueueStatusDistributionEntity;
  popularServices: PopularServiceEntity[];
  lastUpdated: string;
}
