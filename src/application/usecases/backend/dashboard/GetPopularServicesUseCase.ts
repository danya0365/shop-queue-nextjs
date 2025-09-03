import type { PopularServicesDTO } from '@/src/application/dtos/backend/dashboard-stats-dto';
import type { BackendDashboardRepository } from '@/src/domain/repositories/backend/backend-dashboard-repository';
import type { Logger } from '@/src/domain/interfaces/logger';

export interface IGetPopularServicesUseCase {
  execute(): Promise<PopularServicesDTO[]>;
}

export class GetPopularServicesUseCase implements IGetPopularServicesUseCase {
  constructor(
    private readonly dashboardRepository: BackendDashboardRepository,
    private readonly logger: Logger
  ) { }

  async execute(): Promise<PopularServicesDTO[]> {
    try {
      this.logger.info('GetPopularServicesUseCase: Executing popular services retrieval');

      // Get popular services from repository
      const popularServices = await this.dashboardRepository.getPopularServices();
      
      // Map domain entities to DTOs
      const services: PopularServicesDTO[] = popularServices.map(service => ({
        id: service.id,
        name: service.name,
        queueCount: service.queueCount,
        revenue: service.revenue,
        category: service.category
      }));

      this.logger.info('GetPopularServicesUseCase: Successfully retrieved popular services');
      return services;
    } catch (error) {
      this.logger.error('GetPopularServicesUseCase: Error retrieving popular services', error);
      throw error;
    }
  }
}
