import type { BackendServiceRepository } from '@/src/domain/interfaces/backend/BackendServiceRepository';
import type { Logger } from '@/src/domain/interfaces/logger';
import type { ServiceDTO } from '@/src/application/dtos/backend/services-dto';
import { ServiceMapper } from '@/src/application/mappers/backend/ServiceMapper';

export class GetServiceByIdUseCase {
  constructor(
    private readonly serviceRepository: BackendServiceRepository,
    private readonly logger: Logger
  ) {}

  async execute(id: string): Promise<ServiceDTO | null> {
    try {
      this.logger.info('GetServiceByIdUseCase: Getting service by ID', { id });

      const service = await this.serviceRepository.getServiceById(id);

      if (!service) {
        this.logger.warn('GetServiceByIdUseCase: Service not found', { id });
        return null;
      }

      const serviceDTO = ServiceMapper.toDTO(service);

      this.logger.info('GetServiceByIdUseCase: Successfully retrieved service', { id });

      return serviceDTO;
    } catch (error) {
      this.logger.error('GetServiceByIdUseCase: Error getting service by ID', error);
      throw error;
    }
  }
}
