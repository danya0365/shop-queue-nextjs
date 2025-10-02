import { IUseCase } from "@/src/application/interfaces/use-case.interface";
import { CustomerMapper } from "@/src/application/mappers/shop/customer/customer-mapper";
import type { ShopCustomerRepository } from "@/src/domain/repositories/shop/customer/customer-repository";
import {
  ShopCustomerError,
  ShopCustomerErrorType,
} from "@/src/domain/repositories/shop/customer/customer-repository";
import type { LinkCustomerToProfileInputDTO, LinkCustomerToProfileOutputDTO } from "@/src/application/dtos/shop/customer/customer-dto";

export class LinkCustomerToProfileUseCase implements IUseCase<LinkCustomerToProfileInputDTO, LinkCustomerToProfileOutputDTO> {
  constructor(
    private readonly customerRepository: ShopCustomerRepository
  ) {}

  async execute(input: LinkCustomerToProfileInputDTO): Promise<LinkCustomerToProfileOutputDTO> {
    const { customerId, phone } = input;

    try {
      // Validate input
      if (!customerId) {
        throw new ShopCustomerError(
          ShopCustomerErrorType.VALIDATION_ERROR,
          "Customer ID is required",
          "LinkCustomerToProfileUseCase.execute",
          { customerId, phone }
        );
      }

      if (!phone || phone.trim() === "") {
        throw new ShopCustomerError(
          ShopCustomerErrorType.VALIDATION_ERROR,
          "Customer phone is required",
          "LinkCustomerToProfileUseCase.execute",
          { customerId, phone }
        );
      }

      // Basic phone validation
      const phoneRegex = /^[0-9+\-\s()]+$/;
      if (!phoneRegex.test(phone)) {
        throw new ShopCustomerError(
          ShopCustomerErrorType.VALIDATION_ERROR,
          "Invalid phone number format",
          "LinkCustomerToProfileUseCase.execute",
          { customerId, phone }
        );
      }

      // Link customer to profile through repository
      const linkResultEntity = await this.customerRepository.linkCustomerToProfile(customerId, phone);

      // Map entity to DTO
      return CustomerMapper.toLinkCustomerToProfileOutputDTO(linkResultEntity);
    } catch (error) {
      if (error instanceof ShopCustomerError) {
        throw error;
      }

      throw new ShopCustomerError(
        ShopCustomerErrorType.OPERATION_FAILED,
        "Failed to link customer to profile",
        "LinkCustomerToProfileUseCase.execute",
        { customerId, phone, error: error instanceof Error ? error.message : String(error) },
        error
      );
    }
  }
}
