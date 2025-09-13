import { QueueServiceAnalyticsDTO, GetQueueServiceAnalyticsInput } from '@/src/application/dtos/shop/backend/queue-analytics-dto';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { QueueAnalyticsMapper } from '@/src/application/mappers/shop/backend/queue-analytics-mapper';
import { QueueServiceAnalyticsEntity } from '@/src/domain/entities/shop/backend/backend-queue-analytics.entity';
import type { Logger } from '@/src/domain/interfaces/logger';
import { ShopBackendQueueAnalyticsError, ShopBackendQueueAnalyticsErrorType } from '@/src/domain/repositories/shop/backend/backend-queue-analytics-repository';
import { ShopBackendQueueAnalyticsRepository } from '@/src/domain/repositories/shop/backend/backend-queue-analytics-repository';
import { ShopBackendQueueRepository } from '@/src/domain/repositories/shop/backend/backend-queue-repository';

/**
 * Use case for getting queue service analytics data
 * Following SOLID principles and Clean Architecture
 */
export class GetQueueServiceAnalyticsUseCase implements IUseCase<GetQueueServiceAnalyticsInput, QueueServiceAnalyticsDTO> {
  constructor(
    private readonly queueRepository: ShopBackendQueueRepository,
    private readonly queueAnalyticsRepository: ShopBackendQueueAnalyticsRepository,
    private readonly logger: Logger
  ) { }

  /**
   * Execute the use case to get queue service analytics
   * @param input Service analytics input parameters
   * @returns Queue service analytics DTO
   */
  async execute(input: GetQueueServiceAnalyticsInput): Promise<QueueServiceAnalyticsDTO> {
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

      this.logger.info('Getting queue service analytics', { input });

      // Get queues from repository
      const queues = await this.queueRepository.getPaginatedQueues({
        page: 1,
        limit: 10000, // Get all queues for analytics
        filters: {
          shopId: input.shopId,
          dateFrom: input.dateFrom,
          dateTo: input.dateTo,
          employeeId: input.employeeId
        }
      });

      // Calculate service analytics
      const analytics = this.calculateServiceAnalytics(queues.data, input);

      return QueueAnalyticsMapper.toServiceAnalyticsDTO(analytics);
    } catch (error) {
      this.logger.error('Failed to get queue service analytics', { error, input });

      if (error instanceof ShopBackendQueueAnalyticsError) {
        throw error;
      }

      throw new ShopBackendQueueAnalyticsError(
        ShopBackendQueueAnalyticsErrorType.OPERATION_FAILED,
        'Failed to get queue service analytics',
        'getQueueServiceAnalytics',
        { input },
        error
      );
    }
  }

  /**
   * Calculate service analytics from queue data
   * @param queues Queue data
   * @param input Input parameters
   * @returns Calculated service analytics
   */
  private calculateServiceAnalytics(queues: any[], input: GetQueueServiceAnalyticsInput): QueueServiceAnalyticsEntity {
    // Group queues by service
    const serviceData = this.groupQueuesByService(queues);

    // Calculate statistics for each service
    const serviceStats = Object.entries(serviceData).map(([serviceId, serviceQueues]) => {
      const totalQueues = serviceQueues.length;
      const completedQueues = serviceQueues.filter(q => q.status === 'completed').length;
      
      // Calculate average wait time for this service
      const waitTimes = serviceQueues
        .filter(q => q.actualWaitTime && q.actualWaitTime > 0)
        .map(q => q.actualWaitTime);
      
      const averageWaitTime = waitTimes.length > 0
        ? Math.round(waitTimes.reduce((sum, time) => sum + time, 0) / waitTimes.length)
        : 0;

      // Calculate average service time for this service
      const serviceTimes = serviceQueues
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

      // Calculate revenue for this service
      const revenue = serviceQueues.reduce((sum, queue) => {
        const serviceRevenue = queue.queueServices?.reduce((serviceSum: number, service: any) => {
          return serviceSum + (service.price * service.quantity);
        }, 0) || 0;
        return sum + serviceRevenue;
      }, 0);

      // Calculate popularity score
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

    // Sort services by different criteria
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
        from: input.dateFrom,
        to: input.dateTo
      },
      shopId: input.shopId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  /**
   * Group queues by service
   * @param queues Queue data
   * @returns Object with service ID as key and queues as value
   */
  private groupQueuesByService(queues: any[]): Record<string, any[]> {
    const serviceData: Record<string, any[]> = {};
    
    queues.forEach(queue => {
      if (queue.queueServices && Array.isArray(queue.queueServices)) {
        queue.queueServices.forEach((service: any) => {
          const serviceId = service.serviceId;
          
          if (!serviceData[serviceId]) {
            serviceData[serviceId] = [];
          }
          
          // Add queue with service info
          serviceData[serviceId].push({
            ...queue,
            currentService: service
          });
        });
      }
    });
    
    return serviceData;
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
    
    // Try to get service name from queue_services array
    if (queue.queueServices && Array.isArray(queue.queueServices)) {
      const service = queue.queueServices.find((s: any) => s.serviceId === serviceId);
      if (service && service.serviceName) {
        return service.serviceName;
      }
    }
    
    // Fallback to service ID
    return `Service ${serviceId}`;
  }
}
