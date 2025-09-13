import {
  QueueAnalyticsEntity,
  QueueTimeAnalyticsEntity,
  QueuePeakHoursEntity,
  QueueServiceAnalyticsEntity,
  QueueAnalyticsFilters
} from "@/src/domain/entities/shop/backend/backend-queue-analytics.entity";
import {
  QueueAnalyticsSchema,
  QueuePeakHoursSchema,
  QueueServiceAnalyticsSchema,
  QueueAnalyticsCacheSchema
} from "@/src/infrastructure/schemas/shop/backend/queue-analytics.schema";
import { DatabaseDataSource, FilterOperator, QueryOptions, SortDirection } from "@/src/domain/interfaces/datasources/database-datasource";
import { Logger } from "@/src/domain/interfaces/logger";
import { PaginationParams } from "@/src/domain/interfaces/pagination-types";
import { ShopBackendQueueAnalyticsError, ShopBackendQueueAnalyticsErrorType, ShopBackendQueueAnalyticsRepository } from "@/src/domain/repositories/shop/backend/backend-queue-analytics-repository";
import { SupabaseShopBackendQueueAnalyticsMapper } from "@/src/infrastructure/mappers/shop/backend/supabase-backend-queue-analytics.mapper";
import { StandardRepository } from "../../base/standard-repository";

// Extended types for joined data
type QueueAnalyticsSchemaRecord = Record<string, unknown> & QueueAnalyticsSchema;
type QueueAnalyticsCacheSchemaRecord = Record<string, unknown> & QueueAnalyticsCacheSchema;

/**
 * Supabase implementation of the queue analytics repository
 * Following Clean Architecture principles for repository implementation
 */
export class SupabaseShopBackendQueueAnalyticsRepository extends StandardRepository implements ShopBackendQueueAnalyticsRepository {
  private readonly mapper = new SupabaseShopBackendQueueAnalyticsMapper();

  constructor(
    dataSource: DatabaseDataSource,
    logger: Logger
  ) {
    super(dataSource, logger, "ShopBackendQueueAnalytics");
  }

  /**
   * Get queue analytics data
   */
  async getQueueAnalytics(
    shopId: string,
    dateFrom: string,
    dateTo: string,
    filters?: QueueAnalyticsFilters
  ): Promise<QueueAnalyticsEntity> {
    try {
      this.logger.info('Getting queue analytics', { shopId, dateFrom, dateTo, filters });

      // First, try to get from cache
      const cachedAnalytics = await this.getCachedQueueAnalytics(shopId);
      if (cachedAnalytics && this.isCacheValid(cachedAnalytics, dateFrom, dateTo)) {
        this.logger.info('Returning cached queue analytics', { shopId });
        return cachedAnalytics;
      }

      // Build query options
      const queryOptions: QueryOptions = {
        filters: [
          {
            field: 'shop_id',
            operator: FilterOperator.EQ,
            value: shopId
          },
          {
            field: 'date_from',
            operator: FilterOperator.LTE,
            value: dateFrom
          },
          {
            field: 'date_to',
            operator: FilterOperator.GTE,
            value: dateTo
          }
        ],
        sort: [
          {
            field: 'created_at',
            direction: SortDirection.DESC
          }
        ],
        pagination: {
          limit: 1
        }
      };

      // Apply additional filters
      if (filters) {
        this.applyAnalyticsFilters(queryOptions, filters);
      }

      // Query the database
      const result = await this.dataSource.getAdvanced<QueueAnalyticsSchemaRecord>(
        'queue_analytics',
        queryOptions
      );

      if (!result || result.length === 0) {
        // If no analytics exist, calculate them from raw queue data
        const calculatedAnalytics = await this.calculateQueueAnalytics(shopId, dateFrom, dateTo, filters);
        
        // Cache the result
        await this.cacheQueueAnalytics(shopId, calculatedAnalytics);
        
        return calculatedAnalytics;
      }

      // Map the first result to domain entity
      const analyticsRecord = result[0];
      const analytics = SupabaseShopBackendQueueAnalyticsMapper.toQueueAnalyticsEntity(analyticsRecord);
      
      // Cache the result
      await this.cacheQueueAnalytics(shopId, analytics);

      return analytics;
    } catch (error) {
      this.logger.error('Failed to get queue analytics', { shopId, dateFrom, dateTo, error });
      
      if (error instanceof ShopBackendQueueAnalyticsError) {
        throw error;
      }

      throw new ShopBackendQueueAnalyticsError(
        ShopBackendQueueAnalyticsErrorType.OPERATION_FAILED,
        'Failed to get queue analytics',
        'getQueueAnalytics',
        { shopId, dateFrom, dateTo, filters },
        error
      );
    }
  }

