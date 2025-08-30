import type { CustomerDTO } from '@/src/application/dtos/backend/CustomersDTO';
import type { Logger } from '@/src/domain/interfaces/logger';
import type { BackendCustomerRepository } from '@/src/domain/repositories/backend/backend-customer-repository';
import type { CustomerEntity } from '@/src/domain/entities/backend/backend-customer.entity';
import { BackendCustomerError, BackendCustomerErrorType } from '@/src/domain/repositories/backend/backend-customer-repository';

export interface UpdateCustomerUseCaseParams {
  id: string;
  name?: string;
  phone?: string | null;
  email?: string | null;
  dateOfBirth?: string | null;
  gender?: 'male' | 'female' | 'other' | null;
  address?: string | null;
  notes?: string | null;
  isActive?: boolean;
}

export interface IUpdateCustomerUseCase {
  execute(params: UpdateCustomerUseCaseParams): Promise<CustomerDTO>;
}

export class UpdateCustomerUseCase implements IUpdateCustomerUseCase {
  constructor(
    private readonly customerRepository: BackendCustomerRepository,
    private readonly logger: Logger
  ) { }

  async execute(params: UpdateCustomerUseCaseParams): Promise<CustomerDTO> {
    try {
      this.logger.info('UpdateCustomerUseCase: Updating customer', { id: params.id });

      // Check if customer exists
      const existingCustomer = await this.customerRepository.getCustomerById(params.id);
      if (!existingCustomer) {
        throw new BackendCustomerError(
          BackendCustomerErrorType.NOT_FOUND,
          `Customer with ID ${params.id} not found`,
          'updateCustomer'
        );
      }

      // Prepare update data
      const updateData: Partial<Omit<CustomerEntity, 'id' | 'createdAt' | 'updatedAt' | 'totalQueues' | 'totalPoints' | 'membershipTier' | 'lastVisit'>> = {};
      
      if (params.name !== undefined) updateData.name = params.name;
      if (params.phone !== undefined) updateData.phone = params.phone;
      if (params.email !== undefined) updateData.email = params.email;
      if (params.dateOfBirth !== undefined) updateData.dateOfBirth = params.dateOfBirth;
      if (params.gender !== undefined) updateData.gender = params.gender;
      if (params.address !== undefined) updateData.address = params.address;
      if (params.notes !== undefined) updateData.notes = params.notes;
      if (params.isActive !== undefined) updateData.isActive = params.isActive;

      // Validate name if provided
      if (updateData.name !== undefined && (updateData.name === null || updateData.name.trim() === '')) {
        throw new BackendCustomerError(
          BackendCustomerErrorType.VALIDATION_ERROR,
          'Customer name cannot be empty',
          'updateCustomer'
        );
      }

      const updatedCustomer = await this.customerRepository.updateCustomer(params.id, updateData);
      const customerDTO = this.mapCustomerEntityToDTO(updatedCustomer);

      this.logger.info('UpdateCustomerUseCase: Successfully updated customer', { 
        id: updatedCustomer.id,
        name: updatedCustomer.name 
      });
      
      return customerDTO;
    } catch (error) {
      this.logger.error('UpdateCustomerUseCase: Error updating customer', {
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
