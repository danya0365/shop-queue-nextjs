import { PaginatedCustomersDTO } from '@/src/application/dtos/backend/customers-dto';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { CustomerMapper } from '@/src/application/mappers/backend/customer-mapper';
import { BackendCustomerError, BackendCustomerErrorType } from '@/src/domain/repositories/backend/backend-customer-repository';
import type { BackendCustomerRepository } from '@/src/domain/repositories/backend/backend-customer-repository';

export interface GetCustomersPaginatedUseCaseInput {
  page: number;
  perPage: number;
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export class GetCustomersPaginatedUseCase implements IUseCase<GetCustomersPaginatedUseCaseInput, PaginatedCustomersDTO> {
  constructor(
    private readonly customerRepository: BackendCustomerRepository
  ) { }

  async execute(input: GetCustomersPaginatedUseCaseInput): Promise<PaginatedCustomersDTO> {
    const { page, perPage } = input;

    // Validate input
    if (page < 1) {
      throw new BackendCustomerError(
        BackendCustomerErrorType.VALIDATION_ERROR,
        'Page must be greater than 0',
        'getCustomersPaginated'
      );
    }

    if (perPage < 1 || perPage > 100) {
      throw new BackendCustomerError(
        BackendCustomerErrorType.VALIDATION_ERROR,
        'Per page must be between 1 and 100',
        'getCustomersPaginated'
      );
    }

    const customers = await this.customerRepository.getPaginatedCustomers({
      page,
      limit: perPage,
    });

    const customersDTO = customers.data.map(customer => CustomerMapper.toDTO(customer));

    return {
      data: customersDTO,
      pagination: customers.pagination
    };
  }
}
