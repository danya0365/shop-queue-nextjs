import type { 
  QueueAnalyticsEntity, 
  QueueTimeAnalyticsEntity, 
  QueuePeakHoursEntity, 
  QueueServiceAnalyticsEntity 
} from '@/src/domain/entities/shop/backend/backend-queue-analytics.entity';
import type { 
  QueueAnalyticsDTO, 
  QueueTimeAnalyticsDTO, 
  QueuePeakHoursDTO, 
  QueueServiceAnalyticsDTO,
  QueueAnalyticsSummaryDTO 
} from '@/src/application/dtos/shop/backend/queue-analytics-dto';

/**
 * Queue Analytics Mapper
 * Following Clean Architecture principles for data transformation
 */
export class QueueAnalyticsMapper {
  /**
   * Convert QueueAnalyticsEntity to QueueAnalyticsDTO
   */
  static toDTO(entity: QueueAnalyticsEntity): QueueAnalyticsDTO {
    return {
      totalQueues: entity.totalQueues,
      completedQueues: entity.completedQueues,
      cancelledQueues: entity.cancelledQueues,
      noShowQueues: entity.noShowQueues,
      inProgressQueues: entity.inProgressQueues,
      waitingQueues: entity.waitingQueues,
      averageWaitTime: entity.averageWaitTime,
      averageServiceTime: entity.averageServiceTime,
      completionRate: entity.completionRate,
      cancellationRate: entity.cancellationRate,
      noShowRate: entity.noShowRate,
      dateRange: {
        from: entity.dateRange.from,
        to: entity.dateRange.to
      },
      shopId: entity.shopId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt
    };
  }

  /**
   * Convert QueueTimeAnalyticsEntity to QueueTimeAnalyticsDTO
   */
  static toTimeAnalyticsDTO(entity: QueueTimeAnalyticsEntity): QueueTimeAnalyticsDTO {
    return {
      averageWaitTime: entity.averageWaitTime,
      medianWaitTime: entity.medianWaitTime,
      minWaitTime: entity.minWaitTime,
      maxWaitTime: entity.maxWaitTime,
      averageServiceTime: entity.averageServiceTime,
      medianServiceTime: entity.medianServiceTime,
      minServiceTime: entity.minServiceTime,
      maxServiceTime: entity.maxServiceTime,
      totalServiceTime: entity.totalServiceTime,
      dateRange: {
        from: entity.dateRange.from,
        to: entity.dateRange.to
      },
      shopId: entity.shopId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt
    };
  }

  /**
   * Convert QueuePeakHoursEntity to QueuePeakHoursDTO
   */
  static toPeakHoursDTO(entity: QueuePeakHoursEntity): QueuePeakHoursDTO {
    return {
      peakHours: entity.peakHours.map(hour => ({
        hour: hour.hour,
        queueCount: hour.queueCount,
        averageWaitTime: hour.averageWaitTime,
        completionRate: hour.completionRate
      })),
      quietHours: entity.quietHours.map(hour => ({
        hour: hour.hour,
        queueCount: hour.queueCount,
        averageWaitTime: hour.averageWaitTime
      })),
      recommendedStaffing: entity.recommendedStaffing.map(staff => ({
        hour: staff.hour,
        recommendedEmployees: staff.recommendedEmployees,
        reason: staff.reason
      })),
      dateRange: {
        from: entity.dateRange.from,
        to: entity.dateRange.to
      },
      shopId: entity.shopId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt
    };
  }

