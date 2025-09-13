import type { GetServicesInputDTO, ServicesDataDTO } from '@/src/application/dtos/shop/backend/services-dto';
import type { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { ServiceMapper } from '@/src/application/mappers/shop/backend/service-mapper';
import type { ShopBackendServiceRepository } from '@/src/domain/repositories/shop/backend/backend-service-repository';

export class GetServicesUseCase implements IUseCase<GetServicesInputDTO, ServicesDataDTO> {
  constructor(
    private readonly serviceRepository: ShopBackendServiceRepository
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

    if (!filters?.shopId) {
      throw new Error('Shop ID is required');
    }

    // Get services and stats in parallel
    const [servicesResult, stats] = await Promise.all([
      this.serviceRepository.getPaginatedServices({ page, limit, filters }),
      this.serviceRepository.getServiceStats(filters.shopId)
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
