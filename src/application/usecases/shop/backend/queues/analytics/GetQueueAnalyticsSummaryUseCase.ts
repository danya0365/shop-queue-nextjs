import { QueueAnalyticsSummaryDTO } from '@/src/application/dtos/shop/backend/queue-analytics-dto';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { QueueAnalyticsMapper } from '@/src/application/mappers/shop/backend/queue-analytics-mapper';
import { QueueAnalyticsEntity, QueuePeakHoursEntity, QueueServiceAnalyticsEntity } from '@/src/domain/entities/shop/backend/backend-queue-analytics.entity';
import type { Logger } from '@/src/domain/interfaces/logger';
import { ShopBackendQueueAnalyticsError, ShopBackendQueueAnalyticsErrorType } from '@/src/domain/repositories/shop/backend/backend-queue-analytics-repository';
import { ShopBackendQueueAnalyticsRepository } from '@/src/domain/repositories/shop/backend/backend-queue-analytics-repository';
import { ShopBackendQueueRepository } from '@/src/domain/repositories/shop/backend/backend-queue-repository';

/**
 * Use case for getting queue analytics summary for dashboard
 * Following SOLID principles and Clean Architecture
 */
export class GetQueueAnalyticsSummaryUseCase implements IUseCase<string, QueueAnalyticsSummaryDTO> {
  constructor(
    private readonly queueRepository: ShopBackendQueueRepository,
    private readonly queueAnalyticsRepository: ShopBackendQueueAnalyticsRepository,
    private readonly logger: Logger
  ) { }