  /**
   * Convert QueueServiceAnalyticsEntity to QueueServiceAnalyticsDTO
   */
  static toServiceAnalyticsDTO(entity: QueueServiceAnalyticsEntity): QueueServiceAnalyticsDTO {
    return {
      serviceStats: entity.serviceStats.map(stat => ({
        serviceId: stat.serviceId,
        serviceName: stat.serviceName,
        totalQueues: stat.totalQueues,
        completedQueues: stat.completedQueues,
        averageWaitTime: stat.averageWaitTime,
        averageServiceTime: stat.averageServiceTime,
        revenue: stat.revenue,
        popularityScore: stat.popularityScore
      })),
      topServices: entity.topServices.map(service => ({
        serviceId: service.serviceId,
        serviceName: service.serviceName,
        queueCount: service.queueCount,
        revenue: service.revenue
      })),
      leastPopularServices: entity.leastPopularServices.map(service => ({
        serviceId: service.serviceId,
        serviceName: service.serviceName,
        queueCount: service.queueCount,
        revenue: service.revenue
      })),
      dateRange: {
        from: entity.dateRange.from,
        to: entity.dateRange.to
      },
      shopId: entity.shopId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt
    };
  }

  /**
   * Create analytics summary DTO from multiple analytics entities
   */
  static toSummaryDTO(
    todayAnalytics: QueueAnalyticsEntity,
    weeklyAnalytics: QueueAnalyticsEntity,
    monthlyAnalytics: QueueAnalyticsEntity,
    peakHours: QueuePeakHoursEntity,
    serviceAnalytics: QueueServiceAnalyticsEntity
  ): QueueAnalyticsSummaryDTO {
    return {
      todayStats: {
        totalQueues: todayAnalytics.totalQueues,
        completedQueues: todayAnalytics.completedQueues,
        averageWaitTime: todayAnalytics.averageWaitTime,
        completionRate: todayAnalytics.completionRate
      },
      weeklyStats: {
        totalQueues: weeklyAnalytics.totalQueues,
        completedQueues: weeklyAnalytics.completedQueues,
        averageWaitTime: weeklyAnalytics.averageWaitTime,
        completionRate: weeklyAnalytics.completionRate
      },
      monthlyStats: {
        totalQueues: monthlyAnalytics.totalQueues,
        completedQueues: monthlyAnalytics.completedQueues,
        averageWaitTime: monthlyAnalytics.averageWaitTime,
        completionRate: monthlyAnalytics.completionRate
      },
      peakHours: peakHours.peakHours
        .sort((a, b) => b.queueCount - a.queueCount)
        .slice(0, 5)
        .map(hour => ({
          hour: hour.hour,
          queueCount: hour.queueCount
        })),
      topServices: serviceAnalytics.topServices
        .slice(0, 5)
        .map(service => ({
          serviceId: service.serviceId,
          serviceName: service.serviceName,
          queueCount: service.queueCount
        })),
      shopId: todayAnalytics.shopId,
      updatedAt: new Date().toISOString()
    };
  }

  /**
   * Calculate completion rate percentage
   */
  static calculateCompletionRate(completed: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  }

  /**
   * Calculate cancellation rate percentage
   */
  static calculateCancellationRate(cancelled: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((cancelled / total) * 100);
  }

  /**
   * Calculate no-show rate percentage
   */
  static calculateNoShowRate(noShow: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((noShow / total) * 100);
  }

  /**
   * Calculate popularity score for a service
   */
  static calculatePopularityScore(
    totalQueues: number,
    completedQueues: number,
    revenue: number,
    averageWaitTime: number
  ): number {
    // Weighted score based on multiple factors
    const completionWeight = 0.4;
    const revenueWeight = 0.3;
    const volumeWeight = 0.2;
    const speedWeight = 0.1;

    const completionScore = totalQueues > 0 ? (completedQueues / totalQueues) * 100 : 0;
    const revenueScore = Math.min(revenue / 1000, 100); // Normalize to 0-100
    const volumeScore = Math.min(totalQueues / 10, 100); // Normalize to 0-100
    const speedScore = Math.max(0, 100 - averageWaitTime); // Lower wait time = higher score

    return Math.round(
      (completionScore * completionWeight) +
      (revenueScore * revenueWeight) +
      (volumeScore * volumeWeight) +
      (speedScore * speedWeight)
    );
  }
}
