import type { PopularServicesDTO } from '@/src/application/dtos/shop/backend/dashboard-stats-dto';
import type { Logger } from '@/src/domain/interfaces/logger';
import type { ShopBackendDashboardRepository } from '@/src/domain/repositories/shop/backend/backend-dashboard-repository';

export interface IGetPopularServicesUseCase {
  execute(shopId: string): Promise<PopularServicesDTO[]>;
}

export class GetPopularServicesUseCase implements IGetPopularServicesUseCase {
  constructor(
    private readonly dashboardRepository: ShopBackendDashboardRepository,
    private readonly logger: Logger
  ) { }

  async execute(shopId: string): Promise<PopularServicesDTO[]> {
    try {
      this.logger.info('GetPopularServicesUseCase: Executing popular services retrieval', { shopId });

      // Get popular services from repository
      const popularServices = await this.dashboardRepository.getPopularServices(shopId);

      // Map domain entities to DTOs
      const services: PopularServicesDTO[] = popularServices.map(service => ({
        id: service.id,
        name: service.name,
        queueCount: service.queueCount,
        revenue: service.revenue,
        category: service.category
      }));

      this.logger.info('GetPopularServicesUseCase: Successfully retrieved popular services', { shopId });
      return services;
    } catch (error) {
      this.logger.error('GetPopularServicesUseCase: Error retrieving popular services', error);
      throw error;
    }
  }
}
