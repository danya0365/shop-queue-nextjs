import type { PaginationParams } from '@/src/domain/interfaces/pagination-types';

/**
 * Queue analytics entity representing queue statistics and metrics
 * Following Clean Architecture principles - domain entity
 */
export interface QueueAnalyticsEntity {
  totalQueues: number;
  completedQueues: number;
  cancelledQueues: number;
  noShowQueues: number;
  inProgressQueues: number;
  waitingQueues: number;
  averageWaitTime: number; // in minutes
  averageServiceTime: number; // in minutes
  completionRate: number; // percentage
  cancellationRate: number; // percentage
  noShowRate: number; // percentage
  dateRange: {
    from: string;
    to: string;
  };
  shopId?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Queue time analytics entity for time-based analysis
 */
export interface QueueTimeAnalyticsEntity {
  averageWaitTime: number; // in minutes
  medianWaitTime: number; // in minutes
  minWaitTime: number; // in minutes
  maxWaitTime: number; // in minutes
  averageServiceTime: number; // in minutes
  medianServiceTime: number; // in minutes
  minServiceTime: number; // in minutes
  maxServiceTime: number; // in minutes
  totalServiceTime: number; // in minutes
  dateRange: {
    from: string;
    to: string;
  };
  shopId?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Queue peak hours entity for identifying busy periods
 */
export interface QueuePeakHoursEntity {
  peakHours: Array<{
    hour: number; // 0-23
    queueCount: number;
    averageWaitTime: number;
    completionRate: number;
  }>;
  quietHours: Array<{
    hour: number; // 0-23
    queueCount: number;
    averageWaitTime: number;
  }>;
  recommendedStaffing: Array<{
    hour: number; // 0-23
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
 * Queue service analytics entity for service usage analysis
 */
export interface QueueServiceAnalyticsEntity {
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
 * Paginated queue analytics entity
 */
export interface PaginatedQueueAnalyticsEntity {
  data: QueueAnalyticsEntity[];
  pagination: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Analytics filters for advanced filtering
 */
export interface QueueAnalyticsFilters {
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