  /**
   * Get queue time analytics data
   */
  async getQueueTimeAnalytics(
    shopId: string,
    dateFrom: string,
    dateTo: string,
    filters?: QueueAnalyticsFilters
  ): Promise<QueueTimeAnalyticsEntity> {
    try {
      this.logger.info('Getting queue time analytics', { shopId, dateFrom, dateTo, filters });

      // Calculate time analytics from raw queue data
      const timeAnalytics = await this.calculateQueueTimeAnalytics(shopId, dateFrom, dateTo, filters);

      return timeAnalytics;
    } catch (error) {
      this.logger.error('Failed to get queue time analytics', { shopId, dateFrom, dateTo, error });
      
      if (error instanceof ShopBackendQueueAnalyticsError) {
        throw error;
      }

      throw new ShopBackendQueueAnalyticsError(
        ShopBackendQueueAnalyticsErrorType.OPERATION_FAILED,
        'Failed to get queue time analytics',
        'getQueueTimeAnalytics',
        { shopId, dateFrom, dateTo, filters },
        error
      );
    }
  }

  /**
   * Get queue peak hours data
   */
  async getQueuePeakHours(
    shopId: string,
    dateFrom: string,
    dateTo: string,
    filters?: QueueAnalyticsFilters
  ): Promise<QueuePeakHoursEntity> {
    try {
      const filtersArray = [
        { field: 'shop_id', operator: FilterOperator.EQ, value: shopId },
        { field: 'date_from', operator: FilterOperator.GTE, value: dateFrom },
        { field: 'date_to', operator: FilterOperator.LTE, value: dateTo }
      ];
      
      if (filters?.departmentId) {
        filtersArray.push({ field: 'department_id', operator: FilterOperator.EQ, value: filters.departmentId });
      }
      if (filters?.employeeId) {
        filtersArray.push({ field: 'employee_id', operator: FilterOperator.EQ, value: filters.employeeId });
      }
      if (filters?.serviceId) {
        filtersArray.push({ field: 'service_id', operator: FilterOperator.EQ, value: filters.serviceId });
      }

      const queryOptions: QueryOptions = {
        filters: filtersArray
      };

      const result = await this.dataSource.getAdvanced<QueuePeakHoursSchema>(
        'queue_peak_hours',
        queryOptions
      );

      if (!result || result.length === 0) {
        throw new ShopBackendQueueAnalyticsError(
          ShopBackendQueueAnalyticsErrorType.NOT_FOUND,
          `No peak hours data found for shop ${shopId}`,
          'getQueuePeakHours',
          { shopId, dateFrom, dateTo, filters }
        );
      }

      return SupabaseShopBackendQueueAnalyticsMapper.toQueuePeakHoursEntity(result);
    } catch (error) {
      this.logger.error('Failed to get queue peak hours', {
        error,
        shopId,
        dateFrom,
        dateTo,
        filters
      });
      
      if (error instanceof ShopBackendQueueAnalyticsError) {
        throw error;
      }
      
      throw new ShopBackendQueueAnalyticsError(
        ShopBackendQueueAnalyticsErrorType.OPERATION_FAILED,
        'Failed to get queue peak hours',
        'getQueuePeakHours',
        { shopId, dateFrom, dateTo, filters },
        error
      );
    }
  }

