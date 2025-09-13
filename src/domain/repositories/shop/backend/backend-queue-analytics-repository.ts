import type { 
  QueueAnalyticsEntity, 
  QueueTimeAnalyticsEntity, 
  QueuePeakHoursEntity, 
  QueueServiceAnalyticsEntity,
  QueueAnalyticsFilters 
} from '@/src/domain/entities/shop/backend/backend-queue-analytics.entity';
import type { PaginationParams } from '@/src/domain/interfaces/pagination-types';

/**
 * Queue analytics repository error types
 */
export enum ShopBackendQueueAnalyticsErrorType {
  NOT_FOUND = 'not_found',
  OPERATION_FAILED = 'operation_failed',
  VALIDATION_ERROR = 'validation_error',
  UNAUTHORIZED = 'unauthorized',
  INSUFFICIENT_DATA = 'insufficient_data',
  UNKNOWN = 'unknown',
}

/**
 * Custom error class for queue analytics repository operations
 * Following Clean Architecture principles for error handling
 */
export class ShopBackendQueueAnalyticsError extends Error {
  constructor(
    public readonly type: ShopBackendQueueAnalyticsErrorType,
    message: string,
    public readonly operation?: string,
    public readonly context?: Record<string, unknown>,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = 'ShopBackendQueueAnalyticsError';
  }
}

/**
 * Queue analytics repository interface
 * Following Clean Architecture principles and Interface Segregation Principle
 */
export interface ShopBackendQueueAnalyticsRepository {
  /**
   * Get queue analytics data
   * @param shopId Shop ID
   * @param dateFrom Start date
   * @param dateTo End date
   * @param filters Optional filters
   * @returns Queue analytics data
   * @throws ShopBackendQueueAnalyticsError if the operation fails
   */
  getQueueAnalytics(
    shopId: string,
    dateFrom: string,
    dateTo: string,
    filters?: QueueAnalyticsFilters
  ): Promise<QueueAnalyticsEntity>;

  /**
   * Get queue time analytics data
   * @param shopId Shop ID
   * @param dateFrom Start date
   * @param dateTo End date
   * @param filters Optional filters
   * @returns Queue time analytics data
   * @throws ShopBackendQueueAnalyticsError if the operation fails
   */
  getQueueTimeAnalytics(
    shopId: string,
    dateFrom: string,
    dateTo: string,
    filters?: QueueAnalyticsFilters
  ): Promise<QueueTimeAnalyticsEntity>;

  /**
   * Get queue peak hours data
   * @param shopId Shop ID
   * @param dateFrom Start date
   * @param dateTo End date
   * @param filters Optional filters
   * @returns Queue peak hours data
   * @throws ShopBackendQueueAnalyticsError if the operation fails
   */
  getQueuePeakHours(
    shopId: string,
    dateFrom: string,
    dateTo: string,
    filters?: QueueAnalyticsFilters
  ): Promise<QueuePeakHoursEntity>;

  /**
   * Get queue service analytics data
   * @param shopId Shop ID
   * @param dateFrom Start date
   * @param dateTo End date
   * @param filters Optional filters
   * @returns Queue service analytics data
   * @throws ShopBackendQueueAnalyticsError if the operation fails
   */
  getQueueServiceAnalytics(
    shopId: string,
    dateFrom: string,
    dateTo: string,
    filters?: QueueAnalyticsFilters
  ): Promise<QueueServiceAnalyticsEntity>;

  /**
   * Get queue analytics summary for dashboard
   * @param shopId Shop ID
   * @returns Queue analytics summary
   * @throws ShopBackendQueueAnalyticsError if the operation fails
   */
  getQueueAnalyticsSummary(shopId: string): Promise<{
    todayStats: QueueAnalyticsEntity;
    weeklyStats: QueueAnalyticsEntity;
    monthlyStats: QueueAnalyticsEntity;
    peakHours: QueuePeakHoursEntity;
    serviceAnalytics: QueueServiceAnalyticsEntity;
  }>;

  /**
   * Get paginated queue analytics history
   * @param params Pagination parameters
   * @returns Paginated queue analytics data
   * @throws ShopBackendQueueAnalyticsError if the operation fails
   */
  getPaginatedQueueAnalytics(params: PaginationParams & {
    shopId: string;
    dateFrom?: string;
    dateTo?: string;
    filters?: QueueAnalyticsFilters;
  }): Promise<{
    data: QueueAnalyticsEntity[];
    pagination: {
      page: number;
      perPage: number;
      total: number;
      totalPages: number;
    };
  }>;

  /**
   * Cache queue analytics data for performance
   * @param shopId Shop ID
   * @param analytics Analytics data to cache
   * @param cacheTTL Cache time to live in seconds
   * @throws ShopBackendQueueAnalyticsError if the operation fails
   */
  cacheQueueAnalytics(
    shopId: string,
    analytics: QueueAnalyticsEntity,
    cacheTTL?: number
  ): Promise<void>;

  /**
   * Get cached queue analytics data
   * @param shopId Shop ID
   * @returns Cached analytics data or null if not found
   * @throws ShopBackendQueueAnalyticsError if the operation fails
   */
  getCachedQueueAnalytics(shopId: string): Promise<QueueAnalyticsEntity | null>;

  /**
   * Invalidate cached analytics data
   * @param shopId Shop ID
   * @throws ShopBackendQueueAnalyticsError if the operation fails
   */
  invalidateAnalyticsCache(shopId: string): Promise<void>;

  /**
   * Export analytics data to different formats
   * @param shopId Shop ID
   * @param dateFrom Start date
   * @param dateTo End date
   * @param format Export format (csv, json, pdf)
   * @param filters Optional filters
   * @returns Exported data as string
   * @throws ShopBackendQueueAnalyticsError if the operation fails
   */
  exportAnalyticsData(
    shopId: string,
    dateFrom: string,
    dateTo: string,
    format: 'csv' | 'json' | 'pdf',
    filters?: QueueAnalyticsFilters
  ): Promise<string>;
}
