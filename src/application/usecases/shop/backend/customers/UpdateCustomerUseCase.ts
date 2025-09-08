import { CustomerDTO } from '@/src/application/dtos/shop/backend/customers-dto';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { CustomerMapper } from '@/src/application/mappers/shop/backend/customer-mapper';
import type { ShopBackendCustomerRepository } from '@/src/domain/repositories/shop/backend/backend-customer-repository';
import { ShopBackendCustomerError, ShopBackendCustomerErrorType } from '@/src/domain/repositories/shop/backend/backend-customer-repository';

export interface UpdateCustomerUseCaseInput {
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

export class UpdateCustomerUseCase implements IUseCase<UpdateCustomerUseCaseInput, CustomerDTO> {
  constructor(
    private readonly customerRepository: ShopBackendCustomerRepository
  ) { }

  async execute(input: UpdateCustomerUseCaseInput): Promise<CustomerDTO> {
    const { id } = input;

    // Validate input
    if (!id) {
      throw new ShopBackendCustomerError(
        ShopBackendCustomerErrorType.VALIDATION_ERROR,
        'Customer ID is required',
        'updateCustomer'
      );
    }

    // Check if customer exists
    const existingCustomer = await this.customerRepository.getCustomerById(id);
    if (!existingCustomer) {
      throw new ShopBackendCustomerError(
        ShopBackendCustomerErrorType.NOT_FOUND,
        `Customer with ID ${id} not found`,
        'updateCustomer'
      );
    }

    // Create update data object - exclude id from update fields
    const updateFields = Object.fromEntries(
      Object.entries(input).filter(([key]) => key !== 'id')
    );

    // Check if at least one field to update is provided
    if (Object.keys(updateFields).length === 0) {
      throw new ShopBackendCustomerError(
        ShopBackendCustomerErrorType.VALIDATION_ERROR,
        'At least one field to update must be provided',
        'updateCustomer'
      );
    }

    // Validate name if provided
    if (updateFields.name !== undefined && (updateFields.name === null || updateFields.name.trim() === '')) {
      throw new ShopBackendCustomerError(
        ShopBackendCustomerErrorType.VALIDATION_ERROR,
        'Customer name cannot be empty',
        'updateCustomer'
      );
    }

    const updatedCustomer = await this.customerRepository.updateCustomer(id, updateFields);

    return CustomerMapper.toDTO(updatedCustomer);
  }
}
