import { CustomerStatsDTO } from '@/src/application/dtos/backend/customers-dto';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { CustomerMapper } from '@/src/application/mappers/backend/customer-mapper';
import type { BackendCustomerRepository } from '@/src/domain/repositories/backend/backend-customer-repository';

export class GetCustomerStatsUseCase implements IUseCase<void, CustomerStatsDTO> {
  constructor(
    private readonly customerRepository: BackendCustomerRepository
  ) { }

  async execute(): Promise<CustomerStatsDTO> {
    const stats = await this.customerRepository.getCustomerStats();
    return CustomerMapper.statsToDTO(stats);
  }
}
