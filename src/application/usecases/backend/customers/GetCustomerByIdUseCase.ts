import type { CustomerDTO } from '@/src/application/dtos/backend/CustomersDTO';
import type { Logger } from '@/src/domain/interfaces/logger';
import type { BackendCustomerRepository } from '@/src/domain/repositories/backend/backend-customer-repository';
import type { CustomerEntity } from '@/src/domain/entities/backend/backend-customer.entity';
import { BackendCustomerError, BackendCustomerErrorType } from '@/src/domain/repositories/backend/backend-customer-repository';

export interface GetCustomerByIdUseCaseParams {
  id: string;
}

export interface IGetCustomerByIdUseCase {
  execute(params: GetCustomerByIdUseCaseParams): Promise<CustomerDTO>;
}

export class GetCustomerByIdUseCase implements IGetCustomerByIdUseCase {
  constructor(
    private readonly customerRepository: BackendCustomerRepository,
    private readonly logger: Logger
  ) { }

  async execute(params: GetCustomerByIdUseCaseParams): Promise<CustomerDTO> {
    try {
      this.logger.info('GetCustomerByIdUseCase: Getting customer by ID', { id: params.id });

      const customer = await this.customerRepository.getCustomerById(params.id);

      if (!customer) {
        throw new BackendCustomerError(
          BackendCustomerErrorType.NOT_FOUND,
          `Customer with ID ${params.id} not found`,
          'getCustomerById'
        );
      }

      const customerDTO = this.mapCustomerEntityToDTO(customer);

      this.logger.info('GetCustomerByIdUseCase: Successfully retrieved customer', { id: params.id });
      return customerDTO;
    } catch (error) {
      this.logger.error('GetCustomerByIdUseCase: Error getting customer by ID', {
        error,
        id: params.id
      });
      throw error;
    }
  }

  private mapCustomerEntityToDTO(entity: CustomerEntity): CustomerDTO {
    return {
      id: entity.id,
      name: entity.name,
      phone: entity.phone || undefined,
      email: entity.email || undefined,
      date_of_birth: entity.dateOfBirth || undefined,
      gender: entity.gender || undefined,
      address: entity.address || undefined,
      total_queues: entity.totalQueues,
      total_points: entity.totalPoints,
      membership_tier: entity.membershipTier,
      last_visit: entity.lastVisit || undefined,
      notes: entity.notes || undefined,
      is_active: entity.isActive,
      created_at: entity.createdAt,
      updated_at: entity.updatedAt
    };
  }
}
