import type { CreateServiceInputDTO, ServiceDTO } from '@/src/application/dtos/backend/services-dto';
import type { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { ServiceMapper } from '@/src/application/mappers/backend/service-mapper';
import type { BackendServiceRepository } from '@/src/domain/repositories/backend/backend-service-repository';

export class CreateServiceUseCase implements IUseCase<CreateServiceInputDTO, ServiceDTO> {
  constructor(
    private readonly serviceRepository: BackendServiceRepository
  ) { }

  async execute(input: CreateServiceInputDTO): Promise<ServiceDTO> {
    // Validate required fields
    if (!input.name || !input.slug || !input.shopId) {
      throw new Error('Name, slug, and shop ID are required');
    }

    if (input.price < 0) {
      throw new Error('Price must be non-negative');
    }

    const serviceEntity = ServiceMapper.fromCreateDTO(input);
    const createdService = await this.serviceRepository.createService(serviceEntity);

    return ServiceMapper.toDTO(createdService);
  }
}
