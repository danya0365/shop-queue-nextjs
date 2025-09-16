import { PaginatedCustomersDTO } from "@/src/application/dtos/shop/backend/customers-dto";
import { IUseCase } from "@/src/application/interfaces/use-case.interface";
import { CustomerMapper } from "@/src/application/mappers/shop/backend/customer-mapper";
import type { ShopBackendCustomerRepository } from "@/src/domain/repositories/shop/backend/backend-customer-repository";
import {
  ShopBackendCustomerError,
  ShopBackendCustomerErrorType,
} from "@/src/domain/repositories/shop/backend/backend-customer-repository";

export interface GetCustomersPaginatedUseCaseInput {
  page: number;
  perPage: number;
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  filters?: {
    shopId?: string;
    searchQuery?: string;
    membershipTierFilter?: string;
    isActiveFilter?: boolean;
    minTotalPoints?: number;
    maxTotalPoints?: number;
    minTotalQueues?: number;
    maxTotalQueues?: number;
  };
}

export class GetCustomersPaginatedUseCase
  implements IUseCase<GetCustomersPaginatedUseCaseInput, PaginatedCustomersDTO>
{
  constructor(
    private readonly customerRepository: ShopBackendCustomerRepository
  ) {}

  async execute(
    input: GetCustomersPaginatedUseCaseInput
  ): Promise<PaginatedCustomersDTO> {
    const { page, perPage } = input;
    // Validate input
    if (page < 1) {
      throw new ShopBackendCustomerError(
        ShopBackendCustomerErrorType.VALIDATION_ERROR,
        "Page must be greater than 0",
        "getCustomersPaginated"
      );
    }

    if (perPage < 1 || perPage > 100) {
      throw new ShopBackendCustomerError(
        ShopBackendCustomerErrorType.VALIDATION_ERROR,
        "Per page must be between 1 and 100",
        "getCustomersPaginated"
      );
    }

    const customers = await this.customerRepository.getPaginatedCustomers({
      page,
      limit: perPage,
      filters: input.filters,
    });

    const customersDTO = customers.data.map((customer) =>
      CustomerMapper.toDTO(customer)
    );

    return {
      data: customersDTO,
      pagination: customers.pagination,
    };
  }
}
