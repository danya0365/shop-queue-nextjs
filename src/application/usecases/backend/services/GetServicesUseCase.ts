import type { GetServicesInputDTO, ServicesDataDTO } from '@/src/application/dtos/backend/services-dto';
import type { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { ServiceMapper } from '@/src/application/mappers/backend/service-mapper';
import type { BackendServiceRepository } from '@/src/domain/repositories/backend/backend-service-repository';

export class GetServicesUseCase implements IUseCase<GetServicesInputDTO, ServicesDataDTO> {
  constructor(
    private readonly serviceRepository: BackendServiceRepository
  ) { }

  async execute(input: GetServicesInputDTO): Promise<ServicesDataDTO> {
    const { page, limit, filters } = input;

    // Validate input
    if (page < 1) {
      throw new Error('Page must be greater than 0');
    }

    if (limit < 1 || limit > 100) {
      throw new Error('Limit must be between 1 and 100');
    }

    // Get services and stats in parallel
    const [servicesResult, stats] = await Promise.all([
      this.serviceRepository.getPaginatedServices({ page, limit, filters }),
      this.serviceRepository.getServiceStats()
    ]);

    return {
      services: servicesResult.data.map(service => ServiceMapper.toDTO(service)),
      stats: ServiceMapper.statsToDTO(stats),
      totalCount: servicesResult.pagination.totalItems,
      currentPage: servicesResult.pagination.currentPage,
      perPage: servicesResult.pagination.itemsPerPage
    };
  }
}
