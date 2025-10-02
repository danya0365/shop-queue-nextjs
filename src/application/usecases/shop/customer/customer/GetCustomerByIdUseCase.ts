import { IUseCase } from "@/src/application/interfaces/use-case.interface";
import { CustomerMapper } from "@/src/application/mappers/shop/customer/customer-mapper";
import type { ShopCustomerRepository } from "@/src/domain/repositories/shop/customer/customer-repository";
import {
  ShopCustomerError,
  ShopCustomerErrorType,
} from "@/src/domain/repositories/shop/customer/customer-repository";
import type { GetCustomerByIdInputDTO, CustomerDTO } from "@/src/application/dtos/shop/customer/customer-dto";

export class GetCustomerByIdUseCase implements IUseCase<GetCustomerByIdInputDTO, CustomerDTO> {
  constructor(
    private readonly customerRepository: ShopCustomerRepository
  ) {}

  async execute(input: GetCustomerByIdInputDTO): Promise<CustomerDTO> {
    const customerId = input.customerId;

    try {
      // Validate input
      if (!customerId) {
        throw new ShopCustomerError(
          ShopCustomerErrorType.VALIDATION_ERROR,
          "Customer ID is required",
          "GetCustomerByIdUseCase.execute",
          { customerId }
        );
      }

      // Get customer from repository
      const customerEntity = await this.customerRepository.getCustomerById(customerId);

      // Map entity to DTO
      return CustomerMapper.toCustomerDTO(customerEntity);
    } catch (error) {
      if (error instanceof ShopCustomerError) {
        throw error;
      }

      throw new ShopCustomerError(
        ShopCustomerErrorType.OPERATION_FAILED,
        "Failed to get customer by ID",
        "GetCustomerByIdUseCase.execute",
        { customerId, error: error instanceof Error ? error.message : String(error) },
        error
      );
    }
  }
}
