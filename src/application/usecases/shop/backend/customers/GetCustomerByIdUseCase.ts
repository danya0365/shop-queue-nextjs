import { CustomerDTO } from '@/src/application/dtos/shop/backend/customers-dto';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { CustomerMapper } from '@/src/application/mappers/shop/backend/customer-mapper';
import type { ShopBackendCustomerRepository } from '@/src/domain/repositories/shop/backend/backend-customer-repository';
import { ShopBackendCustomerError, ShopBackendCustomerErrorType } from '@/src/domain/repositories/shop/backend/backend-customer-repository';

export class GetCustomerByIdUseCase implements IUseCase<string, CustomerDTO> {
  constructor(
    private readonly customerRepository: ShopBackendCustomerRepository
  ) { }

  async execute(input: string): Promise<CustomerDTO> {
    const id = input;

    // Validate input
    if (!id) {
      throw new ShopBackendCustomerError(
        ShopBackendCustomerErrorType.VALIDATION_ERROR,
        'Customer ID is required',
        'getCustomerById'
      );
    }

    const customer = await this.customerRepository.getCustomerById(id);

    if (!customer) {
      throw new ShopBackendCustomerError(
        ShopBackendCustomerErrorType.NOT_FOUND,
        `Customer with ID ${id} not found`,
        'getCustomerById'
      );
    }

    return CustomerMapper.toDTO(customer);
  }
}
