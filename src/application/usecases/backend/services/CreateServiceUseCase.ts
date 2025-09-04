import type { CreateServiceInputDTO, ServiceDTO } from '@/src/application/dtos/backend/services-dto';
import { ServiceMapper } from '@/src/application/mappers/backend/ServiceMapper';
import type { Logger } from '@/src/domain/interfaces/logger';
import type { BackendServiceRepository } from '@/src/domain/repositories/backend/BackendServiceRepository';

export class CreateServiceUseCase {
  constructor(
    private readonly serviceRepository: BackendServiceRepository,
    private readonly logger: Logger
  ) { }

  async execute(input: CreateServiceInputDTO): Promise<ServiceDTO> {
    try {
      this.logger.info('CreateServiceUseCase: Creating new service', { input });

      // Validate required fields
      if (!input.name || !input.slug || !input.shopId) {
        throw new Error('Name, slug, and shop ID are required');
      }

      if (input.price < 0) {
        throw new Error('Price must be non-negative');
      }

      const serviceEntity = ServiceMapper.fromCreateDTO(input);
      const createdService = await this.serviceRepository.createService(serviceEntity);

      const serviceDTO = ServiceMapper.toDTO(createdService);

      this.logger.info('CreateServiceUseCase: Successfully created service', {
        serviceId: serviceDTO.id,
        name: serviceDTO.name
      });

      return serviceDTO;
    } catch (error) {
      this.logger.error('CreateServiceUseCase: Error creating service', error);
      throw error;
    }
  }
}
