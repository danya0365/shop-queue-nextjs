import { QueueTimeAnalyticsDTO, GetQueueTimeAnalyticsInput } from '@/src/application/dtos/shop/backend/queue-analytics-dto';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { QueueAnalyticsMapper } from '@/src/application/mappers/shop/backend/queue-analytics-mapper';
import { QueueTimeAnalyticsEntity } from '@/src/domain/entities/shop/backend/backend-queue-analytics.entity';
import type { Logger } from '@/src/domain/interfaces/logger';
import { ShopBackendQueueAnalyticsError, ShopBackendQueueAnalyticsErrorType } from '@/src/domain/repositories/shop/backend/backend-queue-analytics-repository';
import { ShopBackendQueueAnalyticsRepository } from '@/src/domain/repositories/shop/backend/backend-queue-analytics-repository';
import { ShopBackendQueueRepository } from '@/src/domain/repositories/shop/backend/backend-queue-repository';

/**
 * Use case for getting queue time analytics data
 * Following SOLID principles and Clean Architecture
 */
export class GetQueueTimeAnalyticsUseCase implements IUseCase<GetQueueTimeAnalyticsInput, QueueTimeAnalyticsDTO> {
  constructor(
    private readonly queueRepository: ShopBackendQueueRepository,
    private readonly queueAnalyticsRepository: ShopBackendQueueAnalyticsRepository,
    private readonly logger: Logger
  ) { }

  /**
   * Execute the use case to get queue time analytics
   * @param input Time analytics input parameters
   * @returns Queue time analytics DTO
   */
  async execute(input: GetQueueTimeAnalyticsInput): Promise<QueueTimeAnalyticsDTO> {
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

      this.logger.info('Getting queue time analytics', { input });

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

      // Calculate time analytics
      const analytics = this.calculateTimeAnalytics(queues.data, input);

      return QueueAnalyticsMapper.toTimeAnalyticsDTO(analytics);
    } catch (error) {
      this.logger.error('Failed to get queue time analytics', { error, input });

      if (error instanceof ShopBackendQueueAnalyticsError) {
        throw error;
      }

      throw new ShopBackendQueueAnalyticsError(
        ShopBackendQueueAnalyticsErrorType.OPERATION_FAILED,
        'Failed to get queue time analytics',
        'getQueueTimeAnalytics',
        { input },
        error
      );
    }
  }

  /**
   * Calculate time analytics from queue data
   * @param queues Queue data
   * @param input Input parameters
   * @returns Calculated time analytics
   */
  private calculateTimeAnalytics(queues: any[], input: GetQueueTimeAnalyticsInput): QueueTimeAnalyticsEntity {
    // Calculate wait times
    const waitTimes = queues
      .filter(q => q.actualWaitTime && q.actualWaitTime > 0)
      .map(q => q.actualWaitTime);

    // Calculate service times
    const serviceTimes = queues
      .filter(q => q.completedAt && q.calledAt)
      .map(q => {
        const completed = new Date(q.completedAt).getTime();
        const called = new Date(q.calledAt).getTime();
        return Math.round((completed - called) / (1000 * 60)); // Convert to minutes
      })
      .filter(time => time > 0);

    // Calculate statistics
    const averageWaitTime = this.calculateAverage(waitTimes);
    const medianWaitTime = this.calculateMedian(waitTimes);
    const minWaitTime = waitTimes.length > 0 ? Math.min(...waitTimes) : 0;
    const maxWaitTime = waitTimes.length > 0 ? Math.max(...waitTimes) : 0;

    const averageServiceTime = this.calculateAverage(serviceTimes);
    const medianServiceTime = this.calculateMedian(serviceTimes);
    const minServiceTime = serviceTimes.length > 0 ? Math.min(...serviceTimes) : 0;
    const maxServiceTime = serviceTimes.length > 0 ? Math.max(...serviceTimes) : 0;

    const totalServiceTime = serviceTimes.reduce((sum, time) => sum + time, 0);

    return {
      averageWaitTime,
      medianWaitTime,
      minWaitTime,
      maxWaitTime,
      averageServiceTime,
      medianServiceTime,
      minServiceTime,
      maxServiceTime,
      totalServiceTime,
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
   * Calculate average of an array of numbers
   * @param numbers Array of numbers
   * @returns Average value
   */
  private calculateAverage(numbers: number[]): number {
    if (numbers.length === 0) return 0;
    return Math.round(numbers.reduce((sum, num) => sum + num, 0) / numbers.length);
  }

  /**
   * Calculate median of an array of numbers
   * @param numbers Array of numbers
   * @returns Median value
   */
  private calculateMedian(numbers: number[]): number {
    if (numbers.length === 0) return 0;
    
    const sorted = [...numbers].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    
    if (sorted.length % 2 === 0) {
      return Math.round((sorted[mid - 1] + sorted[mid]) / 2);
    } else {
      return sorted[mid];
    }
  }
}
