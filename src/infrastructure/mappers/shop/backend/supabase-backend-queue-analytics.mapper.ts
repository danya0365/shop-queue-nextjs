import {
  QueueAnalyticsEntity,
  QueueTimeAnalyticsEntity,
  QueuePeakHoursEntity,
  QueueServiceAnalyticsEntity
} from "@/src/domain/entities/shop/backend/backend-queue-analytics.entity";
import {
  QueueAnalyticsSchema,
  QueueTimeAnalyticsSchema,
  QueuePeakHoursSchema,
  QueueServiceAnalyticsSchema
} from "@/src/infrastructure/schemas/shop/backend/queue-analytics.schema";

/**
 * Mapper for converting between domain entities and database schemas for queue analytics
 * Following Clean Architecture principles and mapping patterns
 */
export class SupabaseShopBackendQueueAnalyticsMapper {
  /**
   * Map queue analytics schema to domain entity
   */
  static toQueueAnalyticsEntity(schema: QueueAnalyticsSchema): QueueAnalyticsEntity {
    return {
      totalQueues: schema.total_queues,
      completedQueues: schema.completed_queues,
      cancelledQueues: schema.cancelled_queues,
      noShowQueues: schema.no_show_queues,
      inProgressQueues: schema.in_progress_queues,
      waitingQueues: schema.waiting_queues,
      averageWaitTime: schema.average_wait_time,
      averageServiceTime: schema.average_service_time,
      completionRate: schema.completion_rate,
      cancellationRate: schema.cancellation_rate,
      noShowRate: schema.no_show_rate,
      dateRange: {
        from: schema.date_from,
        to: schema.date_to
      },
      shopId: schema.shop_id,
      createdAt: schema.created_at,
      updatedAt: schema.updated_at
    };
  }

  /**
   * Map queue time analytics schema to domain entity
   */
  static toQueueTimeAnalyticsEntity(schema: QueueTimeAnalyticsSchema): QueueTimeAnalyticsEntity {
    return {
      averageWaitTime: schema.average_wait_time,
      medianWaitTime: schema.median_wait_time,
      minWaitTime: schema.min_wait_time,
      maxWaitTime: schema.max_wait_time,
      averageServiceTime: schema.average_service_time,
      medianServiceTime: schema.median_service_time,
      minServiceTime: schema.min_service_time,
      maxServiceTime: schema.max_service_time,
      totalServiceTime: schema.total_service_time,
      dateRange: {
        from: schema.date_from,
        to: schema.date_to
      },
      shopId: schema.shop_id,
      createdAt: schema.created_at,
      updatedAt: schema.updated_at
    };
  }

  /**
   * Map queue peak hours schema to domain entity
   */
  static toQueuePeakHoursEntity(schemas: QueuePeakHoursSchema[]): QueuePeakHoursEntity {
    const peakHoursData = schemas.map(schema => ({
      hour: schema.hour,
      queueCount: schema.total_queues,
      averageWaitTime: schema.average_wait_time,
      completionRate: schema.completion_rate
    }));

    const quietHoursData = peakHoursData
      .filter(hour => hour.queueCount < this.calculateAverageQueueCount(peakHoursData))
      .map(hour => ({
        hour: hour.hour,
        queueCount: hour.queueCount,
        averageWaitTime: hour.averageWaitTime
      }));

    const recommendedStaffingData = peakHoursData.map(hour => ({
      hour: hour.hour,
      recommendedEmployees: this.calculateRecommendedEmployees(hour.queueCount, hour.averageWaitTime),
      reason: this.generateStaffingReason(hour.queueCount, hour.averageWaitTime, hour.completionRate)
    }));

    return {
      peakHours: peakHoursData,
      quietHours: quietHoursData,
      recommendedStaffing: recommendedStaffingData,
      dateRange: {
        from: schemas[0]?.date_from || '',
        to: schemas[0]?.date_to || ''
      },
      shopId: schemas[0]?.shop_id,
      createdAt: schemas[0]?.created_at || new Date().toISOString(),
      updatedAt: schemas[0]?.updated_at || new Date().toISOString()
    };
  }

