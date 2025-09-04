import type { ServiceStatsDTO } from '@/src/application/dtos/backend/services-dto';
import type { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { ServiceMapper } from '@/src/application/mappers/backend/service-mapper';
import type { BackendServiceRepository } from '@/src/domain/repositories/backend/backend-service-repository';

export class GetServiceStatsUseCase implements IUseCase<void, ServiceStatsDTO> {
  constructor(
    private readonly serviceRepository: BackendServiceRepository
  ) { }

  async execute(): Promise<ServiceStatsDTO> {
    const stats = await this.serviceRepository.getServiceStats();
    return ServiceMapper.statsToDTO(stats);
  }
}
