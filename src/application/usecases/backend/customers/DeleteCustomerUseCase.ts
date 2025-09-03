import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { BackendCustomerError, BackendCustomerErrorType } from '@/src/domain/repositories/backend/backend-customer-repository';
import type { BackendCustomerRepository } from '@/src/domain/repositories/backend/backend-customer-repository';

export class DeleteCustomerUseCase implements IUseCase<string, boolean> {
  constructor(
    private readonly customerRepository: BackendCustomerRepository
  ) { }

  async execute(input: string): Promise<boolean> {
    // Validate input
    if (!input) {
      throw new BackendCustomerError(
        BackendCustomerErrorType.VALIDATION_ERROR,
        'Customer ID is required',
        'deleteCustomer'
      );
    }

    // Check if customer exists
    const existingCustomer = await this.customerRepository.getCustomerById(input);
    if (!existingCustomer) {
      throw new BackendCustomerError(
        BackendCustomerErrorType.NOT_FOUND,
        `Customer with ID ${input} not found`,
        'deleteCustomer'
      );
    }

    await this.customerRepository.deleteCustomer(input);
    
    return true;
  }
}
