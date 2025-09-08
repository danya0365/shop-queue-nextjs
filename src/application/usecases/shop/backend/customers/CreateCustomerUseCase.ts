import { CustomerDTO } from '@/src/application/dtos/shop/backend/customers-dto';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { CustomerMapper } from '@/src/application/mappers/shop/backend/customer-mapper';
import type { ShopBackendCustomerRepository } from '@/src/domain/repositories/shop/backend/backend-customer-repository';
import { ShopBackendCustomerError, ShopBackendCustomerErrorType } from '@/src/domain/repositories/shop/backend/backend-customer-repository';

export interface CreateCustomerUseCaseInput {
  name: string;
  phone?: string;
  email?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  address?: string;
  notes?: string;
  isActive?: boolean;
}

export class CreateCustomerUseCase implements IUseCase<CreateCustomerUseCaseInput, CustomerDTO> {
  constructor(
    private readonly customerRepository: ShopBackendCustomerRepository
  ) { }

  async execute(input: CreateCustomerUseCaseInput): Promise<CustomerDTO> {
    // Validate input
    if (!input.name || input.name.trim() === '') {
      throw new ShopBackendCustomerError(
        ShopBackendCustomerErrorType.VALIDATION_ERROR,
        'Customer name is required',
        'createCustomer'
      );
    }

    const customerData = {
      name: input.name,
      phone: input.phone || null,
      email: input.email || null,
      dateOfBirth: input.dateOfBirth || null,
      gender: input.gender || null,
      address: input.address || null,
      notes: input.notes || null,
      isActive: input.isActive !== undefined ? input.isActive : true
    };

    const createdCustomer = await this.customerRepository.createCustomer(customerData);

    return CustomerMapper.toDTO(createdCustomer);
  }
}
