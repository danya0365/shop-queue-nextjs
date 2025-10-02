import { IUseCase } from "@/src/application/interfaces/use-case.interface";
import { CustomerMapper } from "@/src/application/mappers/shop/customer/customer-mapper";
import type { ShopCustomerQueueJoinRepository } from "@/src/domain/repositories/shop/customer/queue-join-repository";
import {
  ShopCustomerQueueJoinError,
  ShopCustomerQueueJoinErrorType,
} from "@/src/domain/repositories/shop/customer/queue-join-repository";
import type { GetCustomerByIdInputDTO, CustomerDTO } from "@/src/application/dtos/shop/customer/customer-dto";

export class GetCustomerByIdUseCase implements IUseCase<GetCustomerByIdInputDTO, CustomerDTO> {
  constructor(
    private readonly customerQueueJoinRepository: ShopCustomerQueueJoinRepository
  ) {}

  async execute(input: GetCustomerByIdInputDTO): Promise<CustomerDTO> {
    const customerId = input.customerId;

    try {
      // Validate input
      if (!customerId) {
        throw new ShopCustomerQueueJoinError(
          ShopCustomerQueueJoinErrorType.VALIDATION_ERROR,
          "Customer ID is required",
          "GetCustomerByIdUseCase.execute",
          { customerId }
        );
      }

      // Get customer from repository
      const customerEntity = await this.customerQueueJoinRepository.getCustomerById(customerId);

      // Map entity to DTO
      return CustomerMapper.toCustomerDTO(customerEntity);
    } catch (error) {
      if (error instanceof ShopCustomerQueueJoinError) {
        throw error;
      }

      throw new ShopCustomerQueueJoinError(
        ShopCustomerQueueJoinErrorType.OPERATION_FAILED,
        "Failed to get customer by ID",
        "GetCustomerByIdUseCase.execute",
        { customerId, error: error instanceof Error ? error.message : String(error) },
        error
      );
    }
  }
}
