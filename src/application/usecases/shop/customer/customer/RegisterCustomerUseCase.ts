import { IUseCase } from "@/src/application/interfaces/use-case.interface";
import { CustomerMapper } from "@/src/application/mappers/shop/customer/customer-mapper";
import type { ShopCustomerQueueJoinRepository } from "@/src/domain/repositories/shop/customer/queue-join-repository";
import {
  ShopCustomerQueueJoinError,
  ShopCustomerQueueJoinErrorType,
} from "@/src/domain/repositories/shop/customer/queue-join-repository";
import type { RegisterCustomerInputDTO, RegisterCustomerOutputDTO } from "@/src/application/dtos/shop/customer/customer-dto";

export class RegisterCustomerUseCase implements IUseCase<RegisterCustomerInputDTO, RegisterCustomerOutputDTO> {
  constructor(
    private readonly customerQueueJoinRepository: ShopCustomerQueueJoinRepository
  ) {}

  async execute(input: RegisterCustomerInputDTO): Promise<RegisterCustomerOutputDTO> {
    const { shopId, name, phone } = input;

    try {
      // Validate input
      if (!shopId) {
        throw new ShopCustomerQueueJoinError(
          ShopCustomerQueueJoinErrorType.VALIDATION_ERROR,
          "Shop ID is required",
          "RegisterCustomerUseCase.execute",
          { shopId, name, phone }
        );
      }

      if (!name || name.trim() === "") {
        throw new ShopCustomerQueueJoinError(
          ShopCustomerQueueJoinErrorType.VALIDATION_ERROR,
          "Customer name is required",
          "RegisterCustomerUseCase.execute",
          { shopId, name, phone }
        );
      }

      if (!phone || phone.trim() === "") {
        throw new ShopCustomerQueueJoinError(
          ShopCustomerQueueJoinErrorType.VALIDATION_ERROR,
          "Customer phone is required",
          "RegisterCustomerUseCase.execute",
          { shopId, name, phone }
        );
      }

      // Basic phone validation
      const phoneRegex = /^[0-9+\-\s()]+$/;
      if (!phoneRegex.test(phone)) {
        throw new ShopCustomerQueueJoinError(
          ShopCustomerQueueJoinErrorType.VALIDATION_ERROR,
          "Invalid phone number format",
          "RegisterCustomerUseCase.execute",
          { shopId, name, phone }
        );
      }

      // Register customer through repository
      const registerResultEntity = await this.customerQueueJoinRepository.registerCustomer(shopId, name, phone);

      if (!registerResultEntity || !registerResultEntity.customerId) {
        throw new ShopCustomerQueueJoinError(
          ShopCustomerQueueJoinErrorType.OPERATION_FAILED,
          "Customer registration did not return a valid customer ID",
          "RegisterCustomerUseCase.execute",
          { shopId, name, phone }
        );
      }

      // Map entity to DTO
      return CustomerMapper.toRegisterCustomerOutputDTO(registerResultEntity);
    } catch (error) {
      if (error instanceof ShopCustomerQueueJoinError) {
        throw error;
      }

      throw new ShopCustomerQueueJoinError(
        ShopCustomerQueueJoinErrorType.OPERATION_FAILED,
        "Failed to register customer",
        "RegisterCustomerUseCase.execute",
        { shopId, name, phone, error: error instanceof Error ? error.message : String(error) },
        error
      );
    }
  }
}
