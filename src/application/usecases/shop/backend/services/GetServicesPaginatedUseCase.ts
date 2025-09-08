import type { PaginatedServicesDTO } from '@/src/application/dtos/shop/backend/services-dto';
import type { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { ServiceMapper } from '@/src/application/mappers/shop/backend/service-mapper';
import type { ShopBackendServiceRepository } from '@/src/domain/repositories/shop/backend/backend-service-repository';

export interface GetServicesPaginatedUseCaseInput {
  page: number;
  perPage: number;
  filters?: {
    searchQuery?: string;
    categoryFilter?: string;
    availabilityFilter?: string;
    shopId?: string;
  };
}

export class GetServicesPaginatedUseCase implements IUseCase<GetServicesPaginatedUseCaseInput, PaginatedServicesDTO> {
  constructor(
    private readonly serviceRepository: ShopBackendServiceRepository
  ) { }

  async execute(input: GetServicesPaginatedUseCaseInput): Promise<PaginatedServicesDTO> {
    const { page, perPage, filters } = input;

    // Validate input
    if (page < 1) {
      throw new Error('Page must be greater than 0');
    }

    if (perPage < 1 || perPage > 100) {
      throw new Error('Per page must be between 1 and 100');
    }

    const services = await this.serviceRepository.getPaginatedServices({
      page,
      limit: perPage,
      filters
    });

    const servicesDTO = services.data.map(service => ServiceMapper.toDTO(service));

    return {
      data: servicesDTO,
      pagination: services.pagination
    };
  }
}