  /**
   * Get queue service analytics data
   */
  async getQueueServiceAnalytics(
    shopId: string,
    dateFrom: string,
    dateTo: string,
    filters?: QueueAnalyticsFilters
  ): Promise<QueueServiceAnalyticsEntity> {
    try {
      const filtersArray = [
        { field: 'shop_id', operator: FilterOperator.EQ, value: shopId },
        { field: 'date_from', operator: FilterOperator.GTE, value: dateFrom },
        { field: 'date_to', operator: FilterOperator.LTE, value: dateTo }
      ];
      
      if (filters?.departmentId) {
        filtersArray.push({ field: 'department_id', operator: FilterOperator.EQ, value: filters.departmentId });
      }
      if (filters?.employeeId) {
        filtersArray.push({ field: 'employee_id', operator: FilterOperator.EQ, value: filters.employeeId });
      }
      if (filters?.serviceId) {
        filtersArray.push({ field: 'service_id', operator: FilterOperator.EQ, value: filters.serviceId });
      }

      const queryOptions: QueryOptions = {
        filters: filtersArray
      };

      const result = await this.dataSource.getAdvanced<QueueServiceAnalyticsSchema>(
        'queue_service_analytics',
        queryOptions
      );

      if (!result || result.length === 0) {
        throw new ShopBackendQueueAnalyticsError(
          ShopBackendQueueAnalyticsErrorType.NOT_FOUND,
          `No service analytics data found for shop ${shopId}`,
          'getQueueServiceAnalytics',
          { shopId, dateFrom, dateTo, filters }
        );
      }

      return SupabaseShopBackendQueueAnalyticsMapper.toQueueServiceAnalyticsEntity(result);
    } catch (error) {
      this.logger.error('Failed to get queue service analytics', {
        error,
        shopId,
        dateFrom,
        dateTo,
        filters
      });
      
      if (error instanceof ShopBackendQueueAnalyticsError) {
        throw error;
      }
      
      throw new ShopBackendQueueAnalyticsError(
        ShopBackendQueueAnalyticsErrorType.OPERATION_FAILED,
        'Failed to get queue service analytics',
        'getQueueServiceAnalytics',
        { shopId, dateFrom, dateTo, filters },
        error
      );
    }
  }

