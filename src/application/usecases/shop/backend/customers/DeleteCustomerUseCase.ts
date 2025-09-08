import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import type { ShopBackendCustomerRepository } from '@/src/domain/repositories/shop/backend/backend-customer-repository';
import { ShopBackendCustomerError, ShopBackendCustomerErrorType } from '@/src/domain/repositories/shop/backend/backend-customer-repository';

export class DeleteCustomerUseCase implements IUseCase<string, boolean> {
  constructor(
    private readonly customerRepository: ShopBackendCustomerRepository
  ) { }

  async execute(input: string): Promise<boolean> {
    // Validate input
    if (!input) {
      throw new ShopBackendCustomerError(
        ShopBackendCustomerErrorType.VALIDATION_ERROR,
        'Customer ID is required',
        'deleteCustomer'
      );
    }

    // Check if customer exists
    const existingCustomer = await this.customerRepository.getCustomerById(input);
    if (!existingCustomer) {
      throw new ShopBackendCustomerError(
        ShopBackendCustomerErrorType.NOT_FOUND,
        `Customer with ID ${input} not found`,
        'deleteCustomer'
      );
    }

    await this.customerRepository.deleteCustomer(input);

    return true;
  }
}
