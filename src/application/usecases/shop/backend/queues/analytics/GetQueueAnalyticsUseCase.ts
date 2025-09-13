import { QueueAnalyticsDTO, GetQueueAnalyticsInput } from '@/src/application/dtos/shop/backend/queue-analytics-dto';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { QueueAnalyticsMapper } from '@/src/application/mappers/shop/backend/queue-analytics-mapper';
import { QueueAnalyticsEntity } from '@/src/domain/entities/shop/backend/backend-queue-analytics.entity';
import type { Logger } from '@/src/domain/interfaces/logger';
import { ShopBackendQueueAnalyticsError, ShopBackendQueueAnalyticsErrorType } from '@/src/domain/repositories/shop/backend/backend-queue-analytics-repository';
import { ShopBackendQueueAnalyticsRepository } from '@/src/domain/repositories/shop/backend/backend-queue-analytics-repository';
import { ShopBackendQueueRepository } from '@/src/domain/repositories/shop/backend/backend-queue-repository';

/**
 * Use case for getting queue analytics data
 * Following SOLID principles and Clean Architecture
 */
export class GetQueueAnalyticsUseCase implements IUseCase<GetQueueAnalyticsInput, QueueAnalyticsDTO> {
  constructor(
    private readonly queueRepository: ShopBackendQueueRepository,
    private readonly queueAnalyticsRepository: ShopBackendQueueAnalyticsRepository,
    private readonly logger: Logger
  ) { }

  /**
   * Execute the use case to get queue analytics
   * @param input Analytics input parameters
   * @returns Queue analytics DTO
   */
  async execute(input: GetQueueAnalyticsInput): Promise<QueueAnalyticsDTO> {
    try {
      // Validate input
      if (!input.shopId) {
        throw new Error('Shop ID is required');
      }

      if (!input.dateFrom || !input.dateTo) {
        throw new Error('Date range is required');
      }

      // Validate date range
      const fromDate = new Date(input.dateFrom);
      const toDate = new Date(input.dateTo);
      
      if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
        throw new Error('Invalid date format');
      }

      if (fromDate > toDate) {
        throw new Error('Date from must be before date to');
      }

      this.logger.info('Getting queue analytics', { input });

      // Try to get cached analytics first
      const cachedAnalytics = await this.queueAnalyticsRepository.getCachedQueueAnalytics(input.shopId);
      
      if (cachedAnalytics && this.isCacheValid(cachedAnalytics, input)) {
        this.logger.info('Using cached queue analytics', { shopId: input.shopId });
        return QueueAnalyticsMapper.toDTO(cachedAnalytics);
      }

      // Get queues from repository
      const queues = await this.queueRepository.getPaginatedQueues({
        page: 1,
        limit: 10000, // Get all queues for analytics
        filters: {
          shopId: input.shopId,
          dateFrom: input.dateFrom,
          dateTo: input.dateTo,
          employeeId: input.employeeId,
          serviceId: input.serviceId
        }
      });

      // Calculate analytics
      const analytics = this.calculateAnalytics(queues.data, input);

      // Cache the analytics data
      await this.queueAnalyticsRepository.cacheQueueAnalytics(input.shopId, analytics, 300); // Cache for 5 minutes

      return QueueAnalyticsMapper.toDTO(analytics);
    } catch (error) {
      this.logger.error('Failed to get queue analytics', { error, input });

      if (error instanceof ShopBackendQueueAnalyticsError) {
        throw error;
      }

      throw new ShopBackendQueueAnalyticsError(
        ShopBackendQueueAnalyticsErrorType.OPERATION_FAILED,
        'Failed to get queue analytics',
        'getQueueAnalytics',
        { input },
        error
      );
    }
  }

  /**
   * Calculate analytics from queue data
   * @param queues Queue data
   * @param input Input parameters
   * @returns Calculated analytics
   */
  private calculateAnalytics(queues: any[], input: GetQueueAnalyticsInput): QueueAnalyticsEntity {
    const totalQueues = queues.length;
    
    // Count queues by status
    const completedQueues = queues.filter(q => q.status === 'completed').length;
    const cancelledQueues = queues.filter(q => q.status === 'cancelled').length;
    const noShowQueues = queues.filter(q => q.status === 'no_show').length;
    const inProgressQueues = queues.filter(q => q.status === 'in_progress').length;
    const waitingQueues = queues.filter(q => q.status === 'waiting').length;

    // Calculate wait times
    const waitTimes = queues
      .filter(q => q.actualWaitTime && q.actualWaitTime > 0)
      .map(q => q.actualWaitTime);

    const averageWaitTime = waitTimes.length > 0 
      ? Math.round(waitTimes.reduce((sum, time) => sum + time, 0) / waitTimes.length)
      : 0;

    // Calculate service times
    const serviceTimes = queues
      .filter(q => q.completedAt && q.calledAt)
      .map(q => {
        const completed = new Date(q.completedAt).getTime();
        const called = new Date(q.calledAt).getTime();
        return Math.round((completed - called) / (1000 * 60)); // Convert to minutes
      })
      .filter(time => time > 0);

    const averageServiceTime = serviceTimes.length > 0
      ? Math.round(serviceTimes.reduce((sum, time) => sum + time, 0) / serviceTimes.length)
      : 0;

    // Calculate rates
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
        from: input.dateFrom,
        to: input.dateTo
      },
      shopId: input.shopId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  /**
   * Check if cached analytics is still valid
   * @param cachedAnalytics Cached analytics data
   * @param input Current input parameters
   * @returns True if cache is valid
   */
  private isCacheValid(cachedAnalytics: QueueAnalyticsEntity, input: GetQueueAnalyticsInput): boolean {
    const cacheAge = Date.now() - new Date(cachedAnalytics.updatedAt).getTime();
    const maxCacheAge = 5 * 60 * 1000; // 5 minutes

    // Check if cache is too old
    if (cacheAge > maxCacheAge) {
      return false;
    }

    // Check if date range matches
    if (cachedAnalytics.dateRange.from !== input.dateFrom || 
        cachedAnalytics.dateRange.to !== input.dateTo) {
      return false;
    }

    return true;
  }
}