  /**
   * Execute the use case to get queue analytics summary
   * @param shopId Shop ID
   * @returns Queue analytics summary DTO
   */
  async execute(shopId: string): Promise<QueueAnalyticsSummaryDTO> {
    try {
      // Validate input
      if (!shopId) {
        throw new Error('Shop ID is required');
      }

      this.logger.info('Getting queue analytics summary', { shopId });

      // Get date ranges for different periods
      const today = this.getTodayRange();
      const week = this.getWeekRange();
      const month = this.getMonthRange();

      // Get analytics for different periods
      const [todayStats, weeklyStats, monthlyStats, peakHours, serviceAnalytics] = await Promise.all([
        this.getAnalyticsForPeriod(shopId, today.from, today.to),
        this.getAnalyticsForPeriod(shopId, week.from, week.to),
        this.getAnalyticsForPeriod(shopId, month.from, month.to),
        this.getPeakHoursForPeriod(shopId, month.from, month.to),
        this.getServiceAnalyticsForPeriod(shopId, month.from, month.to)
      ]);

      // Create summary DTO
      const summary = QueueAnalyticsMapper.toSummaryDTO(
        todayStats,
        weeklyStats,
        monthlyStats,
        peakHours,
        serviceAnalytics
      );

      return summary;
    } catch (error) {
      this.logger.error('Failed to get queue analytics summary', { error, shopId });

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
   * Get analytics for a specific period
   * @param shopId Shop ID
   * @param dateFrom Start date
   * @param dateTo End date
   * @returns Analytics data
   */
  private async getAnalyticsForPeriod(
    shopId: string,
    dateFrom: string,
    dateTo: string
  ): Promise<QueueAnalyticsEntity> {
    try {
      // Try to get cached analytics first
      const cacheKey = `${shopId}_${dateFrom}_${dateTo}`;
      const cachedAnalytics = await this.queueAnalyticsRepository.getCachedQueueAnalytics(cacheKey);
      
      if (cachedAnalytics) {
        return cachedAnalytics;
      }

      // Get queues from repository
      const queues = await this.queueRepository.getPaginatedQueues({
        page: 1,
        limit: 10000,
        filters: {
          shopId,
          dateFrom,
          dateTo
        }
      });

      // Calculate analytics
      const analytics = this.calculateAnalytics(queues.data, { shopId, dateFrom, dateTo });

      // Cache the analytics data
      await this.queueAnalyticsRepository.cacheQueueAnalytics(cacheKey, analytics, 300); // Cache for 5 minutes

      return analytics;
    } catch (error) {
      this.logger.error('Failed to get analytics for period', { error, shopId, dateFrom, dateTo });
      
      // Return default analytics if there's an error
      return this.getDefaultAnalytics(shopId, dateFrom, dateTo);
    }
  }

  /**
   * Get peak hours for a specific period
   * @param shopId Shop ID
   * @param dateFrom Start date
   * @param dateTo End date
   * @returns Peak hours data
   */
  private async getPeakHoursForPeriod(
    shopId: string,
    dateFrom: string,
    dateTo: string
  ): Promise<QueuePeakHoursEntity> {
    try {
      // Get queues from repository
      const queues = await this.queueRepository.getPaginatedQueues({
        page: 1,
        limit: 10000,
        filters: {
          shopId,
          dateFrom,
          dateTo
        }
      });

      // Calculate peak hours
      return this.calculatePeakHours(queues.data, { shopId, dateFrom, dateTo });
    } catch (error) {
      this.logger.error('Failed to get peak hours for period', { error, shopId, dateFrom, dateTo });
      
      // Return default peak hours if there's an error
      return this.getDefaultPeakHours(shopId, dateFrom, dateTo);
    }
  }

  /**
   * Get service analytics for a specific period
   * @param shopId Shop ID
   * @param dateFrom Start date
   * @param dateTo End date
   * @returns Service analytics data
   */
  private async getServiceAnalyticsForPeriod(
    shopId: string,
    dateFrom: string,
    dateTo: string
  ): Promise<QueueServiceAnalyticsEntity> {
    try {
      // Get queues from repository
      const queues = await this.queueRepository.getPaginatedQueues({
        page: 1,
        limit: 10000,
        filters: {
          shopId,
          dateFrom,
          dateTo
        }
      });

      // Calculate service analytics
      return this.calculateServiceAnalytics(queues.data, { shopId, dateFrom, dateTo });
    } catch (error) {
      this.logger.error('Failed to get service analytics for period', { error, shopId, dateFrom, dateTo });
      
      // Return default service analytics if there's an error
      return this.getDefaultServiceAnalytics(shopId, dateFrom, dateTo);
    }
  }

  /**
   * Calculate analytics from queue data
   * @param queues Queue data
   * @param params Parameters
   * @returns Calculated analytics
   */
  private calculateAnalytics(queues: any[], params: { shopId: string; dateFrom: string; dateTo: string }): QueueAnalyticsEntity {
    const totalQueues = queues.length;
    const completedQueues = queues.filter(q => q.status === 'completed').length;
    const cancelledQueues = queues.filter(q => q.status === 'cancelled').length;
    const noShowQueues = queues.filter(q => q.status === 'no_show').length;
    const inProgressQueues = queues.filter(q => q.status === 'in_progress').length;
    const waitingQueues = queues.filter(q => q.status === 'waiting').length;

    const waitTimes = queues
      .filter(q => q.actualWaitTime && q.actualWaitTime > 0)
      .map(q => q.actualWaitTime);

    const averageWaitTime = waitTimes.length > 0 
      ? Math.round(waitTimes.reduce((sum, time) => sum + time, 0) / waitTimes.length)
      : 0;

    const serviceTimes = queues
      .filter(q => q.completedAt && q.calledAt)
      .map(q => {
        const completed = new Date(q.completedAt).getTime();
        const called = new Date(q.calledAt).getTime();
        return Math.round((completed - called) / (1000 * 60));
      })
      .filter(time => time > 0);

    const averageServiceTime = serviceTimes.length > 0
      ? Math.round(serviceTimes.reduce((sum, time) => sum + time, 0) / serviceTimes.length)
      : 0;

    const completionRate = QueueAnalyticsMapper.calculateCompletionRate(completedQueues, totalQueues);
    const cancellationRate = QueueAnalyticsMapper.calculateCancellationRate(cancelledQueues, totalQueues);
    const noShowRate = QueueAnalyticsMapper.calculateNoShowRate(noShowQueues, totalQueues);

    return {
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
        from: params.dateFrom,
        to: params.dateTo
      },
      shopId: params.shopId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  /**
   * Calculate peak hours from queue data
   * @param queues Queue data
   * @param params Parameters
   * @returns Calculated peak hours
   */
  private calculatePeakHours(queues: any[], params: { shopId: string; dateFrom: string; dateTo: string }): QueuePeakHoursEntity {
    const hourlyData: Record<number, any[]> = {};
    
    queues.forEach(queue => {
      const createdAt = new Date(queue.createdAt);
      const hour = createdAt.getHours();
      
      if (!hourlyData[hour]) {
        hourlyData[hour] = [];
      }
      
      hourlyData[hour].push(queue);
    });

    const peakHours = Array.from({ length: 24 }, (_, hour) => {
      const hourQueues = hourlyData[hour] || [];
      const queueCount = hourQueues.length;
      
      const waitTimes = hourQueues
        .filter(q => q.actualWaitTime && q.actualWaitTime > 0)
        .map(q => q.actualWaitTime);
      
      const averageWaitTime = waitTimes.length > 0
        ? Math.round(waitTimes.reduce((sum, time) => sum + time, 0) / waitTimes.length)
        : 0;

      const completedQueues = hourQueues.filter(q => q.status === 'completed').length;
      const completionRate = queueCount > 0 
        ? Math.round((completedQueues / queueCount) * 100)
        : 0;

      return { hour, queueCount, averageWaitTime, completionRate };
    });

    return {
      peakHours: peakHours.sort((a, b) => b.queueCount - a.queueCount).slice(0, 8),
      quietHours: peakHours.sort((a, b) => a.queueCount - b.queueCount).slice(0, 8),
      recommendedStaffing: peakHours.map(stat => ({
        hour: stat.hour,
        recommendedEmployees: stat.queueCount > 10 ? 2 : 1,
        reason: stat.queueCount > 10 ? 'High volume' : 'Normal volume'
      })),
      dateRange: {
        from: params.dateFrom,
        to: params.dateTo
      },
      shopId: params.shopId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  /**
   * Calculate service analytics from queue data
   * @param queues Queue data
   * @param params Parameters
   * @returns Calculated service analytics
   */
  private calculateServiceAnalytics(queues: any[], params: { shopId: string; dateFrom: string; dateTo: string }): QueueServiceAnalyticsEntity {
    const serviceData: Record<string, any[]> = {};
    
    queues.forEach(queue => {
      if (queue.queueServices && Array.isArray(queue.queueServices)) {
        queue.queueServices.forEach((service: any) => {
          const serviceId = service.serviceId;
          
          if (!serviceData[serviceId]) {
            serviceData[serviceId] = [];
          }
          
          serviceData[serviceId].push({
            ...queue,
            currentService: service
          });
        });
      }
    });

    const serviceStats = Object.entries(serviceData).map(([serviceId, serviceQueues]) => {
      const totalQueues = serviceQueues.length;
      const completedQueues = serviceQueues.filter(q => q.status === 'completed').length;
      
      const waitTimes = serviceQueues
        .filter(q => q.actualWaitTime && q.actualWaitTime > 0)
        .map(q => q.actualWaitTime);
      
      const averageWaitTime = waitTimes.length > 0
        ? Math.round(waitTimes.reduce((sum, time) => sum + time, 0) / waitTimes.length)
        : 0;

      const serviceTimes = serviceQueues
        .filter(q => q.completedAt && q.calledAt)
        .map(q => {
          const completed = new Date(q.completedAt).getTime();
          const called = new Date(q.calledAt).getTime();
          return Math.round((completed - called) / (1000 * 60));
        })
        .filter(time => time > 0);

      const averageServiceTime = serviceTimes.length > 0
        ? Math.round(serviceTimes.reduce((sum, time) => sum + time, 0) / serviceTimes.length)
        : 0;

      const revenue = serviceQueues.reduce((sum, queue) => {
        const serviceRevenue = queue.queueServices?.reduce((serviceSum: number, service: any) => {
          return serviceSum + (service.price * service.quantity);
        }, 0) || 0;
        return sum + serviceRevenue;
      }, 0);

      const popularityScore = QueueAnalyticsMapper.calculatePopularityScore(
        totalQueues,
        completedQueues,
        revenue,
        averageWaitTime
      );

      return {
        serviceId,
        serviceName: this.getServiceName(serviceQueues[0], serviceId),
        totalQueues,
        completedQueues,
        averageWaitTime,
        averageServiceTime,
        revenue,
        popularityScore
      };
    });

    const topServices = [...serviceStats]
      .sort((a, b) => b.totalQueues - a.totalQueues)
      .slice(0, 10)
      .map(service => ({
        serviceId: service.serviceId,
        serviceName: service.serviceName,
        queueCount: service.totalQueues,
        revenue: service.revenue
      }));

    const leastPopularServices = [...serviceStats]
      .sort((a, b) => a.totalQueues - b.totalQueues)
      .slice(0, 10)
      .map(service => ({
        serviceId: service.serviceId,
        serviceName: service.serviceName,
        queueCount: service.totalQueues,
        revenue: service.revenue
      }));

    return {
      serviceStats,
      topServices,
      leastPopularServices,
      dateRange: {
        from: params.dateFrom,
        to: params.dateTo
      },
      shopId: params.shopId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  /**
   * Get today's date range
   * @returns Today's date range
   */
  private getTodayRange(): { from: string; to: string } {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
    
    return {
      from: startOfDay.toISOString(),
      to: endOfDay.toISOString()
    };
  }

  /**
   * Get this week's date range
   * @returns This week's date range
   */
  private getWeekRange(): { from: string; to: string } {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - dayOfWeek);
    startOfWeek.setHours(0, 0, 0, 0);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    
    return {
      from: startOfWeek.toISOString(),
      to: endOfWeek.toISOString()
    };
  }

  /**
   * Get this month's date range
   * @returns This month's date range
   */
  private getMonthRange(): { from: string; to: string } {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);
    
    return {
      from: startOfMonth.toISOString(),
      to: endOfMonth.toISOString()
    };
  }

  /**
   * Get default analytics data
   * @param shopId Shop ID
   * @param dateFrom Start date
   * @param dateTo End date
   * @returns Default analytics
   */
  private getDefaultAnalytics(shopId: string, dateFrom: string, dateTo: string): QueueAnalyticsEntity {
    return {
      totalQueues: 0,
      completedQueues: 0,
      cancelledQueues: 0,
      noShowQueues: 0,
      inProgressQueues: 0,
      waitingQueues: 0,
      averageWaitTime: 0,
      averageServiceTime: 0,
      completionRate: 0,
      cancellationRate: 0,
      noShowRate: 0,
      dateRange: { from: dateFrom, to: dateTo },
      shopId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  /**
   * Get default peak hours data
   * @param shopId Shop ID
   * @param dateFrom Start date
   * @param dateTo End date
   * @returns Default peak hours
   */
  private getDefaultPeakHours(shopId: string, dateFrom: string, dateTo: string): QueuePeakHoursEntity {
    return {
      peakHours: [],
      quietHours: [],
      recommendedStaffing: [],
      dateRange: { from: dateFrom, to: dateTo },
      shopId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  /**
   * Get default service analytics data
   * @param shopId Shop ID
   * @param dateFrom Start date
   * @param dateTo End date
   * @returns Default service analytics
   */
  private getDefaultServiceAnalytics(shopId: string, dateFrom: string, dateTo: string): QueueServiceAnalyticsEntity {
    return {
      serviceStats: [],
      topServices: [],
      leastPopularServices: [],
      dateRange: { from: dateFrom, to: dateTo },
      shopId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  /**
   * Get service name from queue data
   * @param queue Queue data
   * @param serviceId Service ID
   * @returns Service name
   */
  private getServiceName(queue: any, serviceId: string): string {
    if (queue.currentService && queue.currentService.serviceName) {
      return queue.currentService.serviceName;
    }
    
    if (queue.queueServices && Array.isArray(queue.queueServices)) {
      const service = queue.queueServices.find((s: any) => s.serviceId === serviceId);
      if (service && service.serviceName) {
        return service.serviceName;
      }
    }
    
    return `Service ${serviceId}`;
  }
}
