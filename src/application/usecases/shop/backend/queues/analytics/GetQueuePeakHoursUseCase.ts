import { QueuePeakHoursDTO, GetQueuePeakHoursInput } from '@/src/application/dtos/shop/backend/queue-analytics-dto';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { QueueAnalyticsMapper } from '@/src/application/mappers/shop/backend/queue-analytics-mapper';
import { QueuePeakHoursEntity } from '@/src/domain/entities/shop/backend/backend-queue-analytics.entity';
import type { Logger } from '@/src/domain/interfaces/logger';
import { ShopBackendQueueAnalyticsError, ShopBackendQueueAnalyticsErrorType } from '@/src/domain/repositories/shop/backend/backend-queue-analytics-repository';
import { ShopBackendQueueAnalyticsRepository } from '@/src/domain/repositories/shop/backend/backend-queue-analytics-repository';
import { ShopBackendQueueRepository } from '@/src/domain/repositories/shop/backend/backend-queue-repository';

/**
 * Use case for getting queue peak hours data
 * Following SOLID principles and Clean Architecture
 */
export class GetQueuePeakHoursUseCase implements IUseCase<GetQueuePeakHoursInput, QueuePeakHoursDTO> {
  constructor(
    private readonly queueRepository: ShopBackendQueueRepository,
    private readonly queueAnalyticsRepository: ShopBackendQueueAnalyticsRepository,
    private readonly logger: Logger
  ) { }

  /**
   * Execute the use case to get queue peak hours
   * @param input Peak hours input parameters
   * @returns Queue peak hours DTO
   */
  async execute(input: GetQueuePeakHoursInput): Promise<QueuePeakHoursDTO> {
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

      this.logger.info('Getting queue peak hours', { input });

      // Get queues from repository
      const queues = await this.queueRepository.getPaginatedQueues({
        page: 1,
        limit: 10000, // Get all queues for analytics
        filters: {
          shopId: input.shopId,
          dateFrom: input.dateFrom,
          dateTo: input.dateTo
        }
      });

      // Calculate peak hours analytics
      const analytics = this.calculatePeakHoursAnalytics(queues.data, input);

      return QueueAnalyticsMapper.toPeakHoursDTO(analytics);
    } catch (error) {
      this.logger.error('Failed to get queue peak hours', { error, input });

      if (error instanceof ShopBackendQueueAnalyticsError) {
        throw error;
      }

      throw new ShopBackendQueueAnalyticsError(
        ShopBackendQueueAnalyticsErrorType.OPERATION_FAILED,
        'Failed to get queue peak hours',
        'getQueuePeakHours',
        { input },
        error
      );
    }
  }

  /**
   * Calculate peak hours analytics from queue data
   * @param queues Queue data
   * @param input Input parameters
   * @returns Calculated peak hours analytics
   */
  private calculatePeakHoursAnalytics(queues: any[], input: GetQueuePeakHoursInput): QueuePeakHoursEntity {
    // Group queues by hour of day
    const hourlyData = this.groupQueuesByHour(queues);

    // Calculate statistics for each hour
    const hourlyStats = Array.from({ length: 24 }, (_, hour) => {
      const hourQueues = hourlyData[hour] || [];
      const queueCount = hourQueues.length;
      
      // Calculate average wait time for this hour
      const waitTimes = hourQueues
        .filter(q => q.actualWaitTime && q.actualWaitTime > 0)
        .map(q => q.actualWaitTime);
      
      const averageWaitTime = waitTimes.length > 0
        ? Math.round(waitTimes.reduce((sum, time) => sum + time, 0) / waitTimes.length)
        : 0;

      // Calculate completion rate for this hour
      const completedQueues = hourQueues.filter(q => q.status === 'completed').length;
      const completionRate = queueCount > 0 
        ? Math.round((completedQueues / queueCount) * 100)
        : 0;

      return {
        hour,
        queueCount,
        averageWaitTime,
        completionRate
      };
    });

    // Identify peak hours (top 30% by queue count)
    const sortedByQueueCount = [...hourlyStats].sort((a, b) => b.queueCount - a.queueCount);
    const peakCountThreshold = Math.max(1, Math.floor(hourlyStats.length * 0.3));
    const peakHours = sortedByQueueCount.slice(0, peakCountThreshold);

    // Identify quiet hours (bottom 30% by queue count)
    const quietHours = sortedByQueueCount.slice(-peakCountThreshold);

    // Generate staffing recommendations
    const recommendedStaffing = this.generateStaffingRecommendations(hourlyStats);

    return {
      peakHours,
      quietHours,
      recommendedStaffing,
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
   * Group queues by hour of day
   * @param queues Queue data
   * @returns Object with hour as key and queues as value
   */
  private groupQueuesByHour(queues: any[]): Record<number, any[]> {
    const hourlyData: Record<number, any[]> = {};
    
    queues.forEach(queue => {
      const createdAt = new Date(queue.createdAt);
      const hour = createdAt.getHours();
      
      if (!hourlyData[hour]) {
        hourlyData[hour] = [];
      }
      
      hourlyData[hour].push(queue);
    });
    
    return hourlyData;
  }

  /**
   * Generate staffing recommendations based on hourly data
   * @param hourlyStats Hourly statistics
   * @returns Staffing recommendations
   */
  private generateStaffingRecommendations(hourlyStats: Array<{
    hour: number;
    queueCount: number;
    averageWaitTime: number;
    completionRate: number;
  }>): Array<{
    hour: number;
    recommendedEmployees: number;
    reason: string;
  }> {
    const recommendations: Array<{
      hour: number;
      recommendedEmployees: number;
      reason: string;
    }> = [];

    // Calculate average queue count
    const avgQueueCount = hourlyStats.reduce((sum, stat) => sum + stat.queueCount, 0) / hourlyStats.length;

    hourlyStats.forEach(stat => {
      let recommendedEmployees = 1; // Default minimum
      let reason = 'Normal staffing level';

      if (stat.queueCount > avgQueueCount * 2) {
        // Very busy hour
        recommendedEmployees = Math.max(2, Math.ceil(stat.queueCount / 5));
        reason = `High volume: ${stat.queueCount} queues (avg: ${Math.round(avgQueueCount)})`;
      } else if (stat.queueCount > avgQueueCount * 1.5) {
        // Busy hour
        recommendedEmployees = Math.max(2, Math.ceil(stat.queueCount / 8));
        reason = `Above average volume: ${stat.queueCount} queues`;
      } else if (stat.queueCount < avgQueueCount * 0.3) {
        // Very quiet hour
        recommendedEmployees = 1;
        reason = `Low volume: ${stat.queueCount} queues`;
      } else if (stat.averageWaitTime > 30) {
        // Long wait times
        recommendedEmployees = Math.max(2, Math.ceil(stat.averageWaitTime / 15));
        reason = `Long wait times: ${stat.averageWaitTime} minutes`;
      } else if (stat.completionRate < 70) {
        // Low completion rate
        recommendedEmployees = Math.max(2, Math.ceil((100 - stat.completionRate) / 20));
        reason = `Low completion rate: ${stat.completionRate}%`;
      }

      recommendations.push({
        hour: stat.hour,
        recommendedEmployees,
        reason
      });
    });

    return recommendations;
  }
}
