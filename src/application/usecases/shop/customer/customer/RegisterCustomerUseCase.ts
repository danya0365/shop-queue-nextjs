import { IUseCase } from "@/src/application/interfaces/use-case.interface";
import { CustomerMapper } from "@/src/application/mappers/shop/customer/customer-mapper";
import type { ShopCustomerRepository } from "@/src/domain/repositories/shop/customer/customer-repository";
import {
  ShopCustomerError,
  ShopCustomerErrorType,
} from "@/src/domain/repositories/shop/customer/customer-repository";
import type { RegisterCustomerInputDTO, RegisterCustomerOutputDTO } from "@/src/application/dtos/shop/customer/customer-dto";

export class RegisterCustomerUseCase implements IUseCase<RegisterCustomerInputDTO, RegisterCustomerOutputDTO> {
  constructor(
    private readonly customerRepository: ShopCustomerRepository
  ) {}

  async execute(input: RegisterCustomerInputDTO): Promise<RegisterCustomerOutputDTO> {
    const { shopId, name, phone } = input;

    try {
      // Validate input
      if (!shopId) {
        throw new ShopCustomerError(
          ShopCustomerErrorType.VALIDATION_ERROR,
          "Shop ID is required",
          "RegisterCustomerUseCase.execute",
          { shopId, name, phone }
        );
      }

      if (!name || name.trim() === "") {
        throw new ShopCustomerError(
          ShopCustomerErrorType.VALIDATION_ERROR,
          "Customer name is required",
          "RegisterCustomerUseCase.execute",
          { shopId, name, phone }
        );
      }

      if (!phone || phone.trim() === "") {
        throw new ShopCustomerError(
          ShopCustomerErrorType.VALIDATION_ERROR,
          "Customer phone is required",
          "RegisterCustomerUseCase.execute",
          { shopId, name, phone }
        );
      }

      // Normalize and validate phone (keep digits only, expect 10 digits)
      const cleanedPhone = phone.replace(/\D/g, "");
      if (!/^\d{10}$/.test(cleanedPhone)) {
        throw new ShopCustomerError(
          ShopCustomerErrorType.VALIDATION_ERROR,
          "Invalid phone number format",
          "RegisterCustomerUseCase.execute",
          { shopId, name, phone }
        );
      }

      // Register customer through repository
      const registerResultEntity = await this.customerRepository.registerCustomer(
        shopId,
        name.trim(),
        cleanedPhone
      );

      if (!registerResultEntity || !registerResultEntity.customerId) {
        throw new ShopCustomerError(
          ShopCustomerErrorType.OPERATION_FAILED,
          "Customer registration did not return a valid customer ID",
          "RegisterCustomerUseCase.execute",
          { shopId, name, phone }
        );
      }

      // Map entity to DTO
      return CustomerMapper.toRegisterCustomerOutputDTO(registerResultEntity);
    } catch (error) {
      if (error instanceof ShopCustomerError) {
        throw error;
      }

      throw new ShopCustomerError(
        ShopCustomerErrorType.OPERATION_FAILED,
        "Failed to register customer",
        "RegisterCustomerUseCase.execute",
        { shopId, name, phone, error: error instanceof Error ? error.message : String(error) },
        error
      );
    }
  }
}
