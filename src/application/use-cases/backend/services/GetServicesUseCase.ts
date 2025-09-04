import type { BackendServiceRepository } from '@/src/domain/interfaces/backend/BackendServiceRepository';
import type { Logger } from '@/src/domain/interfaces/logger';
import type { GetServicesInputDTO, ServicesDataDTO } from '@/src/application/dtos/backend/services-dto';
import { ServiceMapper } from '@/src/application/mappers/backend/ServiceMapper';

export class GetServicesUseCase {
  constructor(
    private readonly serviceRepository: BackendServiceRepository,
    private readonly logger: Logger
  ) {}

  async execute(input: GetServicesInputDTO): Promise<ServicesDataDTO> {
    try {
      this.logger.info('GetServicesUseCase: Getting services with stats', { input });

      const result = await this.serviceRepository.getServicesWithStats(
        input.page,
        input.limit,
        input.filters
      );

      const servicesData: ServicesDataDTO = {
        services: result.services.map(ServiceMapper.toDTO),
        stats: ServiceMapper.statsToDTO(result.stats),
        totalCount: result.totalCount,
        currentPage: result.currentPage,
        totalPages: result.totalPages
      };

      this.logger.info('GetServicesUseCase: Successfully retrieved services data', {
        totalCount: servicesData.totalCount,
        currentPage: servicesData.currentPage
      });

      return servicesData;
    } catch (error) {
      this.logger.error('GetServicesUseCase: Error getting services data', error);
      throw error;
    }
  }
}
