import type { ServiceStatsDTO } from "@/src/application/dtos/shop/backend/services-dto";
import type { IUseCase } from "@/src/application/interfaces/use-case.interface";
import { ServiceMapper } from "@/src/application/mappers/shop/backend/service-mapper";
import type { ShopBackendServiceRepository } from "@/src/domain/repositories/shop/backend/backend-service-repository";

export class GetServiceStatsUseCase
  implements IUseCase<string, ServiceStatsDTO>
{
  constructor(
    private readonly serviceRepository: ShopBackendServiceRepository
  ) {}

  async execute(shopId: string): Promise<ServiceStatsDTO> {
    const stats = await this.serviceRepository.getServiceStats(shopId);
    return ServiceMapper.statsToDTO(stats);
  }
}
