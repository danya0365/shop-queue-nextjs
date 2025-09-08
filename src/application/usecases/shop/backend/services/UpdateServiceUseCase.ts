import type { ServiceDTO, UpdateServiceInputDTO } from '@/src/application/dtos/shop/backend/services-dto';
import type { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { ServiceMapper } from '@/src/application/mappers/shop/backend/service-mapper';
import type { ShopBackendServiceRepository } from '@/src/domain/repositories/shop/backend/backend-service-repository';

export class UpdateServiceUseCase implements IUseCase<UpdateServiceInputDTO, ServiceDTO> {
  constructor(
    private readonly serviceRepository: ShopBackendServiceRepository
  ) { }

  async execute(input: UpdateServiceInputDTO): Promise<ServiceDTO> {
    // Validate required fields
    if (!input.id) {
      throw new Error('Service ID is required');
    }

    if (input.updates.price !== undefined && input.updates.price < 0) {
      throw new Error('Price must be non-negative');
    }

    const updatedService = await this.serviceRepository.updateService(input.id, input.updates);
    return ServiceMapper.toDTO(updatedService);
  }
}
