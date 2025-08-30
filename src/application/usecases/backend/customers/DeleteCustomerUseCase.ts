import type { Logger } from '@/src/domain/interfaces/logger';
import type { BackendCustomerRepository } from '@/src/domain/repositories/backend/backend-customer-repository';
import { BackendCustomerError, BackendCustomerErrorType } from '@/src/domain/repositories/backend/backend-customer-repository';

export interface DeleteCustomerUseCaseParams {
  id: string;
}

export interface IDeleteCustomerUseCase {
  execute(params: DeleteCustomerUseCaseParams): Promise<void>;
}

export class DeleteCustomerUseCase implements IDeleteCustomerUseCase {
  constructor(
    private readonly customerRepository: BackendCustomerRepository,
    private readonly logger: Logger
  ) { }

  async execute(params: DeleteCustomerUseCaseParams): Promise<void> {
    try {
      this.logger.info('DeleteCustomerUseCase: Deleting customer', { id: params.id });

      // Check if customer exists
      const existingCustomer = await this.customerRepository.getCustomerById(params.id);
      if (!existingCustomer) {
        throw new BackendCustomerError(
          BackendCustomerErrorType.NOT_FOUND,
          `Customer with ID ${params.id} not found`,
          'deleteCustomer'
        );
      }

      await this.customerRepository.deleteCustomer(params.id);

      this.logger.info('DeleteCustomerUseCase: Successfully deleted customer', { id: params.id });
    } catch (error) {
      this.logger.error('DeleteCustomerUseCase: Error deleting customer', {
        error,
        id: params.id
      });
      throw error;
    }
  }
}