  /**
   * Get queue analytics summary for dashboard
   */
  async getQueueAnalyticsSummary(shopId: string): Promise<{
    todayStats: QueueAnalyticsEntity;
    weeklyStats: QueueAnalyticsEntity;
    monthlyStats: QueueAnalyticsEntity;
    peakHours: QueuePeakHoursEntity;
    serviceAnalytics: QueueServiceAnalyticsEntity;
  }> {
    try {
      const today = new Date();
      const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();
      const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).toISOString();
      
      const weekStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay()).toISOString();
      const weekEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate() + (7 - today.getDay())).toISOString();
      
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1).toISOString();
      const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString();

      const [todayStats, weeklyStats, monthlyStats, peakHours, serviceAnalytics] = await Promise.all([
        this.getQueueAnalytics(shopId, todayStart, todayEnd),
        this.getQueueAnalytics(shopId, weekStart, weekEnd),
        this.getQueueAnalytics(shopId, monthStart, monthEnd),
        this.getQueuePeakHours(shopId, weekStart, weekEnd),
        this.getQueueServiceAnalytics(shopId, monthStart, monthEnd)
      ]);

      return {
        todayStats,
        weeklyStats,
        monthlyStats,
        peakHours,
        serviceAnalytics
      };
    } catch (error) {
      this.logger.error('Failed to get queue analytics summary', {
        error,
        shopId
      });
      
      if (error instanceof ShopBackendQueueAnalyticsError) {
        throw error;
      }
      
      throw new ShopBackendQueueAnalyticsError(
        ShopBackendQueueAnalyticsErrorType.OPERATION_FAILED,
        'Failed to get queue analytics summary',
        'getQueueAnalyticsSummary',
        { shopId },
        error
      );
    }
  }

  /**
   * Get paginated queue analytics history
   */
  async getPaginatedQueueAnalytics(params: PaginationParams & {
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
  }> {
    try {
      this.logger.info('Getting paginated queue analytics', { params });

      const queryOptions: QueryOptions = {
        filters: [
          {
            field: 'shop_id',
            operator: FilterOperator.EQ,
            value: params.shopId
          }
        ],
        sort: [
          {
            field: 'created_at',
            direction: SortDirection.DESC
          }
        ],
        pagination: {
          page: params.page,
          limit: params.limit
        }
      };

      // Apply date filters
      if (params.dateFrom) {
        queryOptions.filters?.push({
          field: 'date_from',
          operator: FilterOperator.GTE,
          value: params.dateFrom
        });
      }

      if (params.dateTo) {
        queryOptions.filters?.push({
          field: 'date_to',
          operator: FilterOperator.LTE,
          value: params.dateTo
        });
      }

      // Apply additional filters
      if (params.filters) {
        this.applyAnalyticsFilters(queryOptions, params.filters);
      }

      const result = await this.dataSource.getAdvanced<QueueAnalyticsSchemaRecord>(
        'queue_analytics',
        queryOptions
      );

      const analytics = result.length > 0 
        ? SupabaseShopBackendQueueAnalyticsMapper.toQueueAnalyticsEntities(result)
        : [];

      return {
        data: analytics,
        pagination: {
          page: params.page,
          perPage: params.limit,
          total: result.length,
          totalPages: Math.ceil(result.length / params.limit)
        }
      };
    } catch (error) {
      this.logger.error('Failed to get paginated queue analytics', { params, error });
      
      if (error instanceof ShopBackendQueueAnalyticsError) {
        throw error;
      }

      throw new ShopBackendQueueAnalyticsError(
        ShopBackendQueueAnalyticsErrorType.OPERATION_FAILED,
        'Failed to get paginated queue analytics',
        'getPaginatedQueueAnalytics',
        { params },
        error
      );
    }
  }

  /**
   * Cache queue analytics data for performance
   */
  async cacheQueueAnalytics(
    shopId: string,
    analytics: QueueAnalyticsEntity,
    cacheTTL: number = 3600 // Default 1 hour
  ): Promise<void> {
    try {
      this.logger.info('Caching queue analytics', { shopId, cacheTTL });

      const expiresAt = new Date();
      expiresAt.setSeconds(expiresAt.getSeconds() + cacheTTL);

      const cacheData: Omit<QueueAnalyticsCacheSchema, 'id' | 'created_at' | 'updated_at'> = {
        shop_id: shopId,
        analytics_data: analytics as unknown as Record<string, unknown>,
        cache_key: `queue_analytics_${shopId}`,
        expires_at: expiresAt.toISOString()
      };

      await this.dataSource.insert('queue_analytics_cache', cacheData);
    } catch (error) {
      this.logger.error('Failed to cache queue analytics', { shopId, error });
      
      if (error instanceof ShopBackendQueueAnalyticsError) {
        throw error;
      }

      throw new ShopBackendQueueAnalyticsError(
        ShopBackendQueueAnalyticsErrorType.OPERATION_FAILED,
        'Failed to cache queue analytics',
        'cacheQueueAnalytics',
        { shopId, cacheTTL },
        error
      );
    }
  }

  /**
   * Get cached queue analytics data
   */
  async getCachedQueueAnalytics(shopId: string): Promise<QueueAnalyticsEntity | null> {
    try {
      this.logger.info('Getting cached queue analytics', { shopId });

      const queryOptions: QueryOptions = {
        filters: [
          {
            field: 'shop_id',
            operator: FilterOperator.EQ,
            value: shopId
          },
          {
            field: 'cache_key',
            operator: FilterOperator.EQ,
            value: `queue_analytics_${shopId}`
          },
          {
            field: 'expires_at',
            operator: FilterOperator.GT,
            value: new Date().toISOString()
          }
        ],
        sort: [
          {
            field: 'created_at',
            direction: SortDirection.DESC
          }
        ],
        pagination: {
          limit: 1
        }
      };

      const result = await this.dataSource.getAdvanced<QueueAnalyticsCacheSchemaRecord>(
        'queue_analytics_cache',
        queryOptions
      );

      if (!result || result.length === 0) {
        return null;
      }

      const cacheData = result[0];
      return cacheData.analytics_data as unknown as QueueAnalyticsEntity;
    } catch (error) {
      this.logger.error('Failed to get cached queue analytics', { shopId, error });
      
      if (error instanceof ShopBackendQueueAnalyticsError) {
        throw error;
      }

      throw new ShopBackendQueueAnalyticsError(
        ShopBackendQueueAnalyticsErrorType.OPERATION_FAILED,
        'Failed to get cached queue analytics',
        'getCachedQueueAnalytics',
        { shopId },
        error
      );
    }
  }

  /**
   * Invalidate cached analytics data
   */
  async invalidateAnalyticsCache(shopId: string): Promise<void> {
    try {
      this.logger.info('Invalidating analytics cache', { shopId });

      await this.dataSource.delete('queue_analytics_cache', `queue_analytics_${shopId}`);
    } catch (error) {
      this.logger.error('Failed to invalidate analytics cache', { shopId, error });
      
      if (error instanceof ShopBackendQueueAnalyticsError) {
        throw error;
      }

      throw new ShopBackendQueueAnalyticsError(
        ShopBackendQueueAnalyticsErrorType.OPERATION_FAILED,
        'Failed to invalidate analytics cache',
        'invalidateAnalyticsCache',
        { shopId },
        error
      );
    }
  }

  /**
   * Calculate queue analytics from raw queue data
   */
  private async calculateQueueAnalytics(
    shopId: string,
    dateFrom: string,
    dateTo: string,
    filters?: QueueAnalyticsFilters
  ): Promise<QueueAnalyticsEntity> {
    try {
      // Build query to get raw queue data
      const queryOptions: QueryOptions = {
        filters: [
          {
            field: 'shop_id',
            operator: FilterOperator.EQ,
            value: shopId
          },
          {
            field: 'created_at',
            operator: FilterOperator.GTE,
            value: dateFrom
          },
          {
            field: 'created_at',
            operator: FilterOperator.LTE,
            value: dateTo
          }
        ]
      };

      // Apply additional filters
      if (filters) {
        this.applyQueueFilters(queryOptions, filters);
      }

      const result = await this.dataSource.getAdvanced<Record<string, unknown>>(
        'queues',
        queryOptions
      );

      const queues = result || [];

      // Calculate analytics
      const totalQueues = queues.length;
      const completedQueues = queues.filter((q: Record<string, unknown>) => q.status === 'completed').length;
      const cancelledQueues = queues.filter((q: Record<string, unknown>) => q.status === 'cancelled').length;
      const noShowQueues = queues.filter((q: Record<string, unknown>) => q.status === 'no_show').length;
      const inProgressQueues = queues.filter((q: Record<string, unknown>) => q.status === 'in_progress').length;
      const waitingQueues = queues.filter((q: Record<string, unknown>) => q.status === 'waiting').length;

      const completionRate = totalQueues > 0 ? (completedQueues / totalQueues) * 100 : 0;
      const cancellationRate = totalQueues > 0 ? (cancelledQueues / totalQueues) * 100 : 0;
      const noShowRate = totalQueues > 0 ? (noShowQueues / totalQueues) * 100 : 0;

      // Calculate average wait times (simplified calculation)
      const averageWaitTime = this.calculateAverageWaitTime(queues);
      const averageServiceTime = this.calculateAverageServiceTime(queues);

      const analytics: QueueAnalyticsEntity = {
        totalQueues,
        completedQueues,
        cancelledQueues,
        noShowQueues,
        inProgressQueues,
        waitingQueues,
        averageWaitTime,
        averageServiceTime,
        completionRate,
        cancellationRate,
        noShowRate,
        dateRange: {
          from: dateFrom,
          to: dateTo
        },
        shopId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      return analytics;
    } catch (error) {
      throw new ShopBackendQueueAnalyticsError(
        ShopBackendQueueAnalyticsErrorType.OPERATION_FAILED,
        'Failed to calculate queue analytics',
        'calculateQueueAnalytics',
        { shopId, dateFrom, dateTo, filters },
        error
      );
    }
  }

  /**
   * Calculate queue time analytics from raw queue data
   */
  private async calculateQueueTimeAnalytics(
    shopId: string,
    dateFrom: string,
    dateTo: string,
    filters?: QueueAnalyticsFilters
  ): Promise<QueueTimeAnalyticsEntity> {
    try {
      // Similar implementation to calculateQueueAnalytics but focused on time metrics
      const queryOptions: QueryOptions = {
        filters: [
          {
            field: 'shop_id',
            operator: FilterOperator.EQ,
            value: shopId
          },
          {
            field: 'created_at',
            operator: FilterOperator.GTE,
            value: dateFrom
          },
          {
            field: 'created_at',
            operator: FilterOperator.LTE,
            value: dateTo
          }
        ]
      };

      if (filters) {
        this.applyQueueFilters(queryOptions, filters);
      }

      const result = await this.dataSource.getAdvanced<Record<string, unknown>>(
        'queues',
        queryOptions
      );

      const queues = result || [];
      const waitTimes = this.extractWaitTimes(queues);
      const serviceTimes = this.extractServiceTimes(queues);

      const timeAnalytics: QueueTimeAnalyticsEntity = {
        averageWaitTime: this.calculateAverage(waitTimes),
        medianWaitTime: this.calculateMedian(waitTimes),
        minWaitTime: Math.min(...waitTimes),
        maxWaitTime: Math.max(...waitTimes),
        averageServiceTime: this.calculateAverage(serviceTimes),
        medianServiceTime: this.calculateMedian(serviceTimes),
        minServiceTime: Math.min(...serviceTimes),
        maxServiceTime: Math.max(...serviceTimes),
        totalServiceTime: serviceTimes.reduce((sum: number, time: number) => sum + time, 0),
        dateRange: {
          from: dateFrom,
          to: dateTo
        },
        shopId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      return timeAnalytics;
    } catch (error) {
      throw new ShopBackendQueueAnalyticsError(
        ShopBackendQueueAnalyticsErrorType.OPERATION_FAILED,
        'Failed to calculate queue time analytics',
        'calculateQueueTimeAnalytics',
        { shopId, dateFrom, dateTo, filters },
        error
      );
    }
  }

  /**
   * Calculate queue peak hours from raw queue data
   */
  private async calculateQueuePeakHours(
    shopId: string,
    dateFrom: string,
    dateTo: string,
    filters?: QueueAnalyticsFilters
  ): Promise<QueuePeakHoursEntity> {
    try {
      const queryOptions: QueryOptions = {
        filters: [
          {
            field: 'shop_id',
            operator: FilterOperator.EQ,
            value: shopId
          },
          {
            field: 'created_at',
            operator: FilterOperator.GTE,
            value: dateFrom
          },
          {
            field: 'created_at',
            operator: FilterOperator.LTE,
            value: dateTo
          }
        ]
      };

      if (filters) {
        this.applyQueueFilters(queryOptions, filters);
      }

      const result = await this.dataSource.getAdvanced<Record<string, unknown>>(
        'queues',
        queryOptions
      );

      const queues = result || [];
      const hourlyData = this.groupQueuesByHour(queues);

      const peakHoursData: Array<{
        hour: number;
        queueCount: number;
        averageWaitTime: number;
        completionRate: number;
      }> = [];
      
      const quietHoursData: Array<{
        hour: number;
        queueCount: number;
        averageWaitTime: number;
      }> = [];
      
      const recommendedStaffingData: Array<{
        hour: number;
        recommendedEmployees: number;
        reason: string;
      }> = [];
      
      const averageHourlyVolume = this.calculateAverageHourlyVolume(hourlyData);
      
      for (let hour = 0; hour < 24; hour++) {
        const hourData = hourlyData[hour] || [];
        const totalQueues = hourData.length;
        const completedQueues = hourData.filter((q: Record<string, unknown>) => q.status === 'completed').length;
        const completionRate = totalQueues > 0 ? (completedQueues / totalQueues) * 100 : 0;
        const averageWaitTime = this.calculateAverageWaitTime(hourData);

        const isPeakHour = totalQueues > averageHourlyVolume;
        const staffingRecommendation = this.generateStaffingRecommendation(totalQueues, completionRate, averageWaitTime);

        if (isPeakHour) {
          peakHoursData.push({
            hour,
            queueCount: totalQueues,
            averageWaitTime,
            completionRate
          });
        } else {
          quietHoursData.push({
            hour,
            queueCount: totalQueues,
            averageWaitTime
          });
        }
        
        recommendedStaffingData.push({
          hour,
          recommendedEmployees: Math.ceil(totalQueues / 10), // Simple calculation
          reason: staffingRecommendation
        });
      }

      return {
        peakHours: peakHoursData,
        quietHours: quietHoursData,
        recommendedStaffing: recommendedStaffingData,
        dateRange: {
          from: dateFrom,
          to: dateTo
        },
        shopId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    } catch (error) {
      throw new ShopBackendQueueAnalyticsError(
        ShopBackendQueueAnalyticsErrorType.OPERATION_FAILED,
        'Failed to calculate queue peak hours',
        'calculateQueuePeakHours',
        { shopId, dateFrom, dateTo, filters },
        error
      );
    }
  }

  /**
   * Calculate queue service analytics from raw queue data
   */
  private async calculateQueueServiceAnalytics(
    shopId: string,
    dateFrom: string,
    dateTo: string,
    filters?: QueueAnalyticsFilters
  ): Promise<QueueServiceAnalyticsEntity> {
    try {
      const queryOptions: QueryOptions = {
        filters: [
          {
            field: 'shop_id',
            operator: FilterOperator.EQ,
            value: shopId
          },
          {
            field: 'created_at',
            operator: FilterOperator.GTE,
            value: dateFrom
          },
          {
            field: 'created_at',
            operator: FilterOperator.LTE,
            value: dateTo
          }
        ]
      };

      if (filters) {
        this.applyQueueFilters(queryOptions, filters);
      }

      const result = await this.dataSource.getAdvanced<Record<string, unknown>>(
        'queues',
        queryOptions
      );

      const queues = result || [];
      const serviceData = this.groupQueuesByService(queues);

      const serviceStatsData: Array<{
        serviceId: string;
        serviceName: string;
        totalQueues: number;
        completedQueues: number;
        averageWaitTime: number;
        averageServiceTime: number;
        revenue: number;
        popularityScore: number;
      }> = [];
      
      for (const [serviceId, serviceQueues] of Object.entries(serviceData)) {
        const totalQueues = serviceQueues.length;
        const completedQueues = serviceQueues.filter((q: Record<string, unknown>) => q.status === 'completed').length;
        const completionRate = totalQueues > 0 ? (completedQueues / totalQueues) * 100 : 0;
        const averageWaitTime = this.calculateAverageWaitTime(serviceQueues);
        const averageServiceTime = this.calculateAverageServiceTime(serviceQueues);
        const totalRevenue = this.calculateTotalRevenue(serviceQueues);
        const popularityScore = this.calculatePopularityScore(totalQueues, completionRate, totalRevenue);

        serviceStatsData.push({
          serviceId,
          serviceName: String(serviceQueues[0]?.service_name || `Service ${serviceId}`),
          totalQueues,
          completedQueues,
          averageWaitTime,
          averageServiceTime,
          revenue: totalRevenue,
          popularityScore
        });
      }
      
      // Sort by popularity score to determine top and least popular services
      const sortedServices = [...serviceStatsData].sort((a, b) => b.popularityScore - a.popularityScore);
      const topServices = sortedServices.slice(0, 5).map(service => ({
        serviceId: service.serviceId,
        serviceName: service.serviceName,
        queueCount: service.totalQueues,
        revenue: service.revenue
      }));
      
      const leastPopularServices = sortedServices.slice(-5).map(service => ({
        serviceId: service.serviceId,
        serviceName: service.serviceName,
        queueCount: service.totalQueues,
        revenue: service.revenue
      }));

      return {
        serviceStats: serviceStatsData,
        topServices,
        leastPopularServices,
        dateRange: {
          from: dateFrom,
          to: dateTo
        },
        shopId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    } catch (error) {
      throw new ShopBackendQueueAnalyticsError(
        ShopBackendQueueAnalyticsErrorType.OPERATION_FAILED,
        'Failed to calculate queue service analytics',
        'calculateQueueServiceAnalytics',
        { shopId, dateFrom, dateTo, filters },
        error
      );
    }
  }

  // Helper methods for calculations
  private applyAnalyticsFilters(queryOptions: QueryOptions, filters: QueueAnalyticsFilters): void {
    // Apply analytics-specific filters
    if (filters.employeeId) {
      queryOptions.filters?.push({
        field: 'employee_id',
        operator: FilterOperator.EQ,
        value: filters.employeeId
      });
    }

    if (filters.serviceId) {
      queryOptions.filters?.push({
        field: 'service_id',
        operator: FilterOperator.EQ,
        value: filters.serviceId
      });
    }

    if (filters.statusFilter) {
      queryOptions.filters?.push({
        field: 'status',
        operator: FilterOperator.EQ,
        value: filters.statusFilter
      });
    }
  }

  private applyQueueFilters(queryOptions: QueryOptions, filters: QueueAnalyticsFilters): void {
    // Apply queue-specific filters
    this.applyAnalyticsFilters(queryOptions, filters);
  }

  private isCacheValid(cachedAnalytics: QueueAnalyticsEntity, dateFrom: string, dateTo: string): boolean {
    return cachedAnalytics.dateRange.from <= dateFrom && cachedAnalytics.dateRange.to >= dateTo;
  }

  private calculateAverageWaitTime(queues: Record<string, unknown>[]): number {
    const waitTimes = this.extractWaitTimes(queues);
    return this.calculateAverage(waitTimes);
  }

  private calculateAverageServiceTime(queues: Record<string, unknown>[]): number {
    const serviceTimes = this.extractServiceTimes(queues);
    return this.calculateAverage(serviceTimes);
  }

  private extractWaitTimes(queues: Record<string, unknown>[]): number[] {
    return queues
      .map((q: Record<string, unknown>) => q.actual_wait_time as number || 0)
      .filter((time: number) => time > 0);
  }

  private extractServiceTimes(queues: Record<string, unknown>[]): number[] {
    return queues
      .map((q: Record<string, unknown>) => {
        const createdAt = new Date(q.created_at as string);
        const completedAt = q.completed_at ? new Date(q.completed_at as string) : createdAt;
        return (completedAt.getTime() - createdAt.getTime()) / (1000 * 60); // Convert to minutes
      })
      .filter((time: number) => time > 0);
  }

  private calculateAverage(numbers: number[]): number {
    if (numbers.length === 0) return 0;
    return numbers.reduce((sum: number, num: number) => sum + num, 0) / numbers.length;
  }

  private calculateMedian(numbers: number[]): number {
    if (numbers.length === 0) return 0;
    const sorted = [...numbers].sort((a: number, b: number) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0 
      ? (sorted[mid - 1] + sorted[mid]) / 2 
      : sorted[mid];
  }

  private groupQueuesByHour(queues: Record<string, unknown>[]): Record<number, Record<string, unknown>[]> {
    const hourlyData: Record<number, Record<string, unknown>[]> = {};
    
    queues.forEach((queue: Record<string, unknown>) => {
      const createdAt = new Date(queue.created_at as string);
      const hour = createdAt.getHours();
      
      if (!hourlyData[hour]) {
        hourlyData[hour] = [];
      }
      hourlyData[hour].push(queue);
    });

    return hourlyData;
  }

  private calculateAverageHourlyVolume(hourlyData: Record<number, Record<string, unknown>[]>): number {
    const volumes = Object.values(hourlyData).map((queues: Record<string, unknown>[]) => queues.length);
    return this.calculateAverage(volumes);
  }

  private generateStaffingRecommendation(totalQueues: number, completionRate: number, averageWaitTime: number): string {
    if (totalQueues === 0) return 'No activity';
    if (completionRate < 50) return 'Increase staff immediately';
    if (averageWaitTime > 30) return 'Consider adding staff';
    if (totalQueues > 10) return 'Monitor closely';
    return 'Adequate staffing';
  }

  private groupQueuesByService(queues: Record<string, unknown>[]): Record<string, Record<string, unknown>[]> {
    const serviceData: Record<string, Record<string, unknown>[]> = {};
    
    queues.forEach((queue: Record<string, unknown>) => {
      const serviceId = queue.service_id as string || 'unknown';
      
      if (!serviceData[serviceId]) {
        serviceData[serviceId] = [];
      }
      serviceData[serviceId].push(queue);
    });

    return serviceData;
  }

  private calculateTotalRevenue(queues: Record<string, unknown>[]): number {
    return queues.reduce((sum: number, queue: Record<string, unknown>) => {
      const totalAmount = queue.total_amount as number || 0;
      return sum + totalAmount;
    }, 0);
  }

  private calculatePopularityScore(totalQueues: number, completionRate: number, totalRevenue: number): number {
    const queueScore = Math.min(totalQueues * 2, 100);
    const completionScore = completionRate;
    const revenueScore = Math.min(totalRevenue / 100, 100);
    
    return (queueScore + completionScore + revenueScore) / 3;
  }

  /**
   * Export analytics data
   */
  async exportAnalyticsData(
    shopId: string,
    dateFrom: string,
    dateTo: string,
    format: 'csv' | 'json' | 'pdf',
    filters?: QueueAnalyticsFilters
  ): Promise<string> {
    try {
      // For now, return a mock JSON string - in a real implementation, this would
      // generate and return the actual exported data string
      const mockData = {
        shopId,
        dateFrom,
        dateTo,
        format,
        filters,
        exportedAt: new Date().toISOString()
      };
      
      return JSON.stringify(mockData, null, 2);
    } catch (error) {
      this.logger.error('Failed to export analytics data', {
        error,
        shopId,
        dateFrom,
        dateTo,
        format,
        filters
      });
      
      if (error instanceof ShopBackendQueueAnalyticsError) {
        throw error;
      }
      
      throw new ShopBackendQueueAnalyticsError(
        ShopBackendQueueAnalyticsErrorType.OPERATION_FAILED,
        'Failed to export analytics data',
        'exportAnalyticsData',
        { shopId, dateFrom, dateTo, format, filters }
      );
    }
  }
}
