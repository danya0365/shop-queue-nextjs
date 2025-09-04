import type { ServiceDTO, UpdateServiceInputDTO } from '@/src/application/dtos/backend/services-dto';
import { ServiceMapper } from '@/src/application/mappers/backend/ServiceMapper';
import type { Logger } from '@/src/domain/interfaces/logger';
import type { BackendServiceRepository } from '@/src/domain/repositories/backend/BackendServiceRepository';

export class UpdateServiceUseCase {
  constructor(
    private readonly serviceRepository: BackendServiceRepository,
    private readonly logger: Logger
  ) { }

  async execute(input: UpdateServiceInputDTO): Promise<ServiceDTO> {
    try {
      this.logger.info('UpdateServiceUseCase: Updating service', { input });

      // Validate price if provided
      if (input.updates.price !== undefined && input.updates.price < 0) {
        throw new Error('Price must be non-negative');
      }

      const updatedService = await this.serviceRepository.updateService(input.id, input.updates);

      const serviceDTO = ServiceMapper.toDTO(updatedService);

      this.logger.info('UpdateServiceUseCase: Successfully updated service', {
        serviceId: serviceDTO.id,
        updates: input.updates
      });

      return serviceDTO;
    } catch (error) {
      this.logger.error('UpdateServiceUseCase: Error updating service', error);
      throw error;
    }
  }
}
