import type { CustomerDTO } from '@/src/application/dtos/backend/customers-dto';
import type { CustomerEntity } from '@/src/domain/entities/backend/backend-customer.entity';
import type { Logger } from '@/src/domain/interfaces/logger';
import type { BackendCustomerRepository } from '@/src/domain/repositories/backend/backend-customer-repository';
import { BackendCustomerError, BackendCustomerErrorType } from '@/src/domain/repositories/backend/backend-customer-repository';

export interface CreateCustomerUseCaseParams {
  name: string;
  phone?: string;
  email?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  address?: string;
  notes?: string;
  isActive?: boolean;
}

export interface ICreateCustomerUseCase {
  execute(params: CreateCustomerUseCaseParams): Promise<CustomerDTO>;
}

export class CreateCustomerUseCase implements ICreateCustomerUseCase {
  constructor(
    private readonly customerRepository: BackendCustomerRepository,
    private readonly logger: Logger
  ) { }

  async execute(params: CreateCustomerUseCaseParams): Promise<CustomerDTO> {
    try {
      this.logger.info('CreateCustomerUseCase: Creating new customer', { name: params.name });

      if (!params.name || params.name.trim() === '') {
        throw new BackendCustomerError(
          BackendCustomerErrorType.VALIDATION_ERROR,
          'Customer name is required',
          'createCustomer'
        );
      }

      const customerData = {
        name: params.name,
        phone: params.phone || null,
        email: params.email || null,
        dateOfBirth: params.dateOfBirth || null,
        gender: params.gender || null,
        address: params.address || null,
        notes: params.notes || null,
        isActive: params.isActive !== undefined ? params.isActive : true
      };

      const createdCustomer = await this.customerRepository.createCustomer(customerData);
      const customerDTO = this.mapCustomerEntityToDTO(createdCustomer);

      this.logger.info('CreateCustomerUseCase: Successfully created customer', {
        id: createdCustomer.id,
        name: createdCustomer.name
      });

      return customerDTO;
    } catch (error) {
      this.logger.error('CreateCustomerUseCase: Error creating customer', {
        error,
        params
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
      dateOfBirth: entity.dateOfBirth || undefined,
      gender: entity.gender || undefined,
      address: entity.address || undefined,
      totalQueues: entity.totalQueues,
      totalPoints: entity.totalPoints,
      membershipTier: entity.membershipTier,
      lastVisit: entity.lastVisit || undefined,
      notes: entity.notes || undefined,
      isActive: entity.isActive,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt
    };
  }
}
