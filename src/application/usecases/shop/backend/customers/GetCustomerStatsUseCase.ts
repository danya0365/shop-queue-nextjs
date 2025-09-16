import { CustomerStatsDTO } from "@/src/application/dtos/shop/backend/customers-dto";
import { IUseCase } from "@/src/application/interfaces/use-case.interface";
import { CustomerMapper } from "@/src/application/mappers/shop/backend/customer-mapper";
import type { ShopBackendCustomerRepository } from "@/src/domain/repositories/shop/backend/backend-customer-repository";

export class GetCustomerStatsUseCase
  implements IUseCase<string, CustomerStatsDTO>
{
  constructor(
    private readonly customerRepository: ShopBackendCustomerRepository
  ) {}

  async execute(shopId: string): Promise<CustomerStatsDTO> {
    const stats = await this.customerRepository.getCustomerStats(shopId);
    return CustomerMapper.statsToDTO(stats);
  }
}