  /**
   * Map queue service analytics schema to domain entity
   */
  static toQueueServiceAnalyticsEntity(schemas: QueueServiceAnalyticsSchema[]): QueueServiceAnalyticsEntity {
    const serviceStatsData = schemas.map(schema => ({
      serviceId: schema.service_id,
      serviceName: schema.service_name,
      totalQueues: schema.total_queues,
      completedQueues: schema.completed_queues,
      averageWaitTime: schema.average_wait_time,
      averageServiceTime: schema.average_service_time,
      revenue: schema.total_revenue,
      popularityScore: schema.popularity_score
    }));

    const topServicesData = serviceStatsData
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)
      .map(service => ({
        serviceId: service.serviceId,
        serviceName: service.serviceName,
        queueCount: service.totalQueues,
        revenue: service.revenue
      }));

    const leastPopularServicesData = serviceStatsData
      .sort((a, b) => a.revenue - b.revenue)
      .slice(0, 5)
      .map(service => ({
        serviceId: service.serviceId,
        serviceName: service.serviceName,
        queueCount: service.totalQueues,
        revenue: service.revenue
      }));

    return {
      serviceStats: serviceStatsData,
      topServices: topServicesData,
      leastPopularServices: leastPopularServicesData,
      dateRange: {
        from: schemas[0]?.date_from || '',
        to: schemas[0]?.date_to || ''
      },
      shopId: schemas[0]?.shop_id,
      createdAt: schemas[0]?.created_at || new Date().toISOString(),
      updatedAt: schemas[0]?.updated_at || new Date().toISOString()
    };
  }

  /**
   * Map domain entity to queue analytics schema (for inserts/updates)
   */
  static fromQueueAnalyticsEntity(entity: QueueAnalyticsEntity): Omit<QueueAnalyticsSchema, 'id' | 'created_at' | 'updated_at'> {
    return {
      shop_id: entity.shopId || '',
      total_queues: entity.totalQueues,
      completed_queues: entity.completedQueues,
      cancelled_queues: entity.cancelledQueues,
      no_show_queues: entity.noShowQueues,
      in_progress_queues: entity.inProgressQueues,
      waiting_queues: entity.waitingQueues,
      average_wait_time: entity.averageWaitTime,
      average_service_time: entity.averageServiceTime,
      completion_rate: entity.completionRate,
      cancellation_rate: entity.cancellationRate,
      no_show_rate: entity.noShowRate,
      date_from: entity.dateRange.from,
      date_to: entity.dateRange.to
    };
  }

  /**
   * Map domain entity to queue time analytics schema (for inserts/updates)
   */
  static fromQueueTimeAnalyticsEntity(entity: QueueTimeAnalyticsEntity): Omit<QueueTimeAnalyticsSchema, 'id' | 'created_at' | 'updated_at'> {
    return {
      shop_id: entity.shopId || '',
      average_wait_time: entity.averageWaitTime,
      median_wait_time: entity.medianWaitTime,
      min_wait_time: entity.minWaitTime,
      max_wait_time: entity.maxWaitTime,
      average_service_time: entity.averageServiceTime,
      median_service_time: entity.medianServiceTime,
      min_service_time: entity.minServiceTime,
      max_service_time: entity.maxServiceTime,
      total_service_time: entity.totalServiceTime,
      date_from: entity.dateRange.from,
      date_to: entity.dateRange.to
    };
  }

  /**
   * Map domain entity to queue peak hours schema (for inserts/updates)
   */
  static fromQueuePeakHoursEntity(entity: QueuePeakHoursEntity): Omit<QueuePeakHoursSchema, 'id' | 'created_at' | 'updated_at'> {
    // For now, return the first peak hour data or default values
    // This is a simplified mapping since the domain entity structure is different
    const firstPeakHour = entity.peakHours[0] || {
      hour: 0,
      queueCount: 0,
      averageWaitTime: 0,
      completionRate: 0
    };
    
    const firstRecommendation = entity.recommendedStaffing[0] || {
      hour: 0,
      recommendedEmployees: 1,
      reason: 'Default staffing'
    };
    
    return {
      shop_id: entity.shopId || '',
      hour: firstPeakHour.hour,
      total_queues: firstPeakHour.queueCount,
      completed_queues: Math.floor(firstPeakHour.queueCount * firstPeakHour.completionRate / 100),
      average_wait_time: firstPeakHour.averageWaitTime,
      completion_rate: firstPeakHour.completionRate,
      is_peak_hour: true, // Default to true for peak hours
      staffing_recommendation: firstRecommendation.reason,
      date_from: entity.dateRange.from,
      date_to: entity.dateRange.to
    };
  }

  /**
   * Map domain entity to queue service analytics schema (for inserts/updates)
   */
  static fromQueueServiceAnalyticsEntity(entity: QueueServiceAnalyticsEntity): Omit<QueueServiceAnalyticsSchema, 'id' | 'created_at' | 'updated_at'> {
    // For now, return the first service stat or default values
    // This is a simplified mapping since the domain entity structure is different
    const firstServiceStat = entity.serviceStats[0] || {
      serviceId: '',
      serviceName: 'Unknown Service',
      totalQueues: 0,
      completedQueues: 0,
      averageWaitTime: 0,
      averageServiceTime: 0,
      revenue: 0,
      popularityScore: 0
    };
    
    return {
      shop_id: entity.shopId || '',
      service_id: firstServiceStat.serviceId,
      service_name: firstServiceStat.serviceName,
      total_queues: firstServiceStat.totalQueues,
      completed_queues: firstServiceStat.completedQueues,
      average_wait_time: firstServiceStat.averageWaitTime,
      average_service_time: firstServiceStat.averageServiceTime,
      total_revenue: firstServiceStat.revenue,
      popularity_score: firstServiceStat.popularityScore,
      date_from: entity.dateRange.from,
      date_to: entity.dateRange.to
    };
  }

  /**
   * Map array of schemas to array of entities
   */
  static toQueueAnalyticsEntities(schemas: QueueAnalyticsSchema[]): QueueAnalyticsEntity[] {
    return schemas.map(schema => this.toQueueAnalyticsEntity(schema));
  }

  /**
   * Map array of peak hours schemas to entity
   */
  static toQueuePeakHoursEntities(schemas: QueuePeakHoursSchema[]): QueuePeakHoursEntity {
    return this.toQueuePeakHoursEntity(schemas);
  }

  /**
   * Map array of service analytics schemas to entity
   */
  static toQueueServiceAnalyticsEntities(schemas: QueueServiceAnalyticsSchema[]): QueueServiceAnalyticsEntity {
    return this.toQueueServiceAnalyticsEntity(schemas);
  }

  // Helper methods
  private static calculateAverageQueueCount(peakHours: Array<{ queueCount: number }>): number {
    if (peakHours.length === 0) return 0;
    const total = peakHours.reduce((sum, hour) => sum + hour.queueCount, 0);
    return total / peakHours.length;
  }

  private static calculateRecommendedEmployees(queueCount: number, averageWaitTime: number): number {
    if (queueCount === 0) return 0;
    if (averageWaitTime > 30) return Math.ceil(queueCount / 2);
    if (averageWaitTime > 15) return Math.ceil(queueCount / 3);
    return Math.ceil(queueCount / 4);
  }

  private static generateStaffingReason(queueCount: number, averageWaitTime: number, completionRate: number): string {
    if (averageWaitTime > 30) return 'High wait times require additional staff';
    if (completionRate < 50) return 'Low completion rate indicates staffing issues';
    if (queueCount > 10) return 'High queue volume requires more employees';
    return 'Standard staffing recommended';
  }
}
