import type { ServiceDTO } from '@/src/application/dtos/shop/backend/services-dto';
import type { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { ServiceMapper } from '@/src/application/mappers/shop/backend/service-mapper';
import type { ShopBackendServiceRepository } from '@/src/domain/repositories/shop/backend/backend-service-repository';

export class GetServiceByIdUseCase implements IUseCase<string, ServiceDTO | null> {
  constructor(
    private readonly serviceRepository: ShopBackendServiceRepository
  ) { }

  async execute(id: string): Promise<ServiceDTO | null> {
    if (!id) {
      throw new Error('Service ID is required');
    }

    const service = await this.serviceRepository.getServiceById(id);

    if (!service) {
      return null;
    }

    return ServiceMapper.toDTO(service);
  }
}
