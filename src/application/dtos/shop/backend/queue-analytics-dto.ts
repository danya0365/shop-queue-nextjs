import type { 
  QueueAnalyticsEntity, 
  QueueTimeAnalyticsEntity, 
  QueuePeakHoursEntity, 
  QueueServiceAnalyticsEntity,
  QueueAnalyticsFilters 
} from '@/src/domain/entities/shop/backend/backend-queue-analytics.entity';

/**
 * Queue Analytics DTO for API responses
 */
export interface QueueAnalyticsDTO {
  totalQueues: number;
  completedQueues: number;
  cancelledQueues: number;
  noShowQueues: number;
  inProgressQueues: number;
  waitingQueues: number;
  averageWaitTime: number;
  averageServiceTime: number;
  completionRate: number;
  cancellationRate: number;
  noShowRate: number;
  dateRange: {
    from: string;
    to: string;
  };
  shopId?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Queue Time Analytics DTO for API responses
 */
export interface QueueTimeAnalyticsDTO {
  averageWaitTime: number;
  medianWaitTime: number;
  minWaitTime: number;
  maxWaitTime: number;
  averageServiceTime: number;
  medianServiceTime: number;
  minServiceTime: number;
  maxServiceTime: number;
  totalServiceTime: number;
  dateRange: {
    from: string;
    to: string;
  };
  shopId?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Queue Peak Hours DTO for API responses
 */
export interface QueuePeakHoursDTO {
  peakHours: Array<{
    hour: number;
    queueCount: number;
    averageWaitTime: number;
    completionRate: number;
  }>;
  quietHours: Array<{
    hour: number;
    queueCount: number;
    averageWaitTime: number;
  }>;
  recommendedStaffing: Array<{
    hour: number;
    recommendedEmployees: number;
    reason: string;
  }>;
  dateRange: {
    from: string;
    to: string;
  };
  shopId?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Queue Service Analytics DTO for API responses
 */
export interface QueueServiceAnalyticsDTO {
  serviceStats: Array<{
    serviceId: string;
    serviceName: string;
    totalQueues: number;
    completedQueues: number;
    averageWaitTime: number;
    averageServiceTime: number;
    revenue: number;
    popularityScore: number;
  }>;
  topServices: Array<{
    serviceId: string;
    serviceName: string;
    queueCount: number;
    revenue: number;
  }>;
  leastPopularServices: Array<{
    serviceId: string;
    serviceName: string;
    queueCount: number;
    revenue: number;
  }>;
  dateRange: {
    from: string;
    to: string;
  };
  shopId?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Input DTO for GetQueueAnalyticsUseCase
 */
export interface GetQueueAnalyticsInput {
  shopId: string;
  dateFrom: string;
  dateTo: string;
  departmentId?: string;
  employeeId?: string;
  serviceId?: string;
}

/**
 * Input DTO for GetQueueTimeAnalyticsUseCase
 */
export interface GetQueueTimeAnalyticsInput {
  shopId: string;
  dateFrom: string;
  dateTo: string;
  departmentId?: string;
  employeeId?: string;
  serviceId?: string;
}

/**
 * Input DTO for GetQueuePeakHoursUseCase
 */
export interface GetQueuePeakHoursInput {
  shopId: string;
  dateFrom: string;
  dateTo: string;
  departmentId?: string;
}

/**
 * Input DTO for GetQueueServiceAnalyticsUseCase
 */
export interface GetQueueServiceAnalyticsInput {
  shopId: string;
  dateFrom: string;
  dateTo: string;
  departmentId?: string;
  employeeId?: string;
}

/**
 * Analytics filters DTO for API requests
 */
export interface QueueAnalyticsFiltersDTO {
  dateFrom?: string;
  dateTo?: string;
  departmentId?: string;
  employeeId?: string;
  serviceId?: string;
  statusFilter?: string;
  priorityFilter?: string;
  minWaitTime?: number;
  maxWaitTime?: number;
  minServiceTime?: number;
  maxServiceTime?: number;
  customerTier?: string;
}

/**
 * Analytics summary DTO for dashboard
 */
export interface QueueAnalyticsSummaryDTO {
  todayStats: {
    totalQueues: number;
    completedQueues: number;
    averageWaitTime: number;
    completionRate: number;
  };
  weeklyStats: {
    totalQueues: number;
    completedQueues: number;
    averageWaitTime: number;
    completionRate: number;
  };
  monthlyStats: {
    totalQueues: number;
    completedQueues: number;
    averageWaitTime: number;
    completionRate: number;
  };
  peakHours: {
    hour: number;
    queueCount: number;
  }[];
  topServices: {
    serviceId: string;
    serviceName: string;
    queueCount: number;
  }[];
  shopId?: string;
  updatedAt: string;
}
