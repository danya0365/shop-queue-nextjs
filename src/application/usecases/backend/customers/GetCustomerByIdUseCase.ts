import { CustomerDTO } from '@/src/application/dtos/backend/customers-dto';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { CustomerMapper } from '@/src/application/mappers/backend/customer-mapper';
import { BackendCustomerError, BackendCustomerErrorType } from '@/src/domain/repositories/backend/backend-customer-repository';
import type { BackendCustomerRepository } from '@/src/domain/repositories/backend/backend-customer-repository';

export class GetCustomerByIdUseCase implements IUseCase<string, CustomerDTO> {
  constructor(
    private readonly customerRepository: BackendCustomerRepository
  ) { }

  async execute(input: string): Promise<CustomerDTO> {
    const id = input;

    // Validate input
    if (!id) {
      throw new BackendCustomerError(
        BackendCustomerErrorType.VALIDATION_ERROR,
        'Customer ID is required',
        'getCustomerById'
      );
    }

    const customer = await this.customerRepository.getCustomerById(id);

    if (!customer) {
      throw new BackendCustomerError(
        BackendCustomerErrorType.NOT_FOUND,
        `Customer with ID ${id} not found`,
        'getCustomerById'
      );
    }

    return CustomerMapper.toDTO(customer);
  }
}
